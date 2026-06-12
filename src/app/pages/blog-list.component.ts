import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { BLOG_POSTS, BlogPost } from '../blog-content';
import { BlogCategoryCopy, categoriesFor, categoryFor, categoryLabel } from '../blog-categories';
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
          <h1 class="hero-title delay-2">{{ category?.title || data.title }}</h1>
          <p class="hero-subtitle text-secondary delay-3">{{ category?.description || data.subtitle }}</p>
        </section>

        <nav class="blog-category-bar glass" aria-label="Blog categories">
          <a class="category-pill" [class.active]="!category" [href]="getBlogUrl()">
            {{ labels.all }}
          </a>
          <a
            class="category-pill"
            *ngFor="let item of categories"
            [class.active]="category?.slug === item.slug"
            [href]="getCategoryUrl(item.slug)"
          >
            {{ item.shortTitle }}
          </a>
        </nav>

        <section class="category-hub glass" *ngIf="category">
          <div>
            <p class="eyebrow">{{ labels.category }}</p>
            <h2>{{ category.title }}</h2>
            <p class="text-secondary">{{ category.description }}</p>
          </div>
          <a class="btn btn-outline" [href]="getTutorialUrl(category)">
            {{ category.tutorialLabel }}
          </a>
        </section>

        <section class="category-grid-section" *ngIf="!category">
          <div class="category-grid">
            <a class="category-card glass glass-hover" *ngFor="let item of categories" [href]="getCategoryUrl(item.slug)">
              <span class="eyebrow">{{ item.shortTitle }}</span>
              <strong>{{ item.title }}</strong>
              <span class="text-secondary">{{ item.description }}</span>
            </a>
          </div>
        </section>

        <section class="blog-grid-section">
          <div class="blog-grid" *ngIf="posts.length > 0; else noPosts">
            <article class="blog-card glass glass-hover reveal" *ngFor="let post of posts; let i = index">
              <div class="blog-card-gradient"></div>
              <div class="blog-card-content">
                <div class="blog-card-meta">
                  <span class="blog-date">{{ post.datePublished | date:'mediumDate' }}</span>
                  <span class="blog-badge">{{ categoryName(post.category) }}</span>
                </div>
                <h2 class="blog-card-title">
                  <a [href]="getPostUrl(post.slug)">{{ post.title }}</a>
                </h2>
                <p class="blog-card-excerpt text-secondary">{{ post.excerpt }}</p>
                <div class="blog-card-footer">
                  <span class="blog-read-time">{{ post.readTime }}</span>
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
      max-width: 720px;
      margin: 0;
    }
    .blog-category-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin: 0 auto 1.5rem;
      padding: 0.75rem;
      border-radius: 14px;
      max-width: 980px;
      justify-content: center;
    }
    .category-pill {
      display: inline-flex;
      align-items: center;
      min-height: 2.5rem;
      padding: 0.55rem 0.9rem;
      border: 1px solid #2b3545;
      border-radius: 10px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 800;
      background: #171c24;
      transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }
    .category-pill:hover,
    .category-pill.active {
      color: var(--text-primary);
      border-color: rgba(14, 165, 233, 0.6);
      background: linear-gradient(135deg, rgba(124, 92, 252, 0.18), rgba(14, 165, 233, 0.12));
    }
    .category-hub {
      max-width: 980px;
      margin: 0 auto 2rem;
      padding: 1.5rem;
      border-radius: 14px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1.25rem;
      align-items: center;
    }
    .category-hub h2 {
      margin: 0.35rem 0 0.5rem;
      font-size: 1.5rem;
    }
    .category-hub p {
      margin-bottom: 0;
    }
    .category-grid-section {
      padding: 0 0 2rem;
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .category-card {
      min-height: 11rem;
      padding: 1.25rem;
      border-radius: 14px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .category-card strong {
      color: var(--text-primary);
      font-size: 1.1rem;
    }
    .category-card .text-secondary {
      font-size: 0.92rem;
      line-height: 1.5;
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
      gap: 1rem;
      margin-bottom: 1.25rem;
      font-size: 0.825rem;
      color: var(--text-tertiary);
    }
    .blog-badge {
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: rgba(124, 92, 252, 0.1);
      color: var(--accent-violet);
      font-weight: 700;
      white-space: nowrap;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .blog-read-time {
      color: var(--text-tertiary);
      font-size: 0.85rem;
      font-weight: 700;
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
      .category-hub {
        grid-template-columns: 1fr;
      }
      .category-hub .btn {
        width: 100%;
      }
      .blog-grid {
        grid-template-columns: 1fr;
      }
      .blog-card {
        padding: 0.5rem;
      }
      .blog-card-footer {
        align-items: flex-start;
        flex-direction: column;
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
  protected categories: BlogCategoryCopy[] = [];
  protected category?: BlogCategoryCopy;
  protected labels = this.labelsFor('en');

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.c = contentFor(this.locale);
    this.data = pageData('blog', this.locale);
    this.labels = this.labelsFor(this.locale);
    const requestedCategorySlug = this.route.snapshot.paramMap.get('category');
    const availableCategorySlugs = new Set(
      BLOG_POSTS
        .filter(post => post.locale === this.locale)
        .map(post => post.category)
    );

    this.categories = categoriesFor(this.locale).filter(item => availableCategorySlugs.has(item.slug));
    this.category = categoryFor(this.locale, requestedCategorySlug);
    this.posts = BLOG_POSTS
      .filter(post => post.locale === this.locale)
      .filter(post => !this.category || post.category === this.category.slug)
      .sort((a, b) => b.datePublished.localeCompare(a.datePublished));

    if (this.category) {
      this.seo.applyBlogCategory(this.category, this.locale, {
        robots: this.posts.length > 0 ? undefined : 'noindex, follow'
      });
    } else {
      this.seo.applyPage('blog', this.locale, {
        robots: requestedCategorySlug ? 'noindex, follow' : undefined
      });
    }
  }

  protected getBlogUrl(): string {
    return pathFor('blog', this.locale);
  }

  protected getPostUrl(slug: string): string {
    return pathFor('blogPost', this.locale).replace(':slug', slug);
  }

  protected getCategoryUrl(category: string): string {
    return pathFor('blogCategory', this.locale).replace(':category', category);
  }

  protected getTutorialUrl(category: BlogCategoryCopy): string {
    return pathFor(category.tutorialPage, this.locale);
  }

  protected categoryName(category: string | undefined): string {
    return categoryLabel(this.locale, category);
  }

  private labelsFor(locale: Locale): { readArticle: string; noPosts: string; all: string; category: string } {
    const labels: Record<Locale, { readArticle: string; noPosts: string; all: string; category: string }> = {
      en: { readArticle: 'Read article', noPosts: 'No articles are available in this category yet.', all: 'All guides', category: 'Category hub' },
      pl: { readArticle: 'Przeczytaj artykuł', noPosts: 'Nie ma jeszcze artykułów w tej kategorii.', all: 'Wszystkie poradniki', category: 'Centrum kategorii' },
      de: { readArticle: 'Artikel lesen', noPosts: 'Für diese Kategorie gibt es noch keine Artikel.', all: 'Alle Guides', category: 'Kategorie' },
      es: { readArticle: 'Leer artículo', noPosts: 'Todavía no hay artículos en esta categoría.', all: 'Todas las guías', category: 'Categoría' },
      fr: { readArticle: 'Lire l’article', noPosts: 'Aucun article n’est encore disponible dans cette catégorie.', all: 'Tous les guides', category: 'Catégorie' },
      it: { readArticle: 'Leggi articolo', noPosts: 'Non ci sono ancora articoli in questa categoria.', all: 'Tutte le guide', category: 'Categoria' },
      uk: { readArticle: 'Читати статтю', noPosts: 'У цій категорії ще немає статей.', all: 'Усі гайди', category: 'Категорія' }
    };
    return labels[locale] || labels.en;
  }
}
