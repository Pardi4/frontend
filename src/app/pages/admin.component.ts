import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ADMIN_PANEL_ROUTE_PATH, ADMIN_PANEL_URL } from '../admin-path';

type AdminTab = 'users' | 'purchases' | 'bugs' | 'support' | 'cache' | 'parser' | 'system';
type AdminLocale = 'en' | 'pl';
type UserSortField = 'credits' | 'questions' | 'streak' | 'status';
type UserSortDirection = 'asc' | 'desc';
type UserSortOption = 'createdAt_desc' | 'createdAt_asc' | `${UserSortField}_${UserSortDirection}` | 'lastOnline_desc' | 'lastOnline_asc';

const ADMIN_ACTIVE_TAB_KEY = 'qs_admin_active_tab';
const ADMIN_USERS_STATE_KEY = 'qs_admin_users_state';
const ADMIN_TAB_IDS: AdminTab[] = ['users', 'purchases', 'bugs', 'support', 'cache', 'parser', 'system'];
const DEFAULT_USER_SORT: UserSortOption = 'createdAt_desc';
const USER_SORT_VALUES: UserSortOption[] = [
  'createdAt_desc',
  'createdAt_asc',
  'credits_desc',
  'credits_asc',
  'lastOnline_desc',
  'lastOnline_asc',
  'questions_desc',
  'questions_asc',
  'streak_desc',
  'streak_asc',
  'status_desc',
  'status_asc'
];
const isAdminTab = (value: unknown): value is AdminTab => ADMIN_TAB_IDS.includes(value as AdminTab);
const isUserSortOption = (value: unknown): value is UserSortOption => USER_SORT_VALUES.includes(value as UserSortOption);

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
    parser: 'Parser',
    system: 'System',
    usersHint: 'accounts',
    purchasesHint: 'billing',
    bugsHint: 'reports',
    supportHint: 'mail',
    cacheHint: 'answers',
    parserHint: 'signals',
    systemHint: 'health',
    usersTitle: 'Users and credits',
    purchasesTitle: 'Purchases and grants',
    bugsTitle: 'Bug reports',
    supportTitle: 'Support inbox',
    cacheTitle: 'Answer cache',
    parserTitle: 'Parser health',
    systemTitle: 'System health',
    usersDescription: 'Track accounts, live extension usage, bans, credits and question history.',
    purchasesDescription: 'Review payment records, manual grants and pending credit application.',
    bugsDescription: 'Read user-submitted bug reports with source URLs.',
    supportDescription: 'Handle unread support mail, linked accounts and quick credit adjustments.',
    cacheDescription: 'Inspect cached AI answers, weak question text and high-hit questions.',
    parserDescription: 'Monitor parser success, platform failures, snapshots and extraction confidence.',
    systemDescription: 'Monitor service health, database state and credit dedupe safety.',
    accountsCredits: 'Accounts and credits',
    searchEmailName: 'Search email or name',
    search: 'Search',
    sortUsers: 'Sort users',
    sortNewestUsers: 'Newest users',
    sortOldestUsers: 'Oldest users',
    sortMostCredits: 'Most credits',
    sortFewestCredits: 'Fewest credits',
    sortLastOnline: 'Last online',
    sortLongestOffline: 'Longest offline',
    sortMostQuestions: 'Most questions',
    sortFewestQuestions: 'Fewest questions',
    sortHighestStreak: 'Highest streak',
    sortLowestStreak: 'Lowest streak',
    clearUsersFilters: 'Clear filters',
    exportVisibleUsers: 'Export visible CSV',
    loadingUsers: 'Refreshing users...',
    emailCopied: 'Email copied.',
    usersExported: 'Visible users exported.',
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
    parserHealth: 'Parser health',
    parserAnalytics: 'Platform analytics',
    parserEvents: 'Parser events',
    parserRecentReports: 'Recent parser reports',
    parserFailureRate: 'Failure rate',
    parserConfidence: 'Confidence',
    parserFailures: 'Failures',
    parserReports: 'Reports',
    parserPlatform: 'Platform',
    parserOutcome: 'Outcome',
    parserReason: 'Reason',
    parserSnapshot: 'Snapshot',
    parserWindow: 'Window',
    parserQuestionsFound: 'Questions found',
    parserOptionsFound: 'Options found',
    parserPageSnapshot: 'Page snapshot',
    parserPageText: 'Page text',
    parserPageCode: 'Page code',
    parserDownloadPageCode: 'Download page code',
    parserAutoReport: 'Auto parser report',
    parserNoEvents: 'No parser events yet.',
    clearFilteredParserEvents: 'Clear filtered',
    clearAllParserEvents: 'Clear all events',
    clearFilteredParserEventsConfirm: 'Delete parser events matching the current filters? User bug reports will stay.',
    clearAllParserEventsConfirm: 'Delete every parser event? User bug reports will stay, but parser analytics will reset.',
    parserEventsCleared: 'Parser events cleared',
    cachedAnswers: 'Cached answers',
    searchCache: 'Search cached question text',
    reset: 'Reset',
    clearCache: 'Clear cache',
    options: 'options',
    hits: 'hits',
    weakText: 'Weak text',
    openDetails: 'Open details',
    noCacheHits: 'No cache hits yet.',
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
    couldNotClearParserEvents: 'Could not clear parser events.',
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
    parser: 'Parser',
    system: 'System',
    usersHint: 'konta',
    purchasesHint: 'billing',
    bugsHint: 'zgłoszenia',
    supportHint: 'maile',
    cacheHint: 'odpowiedzi',
    parserHint: 'sygnały',
    systemHint: 'zdrowie',
    usersTitle: 'Użytkownicy i kredyty',
    purchasesTitle: 'Płatności i granty',
    bugsTitle: 'Zgłoszenia błędów',
    supportTitle: 'Skrzynka supportu',
    cacheTitle: 'Cache odpowiedzi',
    parserTitle: 'Zdrowie parsera',
    systemTitle: 'Stan systemu',
    usersDescription: 'Kontroluj konta, aktywność rozszerzenia, bany, kredyty i historię pytań.',
    purchasesDescription: 'Przeglądaj płatności, ręczne granty i oczekujące dodania kredytów.',
    bugsDescription: 'Czytaj zgłoszenia błędów od użytkowników razem z adresami stron.',
    supportDescription: 'Obsługuj nowe maile, powiązane konta i szybkie korekty kredytów.',
    cacheDescription: 'Sprawdzaj odpowiedzi AI w cache, słabą treść pytań i najczęstsze trafienia.',
    parserDescription: 'Monitoruj skuteczność parsera, błędy platform, snapshoty i confidence ekstrakcji.',
    systemDescription: 'Monitoruj stan usługi, bazę danych i zabezpieczenia przed podwójnym naliczaniem.',
    accountsCredits: 'Konta i kredyty',
    searchEmailName: 'Szukaj e-maila lub nazwy',
    search: 'Szukaj',
    sortUsers: 'Sortuj użytkowników',
    sortNewestUsers: 'Najnowsi użytkownicy',
    sortOldestUsers: 'Najstarsi użytkownicy',
    sortMostCredits: 'Najwięcej kredytów',
    sortFewestCredits: 'Najmniej kredytów',
    sortLastOnline: 'Ostatnio online',
    sortLongestOffline: 'Najdłużej offline',
    sortMostQuestions: 'Najwięcej pytań',
    sortFewestQuestions: 'Najmniej pytań',
    sortHighestStreak: 'Najwyższa seria',
    sortLowestStreak: 'Najniższa seria',
    clearUsersFilters: 'Wyczyść filtry',
    exportVisibleUsers: 'Eksport CSV',
    loadingUsers: 'Odświeżam użytkowników...',
    emailCopied: 'E-mail skopiowany.',
    usersExported: 'Widoczni użytkownicy wyeksportowani.',
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
    copyEmail: 'Kopiuj e-mail',
    close: 'Zamknij',
    linkedAccount: 'Powiązane konto',
    grantCredits: 'Dodaj kredyty',
    noLinkedAccount: 'Brak powiązanego konta',
    unknownEmail: 'Nieznany e-mail',
    noLinkedAccountNote: 'Ten e-mail nadawcy nie pasuje do konta QuizSolver.',
    replies: 'Odpowiedzi',
    reply: 'Odpowiedź',
    replyPlaceholder: 'Napisz pomocną odpowiedź...',
    sendReply: 'Wyślij odpowiedź',
    selectMessage: 'Wybierz wiadomość, żeby ją przeczytać i odpisać.',
    aiCache: 'Cache AI',
    parserHealth: 'Zdrowie parsera',
    parserAnalytics: 'Analityka platform',
    parserEvents: 'Eventy parsera',
    parserRecentReports: 'Ostatnie zgłoszenia parsera',
    parserFailureRate: 'Failure rate',
    parserConfidence: 'Confidence',
    parserFailures: 'Błędy',
    parserReports: 'Zgłoszenia',
    parserPlatform: 'Platforma',
    parserOutcome: 'Wynik',
    parserReason: 'Powód',
    parserSnapshot: 'Snapshot',
    parserWindow: 'Okno',
    parserQuestionsFound: 'Wykryte pytania',
    parserOptionsFound: 'Wykryte opcje',
    parserPageSnapshot: 'Snapshot strony',
    parserPageText: 'Tekst strony',
    parserPageCode: 'Kod strony',
    parserDownloadPageCode: 'Pobierz kod strony',
    parserAutoReport: 'Auto raport parsera',
    parserNoEvents: 'Brak eventów parsera.',
    clearFilteredParserEvents: 'Wyczyść filtrowane',
    clearAllParserEvents: 'Wyczyść wszystko',
    clearFilteredParserEventsConfirm: 'Usunąć eventy parsera pasujące do obecnych filtrów? Zgłoszenia użytkowników zostaną.',
    clearAllParserEventsConfirm: 'Usunąć wszystkie eventy parsera? Zgłoszenia użytkowników zostaną, ale analityka parsera się zresetuje.',
    parserEventsCleared: 'Eventy parsera wyczyszczone',
    cachedAnswers: 'Odpowiedzi w cache',
    searchCache: 'Szukaj treści pytania w cache',
    reset: 'Reset',
    clearCache: 'Wyczyść cache',
    options: 'opcji',
    hits: 'trafień',
    weakText: 'Słaba treść',
    openDetails: 'Otwórz szczegóły',
    noCacheHits: 'Brak trafień cache.',
    healthCheck: 'Stan usługi',
    billingSafety: 'Bezpieczeństwo billingowe',
    creditDedupeMonitor: 'Monitor deduplikacji kredytów',
    refreshBilling: 'Odśwież billing',
    duplicateWarning: 'Wykryto możliwe podwójnie naliczone grupy. Sprawdź od razu.',
    creditUsageLog: 'Log kredytów',
    creditUsageDescription: 'Sprawdź dokładnie co zostało naliczone, umorzone albo odrzucone dla użytkownika i pytania.',
    searchCreditUsage: 'Szukaj e-maila, treści pytania lub hasha',
    allStatuses: 'Wszystkie statusy',
    allActions: 'Wszystkie akcje',
    charged: 'Pobrano',
    claimed: 'Claim',
    waived: 'Umorzono',
    aborted: 'Przerwano',
    declined: 'Odrzucono',
    billableCredits: 'Kredyty płatne',
    creditEvent: 'Zdarzenie kredytowe',
    chargedCredits: 'Pobrane kredyty',
    noCreditUsage: 'Brak rekordów kredytów dla tego filtra.',
    viewQuestion: 'Zobacz pytanie',
    firstCharged: 'Pierwsze pobranie',
    timeSpan: 'Odstęp czasu',
    reviewInLog: 'Sprawdź w logu',
    possibleRefund: 'Zwrot?',
    duplicateReason: 'Ten sam użytkownik, akcja i pytanie naliczone w oknie kontroli.',
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
    newBugReportsWaiting: 'Nowe zgłoszenia błędów czekają',
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
    couldNotCopyEmail: 'Nie udało się skopiować adresu e-mail.',
    couldNotSendReply: 'Nie udało się wysłać odpowiedzi supportu.',
    deleteSupportConfirmPrefix: 'Usunąć wiadomość supportu od',
    unknownSender: 'nieznanego nadawcy',
    couldNotDeleteSupport: 'Nie udało się usunąć wiadomości supportu.',
    couldNotUpdateBugReport: 'Nie udało się zaktualizować zgłoszenia błędu.',
    couldNotClearParserEvents: 'Nie udało się wyczyścić eventów parsera.',
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
    <main class="admin-page-container" [class.is-auth]="isAuthed()">
      <!-- LOGIN VIEW -->
      <section class="admin-login-wrapper" *ngIf="!isAuthed(); else adminApp">
        <div class="login-card glass-morphism anim-fade-in-up">
          <a class="brand-logo" href="/" aria-label="QuizSolver home">
            <div class="logo-box">QS</div>
            <span class="logo-text">QuizSolver Admin</span>
          </a>
          <h1 class="login-title">{{ tr('adminConsole') }}</h1>
          <p class="login-subtitle">{{ tr('loginIntro') }}</p>
          
          <button class="btn-oauth" type="button" (click)="startGoogleLogin()">
            <svg class="google-icon" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {{ tr('continueGoogle') }}
          </button>
          
          <div class="divider"><span>{{ tr('or') }}</span></div>
          
          <form class="login-form" (ngSubmit)="login()">
            <div class="form-group">
              <label>{{ tr('email') }}</label>
              <input type="email" name="email" [(ngModel)]="email" autocomplete="email" class="glass-input">
            </div>
            <div class="form-group">
              <label>{{ tr('password') }}</label>
              <input type="password" name="password" [(ngModel)]="password" autocomplete="current-password" class="glass-input">
            </div>
            <div class="error-msg" *ngIf="error()">{{ error() }}</div>
            <button class="btn-primary-glow" type="submit" [disabled]="loading()">
              {{ loading() ? tr('signingIn') : tr('signIn') }}
            </button>
          </form>
        </div>
      </section>

      <!-- ADMIN APP VIEW -->
      <ng-template #adminApp>
        <div class="admin-shell">
          
          <!-- SIDEBAR -->
          <aside class="sidebar glass-panel">
            <div class="sidebar-top">
              <a class="brand-logo compact" href="/">
                <div class="logo-box">QS</div>
                <span class="logo-text">Admin</span>
              </a>
              
              <div class="quick-status-grid">
                <button type="button" class="status-btn" [class.alert]="supportBadgeCount()" (click)="setActiveTab('support')">
                  <span class="icon">📫</span>
                  <div class="info">
                    <span class="label">{{ tr('support') }}</span>
                    <strong class="value">{{ supportBadgeCount() || 0 }}</strong>
                  </div>
                </button>
                <button type="button" class="status-btn" [class.alert]="bugBadgeCount()" (click)="setActiveTab('bugs')">
                  <span class="icon">🐞</span>
                  <div class="info">
                    <span class="label">{{ tr('bugs') }}</span>
                    <strong class="value">{{ bugBadgeCount() || 0 }}</strong>
                  </div>
                </button>
                <button type="button" class="status-btn" [class.alert]="(parserHealth().summary?.failed || 0) > 0" (click)="setActiveTab('parser')">
                  <span class="icon">⚙️</span>
                  <div class="info">
                    <span class="label">{{ tr('parser') }}</span>
                    <strong class="value">{{ parserHealth().summary?.failed || 0 }}</strong>
                  </div>
                </button>
              </div>

              <nav class="nav-menu">
                <div class="nav-group" *ngFor="let group of tabGroups()">
                  <span class="group-title">{{ group.label }}</span>
                  <button class="nav-item" *ngFor="let tab of group.tabs" [class.active]="activeTab() === tab.id" (click)="setActiveTab(tab.id)">
                    <span class="nav-icon">{{ tab.short }}</span>
                    <span class="nav-label">{{ tabLabel(tab.id) }}</span>
                    <span class="nav-badge" *ngIf="tab.id === 'bugs' && bugBadgeCount()">{{ bugBadgeCount() }}</span>
                    <span class="nav-badge" *ngIf="tab.id === 'support' && supportBadgeCount()">{{ supportBadgeCount() }}</span>
                  </button>
                </div>
              </nav>
            </div>
            
            <div class="sidebar-bottom">
              <div class="lang-switch">
                <a [class.active]="adminLocale() === 'en'" [href]="adminLocaleUrl('en')">EN</a>
                <a [class.active]="adminLocale() === 'pl'" [href]="adminLocaleUrl('pl')">PL</a>
              </div>
              <button class="btn-ghost" type="button" (click)="refresh()">
                <span class="icon">🔄</span> {{ tr('refresh') }}
              </button>
              <button class="btn-ghost danger" type="button" (click)="logout()">
                <span class="icon">🚪</span> {{ tr('logout') }}
              </button>
            </div>
          </aside>

          <!-- MAIN CONTENT -->
          <main class="content-area">
            
            <!-- HEADER -->
            <header class="top-header glass-panel">
              <div class="header-titles">
                <span class="eyebrow">{{ tr('liveOperations') }}</span>
                <h2>{{ activeTabTitle() }}</h2>
                <p class="subtitle">{{ activeTabDescription() }}</p>
              </div>
              <div class="header-actions">
                <button class="btn-glass" type="button" (click)="refresh()" [disabled]="loading()">{{ tr('refresh') }}</button>
                <a class="btn-glass" [href]="adminLocale() === 'pl' ? '/pl/dashboard' : '/dashboard'">{{ tr('dashboard') }}</a>
                <a class="btn-primary-glow small" [href]="adminLocale() === 'pl' ? '/pl' : '/'">{{ tr('publicSite') }}</a>
              </div>
            </header>

            <!-- ALERTS -->
            <div class="global-alerts">
              <div class="alert-box error anim-fade-in-up" *ngIf="error()">{{ error() }}</div>
              <div class="alert-box success anim-fade-in-up" *ngIf="notice()">{{ notice() }}</div>
            </div>

            <!-- DASHBOARD WIDGETS -->
            <div class="dashboard-widgets">
              
              <!-- Priority Notices -->
              <section class="widget-card glass-panel priority-widget">
                <header class="widget-header">
                  <div>
                    <h3>{{ adminLocale() === 'pl' ? 'Kolejka Priorytetowa' : 'Priority Queue' }}</h3>
                    <p>{{ adminLocale() === 'pl' ? 'Zadania wymagające uwagi.' : 'Tasks needing attention.' }}</p>
                  </div>
                </header>
                <div class="widget-content">
                  <div class="notices-grid" *ngIf="adminNoticeCards().length; else noAdminNotices">
                    <button class="notice-card anim-hover-lift" *ngFor="let notice of adminNoticeCards()" [class.tone-warn]="notice.tone === 'warn'" [class.tone-ok]="notice.tone === 'ok'" (click)="openAdminNotice(notice)">
                      <div class="notice-value">{{ notice.value }}</div>
                      <div class="notice-label">{{ notice.label }}</div>
                      <div class="notice-note">{{ notice.note }}</div>
                    </button>
                  </div>
                  <ng-template #noAdminNotices>
                    <div class="empty-state">
                      <span class="empty-icon">✅</span>
                      <strong>{{ adminLocale() === 'pl' ? 'Wszystko w porządku' : 'All good' }}</strong>
                      <p>{{ adminLocale() === 'pl' ? 'Brak pilnych zadań.' : 'No urgent tasks.' }}</p>
                    </div>
                  </ng-template>
                </div>
              </section>

              <!-- Stats Grid -->
              <section class="widget-card glass-panel stats-widget">
                <header class="widget-header">
                  <div>
                    <h3>{{ adminLocale() === 'pl' ? 'Stan Platformy' : 'Platform Snapshot' }}</h3>
                    <p>{{ adminLocale() === 'pl' ? 'Główne wskaźniki.' : 'Key metrics overview.' }}</p>
                  </div>
                </header>
                <div class="widget-content">
                  <div class="stats-grid">
                    <div class="stat-card" *ngFor="let card of statsCards()">
                      <span class="stat-label">{{ card.label }}</span>
                      <strong class="stat-value" [class.text-revenue]="card.revenue">{{ card.value }}</strong>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- TAB CONTENT: USERS -->
            <section class="tab-content anim-fade-in" *ngIf="activeTab() === 'users'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <div>
                    <h3>{{ tr('accountsCredits') }}</h3>
                    <span class="loading-spinner" *ngIf="usersLoading()"></span>
                  </div>
                  <form class="action-bar" (ngSubmit)="loadUsers(1)">
                    <div class="search-box">
                      <span class="search-icon">🔍</span>
                      <input type="search" name="search" [(ngModel)]="userSearch" [placeholder]="tr('searchEmailName')" class="glass-input">
                    </div>
                    <select class="glass-select" name="userSort" [(ngModel)]="userSort" (ngModelChange)="loadUsers(1)">
                      <option *ngFor="let option of userSortOptions()" [value]="option.value">{{ option.label }}</option>
                    </select>
                    <button class="btn-glass" type="submit">{{ tr('search') }}</button>
                    <button class="btn-ghost" type="button" *ngIf="hasUserFilters()" (click)="resetUserFilters()">{{ tr('clearUsersFilters') }}</button>
                    <button class="btn-primary-glow small" type="button" [disabled]="!users().length" (click)="exportVisibleUsersCsv()">CSV</button>
                  </form>
                </div>

                <div class="mini-stats-row">
                  <div class="mini-stat" *ngFor="let card of usersSummaryCards()">
                    <span class="label">{{ card.label }}</span>
                    <strong class="val" [class.text-ok]="card.ok" [class.text-warn]="card.warn">{{ card.value }}</strong>
                  </div>
                </div>

                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ tr('user') }}</th>
                        <th>{{ tr('role') }}</th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('credits')" (click)="cycleUserSort('credits')">{{ tr('credits') }} <span class="indicator">{{ userSortIndicator('credits') }}</span></button></th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('questions')" (click)="cycleUserSort('questions')">{{ tr('questions') }} <span class="indicator">{{ userSortIndicator('questions') }}</span></button></th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('streak')" (click)="cycleUserSort('streak')">{{ tr('streak') }} <span class="indicator">{{ userSortIndicator('streak') }}</span></button></th>
                        <th><button class="sort-btn" [class.active]="userSortDirection('status')" (click)="cycleUserSort('status')">{{ tr('status') }} <span class="indicator">{{ userSortIndicator('status') }}</span></button></th>
                        <th class="text-right">{{ tr('actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of users()" class="table-row anim-hover" [class.banned]="user.isBanned" [class.inactive]="!user.isBanned && !isUserExtensionActive(user)">
                        <td>
                          <div class="user-identity">
                            <button class="link-btn primary" (click)="openUserHistory(user)">{{ user.email }}</button>
                            <span class="user-name">{{ user.displayName || tr('noDisplayName') }}</span>
                          </div>
                        </td>
                        <td><span class="pill role-pill">{{ user.role }}</span></td>
                        <td><strong class="hl-text">{{ user.role === 'admin' ? tr('unlimited') : user.credits }}</strong></td>
                        <td><strong class="hl-text">{{ user.stats?.totalQuestionsSolved || 0 }}</strong></td>
                        <td><strong class="hl-text">{{ user.streak?.current || 0 }}</strong></td>
                        <td>
                          <div class="status-cell">
                            <span class="pill status-pill" [class.danger]="user.isBanned" [class.pending]="!user.isBanned && !user.isExtensionActive">{{ userStatusLabel(user) }}</span>
                            <small class="sub-text">{{ userExtensionLastSeen(user) }}</small>
                          </div>
                        </td>
                        <td class="text-right">
                          <div class="action-buttons">
                            <button class="btn-icon" (click)="openUserHistory(user)" title="History">🕒</button>
                            <button class="btn-icon" (click)="copyUserEmail(user)" title="Copy Email">📋</button>
                            <button class="btn-tiny" (click)="quickGrant(user.id, 50)">+50</button>
                            <button class="btn-tiny" (click)="quickGrant(user.id, 100)">+100</button>
                            <button class="btn-icon text-accent" (click)="openGrantModal(user)" title="Grant">🎁</button>
                            <button class="btn-icon" [class.text-danger]="!user.isBanned" [class.text-success]="user.isBanned" (click)="user.isBanned ? unbanUser(user.id) : banUser(user.id)" [title]="user.isBanned ? tr('unban') : tr('ban')">
                              {{ user.isBanned ? '✅' : '🚫' }}
                            </button>
                            <button class="btn-icon text-danger" *ngIf="user.role !== 'admin'" (click)="deleteUser(user.id, user.email)" title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!users().length">
                        <td colspan="7">
                          <div class="empty-state">{{ tr('noUsers') }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div class="pagination-bar" *ngIf="pagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of pageNumbers()" [class.active]="page === pagination().page" (click)="loadUsers(page)">{{ page }}</button>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: PURCHASES -->
            <section class="tab-content anim-fade-in" *ngIf="activeTab() === 'purchases'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('purchasesTitle') }}</h3>
                </div>
                <div class="table-container">
                  <table class="data-table">
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
                      <tr *ngFor="let purchase of purchases()" class="table-row anim-hover">
                        <td><strong>{{ purchase.user || tr('unknownUser') }}</strong></td>
                        <td><span class="pill">{{ purchase.pack }}</span></td>
                        <td><strong class="hl-text">+{{ purchase.credits }}</strong></td>
                        <td><strong class="text-success">{{ purchase.priceUsd ? formatMoney(purchase.priceUsd) : '-' }}</strong></td>
                        <td><span class="sub-text uppercase">{{ purchase.provider }}</span></td>
                        <td>
                          <div class="status-cell">
                            <span class="pill status-pill" [class.pending]="!purchase.creditsApplied">{{ purchase.creditsApplied ? tr('applied') : tr('pending') }}</span>
                            <button class="link-btn primary small" *ngIf="!purchase.creditsApplied" (click)="applyPurchaseCredits(purchase.id)">{{ tr('apply') }}</button>
                          </div>
                        </td>
                        <td>{{ purchase.reason || '-' }}</td>
                        <td><span class="sub-text">{{ formatDate(purchase.date) }}</span></td>
                      </tr>
                      <tr *ngIf="!purchases().length">
                        <td colspan="8"><div class="empty-state">{{ tr('noPurchases') }}</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: BUGS -->
            <section class="tab-content anim-fade-in" *ngIf="activeTab() === 'bugs'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('bugsTitle') }}</h3>
                  <button class="btn-glass" *ngIf="bugBadgeCount()" (click)="markAllBugReportsRead()">{{ tr('markAllRead') }}</button>
                </div>
                <div class="list-grid">
                  <article class="report-card glass-card anim-hover-lift" *ngFor="let bug of bugs()" [class.unread]="!bug.isRead">
                    <div class="card-head">
                      <div class="card-title">
                        <strong>{{ bug.user || tr('unknownUser') }}</strong>
                        <span class="pill danger" *ngIf="!bug.isRead">{{ tr('unreadBugs') }}</span>
                        <span class="pill pending" *ngIf="bug.source === 'parser-auto'">{{ tr('parserAutoReport') }}</span>
                      </div>
                      <div class="card-actions">
                        <span class="sub-text">{{ formatDate(bug.date) }}</span>
                        <button class="btn-tiny" *ngIf="!bug.isRead" (click)="markBugReportRead(bug)">{{ tr('markRead') }}</button>
                      </div>
                    </div>
                    <a class="report-url primary-link" [href]="bug.url" target="_blank" rel="noopener">{{ bug.url }}</a>
                    <p class="report-desc" *ngIf="bug.description">{{ bug.description }}</p>
                    
                    <div class="chips-row" *ngIf="bug.platform || bug.parserDiagnostics?.outcome || bug.hasPageCode">
                      <span class="chip" *ngIf="bug.platform">{{ bug.platform }}</span>
                      <span class="chip" *ngIf="bug.parserDiagnostics?.outcome">{{ bug.parserDiagnostics.outcome }}</span>
                      <span class="chip success" *ngIf="bug.hasPageCode">{{ tr('parserPageCode') }}</span>
                    </div>

                    <details class="code-details" *ngIf="bug.parserSnapshot?.bodyText || bug.parserSnapshot?.htmlSnippet || bug.parserSnapshot?.fullHtmlFile?.id">
                      <summary class="link-btn primary">{{ tr('parserPageSnapshot') }}</summary>
                      <div class="code-blocks">
                        <button class="btn-glass small download-btn" *ngIf="bug.parserSnapshot?.fullHtmlFile?.id" (click)="downloadParserSnapshotFile(bug.parserSnapshot.fullHtmlFile)">
                          ⬇️ {{ tr('parserDownloadPageCode') }} ({{ formatBytes(bug.parserSnapshot.fullHtmlFile.bytes) }})
                        </button>
                        <div class="code-pane" *ngIf="bug.parserSnapshot?.bodyText">
                          <strong>{{ tr('parserPageText') }}</strong>
                          <pre>{{ bug.parserSnapshot.bodyText }}</pre>
                        </div>
                        <div class="code-pane" *ngIf="bug.parserSnapshot?.htmlSnippet">
                          <strong>{{ tr('parserPageCode') }}</strong>
                          <pre>{{ bug.parserSnapshot.htmlSnippet }}</pre>
                        </div>
                      </div>
                    </details>
                  </article>
                  <div class="empty-state" *ngIf="!bugs().length">{{ tr('noBugReports') }}</div>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: SUPPORT -->
            <section class="tab-content anim-fade-in support-tab" *ngIf="activeTab() === 'support'">
              
              <div class="support-stats-row">
                <div class="mini-stat glass-panel" *ngFor="let item of supportSummaryCards()" [class.tone-warn]="item.tone === 'warn'" [class.tone-ok]="item.tone === 'ok'">
                  <span class="label">{{ item.label }}</span>
                  <strong class="val">{{ item.value }}</strong>
                </div>
              </div>

              <div class="support-layout">
                <!-- Inbox List -->
                <div class="inbox-list glass-panel">
                  <form class="inbox-search" (ngSubmit)="loadSupportMessages()">
                    <input type="search" name="supportSearch" [(ngModel)]="supportSearch" [placeholder]="tr('searchSupport')" class="glass-input">
                    <select name="supportStatusFilter" [(ngModel)]="supportStatusFilter" class="glass-select">
                      <option value="">{{ tr('allMessages') }}</option>
                      <option value="open">{{ tr('open') }}</option>
                      <option value="pending">{{ tr('pending') }}</option>
                      <option value="closed">{{ tr('closed') }}</option>
                    </select>
                    <button class="btn-glass" type="submit">🔍</button>
                  </form>
                  <div class="messages-scroll">
                    <button class="msg-item anim-hover" *ngFor="let message of filteredSupportMessages()" [class.active]="selectedSupportMessage()?.id === message.id" [class.unread]="!message.isRead" (click)="selectSupportMessage(message)">
                      <div class="msg-avatar">{{ supportInitials(message) }}</div>
                      <div class="msg-content">
                        <div class="msg-row">
                          <strong class="msg-subject">{{ message.subject || tr('noSubject') }}</strong>
                          <span class="pill status-pill tiny" [class.danger]="message.status === 'open'" [class.pending]="message.status === 'pending'">{{ supportStatusLabel(message.status) }}</span>
                        </div>
                        <span class="msg-sender">{{ supportSender(message) }}</span>
                        <span class="msg-preview">{{ supportPreview(message) }}</span>
                        <div class="msg-meta">
                          <span class="chip tiny" *ngIf="message.linkedUser">{{ message.linkedUser.credits }} cr</span>
                          <small>{{ formatDate(message.receivedAt) }}</small>
                        </div>
                      </div>
                    </button>
                    <div class="empty-state" *ngIf="!filteredSupportMessages().length">{{ tr('noSupport') }}</div>
                  </div>
                </div>

                <!-- Inbox Detail -->
                <div class="inbox-detail glass-panel" *ngIf="selectedSupportMessage(); else emptyInboxDetail">
                  <header class="detail-header">
                    <div class="header-main">
                      <span class="pill source-pill">{{ supportSourceLabel(selectedSupportMessage()?.source) }}</span>
                      <h3>{{ selectedSupportMessage()?.subject || tr('noSubject') }}</h3>
                      <div class="meta-grid">
                        <div class="meta-item"><span>{{ tr('from') }}</span> <strong>{{ supportSender(selectedSupportMessage()) }} &lt;{{ selectedSupportMessage()?.fromEmail || '-' }}&gt;</strong></div>
                        <div class="meta-item"><span>{{ tr('to') }}</span> <strong>{{ selectedSupportMessage()?.toEmail || 'support@getquizsolver.com' }}</strong></div>
                        <div class="meta-item"><span>{{ tr('received') }}</span> <strong>{{ formatDate(selectedSupportMessage()?.receivedAt) }}</strong></div>
                      </div>
                    </div>
                    <div class="header-actions">
                      <a class="btn-icon" [href]="supportMailto(selectedSupportMessage())" title="Email">📧</a>
                      <button class="btn-icon" (click)="copySupportEmail(selectedSupportMessage())" title="Copy">📋</button>
                      <div class="btn-group">
                        <button class="btn-glass small" (click)="updateSupportStatus(selectedSupportMessage(), 'open')">{{ tr('open') }}</button>
                        <button class="btn-glass small" (click)="updateSupportStatus(selectedSupportMessage(), 'pending')">{{ tr('pending') }}</button>
                        <button class="btn-glass small" (click)="updateSupportStatus(selectedSupportMessage(), 'closed')">{{ tr('close') }}</button>
                      </div>
                      <button class="btn-icon text-danger" (click)="deleteSupportMessage(selectedSupportMessage())" title="Delete">🗑️</button>
                    </div>
                  </header>

                  <div class="linked-user-card" *ngIf="selectedSupportMessage()?.linkedUser as linkedUser; else noLinkedSupportUser">
                    <div class="user-info">
                      <span class="sub-text">{{ tr('linkedAccount') }}</span>
                      <button class="link-btn primary large" (click)="openUserHistory(linkedUser)">{{ linkedUser.email }}</button>
                      <div class="user-badges">
                        <span class="pill">{{ linkedUser.role }}</span>
                        <span class="pill success">{{ linkedUser.credits }} {{ tr('credits') }}</span>
                        <span class="pill info">{{ linkedUser.stats?.totalQuestionsSolved || 0 }} {{ tr('questions') }}</span>
                      </div>
                    </div>
                    <div class="user-actions">
                      <button class="btn-primary-glow small" (click)="openGrantModal(linkedUser, tr('supportAdjustment'))">{{ tr('grantCredits') }}</button>
                      <button class="btn-ghost small" [class.text-danger]="!linkedUser.isBanned" [class.text-success]="linkedUser.isBanned" (click)="linkedUser.isBanned ? unbanUser(linkedUser.id) : banUser(linkedUser.id)">
                        {{ linkedUser.isBanned ? tr('unban') : tr('ban') }}
                      </button>
                    </div>
                  </div>
                  <ng-template #noLinkedSupportUser>
                    <div class="linked-user-card empty">
                      <div class="user-info">
                        <span class="sub-text">{{ tr('noLinkedAccount') }}</span>
                        <strong class="text-danger">{{ selectedSupportMessage()?.fromEmail || tr('unknownEmail') }}</strong>
                        <p class="sub-text">{{ tr('noLinkedAccountNote') }}</p>
                      </div>
                    </div>
                  </ng-template>

                  <div class="message-body">
                    <p *ngFor="let paragraph of supportParagraphs(selectedSupportMessage()?.text)">{{ paragraph }}</p>
                  </div>

                  <div class="replies-section" *ngIf="(selectedSupportMessage()?.replies || []).length">
                    <h4>{{ tr('replies') }}</h4>
                    <div class="reply-card" *ngFor="let reply of selectedSupportMessage()?.replies">
                      <div class="reply-head">
                        <strong>{{ reply.admin }}</strong>
                        <span class="sub-text">{{ formatDate(reply.sentAt) }} • {{ reply.delivery }}</span>
                      </div>
                      <div class="reply-body">
                        <p *ngFor="let p of supportParagraphs(reply.text)">{{ p }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="reply-composer">
                    <h4>{{ tr('reply') }}</h4>
                    <textarea class="glass-input" rows="4" [placeholder]="tr('replyPlaceholder')" [(ngModel)]="supportReplyText"></textarea>
                    <button class="btn-primary-glow" [disabled]="!supportReplyText.trim()" (click)="sendSupportReply(selectedSupportMessage())">{{ tr('sendReply') }}</button>
                  </div>
                </div>
                <ng-template #emptyInboxDetail>
                  <div class="inbox-detail glass-panel flex-center">
                    <div class="empty-state">
                      <span class="empty-icon">✉️</span>
                      <p>{{ tr('selectMessage') }}</p>
                    </div>
                  </div>
                </ng-template>
              </div>
            </section>

            <!-- TAB CONTENT: CACHE -->
            <section class="tab-content anim-fade-in cache-tab" *ngIf="activeTab() === 'cache'">
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('cacheTitle') }}</h3>
                </div>
                <div class="mini-stats-row">
                  <div class="mini-stat">
                    <span class="label">{{ tr('allStoredCacheRecords') }}</span>
                    <strong class="val text-accent">{{ formatNumber(cachePagination().total || 0) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span class="label">{{ tr('matchingCurrentSearch') }}</span>
                    <strong class="val text-accent">{{ formatNumber(cachePagination().filteredTotal || 0) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span class="label">{{ tr('currentCachePageTotal') }}</span>
                    <strong class="val">{{ formatNumber(cacheEntries().length) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span class="label">{{ tr('hitsOnPage') }}</span>
                    <strong class="val">{{ formatNumber(cacheHitsOnPage()) }}</strong>
                  </div>
                </div>
                
                <form class="action-bar" (ngSubmit)="loadCache(1)">
                  <div class="search-box stretch">
                    <span class="search-icon">🔍</span>
                    <input type="search" name="cacheSearch" [(ngModel)]="cacheSearch" [placeholder]="tr('searchCache')" class="glass-input">
                  </div>
                  <select name="cacheSort" [(ngModel)]="cacheSort" (ngModelChange)="loadCache(1)" class="glass-select">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="hits_desc">Most Hits</option>
                    <option value="weak">Weak</option>
                  </select>
                  <button class="btn-primary-glow small" type="submit">{{ tr('search') }}</button>
                  <button class="btn-ghost text-danger" type="button" (click)="clearCache()">{{ 'Clear' }}</button>
                </form>

                <div class="grid-list">
                  <article class="grid-card glass-card anim-hover-lift" *ngFor="let entry of cacheEntries()">
                    <div class="card-head">
                      <span class="pill type-pill uppercase">{{ entry.questionType }}</span>
                      <div class="card-actions">
                        <span class="chip success">🔥 {{ entry.hitCount || 0 }}</span>
                        <button class="btn-icon text-danger" (click)="deleteCacheEntry(entry)" title="Delete">🗑️</button>
                      </div>
                    </div>
                    <strong class="card-title">{{ entry.questionText }}</strong>
                    <div class="meta-row">
                      <span class="hash-text">{{ shortHash(entry.questionHash) }}</span>
                      <span class="date-text">{{ formatDate(entry.createdAt) }}</span>
                    </div>
                    <div class="answer-box">
                      <span class="answer-label">A:</span>
                      <span class="answer-text">{{ entry.answerText }}</span>
                    </div>
                  </article>
                  <div class="empty-state" *ngIf="!cacheEntries().length">No Cache Entries</div>
                </div>

                <div class="pagination-bar" *ngIf="cachePagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of cachePageNumbers()" [class.active]="page === cachePagination().page" (click)="loadCache(page)">{{ page }}</button>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: PARSER -->
            <section class="tab-content anim-fade-in parser-tab" *ngIf="activeTab() === 'parser'">
              
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ 'Parser Health' }}</h3>
                  <button class="btn-glass" (click)="clearParserEvents()">{{ 'Clear' }}</button>
                </div>
                <div class="mini-stats-row">
                  <div class="mini-stat" *ngFor="let s of parserHealthCards()">
                    <span class="label">{{ s.label }}</span>
                    <strong class="val" [class.text-ok]="s.ok" [class.text-warn]="s.warn" >{{ s.value }}</strong>
                  </div>
                </div>

                <form class="action-bar" (ngSubmit)="loadParserEvents(1)">
                  <select name="parserPlatform" [(ngModel)]="parserFilterPlatform" (ngModelChange)="loadParserEvents(1)" class="glass-select stretch">
                    <option value="">{{ 'All Platforms' }}</option>
                    <option *ngFor="let p of parserPlatformRows()" [value]="p">{{ p }}</option>
                  </select>
                  <select name="parserOutcome"  (ngModelChange)="loadParserEvents(1)" class="glass-select stretch">
                    <option value="">{{ 'All Outcomes' }}</option>
                    <option value="ok">{{ 'OK' }}</option>
                    <option value="weak">{{ 'Weak' }}</option>
                    <option value="empty">{{ 'Empty' }}</option>
                    <option value="error">{{ 'Error' }}</option>
                  </select>
                  <button class="btn-primary-glow small" type="submit">{{ tr('filter') }}</button>
                </form>

                <div class="list-grid single-col">
                  <article class="report-card glass-card anim-hover" *ngFor="let event of parserEvents()">
                    <div class="card-head">
                      <div class="card-title">
                        <strong class="uppercase text-accent">{{ event.platform || 'unknown' }}</strong>
                        <span class="sub-text ml-2">{{ parserHost(event) }}</span>
                      </div>
                      <span class="pill status-pill" [class.ok]="parserOutcomeTone(event.outcome) === 'ok'" [class.pending]="parserOutcomeTone(event.outcome) === 'pending'" [class.danger]="parserOutcomeTone(event.outcome) === 'danger'">{{ event.outcome || '-' }}</span>
                    </div>
                    <p class="report-desc text-warn" *ngIf="event.reason">{{ event.reason }}</p>
                    <p class="report-desc">{{ parserEventPreview(event) }}</p>
                    
                    <div class="chips-row">
                      <span class="chip">{{ formatPercent(event.confidence || 0) }} conf</span>
                      <span class="chip">{{ formatNumber(event.questionCount || 0) }} q's</span>
                      <span class="chip">{{ formatNumber(event.optionCount || 0) }} opts</span>
                      <span class="chip success" *ngIf="event.hasPageCode">HTML</span>
                      <span class="chip">{{ formatDate(event.createdAt) }}</span>
                      <a class="primary-link parser-url" [href]="event.url" target="_blank" rel="noopener">{{ shortUrl(event.url) }}</a>
                    </div>

                    <details class="code-details mt-3" *ngIf="event.snapshot?.bodyText || event.snapshot?.htmlSnippet || event.snapshot?.fullHtmlFile?.id">
                      <summary class="link-btn primary">{{ tr('parserPageSnapshot') }}</summary>
                      <div class="code-blocks">
                        <button class="btn-glass small download-btn" *ngIf="event.snapshot?.fullHtmlFile?.id" (click)="downloadParserSnapshotFile(event.snapshot.fullHtmlFile)">
                          ⬇️ {{ tr('parserDownloadPageCode') }} ({{ formatBytes(event.snapshot.fullHtmlFile.bytes) }})
                        </button>
                        <div class="code-pane" *ngIf="event.snapshot?.bodyText">
                          <strong>{{ tr('parserPageText') }}</strong>
                          <pre>{{ event.snapshot.bodyText }}</pre>
                        </div>
                        <div class="code-pane" *ngIf="event.snapshot?.htmlSnippet">
                          <strong>{{ tr('parserPageCode') }}</strong>
                          <pre>{{ event.snapshot.htmlSnippet }}</pre>
                        </div>
                      </div>
                    </details>
                  </article>
                  <div class="empty-state" *ngIf="!parserEvents().length">{{ tr('parserNoEvents') }}</div>
                </div>
                
                <div class="pagination-bar" *ngIf="parserEventsPagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of parserEventPageNumbers()" [class.active]="page === parserEventsPagination().page" (click)="loadParserEvents(page)">{{ page }}</button>
                </div>
              </div>

              <!-- Parser Reports (Bugs) -->
              <div class="section-card glass-panel" *ngIf="(parserHealth().recentBugReports || []).length">
                <div class="section-header">
                  <h3>{{ tr('parserRecentReports') }}</h3>
                </div>
                <div class="list-grid single-col">
                  <article class="report-card glass-card anim-hover" *ngFor="let report of parserHealth().recentBugReports">
                    <p class="report-desc bold">{{ report.parserSnapshot?.questionTexts?.[0] || report.parserDiagnostics?.reason || report.url }}</p>
                    <div class="chips-row">
                      <span class="chip uppercase">{{ report.platform || 'unknown' }}</span>
                      <span class="chip pending" *ngIf="report.source === 'parser-auto'">{{ tr('parserAutoReport') }}</span>
                      <span class="chip">{{ formatPercent(report.parserDiagnostics?.confidence || 0) }} conf</span>
                      <span class="chip success" *ngIf="report.hasPageCode">HTML</span>
                      <span class="chip">{{ formatDate(report.date) }}</span>
                    </div>
                    <a class="primary-link parser-url" [href]="report.url" target="_blank" rel="noopener">{{ shortUrl(report.url) }}</a>
                  </article>
                </div>
              </div>
            </section>

            <!-- TAB CONTENT: SYSTEM -->
            <section class="tab-content anim-fade-in system-tab" *ngIf="activeTab() === 'system'">
              
              <div class="section-card glass-panel">
                <div class="section-header">
                  <h3>{{ tr('healthCheck') }}</h3>
                </div>
                <div class="stats-grid large">
                  <div class="stat-card" *ngFor="let item of healthCards()">
                    <span class="stat-label uppercase">{{ item.label }}</span>
                    <strong class="stat-value text-accent" [class.text-ok]="item.ok">{{ item.value }}</strong>
                  </div>
                </div>
              </div>

              <div class="section-card glass-panel mt-4">
                <div class="section-header">
                  <div>
                    <h3>{{ tr('creditDedupeMonitor') }}</h3>
                    <p class="subtitle">{{ tr('billingSafety') }}</p>
                  </div>
                  <button class="btn-glass" (click)="loadBillingSafety()">{{ tr('refreshBilling') }}</button>
                </div>

                <div class="stats-grid">
                  <div class="stat-card" *ngFor="let item of billingSafetyCards()">
                    <span class="stat-label uppercase">{{ item.label }}</span>
                    <strong class="stat-value" [class.text-ok]="item.ok">{{ item.value }}</strong>
                  </div>
                </div>

                <div class="alert-box error mt-4" *ngIf="(billingSafety().duplicateGroups || []).length">
                  {{ tr('duplicateWarning') }}
                </div>

                <div class="table-container mt-4" *ngIf="(billingSafety().duplicateGroups || []).length">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ tr('user') }}</th>
                        <th>{{ tr('questionText') }}</th>
                        <th>{{ tr('charges') }}</th>
                        <th>{{ tr('actions') }}</th>
                        <th>{{ tr('lastCharged') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let group of billingSafety().duplicateGroups" class="table-row">
                        <td>
                          <button class="link-btn primary" *ngIf="group.userId" (click)="openUserHistory({ id: group.userId, email: group.email || group.userId })">{{ group.email || group.userId }}</button>
                          <strong *ngIf="!group.userId">{{ group.email || tr('unknownUser') }}</strong>
                        </td>
                        <td>
                          <strong>{{ group.questionText || shortHash(group.questionHash) }}</strong>
                          <span class="sub-text block" *ngIf="group.answerText">A: {{ group.answerText }}</span>
                          <span class="sub-text block text-warn">Hash: {{ shortHash(group.questionHash) }}</span>
                        </td>
                        <td>
                          <strong class="hl-text text-danger">{{ group.count }} / {{ group.credits }} cr</strong>
                          <span class="sub-text block">{{ tr('timeSpan') }}: {{ formatDurationMs(group.spanMs) }}</span>
                        </td>
                        <td>
                          <strong>{{ group.action || (group.actions || []).join(', ') }}</strong>
                        </td>
                        <td>
                          <strong>{{ formatDate(group.lastChargedAt) }}</strong>
                          <div class="action-buttons mt-2">
                            <button class="btn-glass small" (click)="reviewDuplicateGroup(group)">{{ tr('reviewInLog') }}</button>
                            <button class="btn-primary-glow small" *ngIf="group.userId" (click)="openGrantModal({ id: group.userId, email: group.email || group.userId }, tr('possibleRefund'))">Refund</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Credit Usage Log -->
              <div class="section-card glass-panel mt-4">
                <div class="section-header">
                  <div>
                    <h3>{{ tr('creditUsageLog') }}</h3>
                    <p class="subtitle">{{ tr('creditEvent') }}</p>
                  </div>
                  <button class="btn-glass" (click)="loadBillingUsage(1)">{{ tr('refresh') }}</button>
                </div>
                
                <form class="action-bar" (ngSubmit)="loadBillingUsage(1)">
                  <div class="search-box stretch">
                    <span class="search-icon">🔍</span>
                    <input type="search" [(ngModel)]="billingUsageSearch" name="billingUsageSearch" [placeholder]="tr('searchCreditUsage')" class="glass-input">
                  </div>
                  <select [(ngModel)]="billingUsageStatus" name="billingUsageStatus" class="glass-select stretch">
                    <option value="">{{ tr('allStatuses') }}</option>
                    <option value="charged">{{ tr('charged') }}</option>
                    <option value="claimed">{{ tr('claimed') }}</option>
                    <option value="waived">{{ tr('waived') }}</option>
                    <option value="aborted">{{ tr('aborted') }}</option>
                    <option value="declined">{{ tr('declined') }}</option>
                  </select>
                  <select [(ngModel)]="billingUsageAction" name="billingUsageAction" class="glass-select stretch">
                    <option value="">{{ tr('allActions') }}</option>
                    <option value="solve">solve</option>
                    <option value="solve-snapshot">solve-snapshot</option>
                    <option value="explain">explain</option>
                    <option value="follow-up">follow-up</option>
                  </select>
                  <button class="btn-primary-glow small" type="submit">{{ tr('search') }}</button>
                </form>

                <div class="mini-stats-row">
                  <div class="mini-stat"><span class="label">{{ tr('visibleEntries') }}</span><strong class="val">{{ formatNumber(billingUsagePagination().total || 0) }}</strong></div>
                  <div class="mini-stat"><span class="label">{{ tr('charged') }}</span><strong class="val text-ok">{{ formatNumber(billingUsageSummary().chargedRecords || 0) }}</strong></div>
                  <div class="mini-stat"><span class="label">{{ tr('chargedCredits') }}</span><strong class="val text-ok">{{ formatNumber(billingUsageSummary().chargedCredits || 0) }}</strong></div>
                </div>

                <div class="table-container mt-4">
                  <table class="data-table">
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
                      <tr *ngFor="let item of billingUsageRows()" class="table-row">
                        <td>
                          <strong>{{ item.questionText }}</strong>
                          <span class="sub-text block" *ngIf="item.answerText">A: {{ item.answerText }}</span>
                          <span class="sub-text block text-warn">{{ item.questionType || item.action }} - {{ shortHash(item.questionHash) }}</span>
                        </td>
                        <td>
                          <button class="link-btn primary block text-left" *ngIf="item.userId" (click)="openUserHistory({ id: item.userId, email: item.email })">{{ item.email }}</button>
                          <strong *ngIf="!item.userId">{{ item.email }}</strong>
                          <span class="sub-text block" *ngIf="item.displayName">{{ item.displayName }}</span>
                        </td>
                        <td>
                          <span class="pill status-pill" [class.ok]="creditUsageStatusClass(item.status) === 'ok'" [class.pending]="creditUsageStatusClass(item.status) === 'pending'" [class.danger]="creditUsageStatusClass(item.status) === 'danger'">{{ creditUsageStatusLabel(item.status) }}</span>
                          <span class="block mt-1">{{ item.action }}</span>
                          <span class="sub-text block text-danger" *ngIf="item.waivedReason">{{ item.waivedReason }}</span>
                        </td>
                        <td>
                          <strong class="hl-text text-accent">{{ item.creditsCharged || 0 }}</strong>
                          <span class="sub-text block">{{ tr('billableCredits') }}: {{ item.credits || 0 }}</span>
                        </td>
                        <td>{{ formatDate(item.time) }}</td>
                        <td>
                          <button class="btn-glass small" (click)="showQuestionDetails(item)">{{ tr('viewQuestion') }}</button>
                        </td>
                      </tr>
                      <tr *ngIf="!billingUsageRows().length">
                        <td colspan="6"><div class="empty-state">{{ tr('noCreditUsage') }}</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="pagination-bar" *ngIf="billingUsagePagination().pages > 1">
                  <button class="page-btn" *ngFor="let page of billingUsagePageNumbers()" [class.active]="page === billingUsagePagination().page" (click)="loadBillingUsage(page)">{{ page }}</button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </ng-template>

      <!-- OVERLAYS & MODALS -->
      <!-- Question Detail Modal -->
      <div class="modal-backdrop" *ngIf="selectedQuestion()" (click)="selectedQuestion.set(null)">
        <div class="modal-card glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ tr('questionDetails') }}</h3>
            <div class="action-buttons">
              <button class="btn-icon text-danger" *ngIf="selectedQuestion()?.cacheId" (click)="deleteCacheEntry(selectedQuestion())" title="Delete from Cache">🗑️</button>
              <button class="btn-icon" (click)="selectedQuestion.set(null)">❌</button>
            </div>
          </header>
          <div class="modal-body">
            <div class="detail-row">
              <span class="label">{{ tr('type') }}</span>
              <span class="pill uppercase">{{ selectedQuestion()?.questionType }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedQuestion()?.hitCount != null">
              <span class="label">{{ tr('cacheHits') }}</span>
              <strong class="val text-accent">{{ selectedQuestion()?.hitCount }}</strong>
            </div>
            <div class="detail-row">
              <span class="label">{{ tr('questionText') }}</span>
              <div class="detail-box">{{ selectedQuestion()?.questionText }}</div>
            </div>
            <div class="detail-row" *ngIf="selectedQuestion()?.answerText">
              <span class="label">{{ 'Answer' }}</span>
              <div class="detail-box highlight">{{ selectedQuestion()?.answerText }}</div>
            </div>
            <div class="detail-row" *ngIf="(selectedQuestion()?.options || []).length">
              <span class="label">{{ tr('options') }}</span>
              <ul class="options-list">
                <li *ngFor="let opt of selectedQuestion()?.options">{{ opt }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- User History Modal -->
      <div class="modal-backdrop" *ngIf="selectedUserHistory()" (click)="selectedUserHistory.set(null)">
        <div class="modal-card large glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ 'History for' }} <span class="text-accent">{{ selectedUserHistory()?.email }}</span></h3>
            <button class="btn-icon" (click)="selectedUserHistory.set(null)">❌</button>
          </header>
          <div class="modal-body">
            <div class="loading-spinner center" *ngIf="false"></div>
            
            <ng-container *ngIf="true">
              <h4 class="mt-0">{{ 'Questions' }}</h4>
              <div class="table-container" style="max-height: 300px;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>{{ tr('date') }}</th>
                      <th>{{ tr('questionText') }}</th>
                      <th>{{ tr('type') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let q of userQuestions()">
                      <td style="white-space:nowrap">{{ formatDate(q.createdAt) }}</td>
                      <td>{{ q.questionText }}</td>
                      <td><span class="pill tiny">{{ q.questionType }}</span></td>
                    </tr>
                    <tr *ngIf="!(userQuestions() || []).length">
                      <td colspan="3"><div class="empty-state tiny">{{ tr('noSolvedQuestions') }}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Grant Credits Modal -->
      <div class="modal-backdrop" *ngIf="selectedGrantUser()" (click)="closeGrantModal()">
        <div class="modal-card small glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ tr('grantCredits') }}</h3>
            <button class="btn-icon" (click)="closeGrantModal()">❌</button>
          </header>
          <div class="modal-body">
            <p class="sub-text text-center">{{ selectedGrantUser()?.email }}</p>
            <form class="grant-form mt-4" (ngSubmit)="grantCustomCredits()">
              <div class="form-group">
                <label>{{ 'Amount' }}</label>
                <input type="number" name="amount" [(ngModel)]="grantAmount" class="glass-input" required min="1">
              </div>
              <div class="form-group">
                <label>{{ tr('reason') }}</label>
                <input type="text" name="reason" [(ngModel)]="grantReason" class="glass-input" required>
              </div>
              <button class="btn-primary-glow full-width mt-4" type="submit" [disabled]="loading()">
                {{ loading() ? '...' : tr('grantCredits') }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Admin Notice Modal -->
      <div class="modal-backdrop" *ngIf="selectedNotice()" (click)="selectedNotice.set(null)">
        <div class="modal-card small glass-panel anim-zoom-in" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ selectedNotice()?.label }}</h3>
            <button class="btn-icon" (click)="selectedNotice.set(null)">❌</button>
          </header>
          <div class="modal-body flex-center col">
            <strong class="mega-val" [class.text-warn]="selectedNotice()?.tone === 'warn'" [class.text-ok]="selectedNotice()?.tone === 'ok'">{{ selectedNotice()?.value }}</strong>
            <p class="text-center mt-3">{{ selectedNotice()?.note }}</p>
            <button class="btn-glass mt-4" (click)="handleNoticeAction(selectedNotice()!); selectedNotice.set(null)">
              {{ '' }}
            </button>
          </div>
        </div>
      </div>

    </main>
  `,  styles: [`
    /* 
      QuizSolver Admin Redesign
      Theme: Dark Glassmorphism
    */
    :host {
      --bg-color: #0b0f19;
      --bg-glass: rgba(18, 25, 43, 0.6);
      --bg-glass-hover: rgba(28, 38, 63, 0.8);
      --border-glass: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.4);
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
      
      display: block;
      min-height: 100vh;
      background-color: var(--bg-color);
      background-image: 
        radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    }

    * { box-sizing: border-box; }
    
    a { color: var(--accent); text-decoration: none; transition: 0.2s; }
    a:hover { filter: brightness(1.2); }
    
    button { cursor: pointer; border: none; background: none; color: inherit; font: inherit; transition: 0.2s; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    /* UTILITIES */
    .mt-0 { margin-top: 0; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .uppercase { text-transform: uppercase; letter-spacing: 0.05em; }
    .flex-center { display: flex; align-items: center; justify-content: center; }
    .col { flex-direction: column; }
    .full-width { width: 100%; }
    .block { display: block; }
    
    .text-accent { color: var(--accent); }
    .text-success { color: var(--success); }
    .text-danger { color: var(--danger); }
    .text-warn { color: var(--warning); }
    .text-ok { color: var(--success); }
    
    .hl-text { font-weight: 700; letter-spacing: -0.02em; }
    .sub-text { color: var(--text-muted); font-size: 0.85rem; }

    /* ANIMATIONS */
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    
    .anim-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-fade-in { animation: fadeIn 0.3s ease forwards; }
    .anim-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .anim-hover { transition: all 0.2s ease; }
    .anim-hover:hover { background-color: var(--bg-glass-hover); }
    .anim-hover-lift { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .anim-hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); background-color: var(--bg-glass-hover); border-color: rgba(255,255,255,0.15); }

    /* GLASS COMPONENTS */
    .glass-panel, .glass-card {
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border-glass);
      border-radius: 16px;
    }
    
    .glass-input, .glass-select {
      background: rgba(0,0,0,0.2);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      color: var(--text-main);
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
      transition: 0.2s;
      outline: none;
    }
    .glass-input:focus, .glass-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
    .glass-select option { background: var(--bg-color); }

    /* BUTTONS */
    .btn-primary-glow {
      background: var(--accent);
      color: #000;
      font-weight: 600;
      border-radius: 8px;
      padding: 0.6rem 1.25rem;
      box-shadow: 0 0 15px var(--accent-glow);
    }
    .btn-primary-glow:hover { box-shadow: 0 0 25px var(--accent-glow); transform: scale(1.02); }
    .btn-primary-glow.small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    
    .btn-glass {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      font-weight: 500;
    }
    .btn-glass:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
    .btn-glass.small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    
    .btn-ghost { padding: 0.6rem 1rem; border-radius: 8px; font-weight: 500; color: var(--text-muted); }
    .btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
    .btn-ghost.danger:hover { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
    .btn-ghost.small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    
    .btn-icon { width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid transparent; }
    .btn-icon:hover { background: rgba(255,255,255,0.1); border-color: var(--border-glass); transform: scale(1.1); }
    .btn-tiny { font-size: 0.75rem; padding: 0.2rem 0.4rem; background: rgba(255,255,255,0.1); border-radius: 4px; font-weight: 600; }
    .btn-tiny:hover { background: rgba(255,255,255,0.2); }
    
    .link-btn { color: var(--accent); font-weight: 500; }
    .link-btn:hover { text-decoration: underline; }
    .link-btn.large { font-size: 1.1rem; }

    /* PILLS & CHIPS */
    .pill {
      display: inline-flex; align-items: center; padding: 0.25rem 0.6rem; 
      border-radius: 999px; font-size: 0.75rem; font-weight: 600;
      background: rgba(255,255,255,0.1); border: 1px solid var(--border-glass);
    }
    .pill.tiny { padding: 0.15rem 0.4rem; font-size: 0.7rem; }
    .pill.success { background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16,185,129,0.3); }
    .pill.danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }
    .pill.pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245,158,11,0.3); }
    .pill.info { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; border-color: rgba(56,189,248,0.3); }
    
    .chip {
      display: inline-flex; align-items: center; padding: 0.2rem 0.5rem;
      border-radius: 6px; font-size: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass);
      color: var(--text-muted);
    }
    .chip.success { color: #34d399; border-color: rgba(16,185,129,0.3); }

    /* LAYOUT: SHELL */
    .admin-page-container { min-height: 100vh; display: flex; }
    .admin-shell { display: flex; width: 100%; height: 100vh; overflow: hidden; }
    
    /* LOGIN */
    .admin-login-wrapper { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .login-card { width: 100%; max-width: 400px; padding: 2.5rem 2rem; display: flex; flex-direction: column; align-items: center; }
    .brand-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .logo-box { width: 40px; height: 40px; background: var(--accent); color: #000; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; }
    .logo-text { font-size: 1.25rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .login-title { font-size: 1.5rem; margin: 0 0 0.5rem; }
    .login-subtitle { color: var(--text-muted); margin: 0 0 2rem; text-align: center; }
    .btn-oauth { display: flex; align-items: center; justify-content: center; gap: 0.75rem; width: 100%; padding: 0.75rem; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass); font-weight: 500; }
    .btn-oauth:hover { background: rgba(255,255,255,0.1); }
    .google-icon { width: 20px; height: 20px; }
    .divider { display: flex; align-items: center; width: 100%; margin: 1.5rem 0; color: var(--text-muted); font-size: 0.85rem; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border-glass); }
    .divider span { padding: 0 1rem; }
    .login-form { width: 100%; display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { font-size: 0.85rem; font-weight: 500; color: var(--text-muted); }
    
    /* SIDEBAR */
    .sidebar { width: 260px; height: 100vh; flex-shrink: 0; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid var(--border-glass); border-radius: 0; }
    .sidebar-top { padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; }
    .sidebar-bottom { padding: 1rem; border-top: 1px solid var(--border-glass); display: flex; flex-direction: column; gap: 0.5rem; }
    
    .brand-logo.compact .logo-box { width: 32px; height: 32px; font-size: 1rem; }
    
    .quick-status-grid { display: grid; grid-template-columns: 1fr; gap: 0.5rem; }
    .status-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 10px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); text-align: left; }
    .status-btn:hover { background: rgba(255,255,255,0.05); }
    .status-btn.alert { border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.05); }
    .status-btn .icon { font-size: 1.25rem; }
    .status-btn .info { display: flex; flex-direction: column; }
    .status-btn .label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .status-btn .value { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
    .status-btn.alert .value { color: var(--warning); }
    
    .nav-group { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .group-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); padding: 0 0.75rem 0.5rem; font-weight: 600; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 8px; color: var(--text-muted); position: relative; }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-main); }
    .nav-item.active { background: rgba(56, 189, 248, 0.1); color: var(--accent); font-weight: 600; }
    .nav-item.active::before { content: ''; position: absolute; left: -1rem; top: 20%; bottom: 20%; width: 4px; background: var(--accent); border-radius: 0 4px 4px 0; }
    .nav-icon { width: 20px; font-weight: bold; text-align: center; opacity: 0.7; }
    .nav-badge { margin-left: auto; background: var(--danger); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 0.1rem 0.4rem; border-radius: 99px; }
    
    .lang-switch { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem; }
    .lang-switch a { padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); border-radius: 4px; }
    .lang-switch a.active { background: var(--accent); color: #000; }

    /* CONTENT AREA */
    .content-area { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow-y: auto; padding: 0 2rem 2rem; }
    
    .top-header { position: sticky; top: 0; z-index: 10; margin: 0 -2rem 1.5rem; padding: 1.5rem 2rem; border-radius: 0; border-left: none; border-right: none; border-top: none; display: flex; justify-content: space-between; align-items: center; }
    .header-titles .eyebrow { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); font-weight: 600; }
    .header-titles h2 { margin: 0.25rem 0 0; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; }
    .header-titles .subtitle { margin: 0.25rem 0 0; color: var(--text-muted); }
    .header-actions { display: flex; gap: 0.75rem; align-items: center; }
    
    .global-alerts { margin-bottom: 1.5rem; }
    .alert-box { padding: 1rem 1.25rem; border-radius: 8px; font-weight: 500; }
    .alert-box.error { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
    .alert-box.success { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; }

    /* DASHBOARD WIDGETS */
    .dashboard-widgets { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
    .widget-card { display: flex; flex-direction: column; }
    .widget-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-glass); }
    .widget-header h3 { margin: 0; font-size: 1.1rem; }
    .widget-header p { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--text-muted); }
    .widget-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
    
    .notices-grid { display: grid; gap: 0.75rem; }
    .notice-card { display: flex; flex-direction: column; align-items: flex-start; padding: 1rem; border-radius: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-glass); text-align: left; }
    .notice-card.tone-warn { border-left: 4px solid var(--warning); }
    .notice-card.tone-ok { border-left: 4px solid var(--success); }
    .notice-value { font-size: 1.5rem; font-weight: 800; line-height: 1; margin-bottom: 0.25rem; }
    .notice-label { font-weight: 600; font-size: 0.9rem; }
    .notice-note { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
    .stats-grid.large { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .stat-card { display: flex; flex-direction: column; gap: 0.25rem; }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); }
    .stat-value { font-size: 1.5rem; font-weight: 700; }
    .stat-value.text-revenue { color: var(--success); }

    /* SECTIONS & TABLES */
    .section-card { display: flex; flex-direction: column; margin-bottom: 1.5rem; }
    .section-header { padding: 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .section-header h3 { margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 0.75rem; }
    
    .action-bar { display: flex; gap: 0.75rem; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-glass); align-items: center; flex-wrap: wrap; background: rgba(0,0,0,0.1); }
    .search-box { position: relative; display: flex; align-items: center; }
    .search-box.stretch { flex: 1; }
    .search-box .search-icon { position: absolute; left: 0.75rem; opacity: 0.5; font-size: 0.9rem; }
    .search-box input { padding-left: 2.25rem; width: 100%; }
    
    .mini-stats-row { display: flex; gap: 2rem; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-glass); flex-wrap: wrap; }
    .mini-stat { display: flex; flex-direction: column; gap: 0.15rem; }
    .mini-stat .label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; font-weight: 600; }
    .mini-stat .val { font-size: 1.1rem; }

    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th { padding: 1rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--border-glass); white-space: nowrap; }
    .data-table td { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
    .table-row.banned { background: rgba(239, 68, 68, 0.05); }
    .table-row.inactive { opacity: 0.7; }
    .table-row:last-child td { border-bottom: none; }
    
    .sort-btn { display: inline-flex; align-items: center; gap: 0.25rem; font-weight: inherit; text-transform: inherit; color: inherit; letter-spacing: inherit; }
    .sort-btn:hover { color: var(--text-main); }
    .sort-btn.active { color: var(--accent); }
    
    .user-identity { display: flex; flex-direction: column; gap: 0.15rem; }
    .user-name { font-size: 0.8rem; color: var(--text-muted); }
    .status-cell { display: flex; flex-direction: column; gap: 0.25rem; align-items: flex-start; }
    .action-buttons { display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end; }
    
    .pagination-bar { padding: 1rem 1.5rem; border-top: 1px solid var(--border-glass); display: flex; justify-content: center; gap: 0.5rem; }
    .page-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 600; border: 1px solid var(--border-glass); background: rgba(0,0,0,0.2); }
    .page-btn:hover { background: rgba(255,255,255,0.1); }
    .page-btn.active { background: var(--accent); color: #000; border-color: var(--accent); }
    
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; color: var(--text-muted); text-align: center; gap: 0.5rem; }
    .empty-state .empty-icon { font-size: 2rem; opacity: 0.5; margin-bottom: 0.5rem; }
    .empty-state.tiny { padding: 1.5rem 1rem; }
    
    /* LISTS & GRIDS (Bugs, Parser, Cache) */
    .list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; padding: 1.5rem; }
    .list-grid.single-col { grid-template-columns: 1fr; }
    .report-card, .grid-card { display: flex; flex-direction: column; padding: 1.25rem; gap: 0.75rem; }
    .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .card-title { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; font-size: 1.1rem; }
    .card-actions { display: flex; gap: 0.5rem; align-items: center; }
    .report-url { font-size: 0.85rem; word-break: break-all; }
    .report-desc { color: var(--text-main); line-height: 1.5; margin: 0; font-size: 0.95rem; }
    .report-desc.bold { font-weight: 600; font-size: 1rem; }
    .chips-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    
    .code-details { background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border-glass); overflow: hidden; }
    .code-details summary { padding: 0.75rem 1rem; cursor: pointer; user-select: none; font-size: 0.85rem; font-weight: 600; background: rgba(255,255,255,0.02); }
    .code-details summary:hover { background: rgba(255,255,255,0.05); }
    .code-blocks { padding: 1rem; display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border-glass); }
    .code-pane strong { display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); }
    .code-pane pre { margin: 0; padding: 1rem; background: #000; border-radius: 6px; font-family: monospace; font-size: 0.8rem; overflow-x: auto; color: #a5b4fc; }
    
    .hash-text { font-family: monospace; color: var(--accent); background: rgba(56,189,248,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.8rem; }
    .date-text { font-size: 0.8rem; color: var(--text-muted); }
    .meta-row { display: flex; justify-content: space-between; align-items: center; }
    .answer-box { background: rgba(16,185,129,0.1); border-left: 3px solid var(--success); padding: 0.75rem; border-radius: 0 6px 6px 0; display: flex; gap: 0.5rem; }
    .answer-label { font-weight: 800; color: var(--success); }
    .answer-text { color: #f8fafc; font-weight: 500; word-break: break-word; }

    /* SUPPORT INBOX */
    .support-tab { display: flex; flex-direction: column; height: calc(100vh - 180px); }
    .support-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }
    .support-stats-row .mini-stat { padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; border-radius: 12px; }
    .support-stats-row .mini-stat.tone-warn { border-bottom: 3px solid var(--warning); }
    .support-stats-row .mini-stat.tone-ok { border-bottom: 3px solid var(--success); }
    
    .support-layout { display: flex; gap: 1rem; flex: 1; min-height: 0; }
    .inbox-list { width: 350px; display: flex; flex-direction: column; flex-shrink: 0; }
    .inbox-search { display: flex; padding: 1rem; gap: 0.5rem; border-bottom: 1px solid var(--border-glass); background: rgba(0,0,0,0.1); }
    .inbox-search input { flex: 1; min-width: 0; }
    .messages-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
    .msg-item { display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border-glass); text-align: left; }
    .msg-item.active { background: rgba(56,189,248,0.1); border-left: 3px solid var(--accent); }
    .msg-item.unread .msg-subject { font-weight: 800; color: #fff; }
    .msg-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .msg-content { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; flex: 1; }
    .msg-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
    .msg-subject { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .msg-sender { font-size: 0.8rem; color: var(--text-muted); }
    .msg-preview { font-size: 0.85rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .msg-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem; }
    
    .inbox-detail { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
    .detail-header { padding: 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .header-main { display: flex; flex-direction: column; gap: 0.5rem; }
    .header-main h3 { margin: 0; font-size: 1.5rem; }
    .source-pill { align-self: flex-start; background: var(--accent-glow); color: var(--accent); }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem; }
    .meta-item { display: flex; flex-direction: column; font-size: 0.85rem; }
    .meta-item span { color: var(--text-muted); text-transform: uppercase; font-size: 0.7rem; }
    
    .linked-user-card { margin: 1.5rem; padding: 1.25rem; background: rgba(56,189,248,0.05); border: 1px solid rgba(56,189,248,0.2); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
    .linked-user-card.empty { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.2); justify-content: flex-start; }
    .user-info { display: flex; flex-direction: column; gap: 0.25rem; }
    .user-badges { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
    .user-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    
    .message-body { padding: 0 1.5rem 1.5rem; font-size: 0.95rem; line-height: 1.6; }
    .message-body p { margin: 0 0 1rem; }
    
    .replies-section { padding: 1.5rem; border-top: 1px solid var(--border-glass); }
    .replies-section h4 { margin: 0 0 1rem; font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); }
    .reply-card { background: rgba(255,255,255,0.03); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border-left: 3px solid var(--accent); }
    .reply-head { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .reply-body p { margin: 0 0 0.5rem; font-size: 0.9rem; line-height: 1.5; }
    
    .reply-composer { padding: 1.5rem; border-top: 1px solid var(--border-glass); background: rgba(0,0,0,0.1); }
    .reply-composer h4 { margin: 0 0 0.75rem; font-size: 0.9rem; }
    .reply-composer textarea { width: 100%; resize: vertical; margin-bottom: 1rem; }

    /* MODALS */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal-card { width: 100%; max-width: 600px; display: flex; flex-direction: column; max-height: 90vh; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .modal-card.small { max-width: 400px; }
    .modal-card.large { max-width: 800px; }
    .modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; }
    .modal-header h3 { margin: 0; font-size: 1.25rem; }
    .modal-body { padding: 1.5rem; overflow-y: auto; }
    
    .detail-row { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
    .detail-row .label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
    .detail-box { background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-glass); line-height: 1.5; font-family: monospace; white-space: pre-wrap; word-break: break-all; }
    .detail-box.highlight { border-color: var(--success); color: var(--success); background: rgba(16,185,129,0.05); }
    .options-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .options-list li { background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid var(--border-glass); }
    
    .mega-val { font-size: 3rem; line-height: 1; }
    
    /* SPINNERS */
    .loading-spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
    .loading-spinner.center { margin: 2rem auto; width: 40px; height: 40px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    /* SCROLLBARS */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
  `]
})
export class AdminComponent implements OnInit, OnDestroy {
  protected cacheSort = 'newest';
  protected parserFilterPlatform = '';
  protected cacheHitsOnPage(): number { return 0; }
  protected async sendSupportReply(msg: any): Promise<void> {}
  protected cacheEntries() { return this.cache().topHits || []; }
  protected selectedNotice = signal<any>(null);
  protected handleNoticeAction(n: any) {}
  protected readonly tabs: Array<{ id: AdminTab; label: string; short: string }> = [
    { id: 'users', label: 'Users', short: 'US' },
    { id: 'purchases', label: 'Purchases', short: 'PY' },
    { id: 'bugs', label: 'Bugs', short: 'BG' },
    { id: 'support', label: 'Support', short: 'SP' },
    { id: 'cache', label: 'Cache', short: 'CA' },
    { id: 'parser', label: 'Parser', short: 'PR' },
    { id: 'system', label: 'System', short: 'SY' }
  ];

  protected readonly activeTab = signal<AdminTab>('users');
  protected readonly adminLocale = signal<AdminLocale>('en');
  protected readonly isAuthed = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly notice = signal('');
  protected readonly stats = signal<any>({});
  protected readonly users = signal<any[]>([]);
  protected readonly usersLoading = signal(false);
  protected readonly purchases = signal<any[]>([]);
  protected readonly bugs = signal<any[]>([]);
  protected readonly supportMessages = signal<any[]>([]);
  protected readonly selectedSupportMessage = signal<any | null>(null);
  protected readonly cache = signal<any>({});
  protected readonly parserHealth = signal<any>({ summary: {}, platforms: [], problemGroups: [], domainIssues: [], recentEvents: [], recentBugReports: [] });
  protected readonly parserEvents = signal<any[]>([]);
  protected readonly health = signal<any>({});
  protected readonly billingSafety = signal<any>({});
  protected readonly billingUsage = signal<any>({ usage: [], summary: {} });
  protected readonly pagination = signal<any>({ page: 1, pages: 1, total: 0 });
  protected readonly cachePagination = signal<any>({ page: 1, pages: 1, total: 0 });
  protected readonly parserEventsPagination = signal<any>({ page: 1, pages: 1, total: 0 });
  protected readonly billingUsagePagination = signal<any>({ page: 1, pages: 1, total: 0 });

  protected readonly selectedQuestion = signal<any | null>(null);
  protected readonly selectedUserHistory = signal<any | null>(null);
  protected readonly selectedGrantUser = signal<any | null>(null);
  protected readonly userQuestions = signal<any[]>([]);
  protected readonly userQuestionsPagination = signal<any>({ page: 1, pages: 1, total: 0 });

  protected email = '';
  protected password = '';
  protected userSearch = '';
  protected userSort: UserSortOption = DEFAULT_USER_SORT;
  protected cacheSearch = '';
  protected parserSearch = '';
  protected parserOutcomeFilter = '';
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
  private noticeTimer: ReturnType<typeof setTimeout> | null = null;

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
    const storedTab = localStorage.getItem(ADMIN_ACTIVE_TAB_KEY);
    if (isAdminTab(storedTab)) this.activeTab.set(storedTab);
    this.restoreUsersState();
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
    this.clearNoticeTimer();
  }

  private startAdminRefreshTimer(): void {
    if (!this.isBrowser || this.adminRefreshTimer) return;
    this.adminRefreshTimer = setInterval(() => {
      if (!this.isAuthed()) return;
      void this.loadStats();
      if (this.activeTab() === 'bugs') void this.loadBugs();
      if (this.activeTab() === 'support') void this.loadSupportMessages();
      if (this.activeTab() === 'users') void this.loadUsers(this.pagination().page || 1);
      if (this.activeTab() === 'parser') void this.loadParserHealth();
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

  protected setActiveTab(tab: AdminTab): void {
    this.activeTab.set(tab);
    if (this.isBrowser) localStorage.setItem(ADMIN_ACTIVE_TAB_KEY, tab);
    if (tab === 'parser') {
      void this.loadParserHealth();
      void this.loadParserEvents(this.parserEventsPagination().page || 1);
    }
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
      this.loadParserHealth(),
      this.loadParserEvents(),
      this.loadHealth(),
      this.loadBillingSafety(),
      this.loadBillingUsage()
    ]);
  }

  protected async loadUsers(page = 1): Promise<void> {
    this.persistUsersState();
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (this.userSearch.trim()) params.set('search', this.userSearch.trim());
    params.set('sort', this.userSort);
    this.usersLoading.set(true);
    try {
      const result = await this.api(`/api/admin/users?${params.toString()}`);
      if (result.success) {
        this.users.set(result.users || []);
        this.pagination.set(result.pagination || { page, pages: 1, total: 0 });
      }
    } finally {
      this.usersLoading.set(false);
    }
  }

  protected cycleUserSort(field: UserSortField): void {
    const currentDirection = this.userSortDirection(field);
    if (!currentDirection) {
      this.userSort = `${field}_asc` as UserSortOption;
    } else if (currentDirection === 'asc') {
      this.userSort = `${field}_desc` as UserSortOption;
    } else {
      this.userSort = DEFAULT_USER_SORT;
    }
    void this.loadUsers(1);
  }

  protected hasUserFilters(): boolean {
    return !!this.userSearch.trim() || this.userSort !== DEFAULT_USER_SORT;
  }

  protected resetUserFilters(): void {
    this.userSearch = '';
    this.userSort = DEFAULT_USER_SORT;
    this.persistUsersState();
    void this.loadUsers(1);
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
      parser: 'parser',
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
      parser: 'parserHint',
      system: 'systemHint'
    };
    return this.tr(hints[tab]);
  }

  protected tabGroups(): Array<{ label: string; note: string; tabs: Array<{ id: AdminTab; label: string; short: string }> }> {
    const pl = this.adminLocale() === 'pl';
    const groups: Array<{ label: string; note: string; ids: AdminTab[] }> = [
      {
        label: pl ? 'Operacje' : 'Operations',
        note: pl ? 'użytkownicy i kontakt' : 'users and contact',
        ids: ['users', 'support', 'bugs']
      },
      {
        label: pl ? 'Wiedza' : 'Knowledge',
        note: pl ? 'parser i odpowiedzi' : 'parser and answers',
        ids: ['parser', 'cache']
      },
      {
        label: pl ? 'Finanse' : 'Revenue',
        note: pl ? 'płatności i billing' : 'payments and billing',
        ids: ['purchases', 'system']
      },
    ];
    return groups.map(group => ({
      label: group.label,
      note: group.note,
      tabs: this.tabs.filter(tab => group.ids.includes(tab.id))
    }));
  }

  protected activeTabTitle(): string {
    const titles: Record<AdminTab, AdminCopyKey> = {
      users: 'usersTitle',
      purchases: 'purchasesTitle',
      bugs: 'bugsTitle',
      support: 'supportTitle',
      cache: 'cacheTitle',
      parser: 'parserTitle',
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
      parser: 'parserDescription',
      system: 'systemDescription'
    };
    return this.tr(descriptions[this.activeTab()]);
  }

  protected userSortOptions(): Array<{ value: UserSortOption; label: string }> {
    return [
      { value: 'createdAt_desc', label: this.tr('sortNewestUsers') },
      { value: 'createdAt_asc', label: this.tr('sortOldestUsers') },
      { value: 'credits_desc', label: this.tr('sortMostCredits') },
      { value: 'credits_asc', label: this.tr('sortFewestCredits') },
      { value: 'lastOnline_desc', label: this.tr('sortLastOnline') },
      { value: 'lastOnline_asc', label: this.tr('sortLongestOffline') },
      { value: 'questions_desc', label: this.tr('sortMostQuestions') },
      { value: 'questions_asc', label: this.tr('sortFewestQuestions') },
      { value: 'streak_desc', label: this.tr('sortHighestStreak') },
      { value: 'streak_asc', label: this.tr('sortLowestStreak') },
      { value: 'status_desc', label: `${this.tr('status')} \u2193` },
      { value: 'status_asc', label: `${this.tr('status')} \u2191` }
    ];
  }

  protected userSortDirection(field: UserSortField): UserSortDirection | null {
    if (this.userSort === `${field}_asc`) return 'asc';
    if (this.userSort === `${field}_desc`) return 'desc';
    return null;
  }

  protected userSortIndicator(field: UserSortField): string {
    const direction = this.userSortDirection(field);
    if (direction === 'asc') return '\u2191';
    if (direction === 'desc') return '\u2193';
    return '\u2195';
  }

  protected userSortAria(field: UserSortField): 'ascending' | 'descending' | 'none' {
    const direction = this.userSortDirection(field);
    if (direction === 'asc') return 'ascending';
    if (direction === 'desc') return 'descending';
    return 'none';
  }

  protected adminNoticeCards(): Array<{ label: string; value: string; note: string; tone?: 'warn' | 'ok'; targetTab?: AdminTab; targetId?: string }> {
    const unreadBugs = this.bugBadgeCount();
    const supportUnread = this.supportBadgeCount();
    const duplicates = (this.billingSafety().duplicateGroups || []).length;
    const activeUsers = this.users().filter(user => this.isUserExtensionActive(user)).length;
    const parserSummary = this.parserHealth().summary || {};
    const parserIssues = Number(parserSummary.failed || 0) + Number(parserSummary.reported || 0);
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

    if (parserIssues > 0) {
      const topProblem = this.parserProblemRows()[0];
      const problemNote = topProblem
        ? `${topProblem.hostname || topProblem.platform || this.tr('parserHealth')}: ${this.truncateText(topProblem.reason || topProblem.outcome || '', 52)}`
        : `${this.tr('parserFailures')} / ${this.tr('parserReports')}`;
      notices.push({
        label: topProblem ? (this.adminLocale() === 'pl' ? 'Najwiekszy problem parsera' : 'Top parser issue') : this.tr('parserHealth'),
        value: topProblem ? this.formatNumber(topProblem.count || parserIssues) : this.formatNumber(parserIssues),
        note: `${problemNote} - ${reviewDetails}`,
        tone: 'warn',
        targetTab: 'parser'
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
      this.setActiveTab(notice.targetTab);
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

  protected parserHealthCards(): Array<{ label: string; value: string; note: string; ok?: boolean; warn?: boolean }> {
    const summary = this.parserHealth().summary || {};
    const total = Number(summary.total || 0);
    const failed = Number(summary.failed || 0);
    const reported = Number(summary.reported || 0);
    return [
      { label: this.tr('parserEvents'), value: this.formatNumber(total), note: `${this.tr('parserWindow')}: ${this.parserHealth().windowDays || 7}d` },
      { label: this.tr('parserFailureRate'), value: this.formatPercent(summary.failureRate || 0), note: `${this.formatNumber(failed)} ${this.tr('parserFailures')}`, warn: Number(summary.failureRate || 0) > 0.15 },
      { label: this.tr('parserConfidence'), value: this.formatPercent(summary.avgConfidence || 0), note: `${this.formatNumber(summary.avgQuestions || 0)} avg questions`, ok: Number(summary.avgConfidence || 0) >= 0.7 },
      { label: this.tr('parserReports'), value: this.formatNumber(reported), note: this.tr('parserRecentReports'), warn: reported > 0 }
    ];
  }

  protected parserPlatformRows(): any[] {
    return (this.parserHealth().platforms || []).slice(0, 12);
  }

  protected parserDomainRows(): any[] {
    return (this.parserHealth().domainIssues || []).slice(0, 8);
  }

  protected parserProblemRows(): any[] {
    return (this.parserHealth().problemGroups || []).slice(0, 10);
  }

  protected parserProblemSite(group: any): string {
    const host = String(group?.hostname || '').trim();
    if (host) return host;
    const short = this.shortUrl(group?.sampleUrl);
    return short && short !== '-' ? short : 'unknown site';
  }

  protected truncateUi(value: unknown, max = 160): string {
    return this.truncateText(value, max);
  }

  protected parserReasons(item: any): string {
    const reasons = Array.isArray(item?.topReasons)
      ? item.topReasons.map((reason: unknown) => String(reason || '').trim()).filter(Boolean)
      : [];
    return reasons.length ? this.truncateText(reasons.join(', '), 180) : '-';
  }

  protected parserOutcomeTone(outcome: unknown): 'ok' | 'pending' | 'danger' | '' {
    const value = String(outcome || '').toLowerCase();
    if (value === 'success') return 'ok';
    if (value === 'partial' || value === 'reported') return 'pending';
    if (value === 'empty' || value === 'weak' || value === 'error') return 'danger';
    return '';
  }

  protected parserHost(event: any): string {
    const host = String(event?.hostname || '').trim();
    if (host) return host;
    try {
      return new URL(String(event?.url || '')).hostname || '-';
    } catch {
      return '-';
    }
  }

  protected parserEventPreview(event: any): string {
    const snapshot = event?.snapshot || {};
    const question = Array.isArray(snapshot.questionTexts) ? snapshot.questionTexts.find(Boolean) : '';
    const body = snapshot.bodyText || '';
    const fallback = event?.reason || event?.url || '';
    return this.truncateText(question || body || fallback || '-', 220);
  }

  protected hasParserEventFilters(): boolean {
    return !!this.parserSearch.trim() || !!this.parserOutcomeFilter;
  }

  protected shortUrl(value: unknown): string {
    const url = String(value || '').trim();
    if (!url) return '-';
    try {
      const parsed = new URL(url);
      return this.truncateText(`${parsed.hostname}${parsed.pathname}`, 90);
    } catch {
      return this.truncateText(url, 90);
    }
  }

  private truncateText(value: unknown, max = 160): string {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '-';
    return text.length > max ? `${text.slice(0, Math.max(0, max - 3))}...` : text;
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
    if (!email) return;
    const copied = await this.copyTextToClipboard(email);
    if (copied) {
      this.showNotice(this.tr('emailCopied'));
    } else {
      this.error.set(this.tr('couldNotCopyEmail'));
    }
  }

  protected async copyUserEmail(user: any): Promise<void> {
    const email = String(user?.email || '').trim();
    if (!email) return;
    const copied = await this.copyTextToClipboard(email);
    if (copied) {
      this.showNotice(this.tr('emailCopied'));
    } else {
      this.error.set(this.tr('couldNotCopyEmail'));
    }
  }

  protected exportVisibleUsersCsv(): void {
    if (!this.isBrowser || !this.users().length) return;
    const rows = [
      ['email', 'displayName', 'role', 'credits', 'questionsSolved', 'streak', 'status', 'lastSeenAt', 'createdAt'],
      ...this.users().map(user => [
        user.email || '',
        user.displayName || '',
        user.role || '',
        user.role === 'admin' ? 'unlimited' : String(user.credits ?? ''),
        String(user.stats?.totalQuestionsSolved || 0),
        String(user.streak?.current || 0),
        this.userStatusLabel(user),
        user.extensionLastSeenAt ? this.formatDate(user.extensionLastSeenAt) : '',
        user.createdAt ? this.formatDate(user.createdAt) : ''
      ])
    ];
    const csv = rows.map(row => row.map(cell => this.csvCell(cell)).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quizsolver-users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    this.showNotice(this.tr('usersExported'));
  }

  protected pageNumbers(): number[] {
    return this.paginationWindow(this.pagination());
  }

  protected parserEventPageNumbers(): number[] {
    return this.paginationWindow(this.parserEventsPagination());
  }

  protected formatNumber(value: unknown): string {
    const number = Number(value || 0);
    return new Intl.NumberFormat(this.adminLocale() === 'pl' ? 'pl-PL' : 'en-US').format(number);
  }

  protected formatBytes(value: unknown): string {
    const bytes = Math.max(0, Number(value || 0));
    if (!Number.isFinite(bytes) || bytes <= 0) return '-';
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  protected formatPercent(value: unknown): string {
    const number = Number(value || 0);
    return new Intl.NumberFormat(this.adminLocale() === 'pl' ? 'pl-PL' : 'en-US', {
      style: 'percent',
      maximumFractionDigits: 0
    }).format(number);
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

  protected async downloadParserSnapshotFile(file: any): Promise<void> {
    const fileId = String(file?.id || '').trim();
    if (!this.isBrowser || !fileId || !this.token) return;
    try {
      const response = await fetch(`/api/admin/parser/snapshot-file/${encodeURIComponent(fileId)}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      if (!response.ok) {
        this.error.set(`Snapshot download failed: HTTP ${response.status}`);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = String(file?.filename || `parser-page-${fileId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      this.error.set('Snapshot download failed.');
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

  protected async loadParserHealth(): Promise<void> {
    const result = await this.api('/api/admin/parser/health?days=7');
    if (result.success) this.parserHealth.set(result);
  }

  protected async loadParserEvents(page = 1): Promise<void> {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    const search = this.parserSearch.trim();
    if (search) params.set('q', search);
    if (this.parserOutcomeFilter) params.set('outcome', this.parserOutcomeFilter);
    const result = await this.api(`/api/admin/parser/events?${params.toString()}`);
    if (result.success) {
      this.parserEvents.set(result.events || []);
      this.parserEventsPagination.set(result.pagination || { page, pages: 1, total: 0 });
    }
  }

  protected async clearParserEvents(all = false): Promise<void> {
    if (!all && !this.hasParserEventFilters()) return;
    const confirmMessage = all ? this.tr('clearAllParserEventsConfirm') : this.tr('clearFilteredParserEventsConfirm');
    if (!this.confirm(confirmMessage)) return;

    const params = new URLSearchParams();
    const search = this.parserSearch.trim();
    if (search) params.set('q', search);
    if (this.parserOutcomeFilter) params.set('outcome', this.parserOutcomeFilter);

    const endpoint = all
      ? '/api/admin/parser/events/all'
      : `/api/admin/parser/events?${params.toString()}`;
    const result = await this.api(endpoint, { method: 'DELETE' });
    if (result.success) {
      this.showNotice(`${this.tr('parserEventsCleared')}: ${this.formatNumber(result.deleted || 0)}`);
      await Promise.all([
        this.loadParserHealth(),
        this.loadParserEvents(1)
      ]);
      return;
    }
    this.error.set(result.error || this.tr('couldNotClearParserEvents'));
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

  private restoreUsersState(): void {
    if (!this.isBrowser) return;
    try {
      const raw = localStorage.getItem(ADMIN_USERS_STATE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      if (typeof state.search === 'string') this.userSearch = state.search.substring(0, 100);
      if (isUserSortOption(state.sort)) this.userSort = state.sort;
    } catch {
      localStorage.removeItem(ADMIN_USERS_STATE_KEY);
    }
  }

  private persistUsersState(): void {
    if (!this.isBrowser) return;
    localStorage.setItem(ADMIN_USERS_STATE_KEY, JSON.stringify({
      search: this.userSearch.trim().substring(0, 100),
      sort: this.userSort
    }));
  }

  private showNotice(message: string): void {
    this.clearNoticeTimer();
    this.error.set('');
    this.notice.set(message);
    if (!this.isBrowser) return;
    this.noticeTimer = setTimeout(() => {
      if (this.notice() === message) this.notice.set('');
      this.noticeTimer = null;
    }, 3500);
  }

  private clearNoticeTimer(): void {
    if (!this.noticeTimer) return;
    clearTimeout(this.noticeTimer);
    this.noticeTimer = null;
  }

  private async copyTextToClipboard(text: string): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      return copied;
    } catch {
      return false;
    }
  }

  private csvCell(value: unknown): string {
    return `"${String(value ?? '').replace(/"/g, '""')}"`;
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
