import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ADMIN_PANEL_ROUTE_PATH, ADMIN_PANEL_URL } from '../admin-path';

type AdminTab = 'users' | 'purchases' | 'bugs' | 'support' | 'cache' | 'leaderboard' | 'system';
type AdminLocale = 'en' | 'pl';

const ADMIN_COPY = {
  en: {
    adminConsole: 'Admin console',
    loginIntro: 'Operational control for credits, users, cache and platform health.',
    continueGoogle: 'Continue with Google',
    or: 'or',
    email: 'Email',
    password: 'Password',
    signingIn: 'Signing in...',
    signIn: 'Sign in',
    adminSections: 'Admin sections',
    refresh: 'Refresh',
    logout: 'Logout',
    liveOperations: 'Live operations',
    dashboard: 'Dashboard',
    publicSite: 'Public site',
    users: 'Users',
    purchases: 'Purchases',
    bugs: 'Bugs',
    support: 'Support',
    cache: 'Cache',
    leaderboard: 'Leaderboard',
    system: 'System',
    usersHint: 'accounts',
    purchasesHint: 'billing',
    bugsHint: 'reports',
    supportHint: 'mail',
    cacheHint: 'answers',
    leaderboardHint: 'ranking',
    systemHint: 'health',
    usersTitle: 'Users and credits',
    purchasesTitle: 'Purchases and grants',
    bugsTitle: 'Bug reports',
    supportTitle: 'Support inbox',
    cacheTitle: 'Answer cache',
    leaderboardTitle: 'Leaderboard',
    systemTitle: 'System health',
    usersDescription: 'Track accounts, live extension usage, bans, credits and question history.',
    purchasesDescription: 'Review payment records, manual grants and pending credit application.',
    bugsDescription: 'Read user-submitted bug reports with source URLs.',
    supportDescription: 'Handle unread support mail, linked accounts and quick credit adjustments.',
    cacheDescription: 'Inspect cached AI answers, weak question text and high-hit questions.',
    leaderboardDescription: 'Review public ranking data and excluded users.',
    systemDescription: 'Monitor service health, database state and credit dedupe safety.',
    accountsCredits: 'Accounts and credits',
    searchEmailName: 'Search email or name',
    search: 'Search',
    user: 'User',
    role: 'Role',
    credits: 'Credits',
    questions: 'Questions',
    streak: 'Streak',
    status: 'Status',
    actions: 'Actions',
    noDisplayName: 'No display name',
    unlimited: 'unlimited',
    history: 'History',
    grant: 'Grant',
    unban: 'Unban',
    ban: 'Ban',
    showLb: 'Show LB',
    hideLb: 'Hide LB',
    delete: 'Delete',
    noUsers: 'No users found.',
    revenue: 'Revenue',
    pack: 'Pack',
    price: 'Price',
    provider: 'Provider',
    applied: 'Applied',
    pending: 'Pending',
    reason: 'Reason',
    date: 'Date',
    apply: 'Apply',
    noPurchases: 'No purchases yet.',
    reports: 'Reports',
    unknownUser: 'Unknown user',
    noBugReports: 'No bug reports.',
    inbox: 'Inbox',
    supportMail: 'Support mail',
    searchSupport: 'Search sender, subject, text',
    allMessages: 'All messages',
    open: 'Open',
    closed: 'Closed',
    filter: 'Filter',
    noSubject: '(No subject)',
    account: 'Account',
    noSupport: 'No support messages.',
    from: 'From',
    to: 'To',
    received: 'Received',
    copyEmail: 'Copy email',
    close: 'Close',
    linkedAccount: 'Linked account',
    grantCredits: 'Grant credits',
    noLinkedAccount: 'No linked account',
    unknownEmail: 'Unknown email',
    noLinkedAccountNote: 'This sender email does not match a QuizSolver account.',
    replies: 'Replies',
    reply: 'Reply',
    replyPlaceholder: 'Write a helpful answer...',
    sendReply: 'Send reply',
    selectMessage: 'Select a message to read and reply.',
    aiCache: 'AI cache',
    cachedAnswers: 'Cached answers',
    searchCache: 'Search cached question text',
    reset: 'Reset',
    clearCache: 'Clear cache',
    options: 'options',
    hits: 'hits',
    weakText: 'Weak text',
    openDetails: 'Open details',
    noCacheHits: 'No cache hits yet.',
    community: 'Community',
    noLeaderboard: 'No leaderboard data.',
    healthCheck: 'Health check',
    billingSafety: 'Billing safety',
    creditDedupeMonitor: 'Credit dedupe monitor',
    refreshBilling: 'Refresh billing',
    creditUsageLog: 'Credit usage log',
    creditUsageDescription: 'Search exactly what was billed, waived or rejected for each user and question.',
    searchCreditUsage: 'Search email, question text or hash',
    allStatuses: 'All statuses',
    allActions: 'All actions',
    charged: 'Charged',
    claimed: 'Claimed',
    waived: 'Waived',
    aborted: 'Aborted',
    declined: 'Declined',
    billableCredits: 'Billable credits',
    creditEvent: 'Credit event',
    chargedCredits: 'Charged credits',
    noCreditUsage: 'No credit usage records for this filter.',
    viewQuestion: 'View question',
    firstCharged: 'First charged',
    timeSpan: 'Time span',
    reviewInLog: 'Review in log',
    possibleRefund: 'Possible refund',
    duplicateReason: 'Same user, action and question charged inside the review window.',
    duplicateWarning: 'Potential duplicate charged groups found. Review immediately.',
    questionHash: 'Question hash',
    charges: 'Charges',
    lastCharged: 'Last charged',
    noDuplicateGroups: 'No duplicate charged groups detected.',
    questionDetails: 'Question details',
    deleteCache: 'Delete cache',
    type: 'Type',
    cacheHits: 'Cache hits',
    counts: 'Counts',
    prompts: 'Prompts',
    rows: 'Rows',
    answerItems: 'Answer items',
    questionText: 'Question text',
    answerSummary: 'Answer summary',
    explanation: 'Explanation',
    solveHistory: 'Solve History',
    noSolvedQuestions: 'No questions solved by this user yet.',
    manualCredits: 'Manual credits',
    cancel: 'Cancel',
    active: 'Active',
    offline: 'Offline',
    banned: 'Banned',
    suspendedAccount: 'Suspended account',
    extensionNotSeen: 'Extension not seen',
    now: 'Now',
    lastSeen: 'Last seen',
    unreadSupport: 'Unread support',
    unreadBugs: 'New bug reports',
    newEmailsWaiting: 'New emails waiting',
    newBugReportsWaiting: 'New bug reports waiting',
    markRead: 'Mark read',
    markAllRead: 'Mark all read',
    creditSafety: 'Credit safety',
    duplicateGroupsNeedReview: 'Duplicate groups need review',
    noDuplicateChargeGroups: 'No duplicate charge groups',
    clickToReview: 'Click to review details',
    usingExtensionNow: 'Using extension now',
    activeHeartbeat: 'Active by recent heartbeat',
    visibleUsers: 'Visible users',
    totalInSearch: 'total in search',
    activeNow: 'Active now',
    blockedAccounts: 'Blocked accounts',
    visibleCredits: 'Visible credits',
    solvedQuestionsVisible: 'solved questions visible',
    visibleEntries: 'Visible entries',
    allStoredCacheRecords: 'All stored cache records',
    matchingCurrentSearch: 'Matching current search',
    currentCachePageTotal: 'Current cache page total',
    hitsOnPage: 'Hits on page',
    usageVisibleRows: 'Usage in visible rows',
    needsParserReview: 'Needs parser/cache review',
    loginRequired: 'Email and password are required.',
    loginFailed: 'Login failed.',
    adminRequired: 'Admin access required.',
    creditsGreaterThanZero: 'Credits must be greater than 0.',
    couldNotGrantCredits: 'Could not grant credits.',
    banConfirm: 'Ban this user?',
    couldNotBanUser: 'Could not ban user.',
    couldNotUnbanUser: 'Could not unban user.',
    couldNotUpdateLeaderboard: 'Could not update leaderboard setting.',
    deleteUserConfirmPrefix: 'Delete',
    deleteUserConfirmSuffix: 'This cannot be undone.',
    couldNotDeleteUser: 'Could not delete user.',
    clearCacheConfirm: 'Clear all cached answers?',
    couldNotClearCache: 'Could not clear cache.',
    deleteCacheConfirm: 'Delete this cached answer?',
    couldNotDeleteCache: 'Could not delete cache entry.',
    couldNotApplyPurchase: 'Could not apply purchase credits.',
    noMessagePreview: 'No message preview.',
    noMessageBody: 'No message body.',
    couldNotCopyEmail: 'Could not copy email address.',
    couldNotSendReply: 'Could not send support reply.',
    deleteSupportConfirmPrefix: 'Delete support message from',
    unknownSender: 'unknown sender',
    couldNotDeleteSupport: 'Could not delete support message.',
    couldNotUpdateBugReport: 'Could not update bug report.',
    supportAdjustment: 'Support adjustment',
    questionHistoryAdjustment: 'Question history adjustment',
    adminManualGrant: 'Admin manual grant'
  },
  pl: {
    adminConsole: 'Panel admina',
    loginIntro: 'Kontrola kredytów, użytkowników, cache i stanu platformy.',
    continueGoogle: 'Kontynuuj z Google',
    or: 'albo',
    email: 'Email',
    password: 'Hasło',
    signingIn: 'Logowanie...',
    signIn: 'Zaloguj',
    adminSections: 'Sekcje panelu admina',
    refresh: 'Odśwież',
    logout: 'Wyloguj',
    liveOperations: 'Operacje na żywo',
    dashboard: 'Dashboard',
    publicSite: 'Strona publiczna',
    users: 'Użytkownicy',
    purchases: 'Płatności',
    bugs: 'Błędy',
    support: 'Support',
    cache: 'Cache',
    leaderboard: 'Ranking',
    system: 'System',
    usersHint: 'konta',
    purchasesHint: 'billing',
    bugsHint: 'zgłoszenia',
    supportHint: 'maile',
    cacheHint: 'odpowiedzi',
    leaderboardHint: 'ranking',
    systemHint: 'zdrowie',
    usersTitle: 'Użytkownicy i kredyty',
    purchasesTitle: 'Płatności i granty',
    bugsTitle: 'Zgłoszenia błędów',
    supportTitle: 'Skrzynka supportu',
    cacheTitle: 'Cache odpowiedzi',
    leaderboardTitle: 'Ranking',
    systemTitle: 'Stan systemu',
    usersDescription: 'Kontroluj konta, aktywność rozszerzenia, bany, kredyty i historię pytań.',
    purchasesDescription: 'Przeglądaj płatności, ręczne granty i oczekujące dodania kredytów.',
    bugsDescription: 'Czytaj zgłoszenia błędów od użytkowników razem z adresami stron.',
    supportDescription: 'Obsługuj nowe maile, powiązane konta i szybkie korekty kredytów.',
    cacheDescription: 'Sprawdzaj odpowiedzi AI w cache, słabą treść pytań i najczęstsze trafienia.',
    leaderboardDescription: 'Przeglądaj dane rankingu publicznego i wykluczonych użytkowników.',
    systemDescription: 'Monitoruj stan usługi, bazę danych i zabezpieczenia przed podwójnym naliczaniem.',
    accountsCredits: 'Konta i kredyty',
    searchEmailName: 'Szukaj emaila lub nazwy',
    search: 'Szukaj',
    user: 'Użytkownik',
    role: 'Rola',
    credits: 'Kredyty',
    questions: 'Pytania',
    streak: 'Seria',
    status: 'Status',
    actions: 'Akcje',
    noDisplayName: 'Brak nazwy',
    unlimited: 'bez limitu',
    history: 'Historia',
    grant: 'Dodaj',
    unban: 'Odbanuj',
    ban: 'Zbanuj',
    showLb: 'Pokaż w rank.',
    hideLb: 'Ukryj w rank.',
    delete: 'Usuń',
    noUsers: 'Nie znaleziono użytkowników.',
    revenue: 'Przychód',
    pack: 'Pakiet',
    price: 'Cena',
    provider: 'Dostawca',
    applied: 'Dodane',
    pending: 'Oczekuje',
    reason: 'Powód',
    date: 'Data',
    apply: 'Dodaj',
    noPurchases: 'Brak płatności.',
    reports: 'Zgłoszenia',
    unknownUser: 'Nieznany użytkownik',
    noBugReports: 'Brak zgłoszeń błędów.',
    inbox: 'Skrzynka',
    supportMail: 'Maile supportu',
    searchSupport: 'Szukaj nadawcy, tematu, treści',
    allMessages: 'Wszystkie wiadomości',
    open: 'Otwarte',
    closed: 'Zamknięte',
    filter: 'Filtruj',
    noSubject: '(Brak tematu)',
    account: 'Konto',
    noSupport: 'Brak wiadomości supportu.',
    from: 'Od',
    to: 'Do',
    received: 'Odebrano',
    copyEmail: 'Kopiuj email',
    close: 'Zamknij',
    linkedAccount: 'Powiązane konto',
    grantCredits: 'Dodaj kredyty',
    noLinkedAccount: 'Brak powiązanego konta',
    unknownEmail: 'Nieznany email',
    noLinkedAccountNote: 'Ten email nadawcy nie pasuje do konta QuizSolver.',
    replies: 'Odpowiedzi',
    reply: 'Odpowiedź',
    replyPlaceholder: 'Napisz pomocną odpowiedź...',
    sendReply: 'Wyślij odpowiedź',
    selectMessage: 'Wybierz wiadomość, żeby ją przeczytać i odpisać.',
    aiCache: 'Cache AI',
    cachedAnswers: 'Odpowiedzi w cache',
    searchCache: 'Szukaj treści pytania w cache',
    reset: 'Reset',
    clearCache: 'Wyczyść cache',
    options: 'opcji',
    hits: 'trafień',
    weakText: 'Słaba treść',
    openDetails: 'Otwórz szczegóły',
    noCacheHits: 'Brak trafień cache.',
    community: 'Społeczność',
    noLeaderboard: 'Brak danych rankingu.',
    healthCheck: 'Stan usługi',
    billingSafety: 'Bezpieczeństwo billingowe',
    creditDedupeMonitor: 'Monitor deduplikacji kredytów',
    refreshBilling: 'Odśwież billing',
    duplicateWarning: 'Wykryto możliwe podwójnie naliczone grupy. Sprawdź od razu.',
    creditUsageLog: 'Log kredytow',
    creditUsageDescription: 'Sprawdz dokladnie co zostalo naliczone, umorzone albo odrzucone dla usera i pytania.',
    searchCreditUsage: 'Szukaj emaila, tresci pytania lub hasha',
    allStatuses: 'Wszystkie statusy',
    allActions: 'Wszystkie akcje',
    charged: 'Pobrano',
    claimed: 'Claim',
    waived: 'Umorzono',
    aborted: 'Przerwano',
    declined: 'Odrzucono',
    billableCredits: 'Kredyty platne',
    creditEvent: 'Zdarzenie kredytowe',
    chargedCredits: 'Pobrane kredyty',
    noCreditUsage: 'Brak rekordow kredytow dla tego filtra.',
    viewQuestion: 'Zobacz pytanie',
    firstCharged: 'Pierwsze pobranie',
    timeSpan: 'Odstep czasu',
    reviewInLog: 'Sprawdz w logu',
    possibleRefund: 'Zwrot?',
    duplicateReason: 'Ten sam user, akcja i pytanie naliczone w oknie kontroli.',
    questionHash: 'Hash pytania',
    charges: 'Naliczono',
    lastCharged: 'Ostatnie naliczenie',
    noDuplicateGroups: 'Brak wykrytych podwójnie naliczonych grup.',
    questionDetails: 'Szczegóły pytania',
    deleteCache: 'Usuń z cache',
    type: 'Typ',
    cacheHits: 'Trafienia cache',
    counts: 'Liczniki',
    prompts: 'Prompty',
    rows: 'Wiersze',
    answerItems: 'Elementy odpowiedzi',
    questionText: 'Treść pytania',
    answerSummary: 'Podsumowanie odpowiedzi',
    explanation: 'Wyjaśnienie',
    solveHistory: 'Historia pytań',
    noSolvedQuestions: 'Ten użytkownik nie ma jeszcze rozwiązanych pytań.',
    manualCredits: 'Ręczne kredyty',
    cancel: 'Anuluj',
    active: 'Aktywny',
    offline: 'Offline',
    banned: 'Zbanowany',
    suspendedAccount: 'Konto zawieszone',
    extensionNotSeen: 'Nie widziano rozszerzenia',
    now: 'Teraz',
    lastSeen: 'Ostatnio widziany',
    unreadSupport: 'Nieprzeczytany support',
    unreadBugs: 'Nowe bledy',
    newEmailsWaiting: 'Nowe maile czekają',
    newBugReportsWaiting: 'Nowe zgloszenia bledow czekaja',
    markRead: 'Oznacz jako przeczytane',
    markAllRead: 'Oznacz wszystkie',
    creditSafety: 'Bezpieczeństwo kredytów',
    duplicateGroupsNeedReview: 'Grupy duplikatów do sprawdzenia',
    noDuplicateChargeGroups: 'Brak podwójnych naliczeń',
    usingExtensionNow: 'Używa teraz rozszerzenia',
    activeHeartbeat: 'Aktywny według ostatniego heartbeat',
    visibleUsers: 'Widoczni użytkownicy',
    totalInSearch: 'łącznie w wyszukiwaniu',
    activeNow: 'Aktywni teraz',
    blockedAccounts: 'Zablokowane konta',
    visibleCredits: 'Widoczne kredyty',
    solvedQuestionsVisible: 'rozwiązanych pytań w widoku',
    visibleEntries: 'Widoczne wpisy',
    allStoredCacheRecords: 'Wszystkie rekordy cache',
    matchingCurrentSearch: 'Pasuje do obecnego wyszukiwania',
    currentCachePageTotal: 'Łącznie dla obecnej strony cache',
    hitsOnPage: 'Trafienia na stronie',
    usageVisibleRows: 'Użycie w widocznych wierszach',
    needsParserReview: 'Do sprawdzenia parser/cache',
    loginRequired: 'Email i hasło są wymagane.',
    loginFailed: 'Logowanie nie powiodło się.',
    adminRequired: 'Wymagany dostęp admina.',
    creditsGreaterThanZero: 'Liczba kredytów musi być większa od 0.',
    couldNotGrantCredits: 'Nie udało się dodać kredytów.',
    banConfirm: 'Zbanować tego użytkownika?',
    couldNotBanUser: 'Nie udało się zbanować użytkownika.',
    couldNotUnbanUser: 'Nie udało się odbanować użytkownika.',
    couldNotUpdateLeaderboard: 'Nie udało się zmienić ustawień rankingu.',
    deleteUserConfirmPrefix: 'Usunąć',
    deleteUserConfirmSuffix: 'Tej operacji nie da się cofnąć.',
    couldNotDeleteUser: 'Nie udało się usunąć użytkownika.',
    clearCacheConfirm: 'Wyczyścić wszystkie odpowiedzi w cache?',
    couldNotClearCache: 'Nie udało się wyczyścić cache.',
    deleteCacheConfirm: 'Usunąć tę odpowiedź z cache?',
    couldNotDeleteCache: 'Nie udało się usunąć wpisu cache.',
    couldNotApplyPurchase: 'Nie udało się dodać kredytów z płatności.',
    noMessagePreview: 'Brak podglądu wiadomości.',
    noMessageBody: 'Brak treści wiadomości.',
    couldNotCopyEmail: 'Nie udało się skopiować adresu email.',
    couldNotSendReply: 'Nie udało się wysłać odpowiedzi supportu.',
    deleteSupportConfirmPrefix: 'Usunąć wiadomość supportu od',
    unknownSender: 'nieznanego nadawcy',
    couldNotDeleteSupport: 'Nie udało się usunąć wiadomości supportu.',
    couldNotUpdateBugReport: 'Nie udalo sie zaktualizowac zgloszenia bledu.',
    supportAdjustment: 'Korekta supportu',
    questionHistoryAdjustment: 'Korekta z historii pytań',
    adminManualGrant: 'Ręczny grant admina'
  }
} as const;

