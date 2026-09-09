import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../seo.service';
import { Locale, contentFor } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="cookies">
      <div class="container privacy-page">
        <section class="utility-hero">
          <div class="utility-hero-grid">
            <div>
              <span class="eyebrow">{{ data.badge }}</span>
              <h1 class="hero-title">{{ data.title }}</h1>
              <p class="hero-subtitle text-secondary">{{ data.subtitle }}</p>
              <div class="utility-meta">
                <span>{{ data.effective }}</span>
                <span id="contact">{{ data.contactLabel }}: {{ data.contactValue }}</span>
              </div>
            </div>
            <aside class="utility-callout glass">
              <h2>{{ c.common.brand }}</h2>
              <p class="text-secondary" style="font-size: 0.95rem; margin-top: 0.5rem;">{{ c.footer.description }}</p>
            </aside>
          </div>
        </section>
        
        <section class="privacy-content">
          <div class="privacy-layout">
            <article class="privacy-card glass glass-hover" *ngFor="let section of data.sections">
              <h2>{{ section.title }}</h2>
              <p class="text-secondary" *ngIf="section.text" style="margin-top: 0.5rem;">{{ section.text }}</p>
              <ul *ngIf="section.items" style="margin-top: 1rem;">
                <li *ngFor="let item of section.items" class="text-secondary">{{ item }}</li>
              </ul>
            </article>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .privacy-page { padding-bottom: 5rem; }
    .utility-hero { padding: 5rem 0 3rem; }
    .utility-hero-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center; }
    .hero-title { font-size: clamp(2rem, 5vw, 3rem); margin-top: 0.5rem; }
    .hero-subtitle { font-size: 1.125rem; margin: 1rem 0 1.5rem; }
    .utility-meta { display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); flex-wrap: wrap; }
    .utility-callout { padding: 2.5rem; }
    .utility-callout h2 { font-size: 1.5rem; }
    .privacy-content { padding: 2rem 0; }
    .privacy-layout { display: flex; flex-direction: column; gap: 2rem; max-width: 800px; margin: 0 auto; }
    .privacy-card { padding: 2.5rem; }
    .privacy-card h2 { font-size: 1.5rem; }
    .privacy-card ul { padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; list-style: disc; }
    @media (max-width: 768px) { .utility-hero-grid { grid-template-columns: 1fr; gap: 2rem; } }
  `]
})
export class CookiesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  protected locale: Locale = 'en';
  protected c = contentFor('en');
  
  protected pageData: Record<string, any> = {
    en: {
      badge: 'Privacy & Security', title: 'Cookie Policy', subtitle: 'How we use cookies and similar technologies.', effective: 'Effective Date: May 21, 2026', contactLabel: 'Support', contactValue: 'support@getquizsolver.com',
      sections: [
        { title: '1. What are cookies?', text: 'Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and understand how you use QuizSolver.' },
        { title: '2. Types of cookies we use', items: ['Essential Cookies: Necessary for the website to function (e.g. login sessions, language preferences).', 'Analytics Cookies: Help us understand how visitors interact with the site. We only use these if you grant consent.'] },
        { title: '3. Your choices', text: 'You can choose to accept or decline non-essential cookies using the consent banner. You can also configure your browser to block cookies, though some features may not work properly.' }
      ]
    },
    pl: {
      badge: 'Prywatność i bezpieczeństwo', title: 'Polityka Cookies', subtitle: 'Jak korzystamy z plików cookie i podobnych technologii.', effective: 'Obowiązuje od: 21 maja 2026', contactLabel: 'Kontakt', contactValue: 'support@getquizsolver.com',
      sections: [
        { title: '1. Czym są ciasteczka?', text: 'Ciasteczka (cookies) to małe pliki tekstowe zapisywane na Twoim urządzeniu. Pomagają nam zapamiętać Twoje preferencje i zrozumieć, jak korzystasz z QuizSolver.' },
        { title: '2. Jakich cookies używamy?', items: ['Niezbędne (Essential): Konieczne do działania strony (np. sesje logowania, wybór języka).', 'Analityczne (Analytics): Pomagają nam zrozumieć ruch na stronie. Używamy ich tylko za Twoją zgodą.'] },
        { title: '3. Twoje wybory', text: 'Możesz zaakceptować lub odrzucić opcjonalne ciasteczka w banerze zgody. Możesz też zablokować je w przeglądarce, ale strona może działać gorzej.' }
      ]
    }
  };

  protected get data() {
    return this.pageData[this.locale] || this.pageData['en'];
  }

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.c = contentFor(this.locale);
    this.title.setTitle(this.data.title + ' | QuizSolver');
  }
}
