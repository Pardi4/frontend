import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, contentFor, pageData } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="mobileInstall">
      <div class="container mobile-install-page">
        <section class="utility-hero text-center">
          <span class="eyebrow">Mobile</span>
          <h1 class="hero-title">{{ data?.title }}</h1>
          <p class="hero-subtitle text-secondary mx-auto">{{ data?.subtitle }}</p>
          
          <div class="os-tabs">
            <button class="btn" [class.btn-primary]="os === 'android'" [class.btn-outline]="os !== 'android'" (click)="os = 'android'">Android</button>
            <button class="btn" [class.btn-primary]="os === 'ios'" [class.btn-outline]="os !== 'ios'" (click)="os = 'ios'">iOS (iPhone/iPad)</button>
          </div>
        </section>

        <section class="tutorial-content">
          <div class="video-container glass glass-hover" *ngIf="os === 'android'">
            <!-- PASTE YOUR ANDROID VIDEO HERE -->
            <div class="video-placeholder">
              <p>Android Video Tutorial goes here</p>
            </div>
          </div>
          
          <div class="video-wrapper-vertical" *ngIf="os === 'ios'">
            <div class="video-container video-container-vertical glass glass-hover">
              <iframe
                src="https://www.youtube-nocookie.com/embed/2YHPMk_xHAs"
                title="How to install QuizSolver on iOS"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
              </iframe>
            </div>
            <div class="video-meta-note">
              <a href="https://youtube.com/shorts/2YHPMk_xHAs" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                <span>{{ locale === 'pl' ? 'Otwórz w aplikacji YouTube' : 'Open in YouTube app' }}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .mobile-install-page {
      padding-bottom: 5rem;
    }
    .utility-hero {
      padding: 5rem 0 3rem;
    }
    .text-center { text-align: center; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-top: 0.5rem;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      margin: 1rem auto 1.5rem;
      max-width: 46rem;
    }
    .os-tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    .tutorial-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .video-wrapper-vertical {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }
    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      height: 0;
      overflow: hidden;
      border-radius: 16px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border);
      width: 100%;
    }
    .video-container-vertical {
      max-width: 360px;
      padding-bottom: 177.77%; /* 9:16 Aspect Ratio */
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 16px;
    }
    .video-placeholder {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      font-size: 1.25rem;
      font-weight: 500;
    }
    .video-meta-note {
      text-align: center;
    }
    .video-meta-note a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class MobileInstallComponent implements OnInit {
  locale: Locale = 'en';
  c = contentFor(this.locale);
  data: any;
  os: 'android' | 'ios' = 'android'; // default

  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
        this.os = 'ios';
      }
    }
    
    this.route.data.subscribe(data => {
      this.locale = data['locale'] || 'en';
      this.c = contentFor(this.locale);
      this.data = pageData('mobileInstall', this.locale);
      this.seo.applyPage('mobileInstall', this.locale);
    });
  }
}