type AdminCopyKey = keyof typeof ADMIN_COPY.en;

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="admin-page">
      <section class="admin-login" *ngIf="!isAuthed(); else adminPanel">
        <div class="admin-login-card glass anim-glow">
          <a class="admin-brand" href="/" aria-label="QuizSolver home">
            <span>QS</span>
            <strong>QuizSolver Admin</strong>
          </a>
          <h1>{{ tr('adminConsole') }}</h1>
          <p class="text-secondary" style="margin-top: 0.5rem; margin-bottom: 2rem;">
            {{ tr('loginIntro') }}
          </p>
          <button class="btn btn-outline btn-block google-auth-btn" type="button" (click)="startGoogleLogin()">
            <span>G</span>
            {{ tr('continueGoogle') }}
          </button>
          <div class="auth-divider"><span>{{ tr('or') }}</span></div>
          <form (ngSubmit)="login()">
            <label class="form-label">
              <span>{{ tr('email') }}</span>
              <input class="form-input" type="email" name="email" [(ngModel)]="email" autocomplete="email">
            </label>
            <label class="form-label" style="margin-top: 1.25rem; display: block;">
              <span>{{ tr('password') }}</span>
              <input class="form-input" type="password" name="password" [(ngModel)]="password" autocomplete="current-password">
            </label>
            <div class="form-error" *ngIf="error()" style="margin-top: 1.25rem;">{{ error() }}</div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="loading()" style="margin-top: 2rem;">
              {{ loading() ? tr('signingIn') : tr('signIn') }}
            </button>
          </form>
        </div>
      </section>

      <ng-template #adminPanel>
        <section class="admin-shell">
          <aside class="admin-sidebar">
            <div>
              <a class="admin-brand" href="/">
                <span>QS</span>
                <strong>Admin</strong>
              </a>
              <nav class="admin-tabs" [attr.aria-label]="tr('adminSections')">
                <button type="button" *ngFor="let tab of tabs" [class.active]="activeTab() === tab.id" (click)="activeTab.set(tab.id)">
                  <span class="tab-short">{{ tab.short }}</span>
                  <span class="tab-copy">
                    <span class="tab-label">{{ tabLabel(tab.id) }}</span>
                    <small>{{ tabHint(tab.id) }}</small>
                  </span>
                  <span class="tab-badge" *ngIf="tab.id === 'bugs' && bugBadgeCount()">{{ bugBadgeCount() }}</span>
                  <span class="tab-badge" *ngIf="tab.id === 'support' && supportBadgeCount()">{{ supportBadgeCount() }}</span>
                </button>
              </nav>
            </div>
            <div class="admin-sidebar-foot">
              <div class="admin-language-switch" aria-label="Admin language">
                <a [class.active]="adminLocale() === 'en'" [href]="adminLocaleUrl('en')">EN</a>
                <a [class.active]="adminLocale() === 'pl'" [href]="adminLocaleUrl('pl')">PL</a>
              </div>
              <button class="btn btn-outline btn-block" type="button" (click)="refresh()">{{ tr('refresh') }}</button>
              <button class="btn btn-ghost btn-block" type="button" (click)="logout()">{{ tr('logout') }}</button>
            </div>
          </aside>

          <section class="admin-main">
            <header class="admin-header">
              <div>
                <p class="eyebrow">{{ tr('liveOperations') }}</p>
                <h1>{{ activeTabTitle() }}</h1>
                <p class="text-secondary" style="margin-top: 0.25rem;">{{ activeTabDescription() }}</p>
              </div>
              <div class="admin-header-actions">
                <a class="btn btn-outline" [href]="adminLocale() === 'pl' ? '/pl/dashboard' : '/dashboard'">{{ tr('dashboard') }}</a>
                <a class="btn btn-primary" [href]="adminLocale() === 'pl' ? '/pl' : '/'">{{ tr('publicSite') }}</a>
              </div>
            </header>

            <div class="admin-alert anim-slide-up" *ngIf="error()">{{ error() }}</div>

            <section class="operations-strip" *ngIf="adminNoticeCards().length">
              <button class="operation-card" type="button" *ngFor="let notice of adminNoticeCards()" [class.warn]="notice.tone === 'warn'" [class.ok]="notice.tone === 'ok'" (click)="openAdminNotice(notice)">
                <span>{{ notice.label }}</span>
                <strong>{{ notice.value }}</strong>
                <small>{{ notice.note }}</small>
              </button>
            </section>

            <section class="admin-stats">
              <article class="glass" *ngFor="let card of statsCards()">
                <span>{{ card.label }}</span>
                <strong [class.revenue]="card.revenue">{{ card.value }}</strong>
              </article>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'users'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ tr('users') }}</p>
                  <h2>{{ tr('accountsCredits') }}</h2>
                </div>
                <form class="admin-search" (ngSubmit)="loadUsers(1)">
                  <input class="form-input" type="search" name="search" [(ngModel)]="userSearch" [placeholder]="tr('searchEmailName')">
                  <button class="btn btn-primary" type="submit">{{ tr('search') }}</button>
                </form>
              </div>

              <div class="insight-grid">
                <article *ngFor="let card of usersSummaryCards()">
                  <span>{{ card.label }}</span>
                  <strong [class.ok]="card.ok" [class.warn]="card.warn">{{ card.value }}</strong>
                  <small>{{ card.note }}</small>
                </article>
              </div>

              <div class="table-scroll">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>{{ tr('user') }}</th>
                      <th>{{ tr('role') }}</th>
                      <th>{{ tr('credits') }}</th>
                      <th>{{ tr('questions') }}</th>
                      <th>{{ tr('streak') }}</th>
                      <th>{{ tr('status') }}</th>
                      <th>{{ tr('actions') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users()">
                      <td class="user-cell">
                        <button type="button" class="link-button primary-link" (click)="openUserHistory(user)">{{ user.email }}</button>
                        <span>{{ user.displayName || tr('noDisplayName') }}</span>
                      </td>
                      <td><span class="badge badge-outline role-badge">{{ user.role }}</span></td>
                      <td><strong class="metric-value">{{ user.role === 'admin' ? tr('unlimited') : user.credits }}</strong></td>
                      <td><strong class="metric-value">{{ user.stats?.totalQuestionsSolved || 0 }}</strong></td>
                      <td><strong class="metric-value">{{ user.streak?.current || 0 }}</strong></td>
                      <td>
                        <span class="status-pill" [class.danger]="user.isBanned" [class.pending]="!user.isBanned && !user.isExtensionActive">
                          {{ userStatusLabel(user) }}
                        </span>
                        <small class="muted-line">
                          {{ userExtensionLastSeen(user) }}
                        </small>
                      </td>
                      <td>
                        <div class="row-actions">
                          <button type="button" (click)="openUserHistory(user)" style="color: var(--accent-cyan);">{{ tr('history') }}</button>
                          <button type="button" (click)="quickGrant(user.id, 50)">+50</button>
                          <button type="button" (click)="quickGrant(user.id, 100)">+100</button>
                          <button type="button" (click)="quickGrant(user.id, 200)">+200</button>
                          <button type="button" (click)="openGrantModal(user)">{{ tr('grant') }}</button>
                          <button type="button" (click)="user.isBanned ? unbanUser(user.id) : banUser(user.id)">
                            {{ user.isBanned ? tr('unban') : tr('ban') }}
                          </button>
                          <button type="button" (click)="toggleLeaderboard(user.id, !user.excludeFromLeaderboard)">
                            {{ user.excludeFromLeaderboard ? tr('showLb') : tr('hideLb') }}
                          </button>
                          <button type="button" class="danger" *ngIf="user.role !== 'admin'" (click)="deleteUser(user.id, user.email)">
                            {{ tr('delete') }}
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="!users().length">
                      <td colspan="7" class="empty-cell" style="text-align: center; padding: 3rem;">{{ tr('noUsers') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="pagination" *ngIf="pagination().pages > 1">
                <button type="button" *ngFor="let page of pageNumbers()" [class.active]="page === pagination().page" (click)="loadUsers(page)">
                  {{ page }}
                </button>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'purchases'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ tr('revenue') }}</p>
                  <h2>{{ tr('purchasesTitle') }}</h2>
                </div>
              </div>
              <div class="table-scroll">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>{{ tr('user') }}</th>
                      <th>{{ tr('pack') }}</th>
                      <th>{{ tr('credits') }}</th>
                      <th>{{ tr('price') }}</th>
                      <th>{{ tr('provider') }}</th>
                      <th>{{ tr('applied') }}</th>
                      <th>{{ tr('reason') }}</th>
                      <th>{{ tr('date') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let purchase of purchases()">
                      <td><strong>{{ purchase.user || tr('unknownUser') }}</strong></td>
                      <td>{{ purchase.pack }}</td>
                      <td>{{ purchase.credits }}</td>
                      <td><span style="font-weight: 600; color: var(--accent-cyan);">{{ purchase.priceUsd ? formatMoney(purchase.priceUsd) : '-' }}</span></td>
                      <td style="text-transform: uppercase; font-size: 0.85rem;">{{ purchase.provider }}</td>
                      <td>
                        <span class="status-pill" [class.pending]="!purchase.creditsApplied">
                          {{ purchase.creditsApplied ? tr('applied') : tr('pending') }}
                        </span>
                        <button type="button" *ngIf="!purchase.creditsApplied" (click)="applyPurchaseCredits(purchase.id)" style="display: block; margin-top: 0.4rem; color: var(--accent-cyan);">{{ tr('apply') }}</button>
                      </td>
                      <td>{{ purchase.reason || '-' }}</td>
                      <td>{{ formatDate(purchase.date) }}</td>
                    </tr>
                    <tr *ngIf="!purchases().length">
                      <td colspan="8" class="empty-cell" style="text-align: center; padding: 3rem;">{{ tr('noPurchases') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'bugs'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ tr('reports') }}</p>
                  <h2>{{ tr('bugsTitle') }}</h2>
                </div>
                <div class="row-actions" *ngIf="bugBadgeCount()">
                  <button type="button" (click)="markAllBugReportsRead()">{{ tr('markAllRead') }}</button>
                </div>
              </div>
              <div class="bug-list">
                <article class="glass" *ngFor="let bug of bugs()" [class.unread]="!bug.isRead">
                  <div class="bug-meta">
                    <div>
                      <strong>{{ bug.user || tr('unknownUser') }}</strong>
                      <span class="status-pill danger" *ngIf="!bug.isRead">{{ tr('unreadBugs') }}</span>
                    </div>
                    <div class="row-actions">
                      <span class="text-secondary" style="font-size: 0.8rem;">{{ formatDate(bug.date) }}</span>
                      <button type="button" *ngIf="!bug.isRead" (click)="markBugReportRead(bug)">{{ tr('markRead') }}</button>
                    </div>
                  </div>
                  <a [href]="bug.url" target="_blank" rel="noopener" style="word-break: break-all;">{{ bug.url }}</a>
                  <p class="text-secondary" *ngIf="bug.description" style="margin-top: 0.75rem; color: var(--text-primary);">
                    {{ bug.description }}
                  </p>
                </article>
                <div class="empty-panel" style="text-align: center; padding: 2rem;" *ngIf="!bugs().length">
                  <p class="text-secondary">{{ tr('noBugReports') }}</p>
                </div>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'support'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ tr('inbox') }}</p>
                  <h2>{{ tr('supportMail') }}</h2>
                </div>
                <form class="admin-search" (ngSubmit)="loadSupportMessages()">
                  <input class="form-input" type="search" name="supportSearch" [(ngModel)]="supportSearch" [placeholder]="tr('searchSupport')">
                  <select class="form-select" name="supportStatusFilter" [(ngModel)]="supportStatusFilter">
                    <option value="">{{ tr('allMessages') }}</option>
                    <option value="open">{{ tr('open') }}</option>
                    <option value="pending">{{ tr('pending') }}</option>
                    <option value="closed">{{ tr('closed') }}</option>
                  </select>
                  <button class="btn btn-primary" type="submit">{{ tr('filter') }}</button>
                </form>
              </div>

              <div class="support-summary">
                <article *ngFor="let item of supportSummaryCards()" [class.warn]="item.tone === 'warn'" [class.ok]="item.tone === 'ok'">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </article>
              </div>

              <div class="support-layout">
                <div class="support-list">
                  <button class="support-item" type="button" *ngFor="let message of filteredSupportMessages()" [class.active]="selectedSupportMessage()?.id === message.id" [class.unread]="!message.isRead" (click)="selectSupportMessage(message)">
                    <span class="support-avatar">{{ supportInitials(message) }}</span>
                    <span class="support-item-main">
                      <span class="support-item-row">
                        <strong>{{ message.subject || tr('noSubject') }}</strong>
                        <span class="status-pill" [class.danger]="message.status === 'open'" [class.pending]="message.status === 'pending'">{{ supportStatusLabel(message.status) }}</span>
                      </span>
                      <span class="support-sender">{{ supportSender(message) }}</span>
                      <span class="badge badge-outline" *ngIf="message.linkedUser">{{ tr('account') }}: {{ message.linkedUser.credits }} {{ tr('credits') }}</span>
                      <span class="support-preview">{{ supportPreview(message) }}</span>
                      <small>{{ formatDate(message.receivedAt) }} - {{ supportSourceLabel(message.source) }}</small>
                    </span>
                  </button>
                  <div class="empty-panel" *ngIf="!filteredSupportMessages().length">
                    <p class="text-secondary">{{ tr('noSupport') }}</p>
                  </div>
                </div>

                <article class="support-detail" *ngIf="selectedSupportMessage(); else supportEmpty">
                  <header>
                    <div>
                      <p class="eyebrow">{{ supportSourceLabel(selectedSupportMessage()?.source) }}</p>
                      <h3>{{ selectedSupportMessage()?.subject || tr('noSubject') }}</h3>
                      <div class="support-meta-grid">
                        <span><strong>{{ tr('from') }}</strong>{{ supportSender(selectedSupportMessage()) }} &lt;{{ selectedSupportMessage()?.fromEmail || '-' }}&gt;</span>
                        <span><strong>{{ tr('to') }}</strong>{{ selectedSupportMessage()?.toEmail || 'support@getquizsolver.com' }}</span>
                        <span><strong>{{ tr('received') }}</strong>{{ formatDate(selectedSupportMessage()?.receivedAt) }}</span>
                        <span><strong>{{ tr('status') }}</strong>{{ supportStatusLabel(selectedSupportMessage()?.status) }}</span>
                      </div>
                    </div>
                    <div class="row-actions">
                      <a class="support-action-link" [href]="supportMailto(selectedSupportMessage())">{{ tr('email') }}</a>
                      <button type="button" (click)="copySupportEmail(selectedSupportMessage())">{{ tr('copyEmail') }}</button>
                      <button type="button" (click)="updateSupportStatus(selectedSupportMessage(), 'open')">{{ tr('open') }}</button>
                      <button type="button" (click)="updateSupportStatus(selectedSupportMessage(), 'pending')">{{ tr('pending') }}</button>
                      <button type="button" (click)="updateSupportStatus(selectedSupportMessage(), 'closed')">{{ tr('close') }}</button>
                      <button type="button" class="danger" (click)="deleteSupportMessage(selectedSupportMessage())">{{ tr('delete') }}</button>
                    </div>
                  </header>

                  <div class="support-linked-user" *ngIf="selectedSupportMessage()?.linkedUser as linkedUser; else noLinkedSupportUser">
                    <div>
                      <span>{{ tr('linkedAccount') }}</span>
                      <strong>{{ linkedUser.email }}</strong>
                      <small>{{ linkedUser.role }} - {{ linkedUser.credits }} {{ tr('credits') }} - {{ linkedUser.stats?.totalQuestionsSolved || 0 }} {{ tr('questions') }}</small>
                    </div>
                    <div class="row-actions">
                      <button type="button" (click)="openUserHistory(linkedUser)">{{ tr('history') }}</button>
                      <button type="button" (click)="openGrantModal(linkedUser, tr('supportAdjustment'))">{{ tr('grantCredits') }}</button>
                      <button type="button" (click)="linkedUser.isBanned ? unbanUser(linkedUser.id) : banUser(linkedUser.id)">
                        {{ linkedUser.isBanned ? tr('unban') : tr('ban') }}
                      </button>
                    </div>
                  </div>
                  <ng-template #noLinkedSupportUser>
                    <div class="support-linked-user muted">
                      <div>
                        <span>{{ tr('noLinkedAccount') }}</span>
                        <strong>{{ selectedSupportMessage()?.fromEmail || tr('unknownEmail') }}</strong>
                        <small>{{ tr('noLinkedAccountNote') }}</small>
                      </div>
                    </div>
                  </ng-template>

                  <div class="support-body">
                    <p *ngFor="let paragraph of supportParagraphs(selectedSupportMessage()?.text)">{{ paragraph }}</p>
                  </div>

                  <div class="support-replies" *ngIf="(selectedSupportMessage()?.replies || []).length">
                    <h4>{{ tr('replies') }}</h4>
                    <article class="support-reply" *ngFor="let reply of selectedSupportMessage()?.replies">
                      <strong>{{ reply.admin }}</strong>
                      <small>{{ formatDate(reply.sentAt) }} - {{ reply.delivery }}</small>
                      <p>{{ reply.text }}</p>
                    </article>
                  </div>

                  <form class="support-reply-form" (ngSubmit)="replySupportMessage()">
                    <label class="form-label">
                      <span>{{ tr('reply') }}</span>
                      <textarea name="supportReplyText" [(ngModel)]="supportReplyText" rows="7" [placeholder]="tr('replyPlaceholder')"></textarea>
                    </label>
                    <button class="btn btn-primary" type="submit" [disabled]="!supportReplyText.trim()">{{ tr('sendReply') }}</button>
                  </form>
                </article>

                <ng-template #supportEmpty>
                  <div class="support-detail support-empty">
                    <p class="text-secondary">{{ tr('selectMessage') }}</p>
                  </div>
                </ng-template>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'cache'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ tr('aiCache') }}</p>
                  <h2>{{ tr('cachedAnswers') }}</h2>
                </div>
                <form class="admin-search" (ngSubmit)="loadCache(1)">
                  <input class="form-input" type="search" name="cacheSearch" [(ngModel)]="cacheSearch" [placeholder]="tr('searchCache')">
                  <button class="btn btn-primary" type="submit">{{ tr('search') }}</button>
                  <button class="btn btn-outline" type="button" *ngIf="cacheSearch" (click)="cacheSearch = ''; loadCache(1)">{{ tr('reset') }}</button>
                  <button class="btn btn-outline" type="button" (click)="clearCache()">{{ tr('clearCache') }}</button>
                </form>
              </div>
              <div class="cache-summary">
                <article *ngFor="let card of cacheSummaryCards()" [class.warn]="card.warn">
                  <span>{{ card.label }}</span>
                  <strong>{{ card.value }}</strong>
                  <small>{{ card.note }}</small>
                </article>
              </div>
              <div class="cache-list">
                <article class="glass clickable-row" *ngFor="let hit of cache().topHits || []" (click)="showQuestionDetails(hit)">
                  <div class="cache-question-main">
                    <p>{{ hit.questionText }}</p>
                    <div class="meta-chips">
                      <span class="badge badge-outline role-badge">{{ hit.questionType }}</span>
                      <span class="badge badge-outline">{{ hit.options?.length || 0 }} {{ tr('options') }}</span>
                      <span class="badge badge-outline">{{ hit.hitCount }} {{ tr('hits') }}</span>
                      <span class="status-pill danger" *ngIf="isWeakQuestionText(hit.questionText)">{{ tr('weakText') }}</span>
                    </div>
                  </div>
                  <span class="open-hint">{{ tr('openDetails') }}</span>
                </article>
                <div class="empty-panel" style="text-align: center; padding: 2rem;" *ngIf="!(cache().topHits || []).length">
                  <p class="text-secondary">{{ tr('noCacheHits') }}</p>
                </div>
              </div>
              <div class="pagination" *ngIf="cachePagination().pages > 1">
                <button type="button" *ngFor="let page of cachePageNumbers()" [class.active]="page === cachePagination().page" (click)="loadCache(page)">
                  {{ page }}
                </button>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'leaderboard'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ tr('community') }}</p>
                  <h2>{{ tr('leaderboard') }}</h2>
                </div>
              </div>
              <div class="leaderboard-admin">
                <article class="glass" *ngFor="let entry of leaderboard()" style="margin-bottom: 0.5rem; border-radius: var(--radius-md);">
                  <strong style="color: var(--accent-cyan);">#{{ entry.rank }}</strong>
                  <span style="font-weight: 600;">{{ entry.name }}</span>
                  <span class="text-secondary">{{ entry.questionsSolved }} {{ tr('questions') }}</span>
                  <span class="badge badge-outline">{{ tr('streak') }}: {{ entry.streak }}</span>
                </article>
                <div class="empty-panel" style="text-align: center; padding: 2rem;" *ngIf="!leaderboard().length">
                  <p class="text-secondary">{{ tr('noLeaderboard') }}</p>
                </div>
              </div>
            </section>

            <section class="admin-panel glass" *ngIf="activeTab() === 'system'">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">{{ tr('system') }}</p>
                  <h2>{{ tr('healthCheck') }}</h2>
                </div>
              </div>
              <div class="health-grid">
                <article class="glass" *ngFor="let item of healthCards()">
                  <span class="text-secondary" style="font-size: 0.75rem; text-transform: uppercase;">{{ item.label }}</span>
                  <strong [class.ok]="item.ok" style="font-size: 1.35rem; margin-top: 0.25rem;">{{ item.value }}</strong>
                </article>
              </div>

              <div id="admin-billing-safety" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                <div class="panel-head" style="margin-bottom: 1rem;">
                  <div>
                    <p class="eyebrow">{{ tr('billingSafety') }}</p>
                    <h3 style="margin: 0.25rem 0 0; font-family: var(--font-heading); font-size: 1.15rem;">{{ tr('creditDedupeMonitor') }}</h3>
                  </div>
                  <button class="btn btn-outline" type="button" (click)="loadBillingSafety()">{{ tr('refreshBilling') }}</button>
                </div>
                <div class="health-grid">
                  <article class="glass" *ngFor="let item of billingSafetyCards()">
                    <span class="text-secondary" style="font-size: 0.75rem; text-transform: uppercase;">{{ item.label }}</span>
                    <strong [class.ok]="item.ok" style="font-size: 1.35rem; margin-top: 0.25rem;">{{ item.value }}</strong>
                  </article>
                </div>

                <div class="admin-alert" *ngIf="(billingSafety().duplicateGroups || []).length" style="margin-top: 1rem;">
                  {{ tr('duplicateWarning') }}
                </div>

                <div class="table-scroll" *ngIf="(billingSafety().duplicateGroups || []).length" style="margin-top: 1rem;">
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>{{ tr('user') }}</th>
                        <th>{{ tr('questionText') }}</th>
                        <th>{{ tr('questionHash') }}</th>
                        <th>{{ tr('charges') }}</th>
                        <th>{{ tr('actions') }}</th>
                        <th>{{ tr('lastCharged') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let group of billingSafety().duplicateGroups">
                        <td>
                          <strong>{{ group.email || group.userId || tr('unknownUser') }}</strong>
                          <button class="link-button primary-link" type="button" *ngIf="group.userId" (click)="openUserHistory({ id: group.userId, email: group.email || group.userId })">
                            {{ tr('history') }}
                          </button>
                        </td>
                        <td class="question-audit-cell">
                          <strong>{{ group.questionText || shortHash(group.questionHash) }}</strong>
                          <span *ngIf="group.answerText">{{ tr('answerSummary') }}: {{ group.answerText }}</span>
                          <span>{{ tr('duplicateReason') }}</span>
                        </td>
                        <td>{{ shortHash(group.questionHash) }}</td>
                        <td>
                          <strong>{{ group.count }} / {{ group.credits }} credits</strong>
                          <span>{{ tr('timeSpan') }}: {{ formatDurationMs(group.spanMs) }}</span>
                        </td>
                        <td>
                          <strong>{{ group.action || (group.actions || []).join(', ') }}</strong>
                          <span>{{ tr('firstCharged') }}: {{ formatDate(group.firstChargedAt) }}</span>
                        </td>
                        <td>
                          <strong>{{ formatDate(group.lastChargedAt) }}</strong>
                          <div class="row-actions" style="margin-top: 0.5rem;">
                            <button type="button" (click)="reviewDuplicateGroup(group)">{{ tr('reviewInLog') }}</button>
                            <button type="button" *ngIf="group.userId" (click)="openGrantModal({ id: group.userId, email: group.email || group.userId }, tr('possibleRefund'))">{{ tr('possibleRefund') }}</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="empty-panel" *ngIf="!(billingSafety().duplicateGroups || []).length" style="text-align: center; padding: 1.25rem; margin-top: 1rem;">
                  <p class="text-secondary">{{ tr('noDuplicateGroups') }}</p>
                </div>

                <div class="credit-usage-panel">
                  <div class="panel-head" style="margin-bottom: 1rem;">
                    <div>
                      <p class="eyebrow">{{ tr('creditEvent') }}</p>
                      <h3 style="margin: 0.25rem 0 0; font-family: var(--font-heading); font-size: 1.15rem;">{{ tr('creditUsageLog') }}</h3>
                      <p class="text-secondary" style="margin: 0.4rem 0 0;">{{ tr('creditUsageDescription') }}</p>
                    </div>
                    <button class="btn btn-outline" type="button" (click)="loadBillingUsage(1)">{{ tr('refresh') }}</button>
                  </div>

                  <form class="admin-search credit-usage-filters" (ngSubmit)="loadBillingUsage(1)">
                    <input type="text" [(ngModel)]="billingUsageSearch" name="billingUsageSearch" [placeholder]="tr('searchCreditUsage')">
                    <select [(ngModel)]="billingUsageStatus" name="billingUsageStatus">
                      <option value="">{{ tr('allStatuses') }}</option>
                      <option value="charged">{{ tr('charged') }}</option>
                      <option value="claimed">{{ tr('claimed') }}</option>
                      <option value="waived">{{ tr('waived') }}</option>
                      <option value="aborted">{{ tr('aborted') }}</option>
                      <option value="declined">{{ tr('declined') }}</option>
                    </select>
                    <select [(ngModel)]="billingUsageAction" name="billingUsageAction">
                      <option value="">{{ tr('allActions') }}</option>
                      <option value="solve">solve</option>
                      <option value="solve-snapshot">solve-snapshot</option>
                      <option value="explain">explain</option>
                      <option value="follow-up">follow-up</option>
                    </select>
                    <button class="btn btn-primary" type="submit">{{ tr('search') }}</button>
                  </form>

                  <div class="health-grid credit-usage-summary">
                    <article class="glass">
                      <span>{{ tr('visibleEntries') }}</span>
                      <strong>{{ formatNumber(billingUsagePagination().total || 0) }}</strong>
                    </article>
                    <article class="glass">
                      <span>{{ tr('charged') }}</span>
                      <strong class="ok">{{ formatNumber(billingUsageSummary().chargedRecords || 0) }}</strong>
                    </article>
                    <article class="glass">
                      <span>{{ tr('chargedCredits') }}</span>
                      <strong class="ok">{{ formatNumber(billingUsageSummary().chargedCredits || 0) }}</strong>
                    </article>
                    <article class="glass">
                      <span>{{ tr('status') }}</span>
                      <strong>{{ billingUsageStatus ? creditUsageStatusLabel(billingUsageStatus) : tr('allStatuses') }}</strong>
                    </article>
                  </div>

                  <div class="table-scroll" style="margin-top: 1rem;">
                    <table class="admin-table credit-usage-table">
                      <thead>
                        <tr>
                          <th>{{ tr('questionText') }}</th>
                          <th>{{ tr('user') }}</th>
                          <th>{{ tr('creditEvent') }}</th>
                          <th>{{ tr('chargedCredits') }}</th>
                          <th>{{ tr('date') }}</th>
                          <th>{{ tr('actions') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of billingUsageRows()">
                          <td class="question-audit-cell">
                            <strong>{{ item.questionText }}</strong>
                            <span *ngIf="item.answerText">{{ tr('answerSummary') }}: {{ item.answerText }}</span>
                            <span>{{ item.questionType || item.action }} - {{ shortHash(item.questionHash) }}</span>
                          </td>
                          <td>
                            <strong>{{ item.email }}</strong>
                            <span *ngIf="item.displayName">{{ item.displayName }}</span>
                          </td>
                          <td>
                            <span class="status-pill" [class.ok]="creditUsageStatusClass(item.status) === 'ok'" [class.pending]="creditUsageStatusClass(item.status) === 'pending'" [class.danger]="creditUsageStatusClass(item.status) === 'danger'">
                              {{ creditUsageStatusLabel(item.status) }}
                            </span>
                            <span>{{ item.action }}</span>
                            <span *ngIf="item.waivedReason">{{ item.waivedReason }}</span>
                          </td>
                          <td>
                            <strong class="metric-value">{{ item.creditsCharged || 0 }}</strong>
                            <span>{{ tr('billableCredits') }}: {{ item.credits || 0 }}</span>
                          </td>
                          <td>{{ formatDate(item.time) }}</td>
                          <td>
                            <div class="row-actions">
                              <button type="button" (click)="showQuestionDetails(item)">{{ tr('viewQuestion') }}</button>
                              <button type="button" *ngIf="item.userId" (click)="openUserHistory({ id: item.userId, email: item.email })">{{ tr('history') }}</button>
                            </div>
                          </td>
                        </tr>
                        <tr *ngIf="!billingUsageRows().length">
                          <td colspan="6" class="empty-cell">{{ tr('noCreditUsage') }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="pagination" *ngIf="billingUsagePagination().pages > 1">
                    <button type="button" *ngFor="let page of billingUsagePageNumbers()" [class.active]="page === billingUsagePagination().page" (click)="loadBillingUsage(page)">
                      {{ page }}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </section>
      </ng-template>

      <!-- Question Detail Modal -->
      <div class="modal-overlay" *ngIf="selectedQuestion()" (click)="selectedQuestion.set(null)" style="z-index: 1100;">
        <div class="modal-card glass anim-slide-up" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ tr('questionDetails') }}</h3>
            <div class="row-actions">
              <button type="button" class="danger" *ngIf="selectedQuestion()?.cacheId" (click)="deleteCacheEntry(selectedQuestion())">{{ tr('deleteCache') }}</button>
              <button class="btn-close" type="button" (click)="selectedQuestion.set(null)">x</button>
            </div>
          </header>
          <div class="modal-body">
            <div class="detail-group">
              <label>{{ tr('type') }}</label>
              <span class="badge badge-outline" style="text-transform: uppercase;">{{ selectedQuestion()?.questionType }}</span>
            </div>
            <div class="detail-group" *ngIf="selectedQuestion()?.hitCount != null" style="margin-top: 1rem;">
              <label>{{ tr('cacheHits') }}</label>
              <strong style="color: var(--text-primary);">{{ selectedQuestion()?.hitCount }}</strong>
            </div>
            <div class="detail-group" style="margin-top: 1rem;">
              <label>{{ tr('counts') }}</label>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge badge-outline">{{ tr('options') }}: {{ selectedQuestion()?.options?.length || 0 }}</span>
                <span class="badge badge-outline">{{ tr('prompts') }}: {{ selectedQuestion()?.prompts?.length || 0 }}</span>
                <span class="badge badge-outline">{{ tr('rows') }}: {{ selectedQuestion()?.rows?.length || 0 }}</span>
                <span class="badge badge-outline">{{ tr('answerItems') }}: {{ answerItems(selectedQuestion()).length }}</span>
              </div>
            </div>
            <div class="detail-group" style="margin-top: 1.5rem;">
              <label>{{ tr('questionText') }}</label>
              <p class="question-text-full">{{ selectedQuestion()?.questionText }}</p>
            </div>
            
            <div class="detail-group" *ngIf="selectedQuestion()?.options?.length" style="margin-top: 1.5rem;">
              <label>{{ tr('options') }} ({{ selectedQuestion()?.options?.length || 0 }})</label>
              <ul class="options-list">
                <li *ngFor="let opt of selectedQuestion()?.options; let i = index">
                  <span class="option-idx">{{ i + 1 }}.</span> {{ opt }}
                </li>
              </ul>
            </div>

            <div class="detail-group" *ngIf="selectedQuestion()?.prompts?.length" style="margin-top: 1.5rem;">
              <label>{{ tr('prompts') }} ({{ selectedQuestion()?.prompts?.length || 0 }})</label>
              <ul class="options-list">
                <li *ngFor="let prompt of selectedQuestion()?.prompts; let i = index">
                  <span class="option-idx">P{{ i + 1 }}:</span> {{ prompt }}
                </li>
              </ul>
            </div>

            <div class="detail-group" *ngIf="selectedQuestion()?.rows?.length" style="margin-top: 1.5rem;">
              <label>{{ tr('rows') }} ({{ selectedQuestion()?.rows?.length || 0 }})</label>
              <ul class="options-list">
                <li *ngFor="let row of selectedQuestion()?.rows; let i = index">
                  <span class="option-idx">R{{ i + 1 }}:</span> {{ row }}
                </li>
              </ul>
            </div>

            <div class="detail-group" *ngIf="answerItems(selectedQuestion()).length" style="margin-top: 1.5rem;">
              <label>{{ tr('answerItems') }} ({{ answerItems(selectedQuestion()).length }})</label>
              <ul class="options-list">
                <li *ngFor="let item of answerItems(selectedQuestion())">
                  <span class="option-idx">{{ item.label }}</span> {{ item.value }}
                  <small *ngIf="item.raw !== null" style="display: block; margin-top: 0.35rem; color: var(--text-secondary);">raw: {{ item.raw }}</small>
                </li>
              </ul>
            </div>

            <div class="detail-group" style="margin-top: 1.5rem; padding: 1rem; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md);">
              <label style="color: var(--accent-emerald);">{{ tr('answerSummary') }}</label>
              <strong style="color: #fff; font-size: 1.1rem; display: block; margin-top: 0.25rem;">{{ formatAnswer(selectedQuestion()) }}</strong>
            </div>

            <div class="detail-group" *ngIf="selectedQuestion()?.explanation" style="margin-top: 1.5rem;">
              <label>{{ tr('explanation') }}</label>
              <p class="explanation-text">{{ selectedQuestion()?.explanation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- User Solve History Modal -->
      <div class="modal-overlay" *ngIf="selectedUserHistory()" (click)="closeUserHistory()" style="z-index: 1000;">
        <div class="modal-card glass anim-slide-up" style="max-width: 800px;" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <div>
              <p class="eyebrow" style="margin: 0;">{{ tr('solveHistory') }}</p>
              <h3 style="margin-top: 0.25rem;">{{ selectedUserHistory()?.email }}</h3>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" type="button" (click)="openGrantModal(selectedUserHistory(), tr('questionHistoryAdjustment'))">{{ tr('grantCredits') }}</button>
              <button class="btn-close" type="button" (click)="closeUserHistory()">x</button>
            </div>
          </header>
          <div class="modal-body" style="padding-top: 1rem;">
            <div class="table-scroll" style="margin: 0; border: 1px solid var(--border); border-radius: var(--radius-md);">
              <table class="admin-table" style="min-width: 100%;">
                <thead>
                  <tr>
                    <th>{{ tr('questionText') }}</th>
                    <th>{{ tr('type') }}</th>
                    <th>{{ tr('date') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let q of userQuestions()" (click)="showQuestionDetails(q)" class="clickable-row">
                    <td style="max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      <strong>{{ q.questionText }}</strong>
                    </td>
                    <td style="text-transform: capitalize;">{{ q.questionType }}</td>
                    <td>{{ formatDate(q.lastSeenAt) }}</td>
                  </tr>
                  <tr *ngIf="!userQuestions().length">
                    <td colspan="3" class="empty-cell" style="text-align: center; padding: 3rem;">{{ tr('noSolvedQuestions') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pagination" *ngIf="userQuestionsPagination().pages > 1" style="margin-top: 1.5rem;">
              <button type="button" *ngFor="let page of userQuestionsPageNumbers()" [class.active]="page === userQuestionsPagination().page" (click)="loadUserQuestions(selectedUserHistory().id, page)">
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Grant Modal -->
      <div class="modal-overlay" *ngIf="selectedGrantUser()" (click)="closeGrantModal()" style="z-index: 1200;">
        <div class="modal-card glass anim-slide-up" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <div>
              <p class="eyebrow" style="margin: 0;">{{ tr('manualCredits') }}</p>
              <h3 style="margin-top: 0.25rem;">{{ selectedGrantUser()?.email }}</h3>
            </div>
            <button class="btn-close" type="button" (click)="closeGrantModal()">x</button>
          </header>
          <form class="modal-body" style="display: flex; flex-direction: column; gap: 1rem;" (ngSubmit)="grantCustomCredits()">
            <label class="form-label">
              <span>{{ tr('credits') }}</span>
              <input class="form-input" type="number" name="grantAmount" min="1" max="10000" step="1" [(ngModel)]="grantAmount">
            </label>
            <label class="form-label">
              <span>{{ tr('reason') }}</span>
              <input class="form-input" type="text" name="grantReason" maxlength="200" [(ngModel)]="grantReason">
            </label>
            <div class="modal-actions end">
              <button class="btn btn-outline" type="button" (click)="closeGrantModal()">{{ tr('cancel') }}</button>
              <button class="btn btn-primary" type="submit">{{ tr('grantCredits') }}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
    }

    /* Login section */
    .admin-login {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
    }
    .admin-login-card {
      width: 100%;
      max-width: 440px;
      padding: 3rem 2.5rem;
      text-align: center;
    }
    .admin-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-heading);
      margin-bottom: 2rem;
    }
    .admin-brand span {
      width: 2.35rem;
      height: 2.35rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #101318 image-set(
        url('/logo-96.webp?v=20260628') type('image/webp'),
        url('/logo-96.png?v=20260628') type('image/png')
      ) center / cover no-repeat;
      color: transparent;
      font-size: 0;
      font-weight: 800;
      padding: 0;
      border-radius: var(--radius-sm);
      box-shadow: 0 10px 24px rgba(14, 165, 233, 0.22);
    }
    .admin-brand strong {
      font-size: 1.25rem;
      color: var(--text-primary);
    }
    .admin-login-card h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .admin-login-card label span {
      display: block;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      font-weight: 600;
      text-align: left;
    }

    /* Shell & Sidebar */
    .admin-shell {
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: 100vh;
    }
    .admin-sidebar {
      background: rgba(10, 12, 22, 0.6);
      border-right: 1px solid var(--border);
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      backdrop-filter: blur(20px);
    }
    .admin-tabs {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 2.5rem 0;
    }
    .admin-tabs button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s var(--ease-out);
      width: 100%;
      text-align: left;
      border: 1px solid transparent;
    }
    .admin-tabs button .tab-short {
      background: rgba(255, 255, 255, 0.05);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
    }
    .admin-tabs button .tab-label {
      flex: 1;
      min-width: 0;
    }
    .admin-tabs button .tab-copy {
      display: grid;
      gap: 0.08rem;
      flex: 1;
      min-width: 0;
    }
    .admin-tabs button .tab-copy small {
      color: var(--text-secondary);
      font-size: 0.7rem;
      line-height: 1.15;
    }
    .admin-tabs button .tab-badge {
      min-width: 1.35rem;
      height: 1.35rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.35rem;
      border-radius: 999px;
      background: var(--accent-rose);
      color: #fff;
      font-size: 0.72rem;
      font-weight: 800;
      margin-left: auto;
    }
    .admin-tabs button:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
    }
    .admin-tabs button.active {
      background: rgba(6, 182, 212, 0.08);
      color: var(--accent-cyan);
      border: 1px solid rgba(6, 182, 212, 0.2);
    }
    .admin-tabs button.active .tab-short {
      background: var(--accent-cyan);
      color: var(--bg-deep);
    }

    .admin-sidebar-foot {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .admin-language-switch {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.35rem;
      padding: 0.3rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.025);
    }
    .admin-language-switch a {
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 0.78rem;
      font-weight: 800;
      padding: 0.45rem 0.6rem;
      text-align: center;
      text-decoration: none;
    }
    .admin-language-switch a.active {
      background: var(--accent-cyan);
      color: var(--bg-deep);
    }

    /* Main content */
    .admin-main {
      padding: 3rem;
      overflow-y: auto;
      max-height: 100vh;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .admin-header h1 {
      font-size: 2.25rem;
    }
    .admin-header-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* Stats */
    .admin-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .admin-stats article {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .admin-stats article span {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    .admin-stats article strong {
      font-size: 2rem;
      font-weight: 800;
      font-family: var(--font-heading);
      color: var(--text-primary);
    }
    .admin-stats article strong.revenue {
      color: var(--accent-emerald);
    }

    .operations-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .operations-strip .operation-card,
    .insight-grid article,
    .cache-summary article {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.025);
      padding: 1rem 1.1rem;
      display: grid;
      gap: 0.25rem;
      min-width: 0;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
    }
    .operations-strip .operation-card:hover {
      border-color: rgba(6, 182, 212, 0.42);
      background: rgba(6, 182, 212, 0.06);
      transform: translateY(-1px);
    }
    .operations-strip .operation-card.warn,
    .cache-summary article.warn {
      border-color: rgba(244, 63, 94, 0.35);
      background: rgba(244, 63, 94, 0.08);
    }
    .operations-strip .operation-card.ok {
      border-color: rgba(16, 185, 129, 0.28);
      background: rgba(16, 185, 129, 0.07);
    }
    .operations-strip span,
    .insight-grid span,
    .cache-summary span {
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .operations-strip strong,
    .insight-grid strong,
    .cache-summary strong {
      color: var(--text-primary);
      font-family: var(--font-heading);
      font-size: 1.45rem;
      line-height: 1.1;
      overflow-wrap: anywhere;
    }
    .operations-strip small,
    .insight-grid small,
    .cache-summary small {
      color: var(--text-secondary);
      font-size: 0.78rem;
      line-height: 1.35;
    }
    .insight-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .insight-grid strong.ok {
      color: var(--accent-emerald);
    }
    .insight-grid strong.warn {
      color: var(--accent-rose);
    }

    /* Admin panels */
    .admin-panel {
      padding: 2.5rem;
      margin-bottom: 2rem;
    }
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .panel-head h2 {
      font-size: 1.75rem;
    }
    .admin-search {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      max-width: 760px;
    }

    /* Data Tables */
    .table-scroll {
      overflow-x: auto;
      margin: 1.5rem -2.5rem -2.5rem;
      border-top: 1px solid var(--border);
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.95rem;
    }
    .admin-table th {
      padding: 1.25rem 2.5rem;
      font-family: var(--font-heading);
      font-weight: 600;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .admin-table td {
      padding: 1.25rem 2.5rem;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .admin-table tr:last-child td {
      border-bottom: none;
    }
    .admin-table td strong {
      display: block;
      color: var(--text-primary);
    }
    .admin-table td span {
      display: block;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    /* Row Actions */
    .row-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .row-actions button,
    .row-actions a {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
      transition: all 0.2s;
      text-decoration: none;
    }
    .row-actions button:hover,
    .row-actions a:hover {
      background: rgba(6, 182, 212, 0.1);
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }
    .row-actions button.danger {
      color: var(--accent-rose);
    }
    .row-actions button.danger:hover {
      background: rgba(244, 63, 94, 0.1);
      border-color: var(--accent-rose);
      color: var(--accent-rose);
    }
    .user-cell {
      min-width: 240px;
    }
    .link-button {
      appearance: none;
      border: 0;
      background: transparent;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: pointer;
      text-align: left;
    }
    .primary-link {
      display: block;
      width: fit-content;
      color: var(--accent-cyan);
      font-weight: 800;
      text-decoration: none;
    }
    .primary-link:hover {
      color: #67e8f9;
    }
    .muted-line {
      display: block;
      margin-top: 0.35rem;
      color: var(--text-secondary);
      font-size: 0.78rem;
    }
    .metric-value {
      color: var(--text-primary);
      font-family: var(--font-heading);
      font-size: 1.02rem;
    }
    .role-badge {
      text-transform: capitalize;
    }
    .admin-table .badge,
    .admin-table .status-pill {
      display: inline-flex;
      width: fit-content;
    }
    .meta-chips {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.45rem;
    }
    .credit-usage-panel {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .credit-usage-filters {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) minmax(140px, 180px) minmax(140px, 180px) auto;
      max-width: none;
    }
    .credit-usage-filters select {
      width: 100%;
      padding: 0.8rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      outline: none;
    }
    .credit-usage-summary {
      margin-top: 1rem;
    }
    .question-audit-cell {
      min-width: 320px;
      max-width: 560px;
    }
    .question-audit-cell strong {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.35;
    }
    .question-audit-cell span {
      margin-top: 0.35rem;
      overflow-wrap: anywhere;
    }
    .credit-usage-table td {
      vertical-align: top;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2.5rem;
    }
    .pagination button {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .pagination button:hover,
    .pagination button.active {
      background: var(--grad-primary);
      border-color: transparent;
      color: #fff;
    }

    /* Bug reports */
    .bug-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .bug-list article {
      border: 1px solid var(--border);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.01);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .bug-list article.unread {
      border-color: rgba(244, 63, 94, 0.38);
      background: rgba(244, 63, 94, 0.07);
      box-shadow: 0 18px 42px rgba(244, 63, 94, 0.08);
    }
    .bug-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .bug-meta > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem;
    }
    .bug-list article a {
      color: var(--accent-cyan);
      font-size: 0.85rem;
    }

    /* Support */
    .support-summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .support-summary article {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.025);
      padding: 1rem;
      display: grid;
      gap: 0.2rem;
    }
    .support-summary article.warn {
      border-color: rgba(244, 63, 94, 0.35);
      background: rgba(244, 63, 94, 0.08);
    }
    .support-summary article.ok {
      border-color: rgba(16, 185, 129, 0.28);
      background: rgba(16, 185, 129, 0.06);
    }
    .support-summary span {
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .support-summary strong {
      color: var(--text-primary);
      font-family: var(--font-heading);
      font-size: 1.55rem;
    }
    .support-layout {
      display: grid;
      grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.6fr);
      gap: 1.25rem;
      align-items: start;
    }
    .support-list {
      display: grid;
      gap: 0.65rem;
      max-height: 720px;
      overflow-y: auto;
      padding-right: 0.35rem;
    }
    .support-item {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.02);
      color: var(--text-primary);
      display: grid;
      grid-template-columns: 2.4rem minmax(0, 1fr);
      gap: 0.85rem;
      padding: 0.95rem;
      text-align: left;
      transition: border-color 0.2s, background 0.2s, transform 0.2s;
    }
    .support-item:hover,
    .support-item.active {
      border-color: rgba(6, 182, 212, 0.42);
      background: rgba(6, 182, 212, 0.07);
    }
    .support-item.unread {
      border-color: rgba(244, 63, 94, 0.38);
      background: rgba(244, 63, 94, 0.07);
    }
    .support-avatar {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(6, 182, 212, 0.14);
      color: var(--accent-cyan);
      font-size: 0.78rem;
      font-weight: 800;
    }
    .support-item-main,
    .support-item-row {
      display: grid;
      min-width: 0;
      gap: 0.35rem;
    }
    .support-item-row {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
    }
    .support-item-row strong,
    .support-sender,
    .support-preview {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .support-sender {
      color: var(--accent-cyan);
      font-size: 0.82rem;
      font-weight: 700;
    }
    .support-preview {
      color: var(--text-secondary);
      font-size: 0.83rem;
      line-height: 1.35;
    }
    .support-item small {
      color: var(--text-secondary);
      font-size: 0.74rem;
    }
    .support-detail {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.018);
      padding: 1.25rem;
      min-height: 520px;
    }
    .support-detail header {
      display: flex;
      justify-content: space-between;
      gap: 1.25rem;
      align-items: flex-start;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    .support-detail h3 {
      margin: 0.25rem 0 0;
      font-size: 1.25rem;
      line-height: 1.25;
    }
    .support-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.65rem;
      margin-top: 1rem;
    }
    .support-meta-grid span {
      display: grid;
      gap: 0.15rem;
      color: var(--text-secondary);
      font-size: 0.82rem;
      overflow-wrap: anywhere;
    }
    .support-meta-grid strong {
      color: var(--text-primary);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .support-linked-user {
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: var(--radius-md);
      background: rgba(6, 182, 212, 0.05);
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }
    .support-linked-user.muted {
      border-color: var(--border);
      background: rgba(255, 255, 255, 0.02);
    }
    .support-linked-user span,
    .support-linked-user small {
      display: block;
      color: var(--text-secondary);
      font-size: 0.8rem;
    }
    .support-linked-user strong {
      display: block;
      color: var(--text-primary);
      margin: 0.15rem 0;
    }
    .support-body {
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: rgba(10, 12, 22, 0.32);
      color: var(--text-primary);
      line-height: 1.62;
      white-space: pre-wrap;
    }
    .support-body p {
      margin: 0 0 0.85rem;
    }
    .support-body p:last-child {
      margin-bottom: 0;
    }
    .support-replies {
      margin-top: 1rem;
      display: grid;
      gap: 0.75rem;
    }
    .support-replies h4 {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .support-reply {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0.9rem 1rem;
      background: rgba(255, 255, 255, 0.025);
    }
    .support-reply small {
      display: block;
      color: var(--text-secondary);
      margin-top: 0.2rem;
      font-size: 0.78rem;
    }
    .support-reply p {
      margin: 0.65rem 0 0;
      color: var(--text-primary);
      line-height: 1.5;
    }
    .support-reply-form {
      display: grid;
      gap: 0.85rem;
      margin-top: 1rem;
    }
    .support-reply-form textarea {
      width: 100%;
      min-height: 150px;
      resize: vertical;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.035);
      color: var(--text-primary);
      padding: 0.85rem 1rem;
      font: inherit;
      line-height: 1.5;
    }
    .support-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    /* Cache panel */
    .cache-summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .cache-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .cache-list article {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .cache-question-main {
      display: grid;
      gap: 0.65rem;
      min-width: 0;
    }
    .cache-question-main p {
      margin: 0;
      color: var(--text-primary);
      font-weight: 650;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }
    .open-hint {
      color: var(--accent-cyan);
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }

    /* Leaderboard admin */
    .leaderboard-admin {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .leaderboard-admin article {
      display: grid;
      grid-template-columns: 80px 1.5fr 1fr 1fr;
      align-items: center;
      padding: 1.25rem 1.5rem;
    }

    /* Health System */
    .health-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .health-grid article {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .health-grid article span {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .health-grid article strong {
      color: var(--text-primary);
    }
    .health-grid article strong.ok {
      color: var(--accent-emerald);
    }

    .admin-alert {
      padding: 1rem 1.5rem;
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.2);
      color: var(--accent-rose);
      border-radius: var(--radius-md);
      margin-bottom: 2rem;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(10, 12, 22, 0.8);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-card {
      width: 100%;
      max-width: 600px;
      background: rgba(16, 19, 31, 0.95);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      max-height: 85vh;
    }
    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 {
      font-size: 1.25rem;
      margin: 0;
      color: var(--text-primary);
    }
    .modal-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .modal-actions.end {
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
    .btn-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.75rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      font-family: inherit;
    }
    .btn-close:hover {
      color: var(--text-primary);
    }
    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
    }
    .detail-group label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .question-text-full {
      font-size: 1.05rem;
      font-weight: 500;
      color: #fff;
      line-height: 1.5;
      margin: 0;
      white-space: pre-wrap;
    }
    .options-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .options-list li {
      padding: 0.65rem 1rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
    }
    .option-idx {
      font-weight: 700;
      color: var(--accent-cyan);
      margin-right: 0.5rem;
    }
    .explanation-text {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }
    .clickable-row {
      cursor: pointer;
      transition: background 0.2s;
    }
    .clickable-row:hover {
      background: rgba(6, 182, 212, 0.06);
    }

    @media (max-width: 1200px) {
      .admin-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      .insight-grid,
      .cache-summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 992px) {
      .admin-shell {
        grid-template-columns: 1fr;
      }
      .admin-sidebar {
        border-right: none;
        border-bottom: 1px solid var(--border);
        padding: 1.5rem;
      }
      .admin-tabs {
        flex-direction: row;
        overflow-x: auto;
        margin: 1.5rem 0;
      }
      .admin-tabs button {
        width: auto;
        white-space: nowrap;
      }
      .admin-sidebar-foot {
        flex-direction: row;
      }
      .admin-main {
        padding: 1.5rem;
      }
      .health-grid {
        grid-template-columns: 1fr;
      }
      .operations-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .support-layout {
        grid-template-columns: 1fr;
      }
      .support-summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 768px) {
      .admin-login {
        padding: 1rem;
        align-items: flex-start;
      }
      .admin-login-card {
        padding: 1.5rem;
        margin-top: 1rem;
      }
      .admin-login-card h1 {
        font-size: 1.6rem;
      }
      .admin-sidebar {
        position: sticky;
        top: 0;
        z-index: 20;
        padding: 0.85rem;
        background: rgba(5, 9, 16, 0.94);
        backdrop-filter: blur(18px);
      }
      .admin-sidebar .admin-brand {
        margin-bottom: 0.75rem;
      }
      .admin-sidebar .admin-brand strong {
        font-size: 1rem;
      }
      .admin-tabs {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.4rem;
        margin: 0 0 0.75rem;
        overflow: visible;
      }
      .admin-tabs button {
        justify-content: center;
        gap: 0.3rem;
        min-width: 0;
        padding: 0.55rem 0.35rem;
        border-radius: 10px;
        font-size: 0.68rem;
        line-height: 1.1;
        text-align: center;
        white-space: normal;
        flex-direction: column;
      }
      .admin-tabs button .tab-short,
      .admin-tabs button .tab-badge {
        font-size: 0.62rem;
        padding: 0.12rem 0.3rem;
      }
      .admin-tabs button .tab-label {
        flex: none;
      }
      .admin-tabs button .tab-copy {
        flex: none;
      }
      .admin-tabs button .tab-copy small {
        display: none;
      }
      .admin-tabs button .tab-badge {
        margin-left: 0;
      }
      .admin-sidebar-foot {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
      .admin-main {
        max-height: none;
        overflow: visible;
        padding: 1rem;
      }
      .admin-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .admin-header h1 {
        font-size: 1.55rem;
      }
      .admin-header-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .admin-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .operations-strip,
      .insight-grid,
      .cache-summary {
        grid-template-columns: 1fr;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .admin-stats article {
        padding: 1rem;
      }
      .admin-stats article span {
        font-size: 0.66rem;
      }
      .admin-stats article strong {
        font-size: 1.35rem;
        overflow-wrap: anywhere;
      }
      .admin-panel {
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .panel-head {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .panel-head h2 {
        font-size: 1.25rem;
      }
      .admin-search {
        max-width: 100%;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(120px, 0.6fr) auto;
      }
      .credit-usage-filters {
        grid-template-columns: 1fr;
      }
      .table-scroll {
        margin: 1rem -1rem -1rem;
        -webkit-overflow-scrolling: touch;
      }
      .admin-table {
        min-width: 760px;
        font-size: 0.85rem;
      }
      .admin-table th,
      .admin-table td {
        padding: 0.9rem 1rem;
      }
      .row-actions button {
        padding: 0.45rem 0.65rem;
      }
      .support-layout {
        gap: 1rem;
      }
      .support-list {
        max-height: 280px;
        padding-right: 0;
      }
      .support-detail {
        min-height: auto;
        padding: 1rem;
      }
      .support-detail header,
      .support-linked-user,
      .bug-meta,
      .cache-list article {
        flex-direction: column;
        align-items: stretch;
      }
      .support-meta-grid {
        grid-template-columns: 1fr;
      }
      .support-reply-form .btn {
        justify-self: stretch;
      }
      .leaderboard-admin article {
        grid-template-columns: 48px 1fr;
        gap: 0.5rem;
      }
      .cache-summary,
      .bug-list article,
      .cache-list article,
      .health-grid article {
        padding: 1rem;
      }
      .open-hint {
        white-space: normal;
      }
    }

    @media (max-width: 430px) {
      .admin-tabs {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .admin-search,
      .admin-header-actions,
      .admin-sidebar-foot {
        grid-template-columns: 1fr;
      }
      .support-summary {
        grid-template-columns: 1fr;
      }
      .admin-stats {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit, OnDestroy {
  protected readonly tabs: Array<{ id: AdminTab; label: string; short: string }> = [
    { id: 'users', label: 'Users', short: 'US' },
    { id: 'purchases', label: 'Purchases', short: 'PY' },
    { id: 'bugs', label: 'Bugs', short: 'BG' },
    { id: 'support', label: 'Support', short: 'SP' },
    { id: 'cache', label: 'Cache', short: 'CA' },
    { id: 'leaderboard', label: 'Leaderboard', short: 'LB' },
    { id: 'system', label: 'System', short: 'SY' }
  ];

  protected readonly activeTab = signal<AdminTab>('users');
  protected readonly adminLocale = signal<AdminLocale>('en');
  protected readonly isAuthed = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly stats = signal<any>({});
  protected readonly users = signal<any[]>([]);
  protected readonly purchases = signal<any[]>([]);
  protected readonly bugs = signal<any[]>([]);
  protected readonly supportMessages = signal<any[]>([]);
  protected readonly selectedSupportMessage = signal<any | null>(null);
  protected readonly cache = signal<any>({});
  protected readonly leaderboard = signal<any[]>([]);
  protected readonly health = signal<any>({});
  protected readonly billingSafety = signal<any>({});
  protected readonly billingUsage = signal<any>({ usage: [], summary: {} });
  protected readonly pagination = signal<any>({ page: 1, pages: 1, total: 0 });
  protected readonly cachePagination = signal<any>({ page: 1, pages: 1, total: 0 });
  protected readonly billingUsagePagination = signal<any>({ page: 1, pages: 1, total: 0 });

  protected readonly selectedQuestion = signal<any | null>(null);
  protected readonly selectedUserHistory = signal<any | null>(null);
  protected readonly selectedGrantUser = signal<any | null>(null);
  protected readonly userQuestions = signal<any[]>([]);
  protected readonly userQuestionsPagination = signal<any>({ page: 1, pages: 1, total: 0 });

  protected email = '';
  protected password = '';
  protected userSearch = '';
  protected cacheSearch = '';
  protected billingUsageSearch = '';
  protected billingUsageStatus = 'charged';
  protected billingUsageAction = '';
  protected supportSearch = '';
  protected supportStatusFilter = '';
  protected supportReplyText = '';
  protected grantAmount = 100;
  protected grantReason: string = ADMIN_COPY.en.supportAdjustment;

  private token = '';
  private readonly isBrowser: boolean;
  private adminRefreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly route: ActivatedRoute,
    private readonly title: Title,
    private readonly meta: Meta
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngOnInit(): Promise<void> {
    const routeLocale = this.route.snapshot.data['locale'] as AdminLocale | undefined;
    const storedLocale = this.isBrowser ? localStorage.getItem('qs_admin_locale') as AdminLocale | null : null;
    const locale = routeLocale === 'pl' ? 'pl' : routeLocale === 'en' ? 'en' : storedLocale === 'pl' ? 'pl' : 'en';
    this.adminLocale.set(locale);
    if (this.isBrowser) localStorage.setItem('qs_admin_locale', locale);
    this.title.setTitle(`${this.tr('adminConsole')} | QuizSolver`);
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    if (!this.isBrowser) return;
    this.token = localStorage.getItem('qs_admin_token') || localStorage.getItem('qs_token') || '';
    if (!this.token) return;

    const me = await this.api('/api/auth/me');
    if (me.success && me.user?.role === 'admin') {
      this.isAuthed.set(true);
      await this.refresh();
      this.startAdminRefreshTimer();
      return;
    }

    this.logout();
  }

  protected async login(): Promise<void> {
    this.error.set('');
    if (!this.email || !this.password) {
      this.error.set(this.tr('loginRequired'));
      return;
    }

    this.loading.set(true);
    const result = await this.api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: this.email, password: this.password, rememberMe: true })
    }, false);
    this.loading.set(false);

    if (!result.success || !result.token) {
      this.error.set(result.error || this.tr('loginFailed'));
      return;
    }

    if (result.user?.role !== 'admin') {
      this.error.set(this.tr('adminRequired'));
      return;
    }

    this.token = result.token;
    localStorage.setItem('qs_admin_token', this.token);
    localStorage.setItem('qs_token', this.token);
    this.isAuthed.set(true);
    await this.refresh();
    this.startAdminRefreshTimer();
  }

  protected logout(): void {
    if (this.token) void this.api('/api/auth/logout', { method: 'POST' });
    this.token = '';
    this.isAuthed.set(false);
    this.stopAdminRefreshTimer();
    if (this.isBrowser) localStorage.removeItem('qs_admin_token');
  }

  ngOnDestroy(): void {
    this.stopAdminRefreshTimer();
  }

  private startAdminRefreshTimer(): void {
    if (!this.isBrowser || this.adminRefreshTimer) return;
    this.adminRefreshTimer = setInterval(() => {
      if (!this.isAuthed()) return;
      void this.loadStats();
      if (this.activeTab() === 'bugs') void this.loadBugs();
      if (this.activeTab() === 'support') void this.loadSupportMessages();
      if (this.activeTab() === 'users') void this.loadUsers(this.pagination().page || 1);
    }, 30000);
  }

  private stopAdminRefreshTimer(): void {
    if (!this.adminRefreshTimer) return;
    clearInterval(this.adminRefreshTimer);
    this.adminRefreshTimer = null;
  }

  protected startGoogleLogin(): void {
    if (!this.isBrowser) return;
    const redirect = this.adminLocale() === 'pl' ? `/pl/${ADMIN_PANEL_ROUTE_PATH}` : ADMIN_PANEL_URL;
    window.location.href = `/api/auth/google/start?redirect=${encodeURIComponent(redirect)}&lang=${this.adminLocale()}`;
  }

  protected async refresh(): Promise<void> {
    this.error.set('');
    await Promise.all([
      this.loadStats(),
      this.loadUsers(this.pagination().page || 1),
      this.loadPurchases(),
      this.loadBugs(),
      this.loadSupportMessages(),
      this.loadCache(),
      this.loadLeaderboard(),
      this.loadHealth(),
      this.loadBillingSafety(),
      this.loadBillingUsage()
    ]);
  }

  protected async loadUsers(page = 1): Promise<void> {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (this.userSearch.trim()) params.set('search', this.userSearch.trim());
    const result = await this.api(`/api/admin/users?${params.toString()}`);
    if (result.success) {
      this.users.set(result.users || []);
      this.pagination.set(result.pagination || { page, pages: 1, total: 0 });
    }
  }

  protected async quickGrant(userId: string, amount: number): Promise<void> {
    const result = await this.api(`/api/admin/users/${userId}/quick-grant`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadStats()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotGrantCredits'));
  }

  protected openGrantModal(user: any, reason = this.tr('adminManualGrant')): void {
    if (!user?.id) return;
    this.selectedGrantUser.set(user);
    this.grantAmount = 100;
    this.grantReason = reason;
  }

  protected closeGrantModal(): void {
    this.selectedGrantUser.set(null);
  }

  protected async grantCustomCredits(): Promise<void> {
    const user = this.selectedGrantUser();
    const credits = Math.floor(Number(this.grantAmount || 0));
    const reason = String(this.grantReason || this.tr('adminManualGrant')).trim().substring(0, 200);
    if (!user?.id || credits <= 0) {
      this.error.set(this.tr('creditsGreaterThanZero'));
      return;
    }

    const result = await this.api(`/api/admin/users/${user.id}/grant-credits`, {
      method: 'POST',
      body: JSON.stringify({ credits, reason })
    });
    if (result.success) {
      this.closeGrantModal();
      await Promise.all([
        this.loadUsers(this.pagination().page),
        this.loadStats(),
        this.loadPurchases(),
        this.loadSupportMessages()
      ]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotGrantCredits'));
  }

  protected async banUser(userId: string): Promise<void> {
    if (!this.confirm(this.tr('banConfirm'))) return;
    const result = await this.api(`/api/admin/users/${userId}/ban`, { method: 'POST' });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadSupportMessages()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotBanUser'));
  }

  protected async unbanUser(userId: string): Promise<void> {
    const result = await this.api(`/api/admin/users/${userId}/unban`, { method: 'POST' });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadSupportMessages()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotUnbanUser'));
  }

  protected async toggleLeaderboard(userId: string, exclude: boolean): Promise<void> {
    const result = await this.api(`/api/admin/users/${userId}/leaderboard`, {
      method: 'PATCH',
      body: JSON.stringify({ exclude })
    });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadLeaderboard()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotUpdateLeaderboard'));
  }

  protected async deleteUser(userId: string, email: string): Promise<void> {
    if (!this.confirm(`${this.tr('deleteUserConfirmPrefix')} ${email}? ${this.tr('deleteUserConfirmSuffix')}`)) return;
    const result = await this.api(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (result.success) {
      await Promise.all([this.loadUsers(this.pagination().page), this.loadStats()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotDeleteUser'));
  }

  protected async clearCache(): Promise<void> {
    if (!this.confirm(this.tr('clearCacheConfirm'))) return;
    const result = await this.api('/api/admin/cache/clear', { method: 'DELETE' });
    if (result.success) {
      await Promise.all([this.loadCache(1), this.loadStats()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotClearCache'));
  }

  protected async deleteCacheEntry(question: any): Promise<void> {
    const cacheId = question?.cacheId;
    if (!cacheId) return;
    if (!this.confirm(this.tr('deleteCacheConfirm'))) return;

    const result = await this.api(`/api/admin/cache/${cacheId}`, { method: 'DELETE' });
    if (result.success) {
      this.selectedQuestion.set(null);
      await Promise.all([this.loadCache(this.cachePagination().page || 1), this.loadStats()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotDeleteCache'));
  }

  protected tr(key: AdminCopyKey): string {
    const copy = ADMIN_COPY[this.adminLocale()] as Partial<Record<AdminCopyKey, string>>;
    return copy[key] || ADMIN_COPY.en[key] || key;
  }

  protected adminLocaleUrl(locale: AdminLocale): string {
    return locale === 'pl' ? `/pl/${ADMIN_PANEL_ROUTE_PATH}` : ADMIN_PANEL_URL;
  }

  protected tabLabel(tab: AdminTab): string {
    const labels: Record<AdminTab, AdminCopyKey> = {
      users: 'users',
      purchases: 'purchases',
      bugs: 'bugs',
      support: 'support',
      cache: 'cache',
      leaderboard: 'leaderboard',
      system: 'system'
    };
    return this.tr(labels[tab]);
  }

  protected tabHint(tab: AdminTab): string {
    const hints: Record<AdminTab, AdminCopyKey> = {
      users: 'usersHint',
      purchases: 'purchasesHint',
      bugs: 'bugsHint',
      support: 'supportHint',
      cache: 'cacheHint',
      leaderboard: 'leaderboardHint',
      system: 'systemHint'
    };
    return this.tr(hints[tab]);
  }

  protected activeTabTitle(): string {
    const titles: Record<AdminTab, AdminCopyKey> = {
      users: 'usersTitle',
      purchases: 'purchasesTitle',
      bugs: 'bugsTitle',
      support: 'supportTitle',
      cache: 'cacheTitle',
      leaderboard: 'leaderboardTitle',
      system: 'systemTitle'
    };
    return this.tr(titles[this.activeTab()]);
  }

  protected activeTabDescription(): string {
    const descriptions: Record<AdminTab, AdminCopyKey> = {
      users: 'usersDescription',
      purchases: 'purchasesDescription',
      bugs: 'bugsDescription',
      support: 'supportDescription',
      cache: 'cacheDescription',
      leaderboard: 'leaderboardDescription',
      system: 'systemDescription'
    };
    return this.tr(descriptions[this.activeTab()]);
  }

  protected adminNoticeCards(): Array<{ label: string; value: string; note: string; tone?: 'warn' | 'ok'; targetTab?: AdminTab; targetId?: string }> {
    const unreadBugs = this.bugBadgeCount();
    const supportUnread = this.supportBadgeCount();
    const duplicates = (this.billingSafety().duplicateGroups || []).length;
    const activeUsers = this.users().filter(user => this.isUserExtensionActive(user)).length;
    const reviewDetails = this.adminLocale() === 'pl' ? 'Kliknij, aby sprawdzic szczegoly' : this.tr('clickToReview');
    const notices: Array<{ label: string; value: string; note: string; tone?: 'warn' | 'ok'; targetTab?: AdminTab; targetId?: string }> = [];

    if (unreadBugs > 0) {
      notices.push({
        label: this.tr('unreadBugs'),
        value: this.formatNumber(unreadBugs),
        note: `${this.tr('newBugReportsWaiting')} - ${reviewDetails}`,
        tone: 'warn',
        targetTab: 'bugs'
      });
    }

    if (supportUnread > 0) {
      notices.push({
        label: this.tr('unreadSupport'),
        value: this.formatNumber(supportUnread),
        note: `${this.tr('newEmailsWaiting')} - ${reviewDetails}`,
        tone: 'warn',
        targetTab: 'support'
      });
    }

    notices.push({
      label: this.tr('creditSafety'),
      value: duplicates ? this.formatNumber(duplicates) : 'OK',
      note: `${duplicates ? this.tr('duplicateGroupsNeedReview') : this.tr('noDuplicateChargeGroups')} - ${reviewDetails}`,
      tone: duplicates ? 'warn' : 'ok',
      targetTab: 'system',
      targetId: 'admin-billing-safety'
    });

    notices.push({
      label: this.tr('usingExtensionNow'),
      value: this.formatNumber(activeUsers),
      note: `${this.tr('activeHeartbeat')} - ${reviewDetails}`,
      tone: activeUsers ? 'ok' : undefined,
      targetTab: 'users'
    });

    return notices;
  }

  protected openAdminNotice(notice: { targetTab?: AdminTab; targetId?: string }): void {
    if (notice.targetTab) {
      this.activeTab.set(notice.targetTab);
      if (notice.targetTab === 'system') {
        void this.loadBillingSafety();
        void this.loadBillingUsage(this.billingUsagePagination().page || 1);
      }
      if (notice.targetTab === 'bugs') void this.loadBugs();
      if (notice.targetTab === 'support') void this.loadSupportMessages();
      if (notice.targetTab === 'users') void this.loadUsers(this.pagination().page || 1);
    }
    if (notice.targetId && this.isBrowser) {
      setTimeout(() => {
        document.getElementById(notice.targetId || '')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  protected usersSummaryCards(): Array<{ label: string; value: string; note: string; ok?: boolean; warn?: boolean }> {
    const users = this.users();
    const active = users.filter(user => this.isUserExtensionActive(user)).length;
    const banned = users.filter(user => user.isBanned).length;
    const credits = users.reduce((sum, user) => sum + (user.role === 'admin' ? 0 : Number(user.credits || 0)), 0);
    const questions = users.reduce((sum, user) => sum + Number(user.stats?.totalQuestionsSolved || 0), 0);
    return [
      { label: this.tr('visibleUsers'), value: this.formatNumber(users.length), note: `${this.formatNumber(this.pagination().total || users.length)} ${this.tr('totalInSearch')}` },
      { label: this.tr('activeNow'), value: this.formatNumber(active), note: this.tr('activeHeartbeat'), ok: active > 0 },
      { label: this.tr('banned'), value: this.formatNumber(banned), note: this.tr('blockedAccounts'), warn: banned > 0 },
      { label: this.tr('visibleCredits'), value: this.formatNumber(credits), note: `${this.formatNumber(questions)} ${this.tr('solvedQuestionsVisible')}` }
    ];
  }

  protected cacheSummaryCards(): Array<{ label: string; value: string; note: string; warn?: boolean }> {
    const hits = this.cache().topHits || [];
    const weak = hits.filter((hit: any) => this.isWeakQuestionText(hit.questionText)).length;
    const totalHits = hits.reduce((sum: number, hit: any) => sum + Number(hit.hitCount || 0), 0);
    const matching = this.cachePagination().total || this.cache().totalMatching || this.cache().totalCached || 0;
    return [
      { label: this.tr('cachedAnswers'), value: this.formatNumber(this.cache().totalCached || 0), note: this.tr('allStoredCacheRecords') },
      { label: this.tr('visibleEntries'), value: this.formatNumber(matching), note: this.cacheSearch.trim() ? this.tr('matchingCurrentSearch') : this.tr('currentCachePageTotal') },
      { label: this.tr('hitsOnPage'), value: this.formatNumber(totalHits), note: this.tr('usageVisibleRows') },
      { label: this.tr('weakText'), value: this.formatNumber(weak), note: this.tr('needsParserReview'), warn: weak > 0 }
    ];
  }

  protected statsCards(): Array<{ label: string; value: string; revenue?: boolean }> {
    const s = this.stats();
    return [
      { label: this.tr('users'), value: this.formatNumber(s.totalUsers) },
      { label: this.tr('questions'), value: this.formatNumber(s.totalQuestions) },
      { label: this.tr('cachedAnswers'), value: this.formatNumber(s.cachedAnswers) },
      { label: this.tr('revenue'), value: this.formatMoney(s.totalRevenue || 0), revenue: true },
      { label: this.adminLocale() === 'pl' ? 'Przychód mies.' : 'Month revenue', value: this.formatMoney(s.monthRevenue || 0), revenue: true },
      { label: this.adminLocale() === 'pl' ? 'Płatności dziś' : 'Purchases today', value: this.formatNumber(s.todayPurchases) },
      { label: this.tr('bugsTitle'), value: this.formatNumber(s.totalBugReports) },
      { label: this.tr('unreadBugs'), value: this.formatNumber(s.unreadBugReports) },
      { label: this.adminLocale() === 'pl' ? 'Otwarty support' : 'Open support', value: this.formatNumber(s.openSupportMessages) },
      { label: this.tr('unreadSupport'), value: this.formatNumber(s.unreadSupportMessages) },
      { label: this.tr('banned'), value: this.formatNumber(s.bannedUsers) }
    ];
  }

  protected healthCards(): Array<{ label: string; value: string; ok?: boolean }> {
    const h = this.health();
    const uptime = Number(h.uptime || 0);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return [
      { label: 'Database', value: h.database || 'unknown', ok: h.database === 'connected' },
      { label: 'Uptime', value: `${hours}h ${minutes}m` },
      { label: 'Memory RSS', value: h.memory?.rss || '-' },
      { label: 'Heap used', value: h.memory?.heapUsed || '-' },
      { label: 'Node', value: h.nodeVersion || '-' },
      { label: 'Environment', value: h.env || '-' }
    ];
  }

  protected billingSafetyCards(): Array<{ label: string; value: string; ok?: boolean }> {
    const b = this.billingSafety();
    const duplicates = (b.duplicateGroups || []).length;
    return [
      { label: this.adminLocale() === 'pl' ? 'Naliczone rekordy' : 'Charged records', value: this.formatNumber(b.chargedRecords), ok: true },
      { label: this.adminLocale() === 'pl' ? 'Naliczone 24h' : 'Charged 24h', value: this.formatNumber(b.chargedLast24h), ok: true },
      { label: this.adminLocale() === 'pl' ? 'Grupy duplikatów' : 'Duplicate groups', value: this.formatNumber(duplicates), ok: duplicates === 0 },
      { label: this.adminLocale() === 'pl' ? 'Aktywne claimy' : 'Active claims', value: this.formatNumber(b.activeClaims), ok: Number(b.activeClaims || 0) < 5 },
      { label: this.adminLocale() === 'pl' ? 'Stare claimy' : 'Stale claims', value: this.formatNumber(b.staleClaims), ok: Number(b.staleClaims || 0) === 0 },
      { label: this.adminLocale() === 'pl' ? 'Przerwane' : 'Aborted', value: this.formatNumber(b.abortedRecords) },
      { label: this.adminLocale() === 'pl' ? 'Odrzucone' : 'Declined', value: this.formatNumber(b.declinedRecords) },
      { label: this.adminLocale() === 'pl' ? 'Umorzone' : 'Waived', value: this.formatNumber(b.waivedRecords) },
      { label: this.adminLocale() === 'pl' ? 'Wszystkie claimy' : 'All claims', value: this.formatNumber(b.totalClaims) }
    ];
  }

  protected filteredSupportMessages(): any[] {
    const q = this.supportSearch.trim().toLowerCase();
    const messages = this.supportMessages();
    if (!q) return messages;
    return messages.filter(message => [
      message.fromEmail,
      message.fromName,
      message.subject,
      message.text,
      message.source
    ].some(value => String(value || '').toLowerCase().includes(q)));
  }

  protected supportSummaryCards(): Array<{ label: string; value: string; tone?: 'warn' | 'ok' }> {
    const messages = this.supportMessages();
    const visible = this.filteredSupportMessages().length;
    const open = messages.filter(message => message.status === 'open').length;
    const pending = messages.filter(message => message.status === 'pending').length;
    const unread = messages.filter(message => !message.isRead).length;
    return [
      { label: this.adminLocale() === 'pl' ? 'Widoczne' : 'Visible', value: this.formatNumber(visible) },
      { label: this.tr('open'), value: this.formatNumber(open), tone: open ? 'warn' : 'ok' },
      { label: this.tr('pending'), value: this.formatNumber(pending) },
      { label: this.adminLocale() === 'pl' ? 'Nieprzeczytane' : 'Unread', value: this.formatNumber(unread), tone: unread ? 'warn' : 'ok' }
    ];
  }

  protected supportBadgeCount(): number {
    const fromStats = Number(this.stats().unreadSupportMessages || 0);
    if (fromStats > 0) return fromStats;
    return this.supportMessages().filter(message => !message.isRead).length;
  }

  protected bugBadgeCount(): number {
    const fromStats = Number(this.stats().unreadBugReports || 0);
    if (fromStats > 0) return fromStats;
    return this.bugs().filter(report => !report.isRead).length;
  }

  protected supportSender(message: any): string {
    const name = String(message?.fromName || '').trim();
    const email = String(message?.fromEmail || '').trim();
    if (name && email && name.toLowerCase() !== email.toLowerCase()) return name;
    return email || name || 'Unknown sender';
  }

  protected supportInitials(message: any): string {
    const source = this.supportSender(message).replace(/@.*/, '').replace(/[^a-z0-9 ]/gi, ' ').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : (parts[0] || 'QS').slice(0, 2);
    return initials.toUpperCase();
  }

  protected supportPreview(message: any): string {
    const text = String(message?.text || message?.html || '').replace(/\s+/g, ' ').trim();
    if (!text) return this.tr('noMessagePreview');
    return text.length > 130 ? `${text.slice(0, 127)}...` : text;
  }

  protected supportParagraphs(value: unknown): string[] {
    const text = String(value || '').replace(/\r\n/g, '\n').trim();
    if (!text) return [this.tr('noMessageBody')];
    return text.split(/\n{2,}/).map(part => part.trim()).filter(Boolean);
  }

  protected supportSourceLabel(value: unknown): string {
    const raw = String(value || 'support').replace(/[-_]/g, ' ').trim();
    return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Support';
  }

  protected supportStatusLabel(value: unknown): string {
    const status = String(value || '').toLowerCase();
    if (status === 'open') return this.tr('open');
    if (status === 'pending') return this.tr('pending');
    if (status === 'closed') return this.tr('closed');
    return String(value || '-');
  }

  protected supportMailto(message: any): string {
    const email = String(message?.fromEmail || '').trim();
    const subject = `Re: ${message?.subject || 'QuizSolver support'}`;
    return email ? `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}` : 'mailto:support@getquizsolver.com';
  }

  protected async copySupportEmail(message: any): Promise<void> {
    const email = String(message?.fromEmail || '').trim();
    if (!email || !this.isBrowser || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      this.error.set(this.tr('couldNotCopyEmail'));
    }
  }

  protected pageNumbers(): number[] {
    return this.paginationWindow(this.pagination());
  }

  protected formatNumber(value: unknown): string {
    const number = Number(value || 0);
    return new Intl.NumberFormat(this.adminLocale() === 'pl' ? 'pl-PL' : 'en-US').format(number);
  }

  protected formatMoney(value: unknown): string {
    const number = Number(value || 0);
    return new Intl.NumberFormat(this.adminLocale() === 'pl' ? 'pl-PL' : 'en-US', { style: 'currency', currency: 'USD' }).format(number);
  }

  protected formatDate(value: unknown): string {
    if (!value) return '-';
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat(this.adminLocale() === 'pl' ? 'pl-PL' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  protected formatDurationMs(value: unknown): string {
    const ms = Math.max(0, Number(value || 0));
    if (!Number.isFinite(ms)) return '-';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${restSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    return `${hours}h ${restMinutes}m`;
  }

  protected reviewDuplicateGroup(group: any): void {
    this.billingUsageSearch = String(group?.questionHash || group?.email || '').trim();
    this.billingUsageStatus = '';
    this.billingUsageAction = String(group?.action || '').trim();
    void this.loadBillingUsage(1);
    if (this.isBrowser) {
      setTimeout(() => {
        document.querySelector('.credit-usage-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  protected isUserExtensionActive(user: any): boolean {
    return !!user?.isExtensionActive && !user?.isBanned;
  }

  protected userStatusLabel(user: any): string {
    if (user?.isBanned) return this.tr('banned');
    return this.isUserExtensionActive(user) ? this.tr('active') : this.tr('offline');
  }

  protected userExtensionLastSeen(user: any): string {
    if (user?.isBanned) return this.tr('suspendedAccount');
    if (!user?.extensionLastSeenAt) return this.tr('extensionNotSeen');
    const prefix = user?.isExtensionActive ? this.tr('now') : this.tr('lastSeen');
    const reason = user?.extensionLastSeenReason ? ` - ${user.extensionLastSeenReason}` : '';
    return `${prefix}: ${this.formatDate(user.extensionLastSeenAt)}${reason}`;
  }

  private async loadStats(): Promise<void> {
    const result = await this.api('/api/admin/stats');
    if (result.success) this.stats.set(result.stats || {});
  }

  private async loadPurchases(): Promise<void> {
    const result = await this.api('/api/admin/purchases');
    if (result.success) this.purchases.set(result.purchases || []);
  }

  protected async applyPurchaseCredits(purchaseId: string): Promise<void> {
    if (!purchaseId) return;
    const result = await this.api(`/api/admin/purchases/${purchaseId}/apply`, { method: 'POST' });
    if (result.success) {
      await Promise.all([
        this.loadPurchases(),
        this.loadUsers(this.pagination().page || 1),
        this.loadStats()
      ]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotApplyPurchase'));
  }

  private async loadBugs(): Promise<void> {
    const result = await this.api('/api/admin/bug-reports');
    if (result.success) this.bugs.set(result.reports || []);
  }

  protected async markBugReportRead(report: any): Promise<void> {
    if (!report?.id || report.isRead) return;
    const result = await this.api(`/api/admin/bug-reports/${report.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead: true })
    });
    if (result.success) {
      this.bugs.set(this.bugs().map(item =>
        item.id === report.id ? { ...item, isRead: true, readAt: result.report?.readAt || new Date().toISOString() } : item
      ));
      await this.loadStats();
      return;
    }
    this.error.set(result.error || this.tr('couldNotUpdateBugReport'));
  }

  protected async markAllBugReportsRead(): Promise<void> {
    const result = await this.api('/api/admin/bug-reports/mark-all-read', { method: 'POST' });
    if (result.success) {
      this.bugs.set(this.bugs().map(item => ({ ...item, isRead: true, readAt: item.readAt || new Date().toISOString() })));
      await this.loadStats();
      return;
    }
    this.error.set(result.error || this.tr('couldNotUpdateBugReport'));
  }

  protected async loadSupportMessages(): Promise<void> {
    const params = new URLSearchParams();
    if (this.supportStatusFilter) params.set('status', this.supportStatusFilter);
    if (this.supportSearch.trim()) params.set('q', this.supportSearch.trim());
    const result = await this.api(`/api/admin/support/messages${params.toString() ? `?${params.toString()}` : ''}`);
    if (!result.success) return;
    const messages = result.messages || [];
    this.supportMessages.set(messages);
    const selectedId = this.selectedSupportMessage()?.id;
    const nextSelected = messages.find((message: any) => message.id === selectedId) || messages[0] || null;
    this.selectedSupportMessage.set(nextSelected);
  }

  protected async selectSupportMessage(message: any): Promise<void> {
    this.selectedSupportMessage.set(message);
    this.supportReplyText = '';
    if (!message?.isRead) {
      await this.updateSupportStatus(message, message.status || 'open', true);
    }
  }

  protected async updateSupportStatus(message: any, status: 'open' | 'pending' | 'closed', markRead = false): Promise<void> {
    if (!message?.id) return;
    const result = await this.api(`/api/admin/support/messages/${message.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, isRead: markRead ? true : message.isRead })
    });
    if (!result.success) return;
    await this.loadSupportMessages();
  }

  protected async replySupportMessage(): Promise<void> {
    const message = this.selectedSupportMessage();
    const text = this.supportReplyText.trim();
    if (!message?.id || !text) return;
    const result = await this.api(`/api/admin/support/messages/${message.id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    if (result.success) {
      this.supportReplyText = '';
      await Promise.all([this.loadSupportMessages(), this.loadStats()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotSendReply'));
  }

  protected async deleteSupportMessage(message: any): Promise<void> {
    if (!message?.id) return;
    if (!this.confirm(`${this.tr('deleteSupportConfirmPrefix')} ${message.fromEmail || this.tr('unknownSender')}?`)) return;
    const result = await this.api(`/api/admin/support/messages/${message.id}`, { method: 'DELETE' });
    if (result.success) {
      this.selectedSupportMessage.set(null);
      await Promise.all([this.loadSupportMessages(), this.loadStats()]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotDeleteSupport'));
  }

  protected async loadCache(page = 1): Promise<void> {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    const search = this.cacheSearch.trim();
    if (search) params.set('q', search);
    const result = await this.api(`/api/admin/cache/stats?${params.toString()}`);
    if (result.success) {
      this.cache.set(result);
      this.cachePagination.set(result.pagination || { page, pages: 1, total: result.totalMatching || result.totalCached || 0 });
    }
  }

  private async loadLeaderboard(): Promise<void> {
    const result = await this.api('/api/admin/leaderboard');
    if (result.success) this.leaderboard.set(result.leaderboard || []);
  }

  private async loadHealth(): Promise<void> {
    const result = await this.api('/api/admin/system/health');
    if (result.success) this.health.set(result.health || {});
  }

  protected async loadBillingSafety(): Promise<void> {
    const result = await this.api('/api/admin/billing/safety');
    if (result.success) this.billingSafety.set(result.billing || {});
  }

  protected async loadBillingUsage(page = 1): Promise<void> {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    const search = this.billingUsageSearch.trim();
    if (search) params.set('q', search);
    if (this.billingUsageStatus) params.set('status', this.billingUsageStatus);
    if (this.billingUsageAction) params.set('action', this.billingUsageAction);
    const result = await this.api(`/api/admin/billing/usage?${params.toString()}`);
    if (result.success) {
      this.billingUsage.set({ usage: result.usage || [], summary: result.summary || {} });
      this.billingUsagePagination.set(result.pagination || { page, pages: 1, total: 0 });
    }
  }

  protected async openUserHistory(user: any): Promise<void> {
    this.selectedUserHistory.set(user);
    await this.loadUserQuestions(user.id, 1);
  }

  protected closeUserHistory(): void {
    this.selectedUserHistory.set(null);
    this.userQuestions.set([]);
    this.userQuestionsPagination.set({ page: 1, pages: 1, total: 0 });
  }

  protected async loadUserQuestions(userId: string, page = 1): Promise<void> {
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    const result = await this.api(`/api/admin/users/${userId}/questions?${params.toString()}`);
    if (result.success) {
      this.userQuestions.set(result.questions || []);
      this.userQuestionsPagination.set(result.pagination || { page, pages: 1, total: 0 });
    }
  }

  protected userQuestionsPageNumbers(): number[] {
    return this.paginationWindow(this.userQuestionsPagination());
  }

  protected cachePageNumbers(): number[] {
    return this.paginationWindow(this.cachePagination());
  }

  protected billingUsagePageNumbers(): number[] {
    return this.paginationWindow(this.billingUsagePagination());
  }

  protected billingUsageRows(): any[] {
    return this.billingUsage().usage || [];
  }

  protected billingUsageSummary(): any {
    return this.billingUsage().summary || {};
  }

  protected creditUsageStatusLabel(value: unknown): string {
    const status = String(value || '').toLowerCase();
    if (status === 'charged') return this.tr('charged');
    if (status === 'claimed') return this.tr('claimed');
    if (status === 'waived') return this.tr('waived');
    if (status === 'aborted') return this.tr('aborted');
    if (status === 'declined') return this.tr('declined');
    return status || '-';
  }

  protected creditUsageStatusClass(value: unknown): string {
    const status = String(value || '').toLowerCase();
    if (status === 'charged') return 'ok';
    if (status === 'claimed') return 'pending';
    if (status === 'declined' || status === 'aborted') return 'danger';
    if (status === 'waived') return 'muted';
    return '';
  }

  private paginationWindow(pagination: any, radius = 3): number[] {
    const pages = Math.max(1, Number(pagination?.pages || 1));
    const current = Math.min(Math.max(1, Number(pagination?.page || 1)), pages);
    const start = Math.max(1, current - radius);
    const end = Math.min(pages, current + radius);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  protected shortHash(value: unknown): string {
    const text = String(value || '');
    return text.length > 18 ? `${text.slice(0, 10)}...${text.slice(-6)}` : text || '-';
  }

  protected showQuestionDetails(q: any): void {
    this.selectedQuestion.set({
      cacheId: q._id || q.cachedAnswerId || null,
      questionText: q.questionText,
      questionType: q.questionType || q.type,
      options: q.options || [],
      prompts: q.prompts || [],
      rows: q.rows || [],
      answer: q.answer,
      explanation: q.explanation || '',
      hitCount: q.hitCount ?? null
    });
  }

  protected isWeakQuestionText(text: string): boolean {
    const compact = String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (!compact) return false;

    const hasMeta =
      /\b(?:domanda|question|pytanie|pregunta|frage|aufgabe|vraag|pergunta|quesito)\s*\d+\s*(?:di|of|de|del|von|z|\/)\s*\d+\b/i.test(compact) ||
      /\b(?:scelta\s+multipla|multiple\s+choice|single\s+choice|single\s+answer|multiple\s+answers|true\s*\/\s*false|vero\s*\/\s*falso|opcion\s+multiple|opcao\s+multipla|choix\s+multiple|mehrfachauswahl|wielokrotny\s+wybor|jednokrotny\s+wybor)\b/i.test(compact);
    const stripped = compact
      .replace(/\b(?:domanda|question|pytanie|pregunta|frage|aufgabe|vraag|pergunta|quesito)\s*\d+\s*(?:di|of|de|del|von|z|\/)\s*\d+\b/gi, ' ')
      .replace(/\b(?:scelta\s+multipla|multiple\s+choice|single\s+choice|single\s+answer|multiple\s+answers|true\s*\/\s*false|vero\s*\/\s*falso|opcion\s+multiple|opcao\s+multipla|choix\s+multiple|mehrfachauswahl|wielokrotny\s+wybor|jednokrotny\s+wybor)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const words = stripped.split(/\s+/).filter(Boolean);
    return hasMeta && (stripped.length < 12 || words.length < 3);
  }

  protected answerItems(q: any): Array<{ label: string; value: string; raw: string | null }> {
    if (!q || q.answer === undefined || q.answer === null) return [];
    const type = q.questionType || q.type;
    const options = q.options || [];
    const answer = q.answer;
    const itemValue = (raw: unknown): { value: string; raw: string | null } => {
      const idx = Number(raw);
      const optionText = Number.isInteger(idx) ? options[idx] : '';
      const rawText = this.rawAnswerValue(raw);
      return {
        value: optionText || rawText,
        raw: optionText ? rawText : null
      };
    };

    if (type === 'radio') {
      const item = itemValue(answer);
      return [{ label: 'A1', ...item }];
    }

    if (Array.isArray(answer)) {
      const labels = type === 'matching'
        ? (q.prompts || [])
        : type === 'matrix'
          ? (q.rows || [])
          : [];
      return answer.map((raw, index) => {
        const item = itemValue(raw);
        const source = labels[index] ? `${labels[index]} ->` : `A${index + 1}`;
        return { label: source, ...item };
      });
    }

    return [{ label: 'A1', value: this.rawAnswerValue(answer), raw: null }];
  }

  private rawAnswerValue(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  protected formatAnswer(q: any): string {
    if (!q) return '';
    const type = q.questionType || q.type;
    const options = q.options || [];
    const answer = q.answer;
    if (type === 'radio') {
      const idx = Number(answer);
      return options[idx] || String(answer);
    }
    if (type === 'checkbox' && Array.isArray(answer)) {
      return answer.map(idx => options[Number(idx)] || String(idx)).join(', ');
    }
    if (type === 'matching' && Array.isArray(answer)) {
      const prompts = q.prompts || [];
      return answer.map((idx, i) => {
        const label = prompts[i] ? `${prompts[i]} -> ` : '';
        return `${label}${options[Number(idx)] || String(idx)}`;
      }).join(' | ');
    }
    if (type === 'matrix' && Array.isArray(answer)) {
      const rows = q.rows || [];
      return answer.map((idx, i) => {
        const label = rows[i] ? `${rows[i]} -> ` : '';
        return `${label}${options[Number(idx)] || String(idx)}`;
      }).join(' | ');
    }
    return String(answer ?? '');
  }

  private confirm(message: string): boolean {
    if (!this.isBrowser) return false;
    return window.confirm(message);
  }

  private async api(endpoint: string, options: RequestInit = {}, withToken = true): Promise<any> {
    if (!this.isBrowser) return { success: false, error: 'Browser unavailable.' };
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    if (withToken && this.token) headers.Authorization = `Bearer ${this.token}`;

    try {
      const response = await fetch(endpoint, { ...options, headers });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        this.token = '';
        this.isAuthed.set(false);
        localStorage.removeItem('qs_admin_token');
        const message = data.error || 'Session expired.';
        this.error.set(message);
        return { success: false, error: message };
      }
      if (!response.ok) {
        const message = data.clientIp
          ? `${data.error || `HTTP ${response.status}`} Detected IP: ${data.clientIp}`
          : (data.error || `HTTP ${response.status}`);
        this.error.set(message);
        return { success: false, error: message };
      }
      return data;
    } catch {
      this.error.set('Network error.');
      return { success: false, error: 'Network error.' };
    }
  }
}
