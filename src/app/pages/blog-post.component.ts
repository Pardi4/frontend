import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../seo.service';
import { BLOG_POSTS, BlogPost } from '../blog-content';
import { Locale, contentFor, pathFor, CHROME_WEB_STORE_URL } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="blogPost">
      <main class="container blog-post-page" id="main-content" *ngIf="post">
        <!-- Back Link -->
        <div class="back-navigation">
          <a [href]="getBlogListUrl()" class="back-link">
            <span class="arrow">←</span>
            <span>{{ locale === 'pl' ? 'Wróć do bazy wiedzy' : 'Back to blog' }}</span>
          </a>
        </div>

        <!-- Article Header -->
        <header class="post-header">
          <div class="post-meta">
            <span class="post-badge">{{ locale === 'pl' ? 'Poradnik' : 'Guide' }}</span>
            <span class="bullet">•</span>
            <span>{{ post.datePublished | date:'mediumDate' }}</span>
            <span class="bullet">•</span>
            <span>{{ post.readTime }} {{ locale === 'pl' ? 'czytania' : 'read' }}</span>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-author-box">
            <span class="author-avatar">{{ post.author.substring(0, 2).toUpperCase() }}</span>
            <div class="author-details">
              <span class="author-name">{{ post.author }}</span>
              <span class="author-role">{{ locale === 'pl' ? 'Autor QuizSolver' : 'QuizSolver Writer' }}</span>
            </div>
          </div>
        </header>

        <!-- Article Body -->
        <article class="post-content glass">
          <div [innerHTML]="post.content"></div>
        </article>

        <!-- CTA Box -->
        <section class="post-cta glass reveal">
          <div class="cta-gradient"></div>
          <div class="cta-inner">
            <h2 class="cta-title">
              {{ locale === 'pl' ? 'Chcesz zdać kolejny test bez stresu?' : 'Ready to pass your next test stress-free?' }}
            </h2>
            <p class="cta-description text-secondary">
              {{ locale === 'pl' 
                ? 'Zainstaluj darmowe rozszerzenie QuizSolver do Chrome. Korzystaj z bocznego panelu i inteligentnych wyjaśnień AI, które ułatwiają naukę i rozwiązywanie quizów.'
                : 'Install the free QuizSolver Chrome extension. Get AI-powered explanations, personal notes, and revision quizzes directly in your browser sidebar.'
              }}
            </p>
            <div class="cta-actions">
              <a [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
                {{ locale === 'pl' ? 'Dodaj do Chrome (Za darmo)' : 'Add to Chrome (Free)' }}
              </a>
              <a [href]="getDemoUrl()" class="btn btn-outline btn-lg">
                {{ locale === 'pl' ? 'Wypróbuj interaktywne demo' : 'Try Interactive Demo' }}
              </a>
            </div>
          </div>
        </section>
      </main>

      <!-- 404/Not Found State -->
      <main class="container not-found-state" *ngIf="!post">
        <div class="not-found-card glass">
          <h1>{{ locale === 'pl' ? 'Nie znaleziono artykułu' : 'Article Not Found' }}</h1>
          <p class="text-secondary">
            {{ locale === 'pl' ? 'Przepraszamy, ten wpis blogowy nie istnieje lub został przeniesiony.' : 'Sorry, this blog post does not exist or has been moved.' }}
          </p>
          <a [href]="getBlogListUrl()" class="btn btn-primary">
            {{ locale === 'pl' ? 'Przejdź do bazy wiedzy' : 'Go to blog' }}
          </a>
        </div>
      </main>
    </qs-shell>
  `,
  styles: [`
    .blog-post-page {
      padding-top: 3rem;
      padding-bottom: 6rem;
      max-width: 860px;
      margin: 0 auto;
    }
    .back-navigation {
      margin-bottom: 2rem;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      transition: color 0.2s ease, gap 0.2s ease;
    }
    .back-link:hover {
      color: var(--accent-cyan);
      gap: 0.75rem;
    }
    .back-link .arrow {
      font-family: system-ui, -apple-system, sans-serif;
    }

    .post-header {
      margin-bottom: 3rem;
    }
    .post-meta {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
    }
    .post-badge {
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--accent-violet);
    }
    .post-meta .bullet {
      color: var(--text-tertiary);
    }
    .post-title {
      font-size: clamp(2rem, 5vw, 2.75rem);
      font-weight: 900;
      line-height: 1.25;
      color: var(--text-primary);
      margin-bottom: 2rem;
    }
    .post-author-box {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .author-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 9999px;
      background: linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-cyan) 100%);
      color: #ffffff;
      font-weight: 800;
      font-size: 0.95rem;
    }
    .author-details {
      display: flex;
      flex-direction: column;
    }
    .author-name {
      font-weight: 700;
      color: var(--text-primary);
    }
    .author-role {
      font-size: 0.825rem;
      color: var(--text-tertiary);
    }

    .post-content {
      padding: 3rem;
      border-radius: var(--radius-lg);
      margin-bottom: 4rem;
    }

    /* Markdown/HTML rendered styles */
    ::ng-deep .blog-article-content {
      font-size: 1.1rem;
      line-height: 1.75;
      color: var(--text-primary);
    }
    ::ng-deep .blog-article-content p {
      margin-bottom: 1.5rem;
    }
    ::ng-deep .blog-article-content h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 2.5rem 0 1rem;
    }
    ::ng-deep .blog-article-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 2rem 0 0.75rem;
    }
    ::ng-deep .blog-article-content ul, ::ng-deep .blog-article-content ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    ::ng-deep .blog-article-content ul {
      list-style-type: disc;
    }
    ::ng-deep .blog-article-content ol {
      list-style-type: decimal;
    }
    ::ng-deep .blog-article-content li {
      margin-bottom: 0.5rem;
    }
    ::ng-deep .blog-article-content blockquote {
      margin: 2rem 0;
      padding: 1.25rem 2rem;
      border-left: 4px solid var(--accent-violet);
      background: rgba(124, 92, 252, 0.04);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }
    ::ng-deep .blog-article-content blockquote p {
      margin-bottom: 0;
      font-style: italic;
      color: var(--text-secondary);
    }
    ::ng-deep .blog-article-content code {
      font-family: Consolas, Monaco, monospace;
      font-size: 0.95rem;
      padding: 0.2rem 0.4rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.06);
      color: var(--accent-cyan);
    }
    ::ng-deep .blog-article-content em {
      font-style: italic;
    }
    ::ng-deep .blog-article-content strong {
      font-weight: 700;
    }

    /* CTA Box */
    .post-cta {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 4rem;
    }
    .cta-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at bottom right, rgba(124, 92, 252, 0.08) 0%, transparent 60%);
      pointer-events: none;
      z-index: 1;
    }
    .cta-inner {
      padding: 3rem;
      z-index: 2;
      position: relative;
      text-align: center;
    }
    .cta-title {
      font-size: 1.75rem;
      font-weight: 850;
      margin-bottom: 1rem;
    }
    .cta-description {
      font-size: 1.05rem;
      max-width: 680px;
      margin: 0 auto 2.25rem;
      line-height: 1.6;
    }
    .cta-actions {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .cta-actions .btn {
      min-width: 240px;
    }

    /* Not Found state */
    .not-found-state {
      padding: 6rem 0;
      max-width: 600px;
      margin: 0 auto;
    }
    .not-found-card {
      padding: 4rem;
      text-align: center;
      border-radius: var(--radius-lg);
    }
    .not-found-card h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .not-found-card p {
      margin-bottom: 2.25rem;
    }

    @media (max-width: 640px) {
      .post-content {
        padding: 1.75rem;
      }
      .cta-inner {
        padding: 2rem;
      }
      .cta-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class BlogPostComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected post?: BlogPost;
  protected readonly storeUrl = CHROME_WEB_STORE_URL;

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    
    // Get slug from route parameters
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.post = BLOG_POSTS.find(p => p.slug === slug && p.locale === this.locale);
        
        if (this.post) {
          // Apply custom BlogPosting schema and SEO parameters
          this.seo.applyBlogPost(this.post, this.locale);
        } else {
          // If post is not found for this language, check if it exists in another language, or display 404
          const otherLangPost = BLOG_POSTS.find(p => p.slug === slug);
          if (otherLangPost) {
            // Redirect to the correct localized page of that post
            const routePattern = pathFor('blogPost', otherLangPost.locale);
            const redirectUrl = routePattern.replace(':slug', slug);
            this.router.navigateByUrl(redirectUrl);
          } else {
            // Apply fallback SEO for 404 state
            this.seo.applyPage('notFound', this.locale);
          }
        }
      }
    });
  }

  protected getBlogListUrl(): string {
    return pathFor('blog', this.locale);
  }

  protected getDemoUrl(): string {
    return pathFor('demo', this.locale);
  }
}
