import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { BLOG_POSTS, BlogPost } from '../blog-content';
import { Locale, contentFor, pageData, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="blog">
      <div class="container blog-list-page" id="main-content">
        <section class="blog-hero">
          <div class="blog-hero-glow"></div>
          <span class="eyebrow delay-1">{{ data.badge }}</span>
          <h1 class="hero-title delay-2">{{ data.title }}</h1>
          <p class="hero-subtitle text-secondary delay-3">{{ data.subtitle }}</p>
        </section>

        <section class="blog-grid-section">
          <div class="blog-grid" *ngIf="posts.length > 0; else noPosts">
            <article class="blog-card glass glass-hover reveal" *ngFor="let post of posts; let i = index">
              <div class="blog-card-gradient"></div>
              <div class="blog-card-content">
                <div class="blog-card-meta">
                  <span class="blog-date">{{ post.datePublished | date:'mediumDate' }}</span>
                  <span class="blog-badge">{{ post.readTime }}</span>
                </div>
                <h2 class="blog-card-title">
                  <a [href]="getPostUrl(post.slug)">{{ post.title }}</a>
                </h2>
                <p class="blog-card-excerpt text-secondary">{{ post.excerpt }}</p>
                <div class="blog-card-footer">
                  <a class="blog-link" [href]="getPostUrl(post.slug)">
                    <span>{{ labels.readArticle }}</span>
                    <span class="arrow">→</span>
                  </a>
                </div>
              </div>
            </article>
          </div>

          <ng-template #noPosts>
            <div class="no-posts glass">
              <p>{{ labels.noPosts }}</p>
            </div>
          </ng-template>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .blog-list-page {
      padding-bottom: 6rem;
      position: relative;
    }
    .blog-hero {
      position: relative;
      padding: 5rem 0 3rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .blog-hero-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60%;
      height: 120%;
      background: radial-gradient(circle, rgba(124, 92, 252, 0.06) 0%, transparent 60%);
      z-index: 1;
      pointer-events: none;
    }
    .hero-title {
      font-size: clamp(2.25rem, 5vw, 3.5rem);
      font-weight: 900;
      line-height: 1.2;
      margin: 0.75rem 0 1rem;
      max-width: 800px;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      max-width: 600px;
      margin: 0;
    }

    .blog-grid-section {
      padding: 2rem 0;
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2.25rem;
    }
    .blog-card {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
    }
    .blog-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(124, 92, 252, 0.08);
    }
    .blog-card-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(124, 92, 252, 0.03) 0%, transparent 50%);
      pointer-events: none;
      z-index: 1;
    }
    .blog-card-content {
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      z-index: 2;
    }
    .blog-card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      font-size: 0.825rem;
      color: var(--text-tertiary);
    }
    .blog-badge {
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: rgba(124, 92, 252, 0.1);
      color: var(--accent-violet);
      font-weight: 600;
    }
    .blog-card-title {
      font-size: 1.35rem;
      font-weight: 800;
      line-height: 1.4;
      margin-bottom: 1rem;
    }
    .blog-card-title a {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .blog-card-title a:hover {
      color: var(--accent-cyan);
    }
    .blog-card-excerpt {
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
    }
    .blog-card-footer {
      margin-top: auto;
    }
    .blog-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--accent-cyan);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 700;
      transition: gap 0.2s ease;
    }
    .blog-link:hover {
      gap: 0.75rem;
    }
    .blog-link .arrow {
      font-family: system-ui, -apple-system, sans-serif;
    }

    .no-posts {
      padding: 4rem 2rem;
      text-align: center;
      color: var(--text-secondary);
      border-radius: var(--radius-lg);
    }

    @media (max-width: 640px) {
      .blog-grid {
        grid-template-columns: 1fr;
      }
      .blog-card {
        padding: 0.5rem;
      }
    }
  `]
})
export class BlogListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected c = contentFor('en');
  protected data = pageData('blog', 'en');
  protected posts: BlogPost[] = [];
  protected labels = this.labelsFor('en');

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.c = contentFor(this.locale);
    this.data = pageData('blog', this.locale);
    this.labels = this.labelsFor(this.locale);
    this.posts = BLOG_POSTS
      .filter(post => post.locale === this.locale)
      .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
    this.seo.applyPage('blog', this.locale);
  }

  protected getPostUrl(slug: string): string {
    const routePattern = pathFor('blogPost', this.locale);
    return routePattern.replace(':slug', slug);
  }

  private labelsFor(locale: Locale): { readArticle: string; noPosts: string } {
    const labels: Record<Locale, { readArticle: string; noPosts: string }> = {
      en: { readArticle: 'Read article', noPosts: 'No articles are available in this language yet.' },
      pl: { readArticle: 'Przeczytaj artykuł', noPosts: 'Nie ma jeszcze artykułów w tym języku.' },
      de: { readArticle: 'Artikel lesen', noPosts: 'Für diese Sprache gibt es noch keine Artikel.' },
      es: { readArticle: 'Leer artículo', noPosts: 'Todavía no hay artículos en este idioma.' },
      fr: { readArticle: 'Lire l’article', noPosts: 'Aucun article n’est encore disponible dans cette langue.' },
      it: { readArticle: 'Leggi articolo', noPosts: 'Non ci sono ancora articoli in questa lingua.' },
      uk: { readArticle: 'Читати статтю', noPosts: 'Поки що немає статей цією мовою.' }
    };
    return labels[locale] || labels.en;
  }
}
