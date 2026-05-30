import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CHROME_WEB_STORE_URL, Locale, PageKey, contentFor, pageData, pathFor } from '../site-content';
import { SeoService } from '../seo.service';
import { ShellComponent } from './shell.component';

const STATUS_UI: Record<Locale, { home: string; install: string; successBadge: string; successSubtitle: string; notFoundBadge: string; notFoundSubtitle: string }> = {
  en: { home: 'Back to home', install: 'Install extension', successBadge: 'Success', successSubtitle: 'Your account is ready.', notFoundBadge: '404', notFoundSubtitle: 'This page does not exist or was moved.' },
  pl: { home: 'Wróć na start', install: 'Zainstaluj rozszerzenie', successBadge: 'Sukces', successSubtitle: 'Twoje konto jest gotowe.', notFoundBadge: '404', notFoundSubtitle: 'Ta strona nie istnieje albo została przeniesiona.' },
  de: { home: 'Zur Startseite', install: 'Erweiterung installieren', successBadge: 'Erfolg', successSubtitle: 'Dein Konto ist bereit.', notFoundBadge: '404', notFoundSubtitle: 'Diese Seite existiert nicht oder wurde verschoben.' },
  es: { home: 'Volver al inicio', install: 'Instalar extensión', successBadge: 'Listo', successSubtitle: 'Tu cuenta está lista.', notFoundBadge: '404', notFoundSubtitle: 'Esta página no existe o fue movida.' },
  fr: { home: 'Retour à l’accueil', install: 'Installer l’extension', successBadge: 'Succès', successSubtitle: 'Ton compte est prêt.', notFoundBadge: '404', notFoundSubtitle: 'Cette page n’existe pas ou a été déplacée.' },
  it: { home: 'Torna alla home', install: 'Installa estensione', successBadge: 'Successo', successSubtitle: 'Il tuo account è pronto.', notFoundBadge: '404', notFoundSubtitle: 'Questa pagina non esiste o è stata spostata.' },
  uk: { home: 'На головну', install: 'Встановити розширення', successBadge: 'Готово', successSubtitle: 'Твій акаунт готовий.', notFoundBadge: '404', notFoundSubtitle: 'Цієї сторінки не існує або її перемістили.' }
};

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" [pageKey]="pageKey">
      <main class="container status-page-main" id="main-content">
        <div class="status-grid">
          <div class="status-content animate-fade-in">
            <span class="eyebrow">{{ data.badge || (pageKey === 'success' ? ui.successBadge : ui.notFoundBadge) }}</span>
            <h1>{{ data.title }}</h1>
            <p class="text-secondary">{{ data.subtitle || (pageKey === 'success' ? ui.successSubtitle : ui.notFoundSubtitle) }}</p>
            <div class="btn-group">
              <a class="btn btn-primary btn-lg" [href]="pathFor(pageKey === 'success' ? 'dashboard' : 'home')">
                {{ data.dashboardCta || data.homeCta || ui.home }}
              </a>
              <a class="btn btn-outline btn-lg" [href]="storeUrl" target="_blank" rel="noopener">
                {{ data.storeCta || ui.install }}
              </a>
            </div>
          </div>
          <aside class="status-aside glass anim-glow">
            <span class="status-code">{{ pageKey === 'success' ? 'OK' : '404' }}</span>
            <p class="text-gradient-strong">{{ c.common.brand }}</p>
          </aside>
        </div>
      </main>
    </qs-shell>
  `,
  styles: [`
    .status-page-main {
      padding: 6rem 0;
      display: flex;
      align-items: center;
      min-height: 70vh;
    }
    .status-grid {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 4rem;
      align-items: center;
      width: 100%;
    }
    .status-content h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      margin: 0.75rem 0 1.25rem;
      line-height: 1.2;
    }
    .status-content p {
      font-size: 1.25rem;
      margin-bottom: 2.5rem;
    }
    .btn-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .status-aside {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .status-code {
      font-size: 7rem;
      font-weight: 800;
      font-family: var(--font-heading);
      line-height: 1;
      background: var(--grad-primary);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .status-aside p {
      font-size: 1.15rem;
      margin-top: 1rem;
      font-family: var(--font-heading);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .status-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
        text-align: center;
      }
      .btn-group {
        justify-content: center;
      }
      .status-code {
        font-size: 5rem;
      }
      .status-aside {
        padding: 2.5rem;
      }
    }
  `]
})
export class StatusPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  protected locale: Locale = 'en';
  protected pageKey: PageKey = 'success';
  protected c = contentFor('en');
  protected data = pageData('success', 'en');
  protected ui = STATUS_UI.en;
  protected readonly storeUrl = CHROME_WEB_STORE_URL;

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.ui = STATUS_UI[this.locale] || STATUS_UI.en;
    this.pageKey = this.route.snapshot.data['pageKey'] as PageKey;
    this.c = contentFor(this.locale);
    this.data = pageData(this.pageKey, this.locale);
    this.seo.applyPage(this.pageKey, this.locale);
  }

  protected pathFor(pageKey: PageKey): string {
    return pathFor(pageKey, this.locale);
  }
}
