import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { SeoService } from '../seo.service';
import { Locale, pageData, pathFor } from '../site-content';
import { ShellComponent } from './shell.component';

type DashboardUi = {
  dashboard: string;
  credits: string;
  creditUnitText: string;
  welcomeUser: string;
  dashboardIntro: string;
  questionsSolved: string;
  referralBonus: string;
  referralCode: string;
  referralMockTitle: string;
  greeting: string;
  lowCreditsTitle: string;
  lowCreditsText: string;
  buyCredits: string;
  referralTitle: string;
  referralText: string;
  copied: string;
  copy: string;
  signups: string;
  purchases: string;
  bonusCredits: string;
  ofPurchase: string;
  history: string;
  historyTitle: string;
  noPurchases: string;
};

const DASHBOARD_UI: Record<Locale, DashboardUi> = {
  en: {
    dashboard: 'Dashboard',
    credits: 'Credits',
    creditUnitText: '1 credit = 1 AI answer',
    welcomeUser: 'Welcome, User',
    dashboardIntro: 'Credits, purchase history, and your referral code in one place.',
    questionsSolved: 'Questions solved',
    referralBonus: 'Referral bonus',
    referralCode: 'Referral code',
    referralMockTitle: 'Refer friends: +5 credits & 10%',
    greeting: 'Hi,',
    lowCreditsTitle: 'Your credits are running low',
    lowCreditsText: 'Buy more so you do not run out during a quiz.',
    buyCredits: 'Buy credits',
    referralTitle: 'Refer friends: +5 credits on signup & 10% from purchases',
    referralText: 'When someone signs up with your link and confirms their email, you both get +5 free credits. Plus, you receive a 10% bonus from every credit purchase they make! (Limit: max 1/hour per device, up to 5 bonuses / +25 credits per 24h per account).',
    copied: 'Copied',
    copy: 'Copy',
    signups: 'Signups',
    purchases: 'Purchases',
    bonusCredits: 'Bonus credits',
    ofPurchase: 'Of purchase',
    history: 'History',
    historyTitle: 'Purchases & Top-ups',
    noPurchases: 'No purchases yet.'
  },
  pl: {
    dashboard: 'Panel',
    credits: 'Kredyty',
    creditUnitText: '1 kredyt = 1 odpowiedź AI',
    welcomeUser: 'Witaj, Użytkowniku',
    dashboardIntro: 'Kredyty, historia zakupów i kod polecający w jednym miejscu.',
    questionsSolved: 'Rozwiązane pytania',
    referralBonus: 'Bonus z poleceń',
    referralCode: 'Kod polecający',
    referralMockTitle: 'Polecaj: +5 kredytów i 10%',
    greeting: 'Cześć,',
    lowCreditsTitle: 'Twoje kredyty zaraz się skończą',
    lowCreditsText: 'Kup więcej, aby nie zabrakło ich podczas quizu.',
    buyCredits: 'Kup kredyty',
    referralTitle: 'Polecaj znajomym: +5 kredytów za rejestrację i 10% z zakupów',
    referralText: 'Gdy ktoś zarejestruje się z Twojego linku i potwierdzi e-mail, obaj dostajecie po +5 darmowych kredytów. Dodatkowo otrzymujesz bonus 10% od każdego dokonanego przez niego zakupu kredytów! (Limit: maks. 1 na godzinę na urządzenie, do 5 bonusów / +25 kredytów na 24h na konto).',
    copied: 'Skopiowano',
    copy: 'Kopiuj',
    signups: 'Rejestracje',
    purchases: 'Zakupy',
    bonusCredits: 'Kredyty bonusowe',
    ofPurchase: 'Od zakupu',
    history: 'Historia',
    historyTitle: 'Zakupy i doładowania',
    noPurchases: 'Nie ma jeszcze zakupów.'
  },
  de: {
    dashboard: 'Dashboard',
    credits: 'Credits',
    creditUnitText: '1 Credit = 1 KI-Antwort',
    welcomeUser: 'Willkommen, Nutzer',
    dashboardIntro: 'Credits, Kaufhistorie und dein Empfehlungscode an einem Ort.',
    questionsSolved: 'Gelöste Fragen',
    referralBonus: 'Empfehlungsbonus',
    referralCode: 'Empfehlungscode',
    referralMockTitle: 'Empfehlen: +5 Credits & 10%',
    greeting: 'Hallo,',
    lowCreditsTitle: 'Deine Credits werden knapp',
    lowCreditsText: 'Kaufe mehr, damit sie während eines Quiz nicht ausgehen.',
    buyCredits: 'Credits kaufen',
    referralTitle: 'Freunde werben: +5 Credits bei Registrierung & 10% auf Käufe',
    referralText: 'Wenn sich jemand über deinen Link anmeldet und die E-Mail bestätigt, erhalten beide +5 Gratis-Credits. Zudem erhältst du 10% Bonus auf jeden Credit-Kauf! (Limit: max. 1/Stunde pro Gerät, bis zu 5 Boni / +25 Credits pro 24h pro Konto).',
    copied: 'Kopiert',
    copy: 'Kopieren',
    signups: 'Registrierungen',
    purchases: 'Käufe',
    bonusCredits: 'Bonus-Credits',
    ofPurchase: 'Vom Kauf',
    history: 'Historie',
    historyTitle: 'Käufe und Aufladungen',
    noPurchases: 'Noch keine Käufe.'
  },
  es: {
    dashboard: 'Panel',
    credits: 'Créditos',
    creditUnitText: '1 crédito = 1 respuesta AI',
    welcomeUser: 'Bienvenido, usuario',
    dashboardIntro: 'Créditos, historial de compras y código de referido en un solo lugar.',
    questionsSolved: 'Preguntas resueltas',
    referralBonus: 'Bono de referido',
    referralCode: 'Código de referido',
    referralMockTitle: 'Recomienda: +5 créditos y 10%',
    greeting: 'Hola,',
    lowCreditsTitle: 'Tus créditos están por acabarse',
    lowCreditsText: 'Compra más para no quedarte sin créditos durante un quiz.',
    buyCredits: 'Comprar créditos',
    referralTitle: 'Recomienda amigos: +5 créditos por registro y 10% en compras',
    referralText: 'Cuando alguien se registra con tu enlace y confirma su correo, ambos reciben +5 créditos gratis. ¡Además recibes un 10% de bonificación en cada compra de créditos! (Límite: máx. 1/hora por dispositivo, hasta 5 bonos / +25 créditos por 24h por cuenta).',
    copied: 'Copiado',
    copy: 'Copiar',
    signups: 'Registros',
    purchases: 'Compras',
    bonusCredits: 'Créditos de bono',
    ofPurchase: 'De la compra',
    history: 'Historial',
    historyTitle: 'Compras y recargas',
    noPurchases: 'Todavía no hay compras.'
  },
  fr: {
    dashboard: 'Tableau de bord',
    credits: 'Crédits',
    creditUnitText: '1 crédit = 1 réponse IA',
    welcomeUser: 'Bienvenue, utilisateur',
    dashboardIntro: 'Crédits, historique d’achat et code de parrainage au même endroit.',
    questionsSolved: 'Questions résolues',
    referralBonus: 'Bonus de parrainage',
    referralCode: 'Code de parrainage',
    referralMockTitle: 'Parrainez : +5 crédits et 10%',
    greeting: 'Bonjour,',
    lowCreditsTitle: 'Tes crédits sont presque épuisés',
    lowCreditsText: 'Achète-en davantage pour ne pas en manquer pendant un quiz.',
    buyCredits: 'Acheter des crédits',
    referralTitle: 'Parrainez des amis : +5 crédits à l’inscription et 10% sur les achats',
    referralText: 'Quand quelqu’un s’inscrit avec votre lien et confirme son e-mail, vous recevez tous les deux +5 crédits gratuits. De plus, vous gagnez un bonus de 10% sur chacun de ses achats ! (Limite : max 1/heure par appareil, jusqu’à 5 bonus / +25 crédits par 24h par compte).',
    copied: 'Copié',
    copy: 'Copier',
    signups: 'Inscriptions',
    purchases: 'Achats',
    bonusCredits: 'Crédits bonus',
    ofPurchase: 'De l’achat',
    history: 'Historique',
    historyTitle: 'Achats et recharges',
    noPurchases: 'Aucun achat pour l’instant.'
  },
  it: {
    dashboard: 'Dashboard',
    credits: 'Crediti',
    creditUnitText: '1 credito = 1 risposta AI',
    welcomeUser: 'Benvenuto, utente',
    dashboardIntro: 'Crediti, cronologia acquisti e codice referral in un unico posto.',
    questionsSolved: 'Domande risolte',
    referralBonus: 'Bonus referral',
    referralCode: 'Codice referral',
    referralMockTitle: 'Invita: +5 crediti e 10%',
    greeting: 'Ciao,',
    lowCreditsTitle: 'I tuoi crediti stanno finendo',
    lowCreditsText: 'Acquistane altri per non rimanere senza durante un quiz.',
    buyCredits: 'Compra crediti',
    referralTitle: 'Invita amici: +5 crediti alla registrazione e 10% sugli acquisti',
    referralText: 'Quando qualcuno si registra con il tuo link e conferma la sua email, entrambi ricevete +5 crediti gratuiti. In più ricevi un bonus del 10% su ogni acquisto di crediti! (Limite: max 1/ora per dispositivo, fino a 5 bonus / +25 crediti per 24h per account).',
    copied: 'Copiato',
    copy: 'Copia',
    signups: 'Registrazioni',
    purchases: 'Acquisti',
    bonusCredits: 'Crediti bonus',
    ofPurchase: 'Dell’acquisto',
    history: 'Cronologia',
    historyTitle: 'Acquisti e ricariche',
    noPurchases: 'Ancora nessun acquisto.'
  },
  uk: {
    dashboard: 'Панель',
    credits: 'Кредити',
    creditUnitText: '1 кредит = 1 AI-відповідь',
    welcomeUser: 'Вітаємо, користувачу',
    dashboardIntro: 'Кредити, історія покупок і реферальний код в одному місці.',
    questionsSolved: 'Розв’язані питання',
    referralBonus: 'Реферальний бонус',
    referralCode: 'Реферальний код',
    referralMockTitle: 'Запрошуй: +5 кредитів і 10%',
    greeting: 'Привіт,',
    lowCreditsTitle: 'Кредити скоро закінчаться',
    lowCreditsText: 'Купи більше, щоб їх вистачило під час вікторини.',
    buyCredits: 'Купити кредити',
    referralTitle: 'Запрошуй друзів: +5 кредитів за реєстрацію та 10% з покупок',
    referralText: 'Коли хтось реєструється за твоїм посиланням і підтверджує пошту, ви обоє отримуєте по +5 безкоштовних кредитів. Крім того, ти отримуєш 10% бонусу з кожної покупки! (Ліміт: макс. 1/год на пристрій, до 5 бонусів / +25 кредитів на 24год на акаунт).',
    copied: 'Скопійовано',
    copy: 'Копіювати',
    signups: 'Реєстрації',
    purchases: 'Покупки',
    bonusCredits: 'Бонусні кредити',
    ofPurchase: 'Від покупки',
    history: 'Історія',
    historyTitle: 'Покупки та поповнення',
    noPurchases: 'Покупок поки немає.'
  },
  pt: {
    dashboard: 'Painel',
    credits: 'Créditos',
    creditUnitText: '1 crédito = 1 resposta IA',
    welcomeUser: 'Bem-vindo, usuário',
    dashboardIntro: 'Créditos, histórico de compras e seu código de indicação em um só lugar.',
    questionsSolved: 'Perguntas resolvidas',
    referralBonus: 'Bônus de indicação',
    referralCode: 'Código de indicação',
    referralMockTitle: 'Indique: +5 créditos e 10%',
    greeting: 'Olá,',
    lowCreditsTitle: 'Seus créditos estão acabando',
    lowCreditsText: 'Compre mais para não ficar sem respostas durante o quiz.',
    buyCredits: 'Comprar créditos',
    referralTitle: 'Indique amigos: +5 créditos no cadastro e 10% nas compras',
    referralText: 'Quando alguém se cadastra com seu link e confirma o e-mail, ambos ganham +5 créditos grátis. Além disso, você recebe um bônus de 10% sobre todas as compras de créditos! (Limite: máx. 1/hora por dispositivo, até 5 bônus / +25 créditos por 24h por conta).',
    copied: 'Copiado',
    copy: 'Copiar',
    signups: 'Cadastros',
    purchases: 'Compras',
    bonusCredits: 'Créditos de bônus',
    ofPurchase: 'Da compra',
    history: 'Histórico',
    historyTitle: 'Compras e recargas',
    noPurchases: 'Nenhuma compra realizada ainda.'
  },
  ar: {
    dashboard: 'لوحة التحكم',
    credits: 'الرصيد',
    creditUnitText: '1 رصيد = 1 إجابة ذكاء اصطناعي',
    welcomeUser: 'مرحباً بك، أيها المستخدم',
    dashboardIntro: 'الرصيد، وسجل المشتريات، ورمز الإحالة الخاص بك في مكان واحد.',
    questionsSolved: 'الأسئلة المحلولة',
    referralBonus: 'مكافأة الإحالة',
    referralCode: 'رمز الإحالة',
    referralMockTitle: 'ادعُ أصدقاءك: +5 رصيد و10%',
    greeting: 'أهلاً،',
    lowCreditsTitle: 'رصيدك قارب على الانتهاء',
    lowCreditsText: 'اشحن رصيدك الآن حتى لا تنفد منك الإجابات أثناء الاختبار.',
    buyCredits: 'شراء رصيد',
    referralTitle: 'ادعُ أصدقاءك: +5 رصيد مجاني عند التسجيل و10% من المشتريات',
    referralText: 'عندما يسجل أي شخص عبر رابطك ويؤكد بريده الإلكتروني، يحصل كليكما على +5 رصيد مجاني، بالإضافة إلى مكافأة 10% من كل عملية شراء رصيد يجريها! (الحد: 1/ساعة كحد أقصى لكل جهاز، وحتى 5 مكافآت / +25 رصيد لكل 24 ساعة لكل حساب).',
    copied: 'تم النسخ',
    copy: 'نسخ',
    signups: 'التسجيلات',
    purchases: 'المشتريات',
    bonusCredits: 'رصيد المكافأة',
    ofPurchase: 'من المشتريات',
    history: 'السجل',
    historyTitle: 'المشتريات وعمليات الشحن',
    noPurchases: 'لا توجد مشتريات حتى الآن.'
  },
  tr: {
    dashboard: 'Panel',
    credits: 'Krediler',
    creditUnitText: '1 kredi = 1 yapay zeka cevabı',
    welcomeUser: 'Hoş geldiniz',
    dashboardIntro: 'Kredileriniz, satın alma geçmişiniz ve tavsiye kodunuz tek bir yerde.',
    questionsSolved: 'Çözülen sorular',
    referralBonus: 'Tavsiye bonusu',
    referralCode: 'Tavsiye kodu',
    referralMockTitle: 'Tavsiye: +5 kredi ve %10',
    greeting: 'Merhaba,',
    lowCreditsTitle: 'Krediniz tükenmek üzere',
    lowCreditsText: 'Quiz esnasında yarı yolda kalmamak için hemen kredi yükleyin.',
    buyCredits: 'Kredi satın al',
    referralTitle: 'Arkadaşlarınızı davet edin: Kayıtta +5 kredi ve satın alımlarda %10 kazanın',
    referralText: 'Biri bağlantınızla kaydolup e-postasını onayladığında, ikiniz de +5 ücretsiz kredi kazanırsınız. Ayrıca her kredi satın alımından %10 bonus kazanırsınız! (Sınır: cihaz başına saatte maks. 1, hesap başına 24 saatte en fazla 5 bonus / +25 kredi).',
    copied: 'Kopyalandı',
    copy: 'Kopyala',
    signups: 'Kayıtlar',
    purchases: 'Satın alımlar',
    bonusCredits: 'Bonus krediler',
    ofPurchase: 'Satın alımdan',
    history: 'Geçmiş',
    historyTitle: 'Satın alımlar ve yüklemeler',
    noPurchases: 'Henüz satın alma yapılmadı.'
  },
  ja: {
    dashboard: 'ダッシュボード',
    credits: 'クレジット',
    creditUnitText: '1 クレジット = 1 回の AI 解答',
    welcomeUser: 'ようこそ',
    dashboardIntro: 'クレジット残高、購入履歴、紹介コードを一元管理。',
    questionsSolved: '解答済み問題数',
    referralBonus: '紹介ボーナス',
    referralCode: '紹介コード',
    referralMockTitle: '友達招待：+5クレジット＆10%',
    greeting: 'こんにちは、',
    lowCreditsTitle: 'クレジット残高が少なくなっています',
    lowCreditsText: 'テスト中に解答が途切れないよう、事前にチャージしてください。',
    buyCredits: 'クレジットを購入',
    referralTitle: '友達を招待：登録で+5クレジット＆購入額の10%を獲得',
    referralText: 'あなたのリンクから登録してメール確認を完了すると、お互いに+5の無料クレジットが付与されます。さらに、クレジット購入ごとに10%のボーナスを獲得できます！（制限：デバイスあたり1時間最大1回、アカウントあたり24時間で最大5回 / +25クレジット）。',
    copied: 'コピー完了',
    copy: 'コピー',
    signups: '登録数',
    purchases: '購入回数',
    bonusCredits: 'ボーナスクレジット',
    ofPurchase: '購入分',
    history: '履歴',
    historyTitle: '購入・チャージ履歴',
    noPurchases: '購入履歴はまだありません。'
  },
  ko: {
    dashboard: '대시보드',
    credits: '크레딧',
    creditUnitText: '1 크레딧 = 1회 AI 정답',
    welcomeUser: '환영합니다',
    dashboardIntro: '크레딧 잔액, 충전 내역, 추천인 코드를 한 곳에서 관리하세요.',
    questionsSolved: '해결한 문제',
    referralBonus: '추천 보너스',
    referralCode: '추천인 코드',
    referralMockTitle: '친구 초대: +5 크레딧 & 10%',
    greeting: '안녕하세요,',
    lowCreditsTitle: '크레딧이 부족합니다',
    lowCreditsText: '시험 중에 문제가 끊기지 않도록 미리 충전해두세요.',
    buyCredits: '크레딧 충전',
    referralTitle: '친구 초대: 가입 시 +5 크레딧 & 구매 시 10% 보너스',
    referralText: '추천 링크로 가입하고 이메일 인증을 완료하면 두 분 모두에게 +5 무료 크레딧이 지급됩니다. 또한 친구가 크레딧을 구매할 때마다 10% 보너스를 받습니다! (제한: 기기당 시간당 최대 1회, 계정당 24시간 내 최대 5회 보너스 / +25 크레딧).',
    copied: '복사됨',
    copy: '복사',
    signups: '가입자 수',
    purchases: '구매 건수',
    bonusCredits: '보너스 크레딧',
    ofPurchase: '구매 대비',
    history: '내역',
    historyTitle: '구매 및 충전 내역',
    noPurchases: '아직 구매 내역이 없습니다.'
  }
};

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent, FormsModule],
  template: `
    <qs-shell #shell [locale]="locale" pageKey="dashboard">
      <div class="container dashboard-main">
        <section *ngIf="!api.currentUser(); else dashboardContent" class="section unauthorized-section-wrapper">
          <div class="unauthorized-blur-bg" aria-hidden="true">
            <header class="dashboard-header" style="padding-top: 1rem;">
              <p class="eyebrow">DASHBOARD</p>
              <h1>{{ ui.welcomeUser }}</h1>
              <p class="desc text-secondary">
                {{ ui.dashboardIntro }}
              </p>
            </header>

            <div class="stats-grid">
              <div class="stat-card glass">
                <div class="stat-num text-gradient-strong">750</div>
                <div class="stat-label">{{ copy.credits }}</div>
              </div>
              <div class="stat-card glass">
                <div class="stat-num">142</div>
                <div class="stat-label">{{ ui.questionsSolved }}</div>
              </div>
              <div class="stat-card glass">
                <div class="stat-num">35</div>
                <div class="stat-label">{{ ui.referralBonus }}</div>
              </div>
            </div>

            <div class="referral-card glass" style="margin-bottom: 2rem;">
              <div class="referral-grid">
                <div class="referral-info">
                  <p class="eyebrow">{{ ui.referralCode }}</p>
                  <h2 style="margin: 0.5rem 0;">{{ ui.referralMockTitle }}</h2>
                  <div class="copy-box" style="max-width: 300px;"><code class="ref-link">https://getquizsolver.com/?ref=demo123</code></div>
                </div>
                <div class="referral-stats" style="grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                  <div class="glass stat-box" style="padding: 0.5rem;"><strong style="font-size: 1.2rem;">12</strong><span style="font-size: 0.65rem;">Signups</span></div>
                  <div class="glass stat-box" style="padding: 0.5rem;"><strong style="font-size: 1.2rem;">3</strong><span style="font-size: 0.65rem;">Purchases</span></div>
                </div>
              </div>
            </div>
          </div>

          <div class="login-panel glass floating-panel">
            <div class="padlock-wrapper">
              <svg class="padlock-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <div class="padlock-glow"></div>
            </div>
            <p class="eyebrow">{{ copy.dashboard }}</p>
            <h2>{{ data.loginTitle }}</h2>
            <p class="desc text-secondary">{{ data.loginText }}</p>
            <button class="btn btn-primary btn-lg" type="button" (click)="shell.openModal('login')">
              {{ data.loginButton }}
            </button>
          </div>
        </section>

        <ng-template #dashboardContent>
          <header class="dashboard-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
            <div>
              <p class="eyebrow">{{ copy.dashboard }}</p>
              <h1>{{ ui.greeting }} {{ api.currentUser()?.displayName || (api.currentUser()?.email?.split('@')?.[0]) || '' }}!</h1>
              <p class="desc text-secondary">{{ ui.dashboardIntro }}</p>
            </div>
            <div>
              <button class="btn btn-outline" (click)="settingsOpen = true">Settings</button>
            </div>
          </header>

          <div *ngIf="api.currentUser()?.accountDeletionScheduledAt" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:1.5rem; margin-bottom:2rem; text-align:center;">
            <h3 style="color:#f87171; margin-bottom:0.5rem;">Account Scheduled for Deletion</h3>
            <p style="color:#e2e8f0; font-size:0.95rem; margin-bottom:1rem;">Your account will be permanently deleted on {{ api.currentUser()?.accountDeletionScheduledAt | date }}.</p>
            <button class="btn btn-primary" (click)="cancelDeletion()">Cancel Deletion</button>
          </div>

          <section class="stats-grid">
            <article class="stat-card glass glass-hover">
              <div class="stat-num text-gradient-strong">
                {{ api.currentUser()?.role === 'admin' ? '∞' : (api.currentUser()?.credits || 0) }}
              </div>
              <div class="stat-label">{{ copy.credits }}</div>
              <div class="stat-note text-secondary">{{ ui.creditUnitText }}</div>
            </article>
            <article class="stat-card glass glass-hover">
              <div class="stat-num">
                {{ api.currentUser()?.stats?.totalQuestionsSolved || 0 }}
              </div>
              <div class="stat-label">{{ ui.questionsSolved }}</div>
            </article>
            <article class="stat-card glass glass-hover">
              <div class="stat-num">
                {{ referral().referralCredits || 0 }}
              </div>
              <div class="stat-label">{{ ui.referralBonus }}</div>
            </article>
          </section>

          <section class="credit-warning glass" *ngIf="lowCredits()">
            <div>
              <p class="eyebrow">{{ copy.credits }}</p>
              <h2>{{ ui.lowCreditsTitle }}</h2>
              <p class="text-secondary">
                {{ ui.lowCreditsText }}
              </p>
            </div>
            <a class="btn btn-primary" [href]="creditsPath()">
              {{ ui.buyCredits }}
            </a>
          </section>

          <section class="referral-section">
            <div class="referral-card glass">
              <div class="referral-grid">
                <div class="referral-info">
                  <p class="eyebrow">{{ ui.referralCode }}</p>
                  <h2>{{ ui.referralTitle }}</h2>
                  <p class="text-secondary">
                    {{ ui.referralText }}
                  </p>
                  <div class="copy-box">
                    <code class="ref-link">{{ referral().referralLink || 'Loading...' }}</code>
                    <div style="display: flex; gap: 8px;">
                      <button class="btn btn-primary btn-sm" type="button" (click)="copyReferral()">
                        {{ copied ? ui.copied : ui.copy }}
                      </button>
                      <button class="btn btn-outline btn-sm" type="button" (click)="editReferralOpen = !editReferralOpen; editReferralInput = api.currentUser()?.referralCode || ''">
                        {{ locale === 'pl' ? 'Zmień' : 'Edit' }}
                      </button>
                    </div>
                  </div>
                  <div *ngIf="editReferralOpen" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                      <input type="text" [(ngModel)]="editReferralInput" placeholder="Nowy kod / New code" class="input" style="flex: 1;" />
                      <button class="btn btn-primary" [disabled]="editReferralLoading" (click)="saveReferralCode()">
                        {{ editReferralLoading ? '...' : (locale === 'pl' ? 'Zapisz' : 'Save') }}
                      </button>
                    </div>
                    <div *ngIf="editReferralError" class="text-error" style="color: #ef4444; font-size: 0.875rem;">{{ editReferralError }}</div>
                  </div>
                </div>
                <div class="referral-stats">
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referredUsers || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ ui.signups }}</span>
                  </div>
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referralPurchases || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ ui.purchases }}</span>
                  </div>
                  <div class="glass stat-box">
                    <strong class="stat-val">{{ referral().referralCredits || 0 }}</strong>
                    <span class="stat-lbl text-secondary">{{ ui.bonusCredits }}</span>
                  </div>
                  <div class="glass stat-box highlight-box">
                    <strong class="stat-val text-gradient-strong">10%</strong>
                    <span class="stat-lbl text-secondary">{{ ui.ofPurchase }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="history-section">
            <div class="history-header">
              <div class="history-title-group">
                <p class="eyebrow">{{ ui.history }}</p>
                <h2>{{ ui.historyTitle }}</h2>
              </div>
            </div>

            <div class="history-list glass" *ngIf="purchases().length; else noPurchases">
              <div class="history-item" *ngFor="let purchase of purchases()">
                <div class="item-details">
                  <strong class="pack-title">{{ (purchase.pack || '').toUpperCase() }}</strong>
                  <p class="credits-count text-secondary">
                    +{{ purchase.credits }} {{ copy.credits }} • {{ purchase.createdAt | date:'mediumDate' }}
                    <span *ngIf="purchase.paymentProvider">({{ purchase.paymentProvider }})</span>
                  </p>
                </div>
                <div class="price-val">
                  {{ purchase.priceUsd ? ('$' + purchase.priceUsd) : (purchase.paymentProvider === 'referral' ? 'bonus' : 'PLN / online') }}
                </div>
              </div>
            </div>
            <ng-template #noPurchases>
              <div class="no-purchases glass">
                <p class="text-secondary">{{ ui.noPurchases }}</p>
              </div>
            </ng-template>
          </section>

<div *ngIf="settingsOpen" class="scanner-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; justify-content:center; align-items:center; padding:1rem;">
  <div class="scanner-modal glass" style="max-width:460px; padding:2rem; border-radius:16px; background:#0f172a; width:100%; position:relative; max-height:90vh; overflow-y:auto;">
    <button style="position:absolute; top:1rem; right:1rem; background:transparent; border:none; color:white; cursor:pointer; font-size:1.5rem;" (click)="settingsOpen = false">&times;</button>
    <h2 style="margin-bottom:1.5rem;">Account Settings</h2>

    <div style="display:flex; flex-direction:column; gap:1.25rem; text-align:left;">
      <div>
        <label style="display:block; margin-bottom:0.25rem; font-size:0.85rem; color:#94a3b8;">Email Address</label>
        <div style="display:flex; gap:0.5rem; flex-direction:column;">
          <div style="display:flex; gap:0.5rem;">
            <input type="email" class="input" [(ngModel)]="editEmail" placeholder="New email address" style="flex:1; padding:0.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:white;" />
            <input *ngIf="hasPassword && !emailCodeSent" type="password" class="input" [(ngModel)]="emailChangePassword" placeholder="Current Password" style="width:130px; padding:0.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:white;" />
            <input *ngIf="emailCodeSent" type="text" class="input" [(ngModel)]="emailCode" placeholder="6-digit code" style="width:100px; padding:0.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:white;" />
            
            <button *ngIf="!emailCodeSent" class="btn btn-primary" style="padding:0.5rem 1rem; font-size:0.85rem;" (click)="requestEmailChange()">Send Code</button>
            <button *ngIf="emailCodeSent" class="btn btn-primary" style="padding:0.5rem 1rem; font-size:0.85rem;" (click)="confirmEmailChange()">Verify</button>
          </div>
          <p *ngIf="emailSavedMsg" style="font-size:0.75rem; color:#22c55e; margin:0;">{{ emailSavedMsg }}</p>
          <p *ngIf="emailErrorMsg" style="font-size:0.75rem; color:#ef4444; margin:0;">{{ emailErrorMsg }}</p>
        </div>
      </div>

      <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:0.25rem 0;" />

      <div *ngIf="hasPassword">
        <label style="display:block; margin-bottom:0.25rem; font-size:0.85rem; color:#94a3b8;">Change Password</label>
        <div style="display:flex; gap:0.5rem; flex-direction:column;">
          <input type="password" class="input" [(ngModel)]="currentPassword" placeholder="Current password" style="width:100%; padding:0.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:white;" />
          <input type="password" class="input" [(ngModel)]="newPassword" placeholder="New password" style="width:100%; padding:0.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:white;" />
          <button class="btn btn-primary" style="padding:0.5rem 1rem; font-size:0.85rem; align-self:flex-start;" (click)="savePassword()">Update Password</button>
          <p *ngIf="passwordSavedMsg" style="font-size:0.75rem; color:#22c55e; margin:0;">{{ passwordSavedMsg }}</p>
          <p *ngIf="passwordErrorMsg" style="font-size:0.75rem; color:#ef4444; margin:0;">{{ passwordErrorMsg }}</p>
        </div>
      </div>
      <div *ngIf="!hasPassword">
        <p style="font-size:0.85rem; color:#94a3b8; margin:0;">You are logged in via an external provider (e.g. Google). Set a password via the "Forgot Password" flow if you want to use a password.</p>
      </div>

      <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:0.25rem 0;" />

      <label style="display:flex; align-items:flex-start; gap:0.5rem; cursor:pointer;">
        <input type="checkbox" [(ngModel)]="marketingEnabled" (change)="saveSettings()" style="margin-top:0.25rem;" />
        <span style="font-size:0.9rem;">Receive marketing emails, tips and special offers</span>
      </label>

      <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:0.25rem 0;" />

      <div style="padding:1rem; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:8px;">
        <p style="font-size:0.85rem; color:#f87171; margin-bottom:0.5rem; font-weight:600;">Delete Account</p>
        <p style="font-size:0.8rem; color:#94a3b8; margin-bottom:1rem;">To permanently delete your account, you need a verification code. Deletion happens after 14 days.</p>
        <div style="display:flex; gap:0.5rem; flex-direction:column;">
          <div style="display:flex; gap:0.5rem;">
            <input *ngIf="hasPassword && !deleteCodeSent" type="password" class="input" [(ngModel)]="deletePassword" placeholder="Current password" style="flex:1; padding:0.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:white;" />
            <input *ngIf="deleteCodeSent" type="text" class="input" [(ngModel)]="deleteCode" placeholder="6-digit code from email" style="flex:1; padding:0.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:white;" />
            
            <button *ngIf="!deleteCodeSent" class="btn" style="background:#ef4444; color:white; padding:0.5rem 1rem; font-size:0.85rem; align-self:flex-start; border:none; cursor:pointer; border-radius:8px;" (click)="requestDeleteAccount()">Send Code</button>
            <button *ngIf="deleteCodeSent" class="btn" style="background:#ef4444; color:white; padding:0.5rem 1rem; font-size:0.85rem; align-self:flex-start; border:none; cursor:pointer; border-radius:8px;" (click)="confirmDeleteAccount()">Delete My Account</button>
          </div>
          <p *ngIf="deleteErrorMsg" style="font-size:0.75rem; color:#ef4444; margin:0;">{{ deleteErrorMsg }}</p>
          <p *ngIf="deleteSavedMsg" style="font-size:0.75rem; color:#22c55e; margin:0;">{{ deleteSavedMsg }}</p>
        </div>
      </div>
    </div>
  </div>
</div>

        </ng-template>
      </div>
    </qs-shell>
  `,
  styles: [`
    .dashboard-main {
      padding-bottom: 5rem;
    }

    /* Unauthorized view */
    .unauthorized-section-wrapper {
      position: relative;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 2rem 0;
    }
    .unauthorized-blur-bg {
      width: 100%;
      pointer-events: none;
      user-select: none;
      filter: blur(10px);
      opacity: 0.25;
      transition: filter 0.3s;
    }
    .login-panel.floating-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 910%;
      max-width: 500px;
      padding: 3.5rem 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 10;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.15);
      animation: float-centered 6s ease-in-out infinite;
    }
    @keyframes float-centered {
      0%, 100% { transform: translate(-50%, -50%) translateY(0); }
      50% { transform: translate(-50%, -50%) translateY(-12px); }
    }
    .login-panel h2 {
      font-size: 2.25rem;
      margin: 1rem 0;
      line-height: 1.25;
    }
    .login-panel .desc {
      margin-bottom: 2rem;
      font-size: 1rem;
      line-height: 1.6;
    }
    .padlock-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .padlock-svg {
      width: 48px;
      height: 48px;
      color: var(--accent-violet);
      filter: drop-shadow(0 0 8px var(--glow-violet));
      animation: padlock-pulse 2s ease-in-out infinite alternate;
      z-index: 2;
    }
    .padlock-glow {
      position: absolute;
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, var(--glow-violet) 0%, transparent 70%);
      border-radius: 50%;
      z-index: 1;
      animation: glow-pulse-inner 2s ease-in-out infinite alternate;
    }
    @keyframes padlock-pulse {
      0% {
        transform: scale(0.95);
        color: var(--accent-violet);
        filter: drop-shadow(0 0 8px var(--glow-violet));
      }
      100% {
        transform: scale(1.05);
        color: var(--accent-cyan);
        filter: drop-shadow(0 0 15px var(--glow-cyan));
      }
    }
    @keyframes glow-pulse-inner {
      0% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      100% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    /* Dashboard Header */
    .dashboard-header {
      padding: 4rem 0 2rem;
    }
    .dashboard-header h1 {
      font-size: 2.75rem;
      margin: 0.5rem 0;
    }

    /* Stats Row */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }
    .stat-card {
      padding: 2.5rem 1.5rem;
      text-align: center;
    }
    .stat-num {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.1;
      font-family: var(--font-heading);
    }
    .stat-label {
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.75rem;
    }

    /* Referral Widget */
    .referral-card {
      padding: 3rem;
      margin-bottom: 3.5rem;
    }
    .referral-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3.5rem;
      align-items: center;
    }
    .referral-info h2 {
      font-size: 1.75rem;
      margin: 0.75rem 0 1rem;
      line-height: 1.3;
    }
    .referral-info p {
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.75rem;
    }
    .copy-box {
      display: flex;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.4);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      align-items: center;
    }
    .ref-link {
      font-family: monospace;
      color: var(--accent-cyan);
      font-size: 0.9rem;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .referral-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    .stat-box {
      padding: 1.25rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
    }
    .highlight-box {
      border: 1px solid var(--border-hover);
      background: rgba(6, 182, 212, 0.05);
    }
    .stat-val {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .stat-lbl {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }
    .stat-note {
      margin-top: 0.45rem;
      font-size: 0.78rem;
      font-weight: 700;
    }
    .credit-warning {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 1.5rem;
      margin: -1rem 0 3.5rem;
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.08);
    }
    .credit-warning h2 {
      margin: 0.35rem 0;
      font-size: 1.35rem;
    }
    .credit-warning p:last-child {
      margin: 0;
    }

    /* Account Activity & History */
    .history-section {
      padding: 3rem 0 1rem;
    }
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .history-header h2 {
      font-size: 2rem;
      margin: 0.35rem 0 0;
    }
    .history-list {
      background: rgba(15, 18, 35, 0.4);
      padding: 1rem 1.5rem;
      border-radius: 14px;
    }
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--border);
    }
    .history-item:last-child {
      border-bottom: none;
    }
    .pack-title {
      font-size: 1.05rem;
      color: var(--text-primary);
    }
    .credits-count {
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
    .price-val {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent-cyan);
    }
    .no-purchases {
      padding: 3rem;
      text-align: center;
      border-radius: 14px;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .referral-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      .referral-card {
        padding: 1.75rem;
      }
      .credit-warning {
        align-items: stretch;
        flex-direction: column;
        margin-top: 0;
      }
      .dashboard-header h1 {
        font-size: 2.25rem;
      }
    }
    @media (max-width: 480px) {
      .dashboard-header {
        padding: 3rem 0 1.5rem;
      }
      .copy-box {
        flex-direction: column;
        align-items: stretch;
      }
      .copy-box .btn {
        width: 100%;
      }
      .referral-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  protected readonly route = inject(ActivatedRoute);
  protected readonly seo = inject(SeoService);
  protected readonly api = inject(ApiService);
  protected readonly purchases = signal<any[]>([]);
  protected readonly referral = signal<any>({});

  protected locale: Locale = 'en';
  protected data = pageData('dashboard', 'en');
  protected copied = false;
  protected editReferralOpen = false;
  protected editReferralInput = '';
  protected editReferralError = '';
  protected editReferralLoading = false;
  protected ui = DASHBOARD_UI.en;
  protected copy = { dashboard: DASHBOARD_UI.en.dashboard, credits: DASHBOARD_UI.en.credits };
  protected settingsOpen = false;
  protected scannerOpen = false;
  protected videoSupported = true;
  protected marketingEnabled = true;

  protected editEmail = '';
  protected emailChangePassword = '';
  protected emailCode = '';
  protected emailCodeSent = false;
  protected emailSavedMsg = '';
  protected emailErrorMsg = '';

  protected currentPassword = '';
  protected newPassword = '';
  protected passwordSavedMsg = '';
  protected passwordErrorMsg = '';

  protected deletePassword = '';
  protected deleteCode = '';
  protected deleteCodeSent = false;
  protected deleteErrorMsg = '';
  protected deleteSavedMsg = '';

  get hasPassword(): boolean {
    return this.api.currentUser()?.authProviders?.includes('password') ?? false;
  }



  async ngOnInit(): Promise<void> {
    this.marketingEnabled = this.api.currentUser()?.marketingConsent !== false;
    this.editEmail = this.api.currentUser()?.email || '';

    this.locale = (this.route.snapshot.data['locale'] || 'en') as Locale;
    this.ui = DASHBOARD_UI[this.locale] || DASHBOARD_UI.en;
    this.copy = { dashboard: this.ui.dashboard, credits: this.ui.credits };
    this.data = pageData('dashboard', this.locale);
    this.seo.applyPage('dashboard', this.locale);
    await this.api.restoreSession();
    await Promise.all([this.loadHistory(), this.loadReferral()]);
  }

  protected async loadHistory(): Promise<void> {
    if (!this.api.token()) return;
    const result = await this.api.request('/api/credits/history');
    if (result.success && Array.isArray(result.purchases)) {
      this.purchases.set(result.purchases);
    }
  }

  protected async loadReferral(): Promise<void> {
    if (!this.api.token()) return;
    const result = await this.api.request('/api/credits/referrals');
    if (result.success) this.referral.set(result);
  }

  protected lowCredits(): boolean {
    const user = this.api.currentUser();
    return !!user && user.role !== 'admin' && Number(user.credits || 0) < 20;
  }

  protected creditsPath(): string {
    return pathFor('credits', this.locale);
  }

    async saveSettings() {
    if (this.api.currentUser()) {
      this.api.currentUser().marketingConsent = this.marketingEnabled;
      await this.api.request('/api/auth/me', { method: 'PATCH', body: JSON.stringify({ marketingConsent: this.marketingEnabled }) });
    }
  }

  async requestEmailChange() {
    this.emailErrorMsg = '';
    this.emailSavedMsg = '';
    if (!this.editEmail) {
      this.emailErrorMsg = 'Email is required.';
      return;
    }
    if (this.hasPassword && !this.emailChangePassword) {
      this.emailErrorMsg = 'Current password is required to change email.';
      return;
    }
    const res = await this.api.request('/api/auth/me', { 
      method: 'PATCH', 
      body: JSON.stringify({ requestEmailChange: this.editEmail, password: this.emailChangePassword }) 
    });
    if (res.success) {
      this.emailCodeSent = true;
      this.emailSavedMsg = 'Code sent to ' + this.editEmail;
    } else {
      this.emailErrorMsg = res.error || 'Failed to send code.';
    }
  }

  async confirmEmailChange() {
    this.emailErrorMsg = '';
    this.emailSavedMsg = '';
    if (!this.emailCode) return;
    const res = await this.api.request('/api/auth/me', { 
      method: 'PATCH', 
      body: JSON.stringify({ confirmEmailChangeCode: this.emailCode }) 
    });
    if (res.success) {
      this.emailCodeSent = false;
      this.emailCode = '';
      this.emailChangePassword = '';
      this.api.currentUser().email = this.editEmail.trim();
      this.emailSavedMsg = 'Email successfully updated.';
      setTimeout(() => this.emailSavedMsg = '', 3000);
    } else {
      this.emailErrorMsg = res.error || 'Invalid code.';
    }
  }

  async savePassword() {
    this.passwordErrorMsg = '';
    this.passwordSavedMsg = '';
    if (!this.currentPassword || !this.newPassword) {
      this.passwordErrorMsg = 'Both fields required.';
      return;
    }
    const res = await this.api.request('/api/auth/me', { method: 'PATCH', body: JSON.stringify({ currentPassword: this.currentPassword, newPassword: this.newPassword }) });
    if (res.success) {
      this.currentPassword = '';
      this.newPassword = '';
      this.passwordSavedMsg = 'Password changed.';
      setTimeout(() => this.passwordSavedMsg = '', 2000);
    } else {
      this.passwordErrorMsg = res.error || 'Failed to change password.';
    }
  }

  async requestDeleteAccount() {
    this.deleteErrorMsg = '';
    this.deleteSavedMsg = '';
    if (this.hasPassword && !this.deletePassword) {
      this.deleteErrorMsg = 'Current password is required.';
      return;
    }
    const res = await this.api.request('/api/auth/me/request-deletion', { 
      method: 'POST', 
      body: JSON.stringify({ password: this.deletePassword }) 
    });
    if (res.success) {
      this.deleteCodeSent = true;
      this.deleteSavedMsg = 'Verification code sent to your email.';
    } else {
      this.deleteErrorMsg = res.error || 'Failed to request deletion.';
    }
  }

  async confirmDeleteAccount() {
    this.deleteErrorMsg = '';
    if (!this.deleteCode) {
      this.deleteErrorMsg = 'Code required.';
      return;
    }
    const res = await this.api.request('/api/auth/me', { 
      method: 'DELETE', 
      body: JSON.stringify({ code: this.deleteCode }) 
    });
    if (res.success) {
      this.deleteCodeSent = false;
      this.deleteCode = '';
      this.deletePassword = '';
      this.settingsOpen = false;
      if (this.api.currentUser()) {
        this.api.currentUser().accountDeletionScheduledAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      }
      alert('Your account has been scheduled for deletion. It will be permanently removed in 14 days.');
    } else {
      this.deleteErrorMsg = res.error || 'Failed to schedule deletion.';
    }
  }

  async cancelDeletion() {
    const res = await this.api.request('/api/auth/me', { 
      method: 'PATCH', 
      body: JSON.stringify({ cancelDeletion: true }) 
    });
    if (res.success && this.api.currentUser()) {
      this.api.currentUser().accountDeletionScheduledAt = null;
      alert('Account deletion has been cancelled.');
    }
  }

  async startQrScanner() {
    this.scannerOpen = true;
    this.videoSupported = true;
    const { default: jsQR } = await import('jsqr');
    setTimeout(async () => {
      try {
        const video = document.getElementById('qrVideo') as HTMLVideoElement;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        const scanLoop = () => {
          if(!this.scannerOpen) { stream.getTracks().forEach(t=>t.stop()); return; }
          if(video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code && code.data.includes('/qr-login/')) {
                stream.getTracks().forEach(t=>t.stop());
                window.location.href = code.data;
                return;
              }
            }
          }
          requestAnimationFrame(scanLoop);
        };
        scanLoop();
      } catch(err) { this.videoSupported = false; }
    }, 100);
  }
  stopQrScanner() {
 this.scannerOpen = false;
  }

  protected async saveReferralCode(): Promise<void> {
    this.editReferralError = '';
    const newRef = this.editReferralInput.trim();
    if (!newRef) {
      this.editReferralOpen = false;
      return;
    }
    this.editReferralLoading = true;
    const res = await this.api.request('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify({ referralCode: newRef })
    });
    this.editReferralLoading = false;
    if (res.success) {
      this.editReferralOpen = false;
      await this.api.restoreSession();
      await this.loadReferral();
    } else {
      this.editReferralError = res.error || 'Wystąpił błąd.';
    }
  }

  protected async copyReferral(): Promise<void> {
    const link = this.referral().referralLink;
    if (!link || !navigator.clipboard) return;
    await navigator.clipboard.writeText(link);
    this.copied = true;
    setTimeout(() => this.copied = false, 1800);
  }
}
