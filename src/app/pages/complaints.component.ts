import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, contentFor, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="complaints">
      <div class="container complaints-page">

        <header class="complaints-hero">
          <div class="hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>{{ isPl ? 'Obsługa zgłoszeń i reklamacji' : 'Claims & Complaints Resolution' }}</span>
          </div>

          <h1 class="hero-title">
            {{ isPl ? 'Procedura reklamacyjna' : 'Complaints Procedure' }}
          </h1>

          <p class="hero-subtitle text-secondary">
            {{ isPl
              ? 'Oficjalne zasady, terminy i tryb składania oraz rozpatrywania reklamacji dotyczących usług i Treści Cyfrowych w serwisie getquizsolver.com.'
              : 'Official terms, deadlines, and guidelines for filing and handling complaints regarding digital content and services on getquizsolver.com.' }}
          </p>

          <div class="hero-meta-bar">
            <div class="meta-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{{ isPl ? 'Termin rozpatrzenia: 14 dni (art. 7a)' : 'Statutory timeline: 14 calendar days' }}</span>
            </div>

            <a class="meta-pill hoverable" href="mailto:support@getquizsolver.com">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>support&#64;getquizsolver.com</span>
            </a>

            <div class="meta-actions">
              <button class="action-btn" type="button" (click)="printPage()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                <span>{{ isPl ? 'Drukuj / PDF' : 'Print / PDF' }}</span>
              </button>
            </div>
          </div>
        </header>

        <section class="seller-card glass">
          <div class="seller-card-header">
            <div class="seller-badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18"/>
                <path d="M9 8h1"/>
                <path d="M9 12h1"/>
                <path d="M9 16h1"/>
                <path d="M14 8h1"/>
                <path d="M14 12h1"/>
                <path d="M14 16h1"/>
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
              </svg>
            </div>
            <div>
              <h2 class="seller-title">{{ isPl ? 'Dane Sprzedawcy i Usługodawcy' : 'Merchant & Service Provider Details' }}</h2>
              <p class="seller-sub text-secondary">{{ isPl ? 'Podmiot odpowiedzialny za realizację usług i rozpatrywanie reklamacji' : 'Entity responsible for digital service delivery and complaint resolution' }}</p>
            </div>
          </div>

          <div class="seller-grid">
            <div class="seller-item">
              <span class="seller-lbl">{{ isPl ? 'Nazwa sprzedawcy / Usługodawca:' : 'Seller Name / Merchant:' }}</span>
              <strong class="seller-val">Kamil Pardała</strong>
              <span class="seller-hint">{{ isPl ? '(działalność nierejestrowana zgodnie z art. 5 ustawy Prawo przedsiębiorców)' : '(unregistered sole proprietorship under Art. 5 of Polish Entrepreneurs Act)' }}</span>
            </div>
            <div class="seller-item">
              <span class="seller-lbl">{{ isPl ? 'Adres siedziby i do doręczeń:' : 'Registered Office & Postal Address:' }}</span>
              <strong class="seller-val">ul. Drukarska 7, 30-348 Kraków</strong>
              <span class="seller-hint">Polska / Poland</span>
            </div>
            <div class="seller-item">
              <span class="seller-lbl">{{ isPl ? 'Adres e-mail do kontaktu i reklamacji:' : 'Official Contact & Claims Email:' }}</span>
              <a class="seller-link highlight" href="mailto:support@getquizsolver.com">support&#64;getquizsolver.com</a>
            </div>
            <div class="seller-item">
              <span class="seller-lbl">{{ isPl ? 'Serwis internetowy:' : 'Service Domain:' }}</span>
              <a class="seller-link" href="https://getquizsolver.com">https://getquizsolver.com</a>
            </div>
            <div class="seller-item">
              <span class="seller-lbl">{{ isPl ? 'Obsługa płatności:' : 'Payment Processors:' }}</span>
              <span class="seller-val">dpay (Payments Lab sp. z o.o., MIP 85/2020: BLIK, przelewy), Lemon Squeezy</span>
            </div>
          </div>
        </section>

        <main class="procedure-content">

          <article class="proc-section glass">
            <div class="proc-num">1</div>
            <div class="proc-body">
              <h2>{{ isPl ? 'Prawo do złożenia reklamacji' : 'Right to lodge a complaint' }}</h2>
              <p>
                {{ isPl
                  ? 'Każdy Klient / Użytkownik Serwisu QuizSolver ma prawo do złożenia reklamacji w przypadku niewykonania lub nienależytego wykonania umowy o świadczenie usług drogą elektroniczną, problemów z doładowaniem salda Kredytów, błędów transakcyjnych lub wadliwego działania Rozszerzenia.'
                  : 'Every Client and User of QuizSolver is entitled to lodge a complaint in the event of non-performance or improper performance of electronic services, issues with token top-ups, transaction disputes, or technical malfunctions of the extension.' }}
              </p>
              <p>
                {{ isPl
                  ? 'Usługodawca ponosi odpowiedzialność za zgodność świadczenia z umową na zasadach określonych w ustawie z dnia 30 maja 2014 r. o prawach konsumenta oraz Kodeksie cywilnym.'
                  : 'The Service Provider is liable for conformity of digital content and services with the contract under the Polish Consumer Rights Act of 30 May 2014 and the Civil Code.' }}
              </p>
            </div>
          </article>

          <article class="proc-section glass">
            <div class="proc-num">2</div>
            <div class="proc-body">
              <h2>{{ isPl ? 'Sposób i forma zgłoszenia' : 'How and where to file a complaint' }}</h2>
              <p>
                {{ isPl
                  ? 'Reklamacje można składać według wyboru Klienta drogą elektroniczną:'
                  : 'Complaints can be submitted electronically using either of the following channels:' }}
              </p>
              <ul class="proc-list">
                <li>
                  <strong>{{ isPl ? 'Pocztą elektroniczną e-mail:' : 'By email:' }}</strong>
                  {{ isPl ? ' bezpośrednio na adres ' : ' directly to ' }}
                  <a href="mailto:support@getquizsolver.com">support&#64;getquizsolver.com</a>.
                </li>
                <li>
                  <strong>{{ isPl ? 'Poprzez formularz kontaktowy:' : 'Via online contact form:' }}</strong>
                  {{ isPl ? ' dostępny całodobowo na podstronie ' : ' available 24/7 at ' }}
                  <a [href]="contactUrl()">getquizsolver.com/contact</a>.
                </li>
              </ul>
              <div class="callout-box">
                <strong>{{ isPl ? 'Zalecana treść zgłoszenia reklamacyjnego:' : 'Recommended content of a complaint report:' }}</strong>
                <ol>
                  <li>{{ isPl ? 'Adres e-mail przypisany do Konta w Serwisie QuizSolver.' : 'Account email address registered with QuizSolver.' }}</li>
                  <li>{{ isPl ? 'Data wystąpienia problemu lub data realizacji płatności.' : 'Date of problem occurrence or payment transaction.' }}</li>
                  <li>{{ isPl ? 'Szczegółowy opis problemu / wady technicznej (np. brak zaksięgowania kredytów po płatności BLIK dpay).' : 'Detailed description of the issue (e.g. uncredited tokens following a BLIK payment via dpay).' }}</li>
                  <li>{{ isPl ? 'Identyfikator transakcji lub potwierdzenie płatności (jeśli dotyczy).' : 'Transaction ID or payment confirmation (if applicable).' }}</li>
                  <li>{{ isPl ? 'Konkretne żądanie Klienta (np. ponowne doładowanie salda, usunięcie błędu, obniżenie ceny lub zwrot wpłaconych środków).' : 'Specific customer request (e.g. credit re-allocation, bug fix, price reduction, or monetary refund).' }}</li>
                </ol>
              </div>
            </div>
          </article>

          <article class="proc-section glass highlight-section">
            <div class="proc-num">3</div>
            <div class="proc-body">
              <h2>{{ isPl ? 'Ustawowy termin rozpatrzenia reklamacji (14 dni)' : 'Statutory resolution period (14 calendar days)' }}</h2>
              <p>
                {{ isPl
                  ? 'Usługodawca zobowiązuje się do merytorycznego rozpatrzenia reklamacji i udzielenia odpowiedzi Klientowi w nieprzekraczalnym terminie '
                  : 'The Service Provider undertakes to examine and respond to the complaint within ' }}
                <strong>{{ isPl ? '14 dni kalendarzowych' : '14 calendar days' }}</strong>
                {{ isPl ? ' od dnia jej prawidłowego wpłynięcia.' : ' from the date of receipt.' }}
              </p>
              <div class="law-banner">
                <div class="law-icon">⚖️</div>
                <div>
                  <strong>{{ isPl ? 'Skutek braku odpowiedzi (art. 7a ustawy o prawach konsumenta):' : 'Legal effect of failure to respond (Art. 7a of Polish Consumer Rights Act):' }}</strong>
                  <p>
                    {{ isPl
                      ? 'Jeżeli Usługodawca nie udzielił odpowiedzi na reklamację w terminie 14 dni od dnia jej otrzymania, uważa się, że reklamację uznał w całości zgodnie z żądaniem Klienta.'
                      : 'If the Service Provider does not respond to a consumer complaint within 14 calendar days of receipt, the complaint is deemed legally accepted in full in accordance with the consumer demand.' }}
                  </p>
                </div>
              </div>
              <p>
                {{ isPl
                  ? 'Odpowiedź na reklamację przekazywana jest Klientowi w formie wiadomości elektronicznej na adres e-mail wskazany w zgłoszeniu.'
                  : 'The response is delivered to the Client via email to the address provided in the complaint.' }}
              </p>
            </div>
          </article>

          <article class="proc-section glass">
            <div class="proc-num">4</div>
            <div class="proc-body">
              <h2>{{ isPl ? 'Procedura zwrotu płatności' : 'Refund processing and reimbursement' }}</h2>
              <p>
                {{ isPl
                  ? 'W przypadku uznania reklamacji skutkującej zwrotem całości lub części wpłaconych środków pieniężnych:'
                  : 'In the event of an accepted complaint resulting in a full or partial monetary refund:' }}
              </p>
              <ul class="proc-list">
                <li>
                  {{ isPl
                    ? 'Zwrot następuje niezwłocznie, nie później niż w terminie 14 dni kalendarzowych od dnia podjęcia decyzji o uznaniu reklamacji.'
                    : 'The refund is processed without undue delay and at the latest within 14 calendar days from the date of resolution.' }}
                </li>
                <li>
                  {{ isPl
                    ? 'Zwrot dokonywany jest przy użyciu takiego samego sposobu płatności, jakiego użył Klient w pierwotnej transakcji (np. zwrot za pośrednictwem dpay w przypadku płatności kodem BLIK lub przelewem online w PLN, bądź za pośrednictwem Lemon Squeezy w przypadku płatności kartą).'
                    : 'Reimbursement is executed using the same payment method originally utilized by the Client (e.g. through dpay for BLIK/online wire transfers in PLN, or via Lemon Squeezy for credit/debit card transactions).' }}
                </li>
                <li>
                  {{ isPl
                    ? 'Klient nie ponosi żadnych dodatkowych opłat ani prowizji z tytułu realizacji zwrotu środków.'
                    : 'The Client incurs no additional fees or commissions for the refund transfer.' }}
                </li>
              </ul>
            </div>
          </article>

          <article class="proc-section glass">
            <div class="proc-num">5</div>
            <div class="proc-body">
              <h2>{{ isPl ? 'Pozasądowe rozwiązywanie sporów' : 'Out-of-court dispute resolution' }}</h2>
              <p>
                {{ isPl
                  ? 'Klient będący Konsumentem ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń:'
                  : 'Consumers have the right to utilize out-of-court dispute resolution mechanisms:' }}
              </p>
              <ul class="proc-list">
                <li>
                  <strong>{{ isPl ? 'Platforma ODR:' : 'EU ODR Platform:' }}</strong>
                  {{ isPl
                    ? ' Konsument może złożyć skargę za pośrednictwem unijnej platformy internetowego rozstrzygania sporów ODR dostępnej pod adresem: '
                    : ' Complaints can be lodged via the European online dispute resolution platform at: ' }}
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>.
                </li>
                <li>
                  <strong>{{ isPl ? 'Rzecznicy Konsumentów:' : 'Consumer Ombudsmen:' }}</strong>
                  {{ isPl
                    ? ' Konsument może zwrócić się o bezpłatną pomoc prawną do właściwego Miejskiego lub Powiatowego Rzecznika Konsumentów.'
                    : ' In Poland, free legal assistance is offered by Municipal and County Consumer Ombudsmen.' }}
                </li>
                <li>
                  <strong>{{ isPl ? 'Inspekcja Handlowa:' : 'Trade Inspection:' }}</strong>
                  {{ isPl
                    ? ' Konsument uprawniony jest do zwrócenia się do Wojewódzkiego Inspektoratu Inspekcji Handlowej z wnioskiem o wszczęcie postępowania mediacyjnego.'
                    : ' Consumers may apply to the Voivodeship Inspectorate of Trade Inspection for mediation.' }}
                </li>
              </ul>
            </div>
          </article>

          <article class="proc-section glass">
            <div class="proc-num">6</div>
            <div class="proc-body">
              <h2>{{ isPl ? 'Dokumenty powiązane i kontakt' : 'Related legal policies & contact' }}</h2>
              <p>
                {{ isPl
                  ? 'Szczegółowe postanowienia dotyczące praw konsumenta, umów o dostarczanie Treści Cyfrowych oraz wyłączenia prawa do odstąpienia od umowy znajdują się w Regulaminie Serwisu.'
                  : 'Comprehensive terms regarding digital content supply, consumer withdrawal waivers, and general conditions are set out in our Terms of Service.' }}
              </p>
              <div class="related-links-grid">
                <a class="rel-btn" [href]="termsUrl()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span>{{ isPl ? 'Regulamin Serwisu (§ 6)' : 'Terms of Service (Section 6)' }}</span>
                </a>
                <a class="rel-btn" [href]="contactUrl()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{{ isPl ? 'Formularz kontaktowy' : 'Online Contact Form' }}</span>
                </a>
                <a class="rel-btn" [href]="privacyUrl()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>{{ isPl ? 'Polityka Prywatności' : 'Privacy Policy' }}</span>
                </a>
              </div>
            </div>
          </article>

        </main>
      </div>
    </qs-shell>
  `,
  styles: [`
    .complaints-page {
      padding-bottom: 5rem;
    }

    /* Hero */
    .complaints-hero {
      padding: 4.5rem 0 2.5rem;
      text-align: center;
      max-width: 52rem;
      margin: 0 auto;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.25);
      color: var(--accent-cyan);
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
    }
    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.4rem);
      font-weight: 900;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .hero-meta-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-decoration: none;
    }
    .meta-pill.hoverable:hover {
      border-color: var(--accent-cyan);
      color: var(--text-primary);
    }
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--text-primary);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--accent-cyan);
    }

    /* Seller Card */
    .seller-card {
      margin: 2rem auto 3.5rem;
      padding: 2.25rem;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(6, 182, 212, 0.3);
      background: radial-gradient(circle at top right, rgba(6, 182, 212, 0.08), transparent 60%), rgba(10, 15, 25, 0.85);
      max-width: 58rem;
    }
    .seller-card-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.75rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .seller-badge-icon {
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-md);
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .seller-title {
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0;
    }
    .seller-sub {
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }
    .seller-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1.5rem;
    }
    .seller-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .seller-lbl {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-tertiary);
      font-weight: 700;
    }
    .seller-val {
      font-size: 1rem;
      color: var(--text-primary);
    }
    .seller-hint {
      font-size: 0.78rem;
      color: var(--text-secondary);
    }
    .seller-link {
      font-size: 0.95rem;
      color: var(--accent-cyan);
      text-decoration: underline;
      font-weight: 600;
      width: fit-content;
    }
    .seller-link.highlight {
      color: #38bdf8;
      font-weight: 700;
    }

    /* Procedure Sections */
    .procedure-content {
      max-width: 58rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .proc-section {
      display: grid;
      grid-template-columns: 3.5rem minmax(0, 1fr);
      gap: 1.75rem;
      padding: 2.25rem;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 20, 30, 0.6);
    }
    .proc-section.highlight-section {
      border-color: rgba(6, 182, 212, 0.35);
      background: radial-gradient(circle at top left, rgba(6, 182, 212, 0.06), transparent 70%), rgba(15, 20, 30, 0.75);
    }
    .proc-num {
      width: 3.25rem;
      height: 3.25rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(124, 92, 252, 0.2));
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: var(--accent-cyan);
      font-size: 1.25rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .proc-body h2 {
      font-size: 1.35rem;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 0.85rem;
      color: var(--text-primary);
    }
    .proc-body p {
      font-size: 1rem;
      line-height: 1.65;
      color: var(--text-secondary);
      margin-bottom: 0.85rem;
    }
    .proc-body p:last-child {
      margin-bottom: 0;
    }
    .proc-body a {
      color: var(--accent-cyan);
      text-decoration: underline;
    }
    .proc-list {
      list-style: disc;
      padding-left: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin: 1rem 0;
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.55;
    }
    .proc-list strong {
      color: var(--text-primary);
    }
    .callout-box {
      margin-top: 1.25rem;
      padding: 1.25rem 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border-left: 3px solid var(--accent-cyan);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
    }
    .callout-box ol {
      margin: 0.75rem 0 0 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .law-banner {
      display: flex;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      margin: 1.25rem 0;
      border-radius: var(--radius-lg);
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.95rem;
      line-height: 1.55;
    }
    .law-banner strong {
      color: #6ee7b7;
      display: block;
      margin-bottom: 0.25rem;
    }
    .law-banner p {
      margin: 0;
      color: #d1fae5;
    }
    .law-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    /* Related links */
    .related-links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: 1rem;
      margin-top: 1.25rem;
    }
    .rel-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.9rem 1.25rem;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .rel-btn:hover {
      background: rgba(6, 182, 212, 0.1);
      border-color: var(--accent-cyan);
      color: #fff;
    }

    @media (max-width: 768px) {
      .proc-section {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1.5rem;
      }
      .proc-num {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1rem;
      }
      .seller-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class ComplaintsComponent implements OnInit {
  protected locale: Locale = 'pl';
  protected isPl: boolean = true;
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    const rawLocale = this.route.snapshot.data['locale'] as Locale;
    this.locale = rawLocale || 'pl';
    this.isPl = this.locale === 'pl';

    const title = this.isPl
      ? 'Procedura reklamacyjna | QuizSolver'
      : 'Complaints Procedure | QuizSolver';
    const description = this.isPl
      ? 'Oficjalna procedura reklamacyjna serwisu QuizSolver. Rozpatrzenie w terminie 14 dni zgodnie z art. 7a ustawy o prawach konsumenta. Sprzedawca: Kamil Pardała, ul. Drukarska 7, Kraków.'
      : 'Official complaints procedure for QuizSolver. Claims resolution within 14 calendar days. Merchant: Kamil Pardała, ul. Drukarska 7, Kraków, Poland.';

    this.seo.applyPage('complaints', this.locale, {
      robots: 'index, follow'
    });
  }

  protected contactUrl(): string {
    return pathFor('contact', this.locale);
  }

  protected termsUrl(): string {
    return `${pathFor('terms', this.locale)}#section-6`;
  }

  protected privacyUrl(): string {
    return pathFor('privacy', this.locale);
  }

  protected printPage(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
