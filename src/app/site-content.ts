export interface PlatformCopy {
  platformName: string;
  shortName: string;
  badge: string;
  title: string;
  subtitle: string;
  meta: { title: string; description: string };
  stepsTitle: string;
  steps: string[];
  features: string[];
  note?: string;
  keywordSections?: Array<{ title: string; text: string }>;
  faq?: Array<{ question: string; answer: string }>;
}

export interface SiteCopy {
  htmlLang: string;
  ogLocale: string;
  common: {
    brand: string;
    credits: string;
    dashboard: string;
    buyCredits: string;
    logout: string;
    createAccount: string;
    email: string;
    password: string;
    confirmPassword: string;
    rememberMe: string;
    signIn: string;
    displayName: string;
    referralCode: string;
    loading: string;
    close: string;
    demo: string;
    historyQuiz: string;
  };
  nav: {
    how: string;
    features: string;
    pricing: string;
    login: string;
    signup: string;
    toggle: string;
  };
  footer: {
    product: string;
    seoPages: string;
    legal: string;
    privacy: string;
    rights: string;
    description: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    showRegister: string;
    showRegisterLink: string;
    registerTitle: string;
    showLogin: string;
    showLoginLink: string;
  };
  privacyPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    badge: string;
    subtitle: string;
    effective: string;
    contactLabel: string;
    contactValue: string;
    sections: Array<{
      title: string;
      text?: string;
      items?: string[];
    }>;
  };
  dashboardPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    loginTitle: string;
    loginText: string;
    loginButton: string;
  };
  creditsPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
  };
  quizPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
  };
  demoPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
  };
  successPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    badge?: string;
    subtitle?: string;
    dashboardCta?: string;
    storeCta?: string;
  };
  notFoundPage: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    badge?: string;
    subtitle?: string;
    homeCta?: string;
    storeCta?: string;
  };
  platformPages: {
    quizSolverAi: PlatformCopy;
    testportal: PlatformCopy;
    moodle: PlatformCopy;
    canvas: PlatformCopy;
    googleForms: PlatformCopy;
    microsoftForms: PlatformCopy;
    blackboard: PlatformCopy;
    quizlet: PlatformCopy;
    socrative: PlatformCopy;
    kahoot: PlatformCopy;
    quizizz: PlatformCopy;
  };
  home: {
    title: string;
    subtitle: string;
    meta: { title: string; description: string };
  };
  [key: string]: any;
}

export type Locale = 'en' | 'pl' | 'de' | 'es' | 'fr' | 'it' | 'uk';

export interface LocaleOption {
  code: Locale;
  shortLabel: string;
  label: string;
  nativeLabel: string;
  htmlLang: string;
  ogLocale: string;
  prefix: string;
  browserAliases: string[];
}

export const SUPPORTED_LOCALES: readonly LocaleOption[] = [
  { code: 'en', shortLabel: 'EN', label: 'English', nativeLabel: 'English', htmlLang: 'en', ogLocale: 'en_US', prefix: '', browserAliases: ['en'] },
  { code: 'pl', shortLabel: 'PL', label: 'Polish', nativeLabel: 'Polski', htmlLang: 'pl', ogLocale: 'pl_PL', prefix: '/pl', browserAliases: ['pl'] },
  { code: 'de', shortLabel: 'DE', label: 'German', nativeLabel: 'Deutsch', htmlLang: 'de', ogLocale: 'de_DE', prefix: '/de', browserAliases: ['de'] },
  { code: 'es', shortLabel: 'ES', label: 'Spanish', nativeLabel: 'Español', htmlLang: 'es', ogLocale: 'es_ES', prefix: '/es', browserAliases: ['es'] },
  { code: 'fr', shortLabel: 'FR', label: 'French', nativeLabel: 'Français', htmlLang: 'fr', ogLocale: 'fr_FR', prefix: '/fr', browserAliases: ['fr'] },
  { code: 'it', shortLabel: 'IT', label: 'Italian', nativeLabel: 'Italiano', htmlLang: 'it', ogLocale: 'it_IT', prefix: '/it', browserAliases: ['it'] },
  { code: 'uk', shortLabel: 'UK', label: 'Ukrainian', nativeLabel: 'Українська', htmlLang: 'uk', ogLocale: 'uk_UA', prefix: '/uk', browserAliases: ['uk', 'ua'] }
];

export const LOCALE_CODES = SUPPORTED_LOCALES.map((locale) => locale.code) as Locale[];

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && LOCALE_CODES.includes(value as Locale);
}

export function localeOption(locale: Locale): LocaleOption {
  return SUPPORTED_LOCALES.find((option) => option.code === locale) || SUPPORTED_LOCALES[0];
}

export function localeFromBrowser(language: string | null | undefined): Locale {
  const normalized = String(language || '').toLowerCase();
  const match = SUPPORTED_LOCALES.find((option) =>
    option.browserAliases.some((alias) => normalized === alias || normalized.startsWith(`${alias}-`))
  );
  return match?.code || 'en';
}

function routeRecord(slug: string): Record<Locale, string> {
  return SUPPORTED_LOCALES.reduce((record, option) => {
    if (!slug) {
      record[option.code] = option.code === 'en' ? '/' : option.prefix;
      return record;
    }
    record[option.code] = `${option.prefix}/${slug}`.replace(/\/+/g, '/');
    return record;
  }, {} as Record<Locale, string>);
}

const en: SiteCopy = {
  htmlLang: "en",
  ogLocale: "en_US",
  home: {
    title: "AI Quiz Solver Chrome Extension",
    subtitle: "Solve and review quiz questions on Testportal, Moodle, Canvas, Google Forms, Kahoot and more",
    meta: {
      title: "QuizSolver | AI Quiz Solver, Kahoot Bot & Quiz Helper",
      description: "QuizSolver is a Chrome AI quiz solver for Testportal, Moodle, Canvas, Google Forms, Kahoot and more. Get answer hints, explanations, FocusScan and practice history."
    }
  },
  common: {
    brand: "QuizSolver",
    credits: "Credits",
    dashboard: "Dashboard",
    buyCredits: "Buy credits",
    logout: "Log out",
    createAccount: "Create account",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm password",
    rememberMe: "Remember me",
    signIn: "Sign in",
    displayName: "Display name (optional)",
    referralCode: "Referral code (optional)",
    loading: "Loading...",
    close: "Close",
    demo: "Demo",
    historyQuiz: "History and quiz"
  },
  nav: {
    how: "How it works",
    features: "Features",
    pricing: "Pricing",
    login: "Log in",
    signup: "Sign up",
    toggle: "Toggle menu"
  },
  footer: {
    product: "Product",
    seoPages: "Supported platforms",
    legal: "Legal",
    privacy: "Privacy Policy",
    rights: "© 2026 QuizSolver. All rights reserved.",
    description: "QuizSolver AI quiz solver Chrome extension."
  },
  auth: {
    loginTitle: "Welcome back",
    loginSubtitle: "Sign in to your QuizSolver account.",
    showRegister: "Don't have an account?",
    showRegisterLink: "Sign up",
    registerTitle: "Create account",
    showLogin: "Already have an account?",
    showLoginLink: "Log in"
  },
  privacyPage: {
    metaTitle: "Privacy Policy | QuizSolver",
    metaDescription: "How QuizSolver collects, processes, and protects your information.",
    title: "Privacy Policy",
    badge: "Privacy & Security",
    subtitle: "We prioritize your data security and respect your privacy.",
    effective: "Effective date: May 21, 2026",
    contactLabel: "Contact Support",
    contactValue: "support@getquizsolver.com",
    sections: [
      {
        title: "1. Data Collection & Control",
        text: "We collect minimal information to deliver our quiz solver services. All data is stored securely and processed in accordance with privacy regulations.",
        items: [
          "Account Details: Username, email address, and encrypted password.",
          "Usage Statistics: Total number of resolved questions and purchased credits.",
          "Referral Data: Signups and purchase counts connected to your referral code."
        ]
      },
      {
        title: "2. Chrome Extension & FocusScan",
        text: "The Chrome extension operates locally on your web browser. It only scans webpage contents or screenshots when you explicitly activate it or trigger the scan tools.",
        items: [
          "Active Scanning: The extension analyzes question and answer elements to provide suggestions.",
          "FocusScan Tool: Captures user-defined screen regions as temporary image payloads to extract text via AI.",
          "Local Context: The extension does not record other open tabs, browsing history, or background activities."
        ]
      },
      {
        title: "3. Third-Party Payments (Stripe)",
        text: "All payment transactions are handled securely by Stripe. We do not store or process your credit card numbers on our servers."
      },
      {
        title: "4. Information Sharing",
        text: "We never sell, rent, or trade your personal information with third parties. Your account data is used solely to authenticate your access, track credits, and provide customer support."
      },
      {
        title: "5. Your Rights & Data Deletion",
        text: "You retain full control over your personal data. You can inspect, modify, or delete your account at any time.",
        items: [
          "Access and Portability: Request a copy of your stored question history.",
          "Account Deletion: Delete your account and associated notes history directly from your settings or by contacting support."
        ]
      }
    ]
  },
  dashboardPage: {
    metaTitle: "User Dashboard | QuizSolver",
    metaDescription: "Manage your credits, top up, check your referral link, and view account statistics.",
    title: "User Dashboard",
    loginTitle: "Access Your Dashboard",
    loginText: "Sign in or create a free account to track your quiz credits, view purchase history, and access your referral program.",
    loginButton: "Sign In / Sign Up"
  },
  creditsPage: {
    metaTitle: "Buy Credits | QuizSolver",
    metaDescription: "Top up QuizSolver credits with one-time packages for answers, explanations, and study tools.",
    title: "Buy Credits"
  },
  quizPage: {
    metaTitle: "History & Practice Quiz | QuizSolver",
    metaDescription: "Review your saved questions, study notes, practice flashcards, and share custom quizzes.",
    title: "History and Quiz"
  },
  demoPage: {
    metaTitle: "Interactive Extension Demo | QuizSolver",
    metaDescription: "Try the QuizSolver extension on a safe local demo quiz with five predefined questions and no credit usage.",
    title: "Interactive Demo"
  },
  successPage: {
    metaTitle: "Payment Successful | QuizSolver",
    metaDescription: "Thank you! Your credit top-up has been successfully completed.",
    badge: "Success",
    title: "Payment Successful",
    subtitle: "Your credits are ready to use.",
    dashboardCta: "Open dashboard",
    storeCta: "Install extension"
  },
  notFoundPage: {
    metaTitle: "404 Page Not Found | QuizSolver",
    metaDescription: "The page you are looking for does not exist on QuizSolver.",
    badge: "404",
    title: "Page Not Found",
    subtitle: "This page does not exist or the link has expired.",
    homeCta: "Back to home",
    storeCta: "Install extension"
  },
  platformPages: {
    quizSolverAi: {
      platformName: "AI quiz solver",
      shortName: "AI Solver",
      badge: "AI solver",
      title: "QuizSolver: The ultimate AI quiz solver extension",
      subtitle: "Solve quizzes seamlessly across any platform with our AI-powered browser extension.",
      meta: { title: "AI Quiz Solver Chrome Extension | QuizSolver", description: "Solve quizzes on Testportal, Moodle, and more using AI." },
      stepsTitle: "How to get started",
      steps: ["Install the extension from Chrome Web Store", "Pin it to your toolbar for quick access", "Open a quiz and let the AI suggest answers in real time"],
      features: ["Instant accurate answers", "Detailed concept explanations", "History saving for studying", "Cross-platform support"],
      keywordSections: [
        { title: "Smartest AI Quiz Companion", text: "QuizSolver runs directly in your Chrome browser, scanning questions on demand to deliver high-quality suggestions instantly." },
        { title: "Ace any test or assignment", text: "Whether it is single choice, multiple choice, or free text, the AI analyzes options and offers clear reasoning for every solution." }
      ],
      faq: [
        { question: "Is this extension free to use?", answer: "Yes, you receive free starting credits to try the extension. You can top up whenever you need more." },
        { question: "Does it work on all web pages?", answer: "Absolutely. Using the FocusScan region tool, you can capture questions on any page, even inside canvases or images." }
      ]
    },
    testportal: {
      platformName: "Testportal",
      shortName: "Testportal",
      badge: "Testportal Workflow",
      title: "Use QuizSolver on Testportal",
      subtitle: "Get answer suggestions directly on Testportal while keeping your workflow clean.",
      meta: { title: "Testportal AI Quiz Solver | QuizSolver", description: "Seamless AI integration for Testportal quizzes. Solve Testportal questions instantly with explanations." },
      stepsTitle: "How to use with Testportal",
      steps: ["Log into Testportal and open your quiz page", "Start the test and activate the extension side panel", "Watch the AI auto-detect the question and display answers"],
      features: ["Auto-detection of Testportal questions", "Maintains response times within safe limits", "Supports images embedded in questions"],
      keywordSections: [
        { title: "Fast Testportal Helper", text: "Say goodbye to stressful time limits. Our extension parses Testportal HTML on the fly and presents answers without delaying your workflow." },
        { title: "Safe and Reliable", text: "Designed to run locally within your browser context, QuizSolver respects the page layout and works exactly like an interactive study side-bar." }
      ],
      faq: [
        { question: "Does it bypass window-leave detection?", answer: "QuizSolver works in a side panel or directly on the page, meaning you do not have to click off the tab or leave the window to look up answers." },
        { question: "Does it support Polish Testportal?", answer: "Yes! QuizSolver works perfectly on both English and Polish test variations." }
      ]
    },
    moodle: {
      platformName: "Moodle",
      shortName: "Moodle",
      badge: "Moodle Integration",
      title: "Solve Moodle Quizzes with AI",
      subtitle: "Enhance your Moodle learning experience with instant AI help.",
      meta: { title: "Moodle AI Quiz Solver | QuizSolver", description: "AI answer suggestions and step-by-step explanations for Moodle quizzes." },
      stepsTitle: "How to use on Moodle",
      steps: ["Open your course quiz on Moodle", "Activate QuizSolver with a single click", "Review AI suggestions and explanations before submitting"],
      features: ["Compatible with Moodle quiz formatting", "Save questions to study history automatically", "Handles math and science notations"],
      keywordSections: [
        { title: "Boost your LMS learning", text: "Moodle courses can have complex question banks. QuizSolver interprets standard text, code snippets, and multiple choice layouts with ease." },
        { title: "Interactive study notes", text: "Every Moodle question you solve is saved in your dashboard, enabling quick review before midterms." }
      ],
      faq: [
        { question: "Can it handle essay questions?", answer: "Yes, it can generate detailed draft answers and outlines for open-ended or essay-style Moodle questions." },
        { question: "Does it require Moodle admin access?", answer: "No, it is a client-side extension that reads only what is displayed on your screen." }
      ]
    },
    canvas: {
      platformName: "Canvas",
      shortName: "Canvas",
      badge: "Canvas LMS",
      title: "Solve Canvas Quizzes with AI",
      subtitle: "Get AI-powered hints and detailed answer explanations on Canvas quizzes.",
      meta: { title: "Canvas AI Quiz Solver | QuizSolver", description: "Integrate AI suggestions seamlessly into your Canvas LMS quizzes." },
      stepsTitle: "How to use with Canvas",
      steps: ["Open your Canvas course page", "Start the quiz and activate the QuizSolver side-panel", "Read and evaluate the suggested answers"],
      features: ["Canvas LMS compatibility", "Saves questions for learning", "Detailed explanation support"],
      keywordSections: [
        { title: "Streamline Canvas Assignments", text: "Canvas quizzes can be long and tedious. QuizSolver lets you tackle them with confidence by breaking down complex questions with AI reasoning." },
        { title: "Learn as you solve", text: "Every answer suggestion comes with an optional step-by-step breakdown, so you learn the concepts behind the questions." }
      ],
      faq: [
        { question: "Does Canvas detect the extension?", answer: "QuizSolver operates inside the standard browser extension sandbox without injecting suspicious scripts into Canvas." },
        { question: "Does it support third-party LTI integrations in Canvas?", answer: "Yes, using the FocusScan feature, you can solve questions loaded inside external LTI frames." }
      ]
    },
    googleForms: {
      platformName: "Google Forms",
      shortName: "Google Forms",
      badge: "Forms Integration",
      title: "Google Forms AI solver",
      subtitle: "Get hints and answers for quizzes hosted on Google Forms.",
      meta: { title: "Google Forms AI Quiz Solver | QuizSolver", description: "Solve Google Forms quizzes with AI." },
      stepsTitle: "Google Forms workflow",
      steps: ["Open your Google Forms quiz link", "Click the QuizSolver icon", "Examine generated answers and explanations"],
      features: ["Works on paginated forms", "Images support in form fields", "Saves answers automatically"],
      keywordSections: [
        { title: "Instantly solve Google Forms", text: "Whether it's a school test or a company survey, Google Forms quizzes are solved in seconds. Our tool reads forms sections effortlessly." },
        { title: "Image OCR", text: "If a question is an image uploaded by the creator, QuizSolver can extract the text and solve it using advanced OCR." }
      ],
      faq: [
        { question: "Does it submit the form for me?", answer: "No, QuizSolver only gives suggestions. You retain full control over when and what you submit." }
      ]
    },
    microsoftForms: {
      platformName: "Microsoft Forms",
      shortName: "MS Forms",
      badge: "MS Forms Integration",
      title: "Solve Microsoft Forms Quizzes with AI",
      subtitle: "Answer suggestions and clear explanations for Microsoft Forms surveys and quizzes.",
      meta: { title: "Microsoft Forms AI Quiz Solver | QuizSolver", description: "Solve Microsoft Forms quizzes with instant AI helper." },
      stepsTitle: "How to use on MS Forms",
      steps: ["Navigate to the Microsoft Forms link", "Open the QuizSolver Chrome extension window", "Get answers for the visible form fields"],
      features: ["Works on multiple choice", "Saves text questions", "Supports anonymous forms"],
      keywordSections: [
        { title: "Effortless MS Forms assistance", text: "Microsoft Forms are commonly used in universities and corporate settings. Keep your grades high with quick AI-supported verification." },
        { title: "Smart parsing", text: "Our extension recognizes form sections, checkboxes, and text fields to supply exact answers." }
      ],
      faq: [
        { question: "Can I use it on mobile?", answer: "Currently, QuizSolver is a desktop Chrome extension. You can review saved notes and practice quizzes on mobile." }
      ]
    },
    blackboard: {
      platformName: "Blackboard",
      shortName: "Blackboard",
      badge: "Blackboard Learn",
      title: "Solve Blackboard Quizzes with AI",
      subtitle: "Get help with online tests on the Blackboard Learn platform.",
      meta: { title: "Blackboard AI Quiz Solver | QuizSolver", description: "Make test preparation easier with AI answers for Blackboard." },
      stepsTitle: "How to use on Blackboard",
      steps: ["Log into your Blackboard portal", "Open your quiz or assignment", "Use QuizSolver to verify your answers"],
      features: ["Matches Blackboard formatting", "Explains complex concepts", "Instant answer scanning"],
      keywordSections: [
        { title: "Overcome Blackboard obstacles", text: "Blackboard Learn assessments can be intimidating. Use QuizSolver to check your work and understand complex multiple-answer questions." }
      ],
      faq: [
        { question: "Is it compatible with Blackboard Ultra?", answer: "Yes, it is fully compatible with both Blackboard Classic and the new Blackboard Ultra interface." }
      ]
    },
    quizlet: {
      platformName: "Quizlet",
      shortName: "Quizlet",
      badge: "Quizlet Study Helper",
      title: "Quizlet AI Solver & Helper",
      subtitle: "Enhance your flashcards and practice sets with instant AI suggestions.",
      meta: { title: "Quizlet AI Solver | QuizSolver", description: "Solve Quizlet matches, tests, and learning modes with AI." },
      stepsTitle: "How to use on Quizlet",
      steps: ["Open any Quizlet set or practice test", "Activate the extension", "Compare answers and study efficiently"],
      features: ["Works on Learn mode", "Supports writing practice", "Matches definitions instantly"],
      keywordSections: [
        { title: "Accelerate Quizlet learning", text: "Skip the trial-and-error. Verify translations, terminology, and definitions instantly during flashcard study." }
      ],
      faq: [
        { question: "Can it solve Quizlet matches?", answer: "Yes, it helps you identify correct pairings quickly for studying purpose." }
      ]
    },
    socrative: {
      platformName: "Socrative",
      shortName: "Socrative",
      badge: "Socrative Real-Time",
      title: "Solve Socrative Quizzes with AI",
      subtitle: "Get rapid answers for Socrative student activities and exit tickets.",
      meta: { title: "Socrative AI Quiz Solver | QuizSolver", description: "Solve Socrative quizzes in real-time with AI answer suggestions." },
      stepsTitle: "How to use on Socrative",
      steps: ["Join the Socrative room", "When questions appear, click QuizSolver", "Review suggested responses"],
      features: ["Real-time synchronization", "Multiple-choice auto-detect", "Concept explanations"],
      keywordSections: [
        { title: "Live classroom assistance", text: "When the teacher launches a Socrative quiz, stay prepared. Receive helpful hints instantly to understand the topic better." }
      ],
      faq: [
        { question: "Does it work in teacher mode?", answer: "It is designed for students to help check and understand answers, but teachers can use it to test their own quizzes." }
      ]
    },
    kahoot: {
      platformName: "Kahoot",
      shortName: "Kahoot",
      badge: "Kahoot Quiz ID Helper",
      title: "Kahoot AI Bot & Answer Bank",
      subtitle: "Use QuizSolver in two Kahoot modes: auto-solve visible questions or load the answer bank with a Quiz ID when the host hides questions.",
      meta: { title: "Kahoot AI Bot & Quiz ID Answer Bank | QuizSolver", description: "Solve visible Kahoot questions with AI or use Quiz ID to view the full Kahoot answer bank in a clean browser extension panel." },
      stepsTitle: "How to use on Kahoot",
      steps: ["Open kahoot.it/instructions or join the Kahoot lobby.", "Choose Solve whole quiz when questions and answer tiles are visible on your device.", "If the host hides questions, copy the Quiz ID from the Kahoot URL and load all questions with correct answers in the panel."],
      features: ["Auto mode watches visible Kahoot questions and clicks the best answer", "Quiz ID mode shows the answer bank without spending AI credits", "Searchable floating panel that works on desktop and mobile layouts"],
      note: "Quiz ID is different from the live game PIN. It appears in Kahoot URLs after quizId=, for example play.kahoot.it/v2/lobby?quizId=...",
      keywordSections: [
        { title: "Two Kahoot solving modes", text: "Some Kahoot games show every question on the player screen, while others hide the question and only show answer tiles. QuizSolver adapts to both cases: it can answer visible questions automatically or load the full quiz structure from a Quiz ID." },
        { title: "What is a Kahoot Quiz ID?", text: "The Quiz ID is the long identifier in the Kahoot lobby or preview URL. Paste it into the extension panel to view a searchable list of questions and correct answers." }
      ],
      faq: [
        { question: "Is Quiz ID the same as the Kahoot PIN?", answer: "No. The PIN joins a live game. Quiz ID identifies the quiz itself and is usually visible in the Kahoot URL after quizId=." },
        { question: "Does Quiz ID mode use credits?", answer: "No. Quiz ID mode loads the Kahoot quiz structure and does not ask AI, so it does not spend credits." },
        { question: "Can QuizSolver click answers automatically?", answer: "Yes, when the question and answer options are visible on your device. If the host hides questions, use Quiz ID mode instead." }
      ]
    },
    quizizz: {
      platformName: "Quizizz",
      shortName: "Quizizz",
      badge: "Quizizz Helper",
      title: "Quizizz Solver & AI Helper",
      subtitle: "Solve Quizizz practice sets with instant AI feedback.",
      meta: { title: "Quizizz Solver & AI Helper | QuizSolver", description: "Get answers and explanations for Quizizz quizzes using AI." },
      stepsTitle: "How to use on Quizizz",
      steps: ["Open the Quizizz game or homework link", "Click on the QuizSolver browser extension", "Study answers and verify learning progress"],
      features: ["Works on homework mode", "Step-by-step breakdown", "Notetaking support"],
      keywordSections: [
        { title: "Improve Quizizz accuracy", text: "No more guessing games. QuizSolver tracks down facts and provides detailed justifications so you actually absorb the study material." }
      ],
      faq: [
        { question: "Does it support school accounts?", answer: "Yes, it runs locally in your browser so it doesn't matter what type of Quizizz account you use." }
      ]
    }
  }
};

const pl: SiteCopy = {
  htmlLang: "pl",
  ogLocale: "pl_PL",
  home: {
    title: "Rozszerzenie AI do rozwiązywania quizów",
    subtitle: "Rozwiązuj i powtarzaj pytania z Testportal, Moodle, Canvas, Google Forms, Kahoot i innych platform",
    meta: {
      title: "QuizSolver | AI quiz solver, Kahoot bot i pomoc do testów",
      description: "QuizSolver to rozszerzenie Chrome do quizów na Testportal, Moodle, Canvas, Google Forms, Kahoot i więcej. Podpowiedzi, wyjaśnienia, FocusScan i historia nauki."
    }
  },
  common: {
    brand: "QuizSolver",
    credits: "Kredyty",
    dashboard: "Panel",
    buyCredits: "Kup kredyty",
    logout: "Wyloguj się",
    createAccount: "Załóż konto",
    email: "Adres e-mail",
    password: "Hasło",
    confirmPassword: "Powtórz hasło",
    rememberMe: "Zapamiętaj mnie",
    signIn: "Zaloguj się",
    displayName: "Nazwa użytkownika (opcjonalnie)",
    referralCode: "Kod polecającego (opcjonalnie)",
    loading: "Ładowanie...",
    close: "Zamknij",
    demo: "Demo",
    historyQuiz: "Historia i quiz"
  },
  nav: {
    how: "Jak to działa",
    features: "Funkcje",
    pricing: "Cennik",
    login: "Zaloguj się",
    signup: "Zarejestruj się",
    toggle: "Menu"
  },
  footer: {
    product: "Produkt",
    seoPages: "Obsługiwane platformy",
    legal: "Informacje prawne",
    privacy: "Polityka prywatności",
    rights: "© 2026 QuizSolver. Wszelkie prawa zastrzeżone.",
    description: "Inteligentne rozszerzenie do Chrome sugerujące odpowiedzi i pomagające w nauce."
  },
  auth: {
    loginTitle: "Witaj ponownie",
    loginSubtitle: "Zaloguj się na swoje konto QuizSolver.",
    showRegister: "Nie masz jeszcze konta?",
    showRegisterLink: "Zarejestruj się",
    registerTitle: "Załóż konto",
    showLogin: "Masz już konto?",
    showLoginLink: "Zaloguj się"
  },
  privacyPage: {
    metaTitle: "Polityka prywatności | QuizSolver",
    metaDescription: "Sprawdź, w jaki sposób QuizSolver gromadzi, przetwarza i chroni Twoje dane osobowe.",
    title: "Polityka prywatności",
    badge: "Prywatność i Bezpieczeństwo",
    subtitle: "Dbamy o bezpieczeństwo Twoich danych i w pełni szanujemy Twoją prywatność.",
    effective: "Ostatnia aktualizacja: 21 maja 2026 r.",
    contactLabel: "Kontakt ze wsparciem",
    contactValue: "support@getquizsolver.com",
    sections: [
      {
        title: "1. Gromadzenie i ochrona danych",
        text: "Gromadzimy jedynie minimalny zakres danych niezbędny do świadczenia usług analizy pytań i obsługi Twojego konta. Wszystkie dane są szyfrowane i bezpiecznie przechowywane.",
        items: [
          "Dane konta: Adres e-mail, wyświetlana nazwa użytkownika oraz zaszyfrowane hasło.",
          "Statystyki użytkowania: Łączna liczba rozwiązanych pytań oraz aktualne saldo zakupionych kredytów.",
          "Program poleceń: Statystyki rejestracji i zakupów powiązanych z Twoim kodem polecającym."
        ]
      },
      {
        title: "2. Działanie rozszerzenia Chrome i FocusScan",
        text: "Rozszerzenie Chrome działa bezpośrednio w Twojej przeglądarce i analizuje zawartość stron wyłącznie w momencie, gdy zostanie ręcznie wywołane.",
        items: [
          "Skanowanie na żądanie: Rozszerzenie analizuje kod strony w celu automatycznego wykrywania pytań i sugerowania odpowiedzi.",
          "Narzędzie FocusScan: Przesyła zaznaczony przez Ciebie obszar ekranu (zrzut fragmentu strony) do analizy AI w celu odczytania tekstu.",
          "Lokalne bezpieczeństwo: Rozszerzenie nie analizuje ani nie śledzi innych otwartych kart, historii przeglądania ani żadnych aktywności w tle."
        ]
      },
      {
        title: "3. Bezpieczne płatności (Stripe)",
        text: "Wszystkie płatności za pakiety kredytów są przetwarzane w bezpieczny sposób za pośrednictwem platformy Stripe. Nie przechowujemy ani nie przetwarzamy danych kart płatniczych na naszych serwerach."
      },
      {
        title: "4. Udostępnianie danych",
        text: "Nigdy nie sprzedajemy, nie wynajmujemy ani nie udostępniamy Twoich danych podmiotom trzecim. Zebrane informacje służą wyłącznie do autoryzacji dostępu, rozliczania kredytów i świadczenia wsparcia technicznego."
      },
      {
        title: "5. Twoje prawa i usuwanie konta",
        text: "Zachowujesz pełną kontrolę nad swoimi danymi osobowymi. W każdej chwili możesz zaktualizować swoje informacje lub całkowicie usunąć konto.",
        items: [
          "Wgląd w dane: Masz stały dostęp do pełnej historii swoich pytań i możesz ją pobrać lub edytować.",
          "Usuwanie danych: Możesz w każdej chwili usunąć swoje konto wraz ze wszystkimi powiązanymi pytaniami bezpośrednio z poziomu ustawień lub kontaktując się z naszym wsparciem."
        ]
      }
    ]
  },
  dashboardPage: {
    metaTitle: "Panel użytkownika | QuizSolver",
    metaDescription: "Zarządzaj kredytami, doładowuj konto, pobieraj kod polecający i sprawdzaj statystyki swojego konta.",
    title: "Panel użytkownika",
    loginTitle: "Zaloguj się do panelu",
    loginText: "Zaloguj się lub załóż darmowe konto, aby zarządzać kredytami, sprawdzać historię transakcji i korzystać z programu poleceń.",
    loginButton: "Zaloguj się / Załóż konto"
  },
  creditsPage: {
    metaTitle: "Kup kredyty | QuizSolver",
    metaDescription: "Doładuj kredyty QuizSolver jednorazowym pakietem do odpowiedzi, wyjaśnień i nauki.",
    title: "Kup kredyty"
  },
  quizPage: {
    metaTitle: "Historia i quizy powtórkowe | QuizSolver",
    metaDescription: "Przeglądaj zapisane pytania, twórz fiszki do nauki, dodawaj notatki i udostępniaj własne quizy.",
    title: "Historia i quiz"
  },
  demoPage: {
    metaTitle: "Interaktywne demo rozszerzenia | QuizSolver",
    metaDescription: "Przetestuj QuizSolver na bezpiecznym quizie demo z pięcioma gotowymi pytaniami, bez zużycia kredytów.",
    title: "Interaktywne demo"
  },
  successPage: {
    metaTitle: "Płatność powiodła się | QuizSolver",
    metaDescription: "Dziękujemy! Doładowanie konta kredytami zakończyło się sukcesem.",
    title: "Płatność powiodła się"
  },
  notFoundPage: {
    metaTitle: "Strona nie znaleziona (404) | QuizSolver",
    metaDescription: "Strona, której szukasz, nie istnieje w serwisie QuizSolver.",
    badge: "404",
    title: "Strona nie znaleziona",
    subtitle: "Ta strona nie istnieje albo link wygasł.",
    homeCta: "Wróć na start",
    storeCta: "Zainstaluj rozszerzenie"
  },
  platformPages: {
    quizSolverAi: {
      platformName: "AI quiz solver",
      shortName: "AI Solver",
      badge: "Asystent AI",
      title: "QuizSolver: Zaawansowany asystent AI do rozwiązywania quizów",
      subtitle: "Rozwiązuj quizy i testy szybko na dowolnej platformie dzięki naszemu inteligentnemu rozszerzeniu.",
      meta: { title: "Sztuczna Inteligencja do Quizów i Testów | QuizSolver", description: "Rozwiązuj quizy i testy online z pomocą sztucznej inteligencji. Pobierz oficjalnego asystenta do przeglądarki Chrome." },
      stepsTitle: "Jak zacząć?",
      steps: ["Zainstaluj rozszerzenie z oficjalnego sklepu Chrome Web Store.", "Przypnij ikonę QuizSolver do paska narzędzi przeglądarki.", "Otwórz swój test i pozwól, aby sztuczna inteligencja na bieżąco proponowała poprawne odpowiedzi."],
      features: ["Błyskawiczne odpowiedzi", "Szczegółowe wyjaśnienia pojęć", "Automatyczny zapis historii do nauki", "Pełna kompatybilność z wieloma platformami"],
      keywordSections: [
        { title: "Twój inteligentny asystent nauki", text: "QuizSolver działa bezpośrednio w przeglądarce, na żądanie analizując strukturę pytania i dostarczając precyzyjne podpowiedzi w ułamku sekundy." },
        { title: "Z łatwością poradzisz sobie z każdym pytaniem", text: "Niezależnie od tego, czy mierzysz się z pytaniami jednokrotnego wyboru, wielokrotnego wyboru, czy otwartymi, nasze AI precyzyjnie analizuje opcje i wyjaśnia każdy krok." }
      ],
      faq: [
        { question: "Czy rozszerzenie jest darmowe?", answer: "Tak, na start otrzymujesz darmowe kredyty na przetestowanie narzędzia. W każdej chwili możesz doładować swoje konto, jeśli będziesz potrzebować więcej." },
        { question: "Czy działa na wszystkich stronach?", answer: "Tak. Dzięki innowacyjnemu narzędziu FocusScan możesz zaznaczyć dowolny obszar ekranu, co pozwala na odczytanie i rozwiązanie pytań wklejonych jako obrazki lub ukrytych w ramkach." }
      ]
    },
    testportal: {
      platformName: "Testportal",
      shortName: "Testportal",
      badge: "Wsparcie Testportal",
      title: "QuizSolver na platformie Testportal",
      subtitle: "Otrzymuj sugestie odpowiedzi w czasie rzeczywistym bezpośrednio na Testportalu.",
      meta: { title: "Testportal AI Quiz Solver | Rozwiązuj Testy z AI", description: "Błyskawiczne i bezpieczne odpowiedzi na platformie Testportal z użyciem AI. Zapomnij o stresie i limitach czasu." },
      stepsTitle: "Jak używać QuizSolver na Testportalu",
      steps: ["Zaloguj się na Testportal i przejdź do swojego testu.", "Uruchom panel boczny rozszerzenia QuizSolver w przeglądarce.", "Nasze AI automatycznie zidentyfikuje pytanie i wskaże sugerowane warianty odpowiedzi."],
      features: ["Automatyczne wykrywanie pytań i opcji wyboru", "Zachowanie bezpiecznych, naturalnych odstępów czasowych", "Pełne wsparcie dla pytań zawierających zdjęcia"],
      keywordSections: [
        { title: "Szybka pomoc na platformie Testportal", text: "Zapomnij o stresie związanym z uciekającym czasem. Nasze rozszerzenie analizuje treść w locie i wyświetla precyzyjne podpowiedzi bezpośrednio w panelu bocznym." },
        { title: "Dyskrecja i bezpieczeństwo", text: "QuizSolver funkcjonuje lokalnie w kontekście przeglądarki, nie modyfikując struktury strony ani nie wyzwalając mechanizmów zabezpieczających platformy." }
      ],
      faq: [
        { question: "Czy Testportal wykrywa działanie rozszerzenia?", answer: "Nie. Ponieważ QuizSolver działa bezpośrednio w panelu bocznym Chrome (Side Panel), nie musisz klikać poza obszar testu ani opuszczać karty przeglądarki." },
        { question: "Czy działa na polskim Testportalu?", answer: "Tak! Nasze AI w pełni wspiera analizę pytań zarówno w języku polskim, jak i angielskim." }
      ]
    },
    moodle: {
      platformName: "Moodle",
      shortName: "Moodle",
      badge: "Wsparcie Moodle",
      title: "Rozwiązuj quizy Moodle z AI",
      subtitle: "Podnieś swoje oceny i lepiej zrozum materiał dzięki inteligentnym wskazówkom na Moodle.",
      meta: { title: "Moodle AI Quiz Solver | QuizSolver", description: "Pomoc przy quizach Moodle z wykorzystaniem sztucznej inteligencji." },
      stepsTitle: "Jak używać na Moodle",
      steps: ["Otwórz quiz na platformie Moodle.", "Uruchom rozszerzenie QuizSolver jednym kliknięciem.", "Zapoznaj się z podpowiedziami oraz wyjaśnieniami AI przed wysłaniem odpowiedzi."],
      features: ["Pełna kompatybilność z różnymi typami pytań na Moodle", "Automatyczne zapisywanie pytań do historii nauki", "Obsługa wzorów i notacji matematycznej (LaTeX)"],
      keywordSections: [
        { title: "Szybsza nauka na platformie Moodle", text: "Testy na Moodle bywają skomplikowane. QuizSolver błyskawicznie analizuje treść, kody źródłowe oraz opcje wyboru, pomagając Ci szybko zrozumieć trudne zagadnienia." }
      ],
      faq: [
        { question: "Czy radzi sobie z pytaniami otwartymi?", answer: "Tak, sztuczna inteligencja potrafi wygenerować logiczne konspekty oraz gotowe odpowiedzi do pytań otwartych i opisowych." }
      ]
    },
    canvas: {
      platformName: "Canvas",
      shortName: "Canvas",
      badge: "Canvas LMS",
      title: "Rozwiązuj quizy Canvas z AI",
      subtitle: "Otrzymuj wskazówki i precyzyjne wyjaśnienia krok po kroku w quizach Canvas LMS.",
      meta: { title: "Canvas AI Quiz Solver | QuizSolver", description: "Zintegruj sztuczną inteligencję ze swoimi quizami na platformie Canvas." },
      stepsTitle: "Jak używać na Canvas",
      steps: ["Zaloguj się do Canvas i otwórz odpowiedni quiz.", "Uruchom panel boczny rozszerzenia QuizSolver w przeglądarce.", "Zapoznaj się z sugestiami i wyjaśnieniami wygenerowanymi przez AI."],
      features: ["Pełna integracja z systemem Canvas LMS", "Zapisywanie rozwiązanych pytań na później w historii", "Szczegółowe objaśnienia każdego zagadnienia"],
      keywordSections: [
        { title: "Skuteczna pomoc w quizach Canvas", text: "Kolokwia i quizy w systemie Canvas bywają wyjątkowo długie. Z QuizSolver przebrniesz przez nie bez stresu, mając u boku inteligentnego asystenta AI." }
      ],
      faq: [
        { question: "Czy system Canvas wykrywa to rozszerzenie?", answer: "Nie. Rozszerzenie działa w bezpiecznej, izolowanej piaskownicy przeglądarki Chrome i nie ingeruje w kod śledzący ani skrypty analityczne platformy Canvas." }
      ]
    },
    googleForms: {
      platformName: "Google Forms",
      shortName: "Google Forms",
      badge: "Forms Integration",
      title: "AI Solver do Google Forms",
      subtitle: "Błyskawiczne sugestie odpowiedzi w testach i ankietach Google Forms.",
      meta: { title: "Google Forms AI Quiz Solver | Rozwiązuj Formularze z AI", description: "Rozwiązuj quizy i formularze Google Forms z pomocą sztucznej inteligencji. Otrzymuj gotowe odpowiedzi i szczegółowe opisy." },
      stepsTitle: "Przepływ pracy na Google Forms",
      steps: ["Otwórz link do formularza Google Forms w przeglądarce.", "Kliknij ikonę rozszerzenia QuizSolver, aby aktywować pomocnika.", "Zapoznaj się z sugerowanymi odpowiedziami oraz ich uzasadnieniem."],
      features: ["Wsparcie dla długich, wielostronicowych formularzy", "Rozpoznawanie pytań z grafikami i schematami", "Automatyczne budowanie bazy pytań w historii"],
      keywordSections: [
        { title: "Szybkie rozwiązywanie formularzy Google", text: "Niezależnie od tego, czy rozwiązujesz krótki sprawdzian, czy rozbudowany test wiedzy, QuizSolver błyskawicznie analizuje pola formularza Google i sugeruje poprawne opcje." }
      ],
      faq: [
        { question: "Czy program sam wyśle formularz?", answer: "Nie. QuizSolver działa wyłącznie jako asystent wyświetlający podpowiedzi. Ostateczna decyzja i wysłanie formularza zawsze należą do Ciebie." }
      ]
    },
    microsoftForms: {
      platformName: "Microsoft Forms",
      shortName: "MS Forms",
      badge: "MS Forms Integration",
      title: "AI Solver do Microsoft Forms",
      subtitle: "Sugestie odpowiedzi i logiczne wyjaśnienia dla testów i quizów Microsoft Forms.",
      meta: { title: "Microsoft Forms AI Quiz Solver | Wsparcie Testów MS Forms", description: "Błyskawicznie rozwiązuj testy i ankiety Microsoft Forms dzięki sztucznej inteligencji. Otrzymuj precyzyjne podpowiedzi." },
      stepsTitle: "Jak używać na MS Forms",
      steps: ["Przejdź do testu Microsoft Forms w swojej przeglądarce.", "Uruchom rozszerzenie QuizSolver, by przeanalizować stronę.", "Odbierz precyzyjne wskazówki do wszystkich widocznych pytań."],
      features: ["Obsługa pytań jednokrotnego oraz wielokrotnego wyboru", "Zapisywanie pytań otwartych do historii nauki", "Pełna kompatybilność z formularzami anonimowymi"],
      keywordSections: [
        { title: "Inteligentne wsparcie na MS Forms", text: "Testy Microsoft Forms są powszechnie stosowane na uczelniach i w firmach. Zadbaj o wysokie oceny i zweryfikuj swoją wiedzę z pomocą sztucznej inteligencji." }
      ],
      faq: [
        { question: "Czy mogę używać na telefonie?", answer: "Rozszerzenie działa w przeglądarce Chrome na komputerach. Z kolei na smartfonie możesz wygodnie przeglądać swoją historię pytań, edytować notatki i rozwiązywać quizy powtórkowe." }
      ]
    },
    blackboard: {
      platformName: "Blackboard",
      shortName: "Blackboard",
      badge: "Blackboard Learn",
      title: "AI Solver do platformy Blackboard",
      subtitle: "Inteligentne wsparcie przy testach i quizach na platformie Blackboard Learn.",
      meta: { title: "Blackboard AI Quiz Solver | Rozwiązuj Testy z AI", description: "Błyskawiczne odpowiedzi i analizy na platformie Blackboard Learn z użyciem AI. Zwiększ efektywność swojej nauki." },
      stepsTitle: "Jak używać na Blackboard",
      steps: ["Zaloguj się do portalu uczelnianego Blackboard.", "Otwórz test, quiz lub zadanie domowe.", "Uruchom QuizSolver, aby błyskawicznie zweryfikować poprawne odpowiedzi."],
      features: ["Pełne dopasowanie do specyficznego formatowania Blackboard", "Szczegółowe wyjaśnienia skomplikowanych pojęć i teorii", "Skanowanie i analiza pytań w czasie rzeczywistym"],
      keywordSections: [
        { title: "Bezstresowa nauka na platformie Blackboard", text: "Egzaminy i testy na Blackboard Learn potrafią być dużym wyzwaniem. QuizSolver ułatwia weryfikację wiedzę, pomaga unikać błędów i pozwala lepiej zrozumieć trudne tematy." }
      ],
      faq: [
        { question: "Czy wspiera wersję Blackboard Ultra?", answer: "Tak, rozszerzenie jest w pełni kompatybilne zarówno z klasycznym widokkiem Blackboard Learn, jak i z najnowszym interfejsem Blackboard Ultra." }
      ]
    },
    quizlet: {
      platformName: "Quizlet",
      shortName: "Quizlet",
      badge: "Quizlet Study Helper",
      title: "AI Solver i Pomocnik do Quizlet",
      subtitle: "Maksymalizuj efekty nauki z fiszkami i zestawami testów Quizlet dzięki AI.",
      meta: { title: "Quizlet AI Solver | Rozwiązuj Fiszki i Testy", description: "Rozwiązuj testy i dopasowania w Quizlet z pomocą sztucznej inteligencji. Ucz się języków i definicji szybciej." },
      stepsTitle: "Jak używać na Quizlet",
      steps: ["Otwórz dowolny zestaw fiszek lub test próbny na Quizlet.", "Uruchom rozszerzenie QuizSolver jednym kliknięciem.", "Porównuj sugerowane odpowiedzi z własnymi i ucz się wydajniej."],
      features: ["Wsparcie dla trybu nauki (Learn Mode) na Quizlet", "Pomoc przy ćwiczeniach pisemnych i otwartych", "Szybkie dopasowywanie definicji do pojęć"],
      keywordSections: [
        { title: "Błyskawiczne opanowanie definicji", text: "Nie trać czasu na żmudne zgadywanie. Sprawdzaj tłumaczenia, słówka i skomplikowaną terminologię natychmiast podczas nauki z fiszkami." }
      ],
      faq: [
        { question: "Czy pomaga w grze Dopasowania?", answer: "Tak, QuizSolver potrafi szybko wskazać poprawne dopasowania słówek i definicji, co znacznie przyspiesza naukę pamięciową." }
      ]
    },
    socrative: {
      platformName: "Socrative",
      shortName: "Socrative",
      badge: "Socrative Real-Time",
      title: "AI Solver do platformy Socrative",
      subtitle: "Błyskawiczne odpowiedzi i wyjaśnienia na żywo dla platformy Socrative.",
      meta: { title: "Socrative AI Quiz Solver | Odpowiedzi na Żywo", description: "Rozwiązuj quizy i wejściówki Socrative w czasie rzeczywistym dzięki sztucznej inteligencji. Otrzymuj natychmiastowe wyjaśnienia." },
      stepsTitle: "Jak używać na Socrative",
      steps: ["Dołącz do pokoju Socrative (Socrative Room) wskazanego przez prowadzącego.", "Gdy na ekranie pojawi się pytanie, kliknij ikonę QuizSolver.", "Błyskawicznie zapoznaj się z sugerowanymi odpowiedziami i uzasadnieniem AI."],
      features: ["Błyskawiczna synchronizacja w czasie rzeczywistym", "Automatyczne wykrywanie pytań jedno- i wielokrotnego wyboru", "Szczegółowe wyjaśnienia pojęć trudnych do zapamiętania"],
      keywordSections: [
        { title: "Wsparcie w quizach na żywo", text: "Gdy nauczyciel uruchamia szybką wejściówkę lub quiz na Socrative, bądź zawsze przygotowany. Zdobądź sugerowaną odpowiedź w kilka sekund i od razu zrozum dane zagadnienie." }
      ],
      faq: [
        { question: "Czy działa w trybie nauczyciela?", answer: "Narzędzie zostało stworzone z myślą o uczniach i studentach w celu weryfikacji wiedzy, ale nauczyciele również mogą z niego korzystać, aby przetestować trudność własnych pytań." }
      ]
    },
    kahoot: {
      platformName: "Kahoot",
      shortName: "Kahoot",
      badge: "Kahoot Quiz ID",
      title: "Kahoot AI Bot i bank odpowiedzi",
      subtitle: "QuizSolver działa w dwóch trybach: automatycznie rozwiązuje widoczne pytania albo pokazuje bank odpowiedzi po Quiz ID, gdy host ukrywa pytania.",
      meta: { title: "Kahoot AI Bot i Quiz ID Answer Bank | QuizSolver", description: "Rozwiązuj widoczne pytania Kahoot z AI albo użyj Quiz ID, żeby zobaczyć pełny bank pytań i poprawnych odpowiedzi w panelu rozszerzenia." },
      stepsTitle: "Jak używać na Kahoot",
      steps: ["Wejdź na kahoot.it/instructions albo do lobby Kahoota.", "Wybierz Rozwiąż cały quiz, jeśli pytania i kafelki odpowiedzi są widoczne na Twoim urządzeniu.", "Jeśli host ukrywa pytania, skopiuj Quiz ID z adresu URL po quizId= i wczytaj listę pytań z poprawnymi odpowiedziami."],
      features: ["Tryb auto obserwuje widoczne pytania Kahoot i klika najlepszą odpowiedź", "Tryb Quiz ID pokazuje bank odpowiedzi bez zużywania kredytów AI", "Pływający panel z wyszukiwarką działa wygodnie na komputerze i telefonie"],
      note: "Quiz ID to nie PIN do gry na żywo. Znajdziesz go w adresie Kahoota po quizId=, np. play.kahoot.it/v2/lobby?quizId=...",
      keywordSections: [
        { title: "Dwa tryby działania dla Kahoota", text: "Nie każdy Kahoot pokazuje pytania na urządzeniu gracza. Dlatego QuizSolver obsługuje dwa scenariusze: automatyczne odpowiadanie na widoczne pytania oraz bank odpowiedzi po Quiz ID, gdy host ukrywa treść quizu." },
        { title: "Co to Quiz ID w Kahoot?", text: "Quiz ID to długi identyfikator quizu widoczny w linku do lobby lub podglądu Kahoota. Wklej go do panelu rozszerzenia, żeby zobaczyć wyszukiwalną listę pytań i poprawnych odpowiedzi." }
      ],
      faq: [
        { question: "Czy Quiz ID to to samo co PIN Kahoota?", answer: "Nie. PIN służy do dołączenia do gry na żywo. Quiz ID identyfikuje sam quiz i zwykle znajduje się w adresie URL po quizId=." },
        { question: "Czy tryb Quiz ID zużywa kredyty?", answer: "Nie. Tryb Quiz ID wczytuje strukturę quizu Kahoot i nie wysyła pytania do AI, więc nie zużywa kredytów." },
        { question: "Czy QuizSolver może automatycznie klikać odpowiedzi?", answer: "Tak, jeśli pytania i odpowiedzi są widoczne na Twoim urządzeniu. Gdy host je ukrywa, użyj trybu Quiz ID." }
      ]
    },
    quizizz: {
      platformName: "Quizizz",
      shortName: "Quizizz",
      badge: "Quizizz Pomocnik",
      title: "AI Solver i Pomocnik do Quizizz",
      subtitle: "Rozwiązuj zadania i testy na Quizizz z natychmiastowym wsparciem sztucznej inteligencji.",
      meta: { title: "Quizizz AI Solver & Helper | Rozwiązuj Quizizz z AI", description: "Otrzymuj precyzyjne odpowiedzi i logiczne objaśnienia do testów na Quizizz. Ucz się bez zgadywania." },
      stepsTitle: "Jak używać na Quizizz",
      steps: ["Otwórz grę lub zadanie domowe na platformie Quizizz.", "Uruchom rozszerzenie przeglądarki QuizSolver.", "Przeanalizuj sugerowane odpowiedzi i zweryfikuj swoje postępy."],
      features: ["Wsparcie dla trybu zadań domowych (Homework Mode)", "Objaśnienia krok po kroku", "Wygodne robienie notatek przy pytaniach"],
      keywordSections: [
        { title: "Zwiększ skuteczność na Quizizz", text: "Koniec ze zgadywaniem. QuizSolver analizuje fakty i dostarcza logiczne uzasadnienia, dzięki czemu rzeczywiście przyswajasz materiał podczas nauki." }
      ],
      faq: [
        { question: "Czy wspiera konta szkolne?", answer: "Tak, rozszerzenie działa lokalnie w Twojej przeglądarce, więc nie ma znaczenia, jakiego rodzaju konta Quizizz używasz." }
      ]
    }
  }
};

export type PageKey =
  | 'home'
  | 'dashboard'
  | 'credits'
  | 'quiz'
  | 'demo'
  | 'quizSolverAi'
  | 'testportal'
  | 'moodle'
  | 'canvas'
  | 'googleForms'
  | 'microsoftForms'
  | 'blackboard'
  | 'quizlet'
  | 'socrative'
  | 'kahoot'
  | 'quizizz'
  | 'privacy'
  | 'notFound'
  | 'success';



export const SITE_URL = 'https://getquizsolver.com';
export const CHROME_WEB_STORE_URL =
  'https://chromewebstore.google.com/detail/quiz-solver-pro/cjchfdnplpjkihigljnicebnhjkpndik';

type ExtraLocale = Exclude<Locale, 'en' | 'pl'>;

interface LocalizedSiteBundle {
  homeTitle: string;
  homeSubtitle: string;
  homeMetaTitle: string;
  homeMetaDescription: string;
  common: Record<string, string>;
  nav: Record<string, string>;
  footer: Record<string, string>;
  auth: Record<string, string>;
  shell: Record<string, string>;
  privacyPage: SiteCopy['privacyPage'];
  dashboardPage: SiteCopy['dashboardPage'];
  creditsPage: SiteCopy['creditsPage'];
  quizPage: SiteCopy['quizPage'];
  demoPage: SiteCopy['demoPage'];
  successPage: SiteCopy['successPage'];
  notFoundPage: SiteCopy['notFoundPage'];
  platform: {
    badge: string;
    title: (name: string) => string;
    subtitle: (name: string) => string;
    metaTitle: (name: string) => string;
    metaDescription: (name: string) => string;
    stepsTitle: string;
    steps: (name: string) => string[];
    features: (name: string) => string[];
    keywordTitle: (name: string) => string;
    keywordText: (name: string) => string;
    faqQuestion: (name: string) => string;
    faqAnswer: (name: string) => string;
  };
}

const LOCALIZED_SITE: Record<ExtraLocale, LocalizedSiteBundle> = {
  de: {
    homeTitle: 'KI-Quiz-Solver Chrome-Erweiterung',
    homeSubtitle: 'Löse Quizze auf Testportal, Moodle und weiteren Plattformen mit KI',
    homeMetaTitle: 'QuizSolver | KI Quiz Solver, Kahoot Bot und Quiz Helper',
    homeMetaDescription: 'Chrome KI-Quiz-Solver für Testportal, Moodle, Canvas, Google Forms, Kahoot und mehr. Antwort-Hinweise, Erklärungen, FocusScan und Lernhistorie.',
    common: { credits: 'Credits', dashboard: 'Dashboard', buyCredits: 'Credits kaufen', logout: 'Abmelden', createAccount: 'Konto erstellen', email: 'E-Mail-Adresse', password: 'Passwort', confirmPassword: 'Passwort bestätigen', rememberMe: 'Angemeldet bleiben', signIn: 'Anmelden', displayName: 'Anzeigename (optional)', referralCode: 'Empfehlungscode (optional)', loading: 'Wird geladen...', close: 'Schließen', demo: 'Demo', historyQuiz: 'Historie & Quiz' },
    nav: { how: 'So funktioniert es', features: 'Funktionen', pricing: 'Preise', login: 'Einloggen', signup: 'Registrieren', toggle: 'Menü öffnen' },
    footer: { product: 'Produkt', seoPages: 'Unterstützte Plattformen', legal: 'Rechtliches', privacy: 'Datenschutz', rights: '© 2026 QuizSolver. Alle Rechte vorbehalten.', description: 'QuizSolver KI-Quiz-Solver Chrome-Erweiterung.' },
    auth: { loginTitle: 'Willkommen zurück', loginSubtitle: 'Melde dich bei deinem QuizSolver-Konto an.', showRegister: 'Noch kein Konto?', showRegisterLink: 'Registrieren', registerTitle: 'Konto erstellen', showLogin: 'Schon registriert?', showLoginLink: 'Einloggen' },
    shell: { readyEyebrow: 'Bereit zur Installation?', readyTitle: 'Füge QuizSolver zu Chrome hinzu und starte mit deinem ersten Quiz.', readyDesc: 'Erweiterung, Fragenhistorie, Notizen und Übungen laufen über ein Konto.', openStore: 'Chrome Web Store öffnen', footerDesc: 'Chrome-Erweiterung für Antwortvorschläge, Erklärungen, Notizen und Wiederholungen.', continueGoogle: 'Mit Google fortfahren', signupGoogle: 'Mit Google registrieren', or: 'oder', forgotPassword: 'Passwort vergessen?', referralInfo: 'Der Empfehlungscode ist optional. Empfehlende erhalten 5% der von dir gekauften Credits als Bonus.', verifyEmail: 'E-Mail bestätigen', verifyEmailText: 'Gib den 6-stelligen Code ein, den wir gesendet haben an:', verifyAndLogin: 'Bestätigen und anmelden', noCode: 'Kein Code erhalten?', resendCode: 'Erneut senden', resetPassword: 'Passwort zurücksetzen', resetPasswordText: 'Gib deine E-Mail ein, dann senden wir dir einen Code.', sendCode: 'Code senden', backToLogin: 'Zurück zum Login', setNewPassword: 'Neues Passwort setzen', setNewPasswordText: 'Gib den E-Mail-Code und dein neues Passwort ein.', changePassword: 'Passwort ändern', mailDisabled: 'E-Mail-Versand ist auf dem Server noch nicht konfiguriert.', testCode: 'Testcode', verificationSent: 'Wir haben einen Bestätigungscode per E-Mail gesendet.', loginFailed: 'Login fehlgeschlagen.', passwordsMismatch: 'Die Passwörter stimmen nicht überein.', registerFailed: 'Registrierung fehlgeschlagen.', invalidCode: 'Der Code ist ungültig oder abgelaufen.', alreadyVerified: 'Diese E-Mail ist bereits bestätigt.', newCodeSent: 'Wir haben einen neuen Code gesendet.', codeSendFailed: 'Der Code konnte nicht gesendet werden.', resetSent: 'Falls das Konto existiert, haben wir einen Reset-Code gesendet.', resetStartFailed: 'Passwort-Reset konnte nicht gestartet werden.', passwordChanged: 'Passwort geändert. Du kannst dich anmelden.', passwordChangeFailed: 'Passwort konnte nicht geändert werden.' },
    privacyPage: { metaTitle: 'Datenschutz | QuizSolver', metaDescription: 'Wie QuizSolver deine Daten sammelt, verarbeitet und schützt.', title: 'Datenschutz', badge: 'Datenschutz & Sicherheit', subtitle: 'Wir schützen deine Daten und respektieren deine Privatsphäre.', effective: 'Gültig ab: 21. Mai 2026', contactLabel: 'Support kontaktieren', contactValue: 'support@getquizsolver.com', sections: [{ title: '1. Datenerfassung und Kontrolle', text: 'Wir erfassen nur Daten, die für Konto, Credits und den QuizSolver-Dienst nötig sind.', items: ['Kontodaten: E-Mail, Anzeigename und verschlüsseltes Passwort.', 'Nutzungsdaten: gelöste Fragen, Credits und Käufe.', 'Empfehlungen: Registrierungen und Käufe über deinen Code.'] }, { title: '2. Chrome-Erweiterung und FocusScan', text: 'Die Erweiterung analysiert nur Inhalte, wenn du sie aktiv auslöst.', items: ['Aktives Scannen: sichtbare Fragen und Antwortoptionen.', 'FocusScan: der von dir markierte Bildschirmausschnitt.', 'Kein Tracking anderer Tabs oder des Browserverlaufs.'] }, { title: '3. Zahlungen', text: 'Zahlungen werden sicher über Stripe verarbeitet. Wir speichern keine Kartennummern.' }, { title: '4. Weitergabe', text: 'Wir verkaufen oder vermieten keine persönlichen Daten.' }, { title: '5. Deine Rechte', text: 'Du kannst deine Daten einsehen, ändern oder löschen lassen.', items: ['Export deiner gespeicherten Fragen.', 'Kontolöschung über Einstellungen oder Support.'] }] },
    dashboardPage: { metaTitle: 'Dashboard | QuizSolver', metaDescription: 'Verwalte Credits, Käufe, Empfehlungslink und Kontostatistiken.', title: 'Dashboard', loginTitle: 'Dashboard öffnen', loginText: 'Melde dich an oder erstelle ein Konto, um Credits und Käufe zu verwalten.', loginButton: 'Einloggen / Registrieren' },
    creditsPage: { metaTitle: 'Credits kaufen | QuizSolver', metaDescription: 'Lade QuizSolver-Credits für Antworten, Erklärungen und Lernwerkzeuge auf.', title: 'Credits kaufen' },
    quizPage: { metaTitle: 'Historie & Übungsquiz | QuizSolver', metaDescription: 'Überprüfe gespeicherte Fragen, Notizen, Karteikarten und geteilte Quizze.', title: 'Historie und Quiz' },
    demoPage: { metaTitle: 'Interaktive Erweiterungsdemo | QuizSolver', metaDescription: 'Teste QuizSolver in einem sicheren Demo-Quiz ohne Credit-Verbrauch.', title: 'Interaktive Demo' },
    successPage: { metaTitle: 'Zahlung erfolgreich | QuizSolver', metaDescription: 'Danke! Deine Credits wurden gutgeschrieben.', badge: 'Erfolg', title: 'Zahlung erfolgreich', subtitle: 'Deine Credits sind einsatzbereit.', dashboardCta: 'Dashboard öffnen', storeCta: 'Erweiterung installieren' },
    notFoundPage: { metaTitle: '404 Seite nicht gefunden | QuizSolver', metaDescription: 'Diese Seite existiert nicht.', badge: '404', title: 'Seite nicht gefunden', subtitle: 'Diese Seite existiert nicht oder der Link ist abgelaufen.', homeCta: 'Zur Startseite', storeCta: 'Erweiterung installieren' },
    platform: { badge: 'Workflow', title: (name) => `${name} mit QuizSolver lösen`, subtitle: (name) => `Erhalte KI-Antwortvorschläge, Erklärungen und Lernhistorie für ${name}.`, metaTitle: (name) => `${name} KI Quiz Solver | QuizSolver`, metaDescription: (name) => `Löse ${name}-Quizze mit KI-Antwortvorschlägen, Erklärungen und gespeicherter Lernhistorie.`, stepsTitle: 'So verwendest du QuizSolver', steps: (name) => [`Öffne dein Quiz auf ${name}.`, 'Starte die QuizSolver-Erweiterung.', 'Prüfe die vorgeschlagenen Antworten und Erklärungen.'], features: () => ['Schnelle KI-Antwortvorschläge', 'Kurze Erklärungen', 'Speichern in der Lernhistorie'], keywordTitle: (name) => `Besser lernen mit ${name}`, keywordText: (name) => `QuizSolver hilft dir, Fragen auf ${name} schneller zu verstehen und später gezielt zu wiederholen.`, faqQuestion: (name) => `Funktioniert QuizSolver mit ${name}?`, faqAnswer: (name) => `Ja. QuizSolver erkennt sichtbare Fragen auf ${name} und kann bei Bedarf FocusScan verwenden.` }
  },
  es: {
    homeTitle: 'Extensión Chrome de IA para resolver quizzes',
    homeSubtitle: 'Resuelve quizzes en Testportal, Moodle y más con IA',
    homeMetaTitle: 'QuizSolver | AI Quiz Solver, Kahoot Bot y Quiz Helper',
    homeMetaDescription: 'Extensión Chrome para quizzes en Testportal, Moodle, Canvas, Google Forms, Kahoot y más. Pistas, explicaciones, FocusScan e historial.',
    common: { credits: 'Créditos', dashboard: 'Panel', buyCredits: 'Comprar créditos', logout: 'Cerrar sesión', createAccount: 'Crear cuenta', email: 'Correo electrónico', password: 'Contraseña', confirmPassword: 'Confirmar contraseña', rememberMe: 'Recordarme', signIn: 'Iniciar sesión', displayName: 'Nombre visible (opcional)', referralCode: 'Código de referido (opcional)', loading: 'Cargando...', close: 'Cerrar', demo: 'Demo', historyQuiz: 'Historial y quiz' },
    nav: { how: 'Cómo funciona', features: 'Funciones', pricing: 'Precios', login: 'Entrar', signup: 'Registrarse', toggle: 'Abrir menú' },
    footer: { product: 'Producto', seoPages: 'Plataformas compatibles', legal: 'Legal', privacy: 'Privacidad', rights: '© 2026 QuizSolver. Todos los derechos reservados.', description: 'Extensión Chrome QuizSolver para resolver quizzes con IA.' },
    auth: { loginTitle: 'Bienvenido de nuevo', loginSubtitle: 'Inicia sesión en tu cuenta de QuizSolver.', showRegister: '¿No tienes cuenta?', showRegisterLink: 'Regístrate', registerTitle: 'Crear cuenta', showLogin: '¿Ya tienes cuenta?', showLoginLink: 'Entrar' },
    shell: { readyEyebrow: '¿Listo para instalar?', readyTitle: 'Añade QuizSolver a Chrome y empieza con tu primer quiz.', readyDesc: 'La extensión, el historial, las notas y la práctica funcionan en una sola cuenta.', openStore: 'Abrir Chrome Web Store', footerDesc: 'Extensión Chrome para sugerencias, explicaciones, notas y repasos.', continueGoogle: 'Continuar con Google', signupGoogle: 'Registrarse con Google', or: 'o', forgotPassword: '¿Olvidaste tu contraseña?', referralInfo: 'El código de referido es opcional. Quien te refirió recibe un 5% de los créditos que compres.', verifyEmail: 'Verificar correo', verifyEmailText: 'Introduce el código de 6 dígitos enviado a:', verifyAndLogin: 'Verificar e iniciar sesión', noCode: '¿No llegó el código?', resendCode: 'Reenviar', resetPassword: 'Restablecer contraseña', resetPasswordText: 'Introduce tu correo y enviaremos un código.', sendCode: 'Enviar código', backToLogin: 'Volver al login', setNewPassword: 'Nueva contraseña', setNewPasswordText: 'Introduce el código y la nueva contraseña.', changePassword: 'Cambiar contraseña', mailDisabled: 'El envío de emails aún no está configurado en el servidor.', testCode: 'Código de prueba', verificationSent: 'Enviamos un código de verificación por email.', loginFailed: 'No se pudo iniciar sesión.', passwordsMismatch: 'Las contraseñas no coinciden.', registerFailed: 'No se pudo registrar.', invalidCode: 'El código es inválido o expiró.', alreadyVerified: 'Este email ya está verificado.', newCodeSent: 'Enviamos un nuevo código.', codeSendFailed: 'No se pudo enviar el código.', resetSent: 'Si la cuenta existe, enviamos un código de restablecimiento.', resetStartFailed: 'No se pudo iniciar el restablecimiento.', passwordChanged: 'Contraseña cambiada. Ya puedes iniciar sesión.', passwordChangeFailed: 'No se pudo cambiar la contraseña.' },
    privacyPage: { metaTitle: 'Privacidad | QuizSolver', metaDescription: 'Cómo QuizSolver recopila, procesa y protege tu información.', title: 'Privacidad', badge: 'Privacidad y seguridad', subtitle: 'Protegemos tus datos y respetamos tu privacidad.', effective: 'Fecha efectiva: 21 de mayo de 2026', contactLabel: 'Soporte', contactValue: 'support@getquizsolver.com', sections: [{ title: '1. Datos y control', text: 'Recopilamos solo la información necesaria para la cuenta, los créditos y el servicio.', items: ['Cuenta: email, nombre visible y contraseña cifrada.', 'Uso: preguntas resueltas, créditos y compras.', 'Referidos: registros y compras vinculadas a tu código.'] }, { title: '2. Extensión y FocusScan', text: 'La extensión analiza contenido solo cuando la activas.', items: ['Escaneo activo de preguntas y opciones visibles.', 'FocusScan usa el área de pantalla que seleccionas.', 'No registramos otras pestañas ni historial.'] }, { title: '3. Pagos', text: 'Los pagos se procesan de forma segura con Stripe.' }, { title: '4. Compartición', text: 'No vendemos ni alquilamos tus datos personales.' }, { title: '5. Tus derechos', text: 'Puedes acceder, modificar o eliminar tus datos.', items: ['Exportar preguntas guardadas.', 'Eliminar tu cuenta desde ajustes o soporte.'] }] },
    dashboardPage: { metaTitle: 'Panel | QuizSolver', metaDescription: 'Gestiona créditos, compras, enlace de referido y estadísticas.', title: 'Panel de usuario', loginTitle: 'Accede a tu panel', loginText: 'Inicia sesión o crea una cuenta para gestionar tus créditos.', loginButton: 'Entrar / Registrarse' },
    creditsPage: { metaTitle: 'Comprar créditos | QuizSolver', metaDescription: 'Recarga créditos para respuestas, explicaciones y herramientas de estudio.', title: 'Comprar créditos' },
    quizPage: { metaTitle: 'Historial y práctica | QuizSolver', metaDescription: 'Revisa preguntas guardadas, notas, flashcards y quizzes compartidos.', title: 'Historial y quiz' },
    demoPage: { metaTitle: 'Demo interactiva | QuizSolver', metaDescription: 'Prueba QuizSolver en un demo seguro sin usar créditos.', title: 'Demo interactiva' },
    successPage: { metaTitle: 'Pago correcto | QuizSolver', metaDescription: 'Gracias. Tus créditos se añadieron correctamente.', badge: 'Éxito', title: 'Pago correcto', subtitle: 'Tus créditos ya están listos.', dashboardCta: 'Abrir panel', storeCta: 'Instalar extensión' },
    notFoundPage: { metaTitle: '404 Página no encontrada | QuizSolver', metaDescription: 'La página no existe.', badge: '404', title: 'Página no encontrada', subtitle: 'La página no existe o el enlace expiró.', homeCta: 'Volver al inicio', storeCta: 'Instalar extensión' },
    platform: { badge: 'Flujo', title: (name) => `Resolver ${name} con QuizSolver`, subtitle: (name) => `Obtén sugerencias de IA, explicaciones e historial de estudio para ${name}.`, metaTitle: (name) => `${name} AI Quiz Solver | QuizSolver`, metaDescription: (name) => `Resuelve quizzes de ${name} con sugerencias de IA, explicaciones e historial guardado.`, stepsTitle: 'Cómo usar QuizSolver', steps: (name) => [`Abre tu quiz en ${name}.`, 'Inicia la extensión QuizSolver.', 'Revisa las respuestas y explicaciones sugeridas.'], features: () => ['Sugerencias rápidas de IA', 'Explicaciones breves', 'Historial de estudio guardado'], keywordTitle: (name) => `Estudia mejor con ${name}`, keywordText: (name) => `QuizSolver te ayuda a entender preguntas de ${name} y repasarlas más tarde.`, faqQuestion: (name) => `¿Funciona QuizSolver con ${name}?`, faqAnswer: (name) => `Sí. QuizSolver detecta preguntas visibles en ${name} y también puede usar FocusScan.` }
  },
  fr: {
    homeTitle: 'Extension Chrome IA pour résoudre des quiz',
    homeSubtitle: 'Résolvez des quiz sur Testportal, Moodle et plus avec l’IA',
    homeMetaTitle: 'QuizSolver | AI Quiz Solver, Kahoot Bot et Quiz Helper',
    homeMetaDescription: 'Extension Chrome pour Testportal, Moodle, Canvas, Google Forms, Kahoot et plus. Indices, explications, FocusScan et historique de révision.',
    common: { credits: 'Crédits', dashboard: 'Tableau de bord', buyCredits: 'Acheter des crédits', logout: 'Déconnexion', createAccount: 'Créer un compte', email: 'Adresse e-mail', password: 'Mot de passe', confirmPassword: 'Confirmer le mot de passe', rememberMe: 'Se souvenir de moi', signIn: 'Connexion', displayName: 'Nom affiché (optionnel)', referralCode: 'Code de parrainage (optionnel)', loading: 'Chargement...', close: 'Fermer', demo: 'Démo', historyQuiz: 'Historique et quiz' },
    nav: { how: 'Fonctionnement', features: 'Fonctions', pricing: 'Tarifs', login: 'Connexion', signup: 'Inscription', toggle: 'Ouvrir le menu' },
    footer: { product: 'Produit', seoPages: 'Plateformes prises en charge', legal: 'Légal', privacy: 'Confidentialité', rights: '© 2026 QuizSolver. Tous droits réservés.', description: 'Extension Chrome QuizSolver pour résoudre des quiz avec l’IA.' },
    auth: { loginTitle: 'Bon retour', loginSubtitle: 'Connectez-vous à votre compte QuizSolver.', showRegister: 'Pas encore de compte ?', showRegisterLink: 'S’inscrire', registerTitle: 'Créer un compte', showLogin: 'Déjà un compte ?', showLoginLink: 'Connexion' },
    shell: { readyEyebrow: 'Prêt à installer ?', readyTitle: 'Ajoutez QuizSolver à Chrome et commencez votre premier quiz.', readyDesc: 'Extension, historique, notes et entraînement fonctionnent avec un seul compte.', openStore: 'Ouvrir Chrome Web Store', footerDesc: 'Extension Chrome pour suggestions, explications, notes et révisions.', continueGoogle: 'Continuer avec Google', signupGoogle: 'S’inscrire avec Google', or: 'ou', forgotPassword: 'Mot de passe oublié ?', referralInfo: 'Le code de parrainage est optionnel. Le parrain reçoit 5% des crédits achetés.', verifyEmail: 'Vérifier l’e-mail', verifyEmailText: 'Entrez le code à 6 chiffres envoyé à :', verifyAndLogin: 'Vérifier et se connecter', noCode: 'Code non reçu ?', resendCode: 'Renvoyer', resetPassword: 'Réinitialiser le mot de passe', resetPasswordText: 'Entrez votre e-mail et nous enverrons un code.', sendCode: 'Envoyer le code', backToLogin: 'Retour à la connexion', setNewPassword: 'Nouveau mot de passe', setNewPasswordText: 'Entrez le code e-mail et votre nouveau mot de passe.', changePassword: 'Changer le mot de passe', mailDisabled: 'L’envoi d’e-mails n’est pas encore configuré sur le serveur.', testCode: 'Code de test', verificationSent: 'Nous avons envoyé un code de vérification par e-mail.', loginFailed: 'Connexion impossible.', passwordsMismatch: 'Les mots de passe ne correspondent pas.', registerFailed: 'Inscription impossible.', invalidCode: 'Le code est invalide ou expiré.', alreadyVerified: 'Cet e-mail est déjà vérifié.', newCodeSent: 'Nouveau code envoyé.', codeSendFailed: 'Impossible d’envoyer le code.', resetSent: 'Si le compte existe, nous avons envoyé un code.', resetStartFailed: 'Impossible de démarrer la réinitialisation.', passwordChanged: 'Mot de passe modifié. Vous pouvez vous connecter.', passwordChangeFailed: 'Impossible de changer le mot de passe.' },
    privacyPage: { metaTitle: 'Confidentialité | QuizSolver', metaDescription: 'Comment QuizSolver collecte, traite et protège vos informations.', title: 'Confidentialité', badge: 'Confidentialité et sécurité', subtitle: 'Nous protégeons vos données et respectons votre vie privée.', effective: 'Date d’effet : 21 mai 2026', contactLabel: 'Support', contactValue: 'support@getquizsolver.com', sections: [{ title: '1. Données et contrôle', text: 'Nous collectons uniquement les données nécessaires au compte, aux crédits et au service.', items: ['Compte : e-mail, nom affiché et mot de passe chiffré.', 'Usage : questions résolues, crédits et achats.', 'Parrainage : inscriptions et achats liés à votre code.'] }, { title: '2. Extension et FocusScan', text: 'L’extension analyse le contenu uniquement quand vous l’activez.', items: ['Scan actif des questions et options visibles.', 'FocusScan utilise la zone d’écran sélectionnée.', 'Aucun suivi des autres onglets ou de l’historique.'] }, { title: '3. Paiements', text: 'Les paiements sont traités en sécurité par Stripe.' }, { title: '4. Partage', text: 'Nous ne vendons ni ne louons vos données personnelles.' }, { title: '5. Vos droits', text: 'Vous pouvez consulter, modifier ou supprimer vos données.', items: ['Exporter vos questions enregistrées.', 'Supprimer votre compte via les paramètres ou le support.'] }] },
    dashboardPage: { metaTitle: 'Tableau de bord | QuizSolver', metaDescription: 'Gérez crédits, achats, parrainage et statistiques.', title: 'Tableau de bord', loginTitle: 'Accéder au tableau de bord', loginText: 'Connectez-vous ou créez un compte pour gérer vos crédits.', loginButton: 'Connexion / Inscription' },
    creditsPage: { metaTitle: 'Acheter des crédits | QuizSolver', metaDescription: 'Rechargez des crédits QuizSolver pour réponses, explications et outils d’étude.', title: 'Acheter des crédits' },
    quizPage: { metaTitle: 'Historique et entraînement | QuizSolver', metaDescription: 'Consultez vos questions, notes, cartes et quiz partagés.', title: 'Historique et quiz' },
    demoPage: { metaTitle: 'Démo interactive | QuizSolver', metaDescription: 'Essayez QuizSolver sur une démo sûre sans utiliser de crédits.', title: 'Démo interactive' },
    successPage: { metaTitle: 'Paiement réussi | QuizSolver', metaDescription: 'Merci. Vos crédits ont été ajoutés.', badge: 'Succès', title: 'Paiement réussi', subtitle: 'Vos crédits sont prêts.', dashboardCta: 'Ouvrir le tableau', storeCta: 'Installer l’extension' },
    notFoundPage: { metaTitle: '404 Page introuvable | QuizSolver', metaDescription: 'Cette page n’existe pas.', badge: '404', title: 'Page introuvable', subtitle: 'Cette page n’existe pas ou le lien a expiré.', homeCta: 'Retour à l’accueil', storeCta: 'Installer l’extension' },
    platform: { badge: 'Workflow', title: (name) => `Résoudre ${name} avec QuizSolver`, subtitle: (name) => `Recevez des suggestions IA, des explications et un historique pour ${name}.`, metaTitle: (name) => `${name} AI Quiz Solver | QuizSolver`, metaDescription: (name) => `Résolvez des quiz ${name} avec suggestions IA, explications et historique enregistré.`, stepsTitle: 'Comment utiliser QuizSolver', steps: (name) => [`Ouvrez votre quiz sur ${name}.`, 'Lancez l’extension QuizSolver.', 'Vérifiez les réponses et explications proposées.'], features: () => ['Suggestions IA rapides', 'Explications courtes', 'Historique d’étude enregistré'], keywordTitle: (name) => `Mieux étudier avec ${name}`, keywordText: (name) => `QuizSolver vous aide à comprendre les questions sur ${name} et à les réviser plus tard.`, faqQuestion: (name) => `QuizSolver fonctionne-t-il avec ${name} ?`, faqAnswer: (name) => `Oui. QuizSolver détecte les questions visibles sur ${name} et peut aussi utiliser FocusScan.` }
  },
  it: {
    homeTitle: 'Estensione Chrome AI per quiz',
    homeSubtitle: 'Risolvi quiz su Testportal, Moodle e altre piattaforme con l’AI',
    homeMetaTitle: 'QuizSolver | AI Quiz Solver, Kahoot Bot e Quiz Helper',
    homeMetaDescription: 'Estensione Chrome per quiz su Testportal, Moodle, Canvas, Google Forms, Kahoot e altro. Suggerimenti, spiegazioni, FocusScan e cronologia.',
    common: { credits: 'Crediti', dashboard: 'Dashboard', buyCredits: 'Compra crediti', logout: 'Esci', createAccount: 'Crea account', email: 'Indirizzo email', password: 'Password', confirmPassword: 'Conferma password', rememberMe: 'Ricordami', signIn: 'Accedi', displayName: 'Nome visualizzato (opzionale)', referralCode: 'Codice referral (opzionale)', loading: 'Caricamento...', close: 'Chiudi', demo: 'Demo', historyQuiz: 'Cronologia e quiz' },
    nav: { how: 'Come funziona', features: 'Funzioni', pricing: 'Prezzi', login: 'Accedi', signup: 'Registrati', toggle: 'Apri menu' },
    footer: { product: 'Prodotto', seoPages: 'Piattaforme supportate', legal: 'Legale', privacy: 'Privacy', rights: '© 2026 QuizSolver. Tutti i diritti riservati.', description: 'Estensione Chrome QuizSolver per risolvere quiz con l’AI.' },
    auth: { loginTitle: 'Bentornato', loginSubtitle: 'Accedi al tuo account QuizSolver.', showRegister: 'Non hai un account?', showRegisterLink: 'Registrati', registerTitle: 'Crea account', showLogin: 'Hai già un account?', showLoginLink: 'Accedi' },
    shell: { readyEyebrow: 'Pronto per installare?', readyTitle: 'Aggiungi QuizSolver a Chrome e inizia dal primo quiz.', readyDesc: 'Estensione, cronologia, note e pratica funzionano con un solo account.', openStore: 'Apri Chrome Web Store', footerDesc: 'Estensione Chrome per suggerimenti, spiegazioni, note e ripasso.', continueGoogle: 'Continua con Google', signupGoogle: 'Registrati con Google', or: 'oppure', forgotPassword: 'Password dimenticata?', referralInfo: 'Il codice referral è opzionale. Chi ti invita riceve il 5% dei crediti che compri.', verifyEmail: 'Verifica email', verifyEmailText: 'Inserisci il codice di 6 cifre inviato a:', verifyAndLogin: 'Verifica e accedi', noCode: 'Codice non arrivato?', resendCode: 'Invia di nuovo', resetPassword: 'Reimposta password', resetPasswordText: 'Inserisci la tua email e invieremo un codice.', sendCode: 'Invia codice', backToLogin: 'Torna al login', setNewPassword: 'Nuova password', setNewPasswordText: 'Inserisci il codice email e la nuova password.', changePassword: 'Cambia password', mailDisabled: 'L’invio email non è ancora configurato sul server.', testCode: 'Codice test', verificationSent: 'Abbiamo inviato un codice di verifica via email.', loginFailed: 'Accesso non riuscito.', passwordsMismatch: 'Le password non coincidono.', registerFailed: 'Registrazione non riuscita.', invalidCode: 'Il codice non è valido o è scaduto.', alreadyVerified: 'Questa email è già verificata.', newCodeSent: 'Abbiamo inviato un nuovo codice.', codeSendFailed: 'Impossibile inviare il codice.', resetSent: 'Se l’account esiste, abbiamo inviato un codice.', resetStartFailed: 'Impossibile avviare il reset.', passwordChanged: 'Password cambiata. Ora puoi accedere.', passwordChangeFailed: 'Impossibile cambiare password.' },
    privacyPage: { metaTitle: 'Privacy | QuizSolver', metaDescription: 'Come QuizSolver raccoglie, elabora e protegge le informazioni.', title: 'Privacy', badge: 'Privacy e sicurezza', subtitle: 'Proteggiamo i tuoi dati e rispettiamo la tua privacy.', effective: 'Data di entrata in vigore: 21 maggio 2026', contactLabel: 'Supporto', contactValue: 'support@getquizsolver.com', sections: [{ title: '1. Dati e controllo', text: 'Raccogliamo solo dati necessari per account, crediti e servizio.', items: ['Account: email, nome visualizzato e password cifrata.', 'Uso: domande risolte, crediti e acquisti.', 'Referral: registrazioni e acquisti collegati al codice.'] }, { title: '2. Estensione e FocusScan', text: 'L’estensione analizza contenuti solo quando la attivi.', items: ['Scansione attiva di domande e opzioni visibili.', 'FocusScan usa l’area dello schermo selezionata.', 'Nessun tracciamento di altre schede o cronologia.'] }, { title: '3. Pagamenti', text: 'I pagamenti sono gestiti in sicurezza da Stripe.' }, { title: '4. Condivisione', text: 'Non vendiamo né affittiamo dati personali.' }, { title: '5. Diritti', text: 'Puoi consultare, modificare o eliminare i tuoi dati.', items: ['Esportare le domande salvate.', 'Eliminare l’account da impostazioni o supporto.'] }] },
    dashboardPage: { metaTitle: 'Dashboard | QuizSolver', metaDescription: 'Gestisci crediti, acquisti, referral e statistiche.', title: 'Dashboard utente', loginTitle: 'Apri dashboard', loginText: 'Accedi o crea un account per gestire i crediti.', loginButton: 'Accedi / Registrati' },
    creditsPage: { metaTitle: 'Compra crediti | QuizSolver', metaDescription: 'Ricarica crediti QuizSolver per risposte, spiegazioni e strumenti di studio.', title: 'Compra crediti' },
    quizPage: { metaTitle: 'Cronologia e pratica | QuizSolver', metaDescription: 'Rivedi domande salvate, note, flashcard e quiz condivisi.', title: 'Cronologia e quiz' },
    demoPage: { metaTitle: 'Demo interattiva | QuizSolver', metaDescription: 'Prova QuizSolver in una demo sicura senza usare crediti.', title: 'Demo interattiva' },
    successPage: { metaTitle: 'Pagamento riuscito | QuizSolver', metaDescription: 'Grazie. I crediti sono stati aggiunti.', badge: 'Successo', title: 'Pagamento riuscito', subtitle: 'I crediti sono pronti.', dashboardCta: 'Apri dashboard', storeCta: 'Installa estensione' },
    notFoundPage: { metaTitle: '404 Pagina non trovata | QuizSolver', metaDescription: 'Questa pagina non esiste.', badge: '404', title: 'Pagina non trovata', subtitle: 'La pagina non esiste o il link è scaduto.', homeCta: 'Torna alla home', storeCta: 'Installa estensione' },
    platform: { badge: 'Workflow', title: (name) => `Risolvi ${name} con QuizSolver`, subtitle: (name) => `Ottieni suggerimenti AI, spiegazioni e cronologia per ${name}.`, metaTitle: (name) => `${name} AI Quiz Solver | QuizSolver`, metaDescription: (name) => `Risolvi quiz ${name} con suggerimenti AI, spiegazioni e cronologia salvata.`, stepsTitle: 'Come usare QuizSolver', steps: (name) => [`Apri il quiz su ${name}.`, 'Avvia l’estensione QuizSolver.', 'Controlla risposte e spiegazioni suggerite.'], features: () => ['Suggerimenti AI rapidi', 'Spiegazioni brevi', 'Cronologia studio salvata'], keywordTitle: (name) => `Studia meglio con ${name}`, keywordText: (name) => `QuizSolver ti aiuta a capire le domande su ${name} e ripassarle più tardi.`, faqQuestion: (name) => `QuizSolver funziona con ${name}?`, faqAnswer: (name) => `Sì. QuizSolver rileva le domande visibili su ${name} e può usare anche FocusScan.` }
  },
  uk: {
    homeTitle: 'Chrome-розширення AI Quiz Solver',
    homeSubtitle: 'Розв’язуй квізи на Testportal, Moodle та інших платформах за допомогою AI',
    homeMetaTitle: 'QuizSolver | AI Quiz Solver, Kahoot Bot і Quiz Helper',
    homeMetaDescription: 'Chrome-розширення для Testportal, Moodle, Canvas, Google Forms, Kahoot та інших квізів. Підказки, пояснення, FocusScan та історія.',
    common: { credits: 'Кредити', dashboard: 'Панель', buyCredits: 'Купити кредити', logout: 'Вийти', createAccount: 'Створити акаунт', email: 'Електронна пошта', password: 'Пароль', confirmPassword: 'Підтвердити пароль', rememberMe: 'Запам’ятати мене', signIn: 'Увійти', displayName: 'Ім’я (необов’язково)', referralCode: 'Реферальний код (необов’язково)', loading: 'Завантаження...', close: 'Закрити', demo: 'Демо', historyQuiz: 'Історія і квіз' },
    nav: { how: 'Як це працює', features: 'Функції', pricing: 'Ціни', login: 'Увійти', signup: 'Реєстрація', toggle: 'Відкрити меню' },
    footer: { product: 'Продукт', seoPages: 'Підтримувані платформи', legal: 'Правова інформація', privacy: 'Приватність', rights: '© 2026 QuizSolver. Усі права захищені.', description: 'Chrome-розширення QuizSolver для AI-відповідей у квізах.' },
    auth: { loginTitle: 'З поверненням', loginSubtitle: 'Увійди у свій акаунт QuizSolver.', showRegister: 'Немає акаунта?', showRegisterLink: 'Зареєструватися', registerTitle: 'Створити акаунт', showLogin: 'Вже маєш акаунт?', showLoginLink: 'Увійти' },
    shell: { readyEyebrow: 'Готовий встановити?', readyTitle: 'Додай QuizSolver у Chrome і почни з першого квізу.', readyDesc: 'Розширення, історія питань, нотатки і практика працюють з одного акаунта.', openStore: 'Відкрити Chrome Web Store', footerDesc: 'Chrome-розширення для підказок, пояснень, нотаток і повторення.', continueGoogle: 'Продовжити з Google', signupGoogle: 'Зареєструватися через Google', or: 'або', forgotPassword: 'Забув пароль?', referralInfo: 'Реферальний код необов’язковий. Той, хто запросив, отримує 5% куплених кредитів як бонус.', verifyEmail: 'Підтвердити email', verifyEmailText: 'Введи 6-значний код, надісланий на:', verifyAndLogin: 'Підтвердити і увійти', noCode: 'Код не прийшов?', resendCode: 'Надіслати ще раз', resetPassword: 'Скинути пароль', resetPasswordText: 'Введи email, і ми надішлемо код.', sendCode: 'Надіслати код', backToLogin: 'Повернутися до входу', setNewPassword: 'Новий пароль', setNewPasswordText: 'Введи код з email і новий пароль.', changePassword: 'Змінити пароль', mailDisabled: 'Відправлення email ще не налаштоване на сервері.', testCode: 'Тестовий код', verificationSent: 'Ми надіслали код підтвердження на email.', loginFailed: 'Не вдалося увійти.', passwordsMismatch: 'Паролі не збігаються.', registerFailed: 'Не вдалося зареєструватися.', invalidCode: 'Код неправильний або прострочений.', alreadyVerified: 'Цей email вже підтверджений.', newCodeSent: 'Ми надіслали новий код.', codeSendFailed: 'Не вдалося надіслати код.', resetSent: 'Якщо акаунт існує, ми надіслали код скидання.', resetStartFailed: 'Не вдалося почати скидання пароля.', passwordChanged: 'Пароль змінено. Можеш увійти.', passwordChangeFailed: 'Не вдалося змінити пароль.' },
    privacyPage: { metaTitle: 'Приватність | QuizSolver', metaDescription: 'Як QuizSolver збирає, обробляє і захищає твої дані.', title: 'Приватність', badge: 'Приватність і безпека', subtitle: 'Ми захищаємо твої дані і поважаємо приватність.', effective: 'Дата набуття чинності: 21 травня 2026', contactLabel: 'Підтримка', contactValue: 'support@getquizsolver.com', sections: [{ title: '1. Дані і контроль', text: 'Ми збираємо лише дані, потрібні для акаунта, кредитів і сервісу.', items: ['Акаунт: email, ім’я і зашифрований пароль.', 'Використання: розв’язані питання, кредити і покупки.', 'Реферали: реєстрації і покупки за твоїм кодом.'] }, { title: '2. Розширення і FocusScan', text: 'Розширення аналізує контент лише після твоєї дії.', items: ['Активне сканування видимих питань і варіантів.', 'FocusScan використовує вибрану область екрана.', 'Ми не записуємо інші вкладки чи історію браузера.'] }, { title: '3. Платежі', text: 'Платежі безпечно обробляються через Stripe.' }, { title: '4. Передача даних', text: 'Ми не продаємо і не здаємо персональні дані.' }, { title: '5. Твої права', text: 'Ти можеш переглянути, змінити або видалити свої дані.', items: ['Експорт збережених питань.', 'Видалення акаунта через налаштування або підтримку.'] }] },
    dashboardPage: { metaTitle: 'Панель | QuizSolver', metaDescription: 'Керуй кредитами, покупками, рефералами і статистикою.', title: 'Панель користувача', loginTitle: 'Відкрити панель', loginText: 'Увійди або створи акаунт, щоб керувати кредитами.', loginButton: 'Увійти / Зареєструватися' },
    creditsPage: { metaTitle: 'Купити кредити | QuizSolver', metaDescription: 'Поповни кредити QuizSolver для відповідей, пояснень і навчальних інструментів.', title: 'Купити кредити' },
    quizPage: { metaTitle: 'Історія і практика | QuizSolver', metaDescription: 'Переглядай збережені питання, нотатки, картки і спільні квізи.', title: 'Історія і квіз' },
    demoPage: { metaTitle: 'Інтерактивне демо | QuizSolver', metaDescription: 'Спробуй QuizSolver у безпечному демо без витрати кредитів.', title: 'Інтерактивне демо' },
    successPage: { metaTitle: 'Платіж успішний | QuizSolver', metaDescription: 'Дякуємо. Кредити додано.', badge: 'Успіх', title: 'Платіж успішний', subtitle: 'Кредити готові до використання.', dashboardCta: 'Відкрити панель', storeCta: 'Встановити розширення' },
    notFoundPage: { metaTitle: '404 Сторінку не знайдено | QuizSolver', metaDescription: 'Ця сторінка не існує.', badge: '404', title: 'Сторінку не знайдено', subtitle: 'Ця сторінка не існує або посилання застаріло.', homeCta: 'На головну', storeCta: 'Встановити розширення' },
    platform: { badge: 'Workflow', title: (name) => `Розв’язуй ${name} з QuizSolver`, subtitle: (name) => `Отримуй AI-підказки, пояснення та історію навчання для ${name}.`, metaTitle: (name) => `${name} AI Quiz Solver | QuizSolver`, metaDescription: (name) => `Розв’язуй квізи ${name} з AI-підказками, поясненнями і збереженою історією.`, stepsTitle: 'Як користуватися QuizSolver', steps: (name) => [`Відкрий квіз на ${name}.`, 'Запусти розширення QuizSolver.', 'Перевір запропоновані відповіді і пояснення.'], features: () => ['Швидкі AI-підказки', 'Короткі пояснення', 'Збережена історія навчання'], keywordTitle: (name) => `Навчайся краще з ${name}`, keywordText: (name) => `QuizSolver допомагає швидше зрозуміти питання на ${name} і повторити їх пізніше.`, faqQuestion: (name) => `Чи працює QuizSolver з ${name}?`, faqAnswer: (name) => `Так. QuizSolver знаходить видимі питання на ${name} і може використовувати FocusScan.` }
  }
};

const EN_SHELL = {
  demo: 'Demo',
  historyQuiz: 'History & quiz',
  readyEyebrow: 'Ready to install?',
  readyTitle: 'Add QuizSolver to Chrome and start with your first quiz.',
  readyDesc: 'The extension, question history, notes, and history quiz all work from one account.',
  openStore: 'Open Chrome Web Store',
  footerDesc: 'Chrome extension for answer suggestions, explanations, notes, and practice from question history.',
  continueGoogle: 'Continue with Google',
  signupGoogle: 'Sign up with Google',
  or: 'or',
  forgotPassword: 'Forgot password?',
  referralInfo: 'Referral code is optional. The referrer receives 5% of the credits you buy as a bonus.',
  verifyEmail: 'Verify email',
  verifyEmailText: 'Enter the 6-digit code sent to:',
  verifyAndLogin: 'Verify and sign in',
  noCode: 'No code?',
  resendCode: 'Resend code',
  resetPassword: 'Reset password',
  resetPasswordText: 'Enter your email and we will send a reset code.',
  sendCode: 'Send code',
  backToLogin: 'Back to login',
  setNewPassword: 'Set new password',
  setNewPasswordText: 'Enter the email code and your new password.',
  changePassword: 'Change password',
  mailDisabled: 'Email delivery is not configured on the server yet.',
  testCode: 'Test code',
  verificationSent: 'We sent a verification code to your email.',
  loginFailed: 'Login failed.',
  passwordsMismatch: 'Passwords do not match.',
  registerFailed: 'Registration failed.',
  invalidCode: 'The code is invalid or expired.',
  alreadyVerified: 'This email is already verified.',
  newCodeSent: 'We sent a new code.',
  codeSendFailed: 'Could not send the code.',
  resetSent: 'If the account exists, we sent a reset code.',
  resetStartFailed: 'Could not start password reset.',
  passwordChanged: 'Password changed. You can sign in.',
  passwordChangeFailed: 'Could not change password.'
};

const PL_SHELL = {
  demo: 'Demo',
  historyQuiz: 'Historia i quiz',
  readyEyebrow: 'Gotowy do instalacji?',
  readyTitle: 'Dodaj QuizSolver do Chrome i zacznij od pierwszego quizu.',
  readyDesc: 'Rozszerzenie, historia pytań, notatki i quiz z historii działają na jednym koncie.',
  openStore: 'Otwórz Chrome Web Store',
  footerDesc: 'Rozszerzenie Chrome do sugestii odpowiedzi, wyjaśnień, notatek i powtórek z historii pytań.',
  continueGoogle: 'Kontynuuj z Google',
  signupGoogle: 'Załóż konto przez Google',
  or: 'albo',
  forgotPassword: 'Nie pamiętasz hasła?',
  referralInfo: 'Kod polecenia jest opcjonalny. Osoba polecająca dostaje 5% kupionych przez Ciebie kredytów jako bonus.',
  verifyEmail: 'Potwierdź e-mail',
  verifyEmailText: 'Wpisz 6-cyfrowy kod wysłany na:',
  verifyAndLogin: 'Zweryfikuj i zaloguj',
  noCode: 'Kod nie doszedł?',
  resendCode: 'Wyślij ponownie',
  resetPassword: 'Reset hasła',
  resetPasswordText: 'Podaj e-mail, a wyślemy kod do ustawienia nowego hasła.',
  sendCode: 'Wyślij kod',
  backToLogin: 'Wróć do logowania',
  setNewPassword: 'Ustaw nowe hasło',
  setNewPasswordText: 'Wpisz kod z maila i nowe hasło.',
  changePassword: 'Zmień hasło',
  mailDisabled: 'Wysyłka maili nie jest jeszcze skonfigurowana na serwerze.',
  testCode: 'Kod testowy',
  verificationSent: 'Wysłaliśmy kod weryfikacyjny na e-mail.',
  loginFailed: 'Logowanie nie powiodło się.',
  passwordsMismatch: 'Hasła nie są takie same.',
  registerFailed: 'Rejestracja nie powiodła się.',
  invalidCode: 'Kod jest niepoprawny albo wygasł.',
  alreadyVerified: 'Ten e-mail jest już zweryfikowany.',
  newCodeSent: 'Wysłaliśmy nowy kod.',
  codeSendFailed: 'Nie udało się wysłać kodu.',
  resetSent: 'Jeśli konto istnieje, wysłaliśmy kod resetu.',
  resetStartFailed: 'Nie udało się zacząć resetu hasła.',
  passwordChanged: 'Hasło zmienione. Możesz się zalogować.',
  passwordChangeFailed: 'Nie udało się zmienić hasła.'
};

function applySharedCopy(copy: SiteCopy, locale: Locale): SiteCopy {
  const option = localeOption(locale);
  const shellByLocale: Partial<Record<Locale, typeof EN_SHELL>> = { en: EN_SHELL, pl: PL_SHELL };
  const shell = shellByLocale[locale] || LOCALIZED_SITE[locale as ExtraLocale].shell;
  const localizedCommon = shellByLocale[locale] ? null : LOCALIZED_SITE[locale as ExtraLocale].common;
  copy.htmlLang = option.htmlLang;
  copy.ogLocale = option.ogLocale;
  copy.common = {
    ...copy.common,
    demo: localizedCommon?.demo || shell.demo,
    historyQuiz: localizedCommon?.historyQuiz || shell.historyQuiz
  };
  copy.shell = shell;
  return copy;
}

function buildPlatformPages(bundle: LocalizedSiteBundle): SiteCopy['platformPages'] {
  return Object.fromEntries(Object.entries(en.platformPages).map(([key, base]) => {
    const name = base.shortName || base.platformName;
    const copy: PlatformCopy = {
      platformName: base.platformName,
      shortName: base.shortName,
      badge: `${name} ${bundle.platform.badge}`,
      title: bundle.platform.title(name),
      subtitle: bundle.platform.subtitle(name),
      meta: { title: bundle.platform.metaTitle(name), description: bundle.platform.metaDescription(name) },
      stepsTitle: bundle.platform.stepsTitle,
      steps: bundle.platform.steps(name),
      features: bundle.platform.features(name),
      note: base.note ? bundle.platform.keywordText(name) : undefined,
      keywordSections: [
        { title: bundle.platform.keywordTitle(name), text: bundle.platform.keywordText(name) }
      ],
      faq: [
        { question: bundle.platform.faqQuestion(name), answer: bundle.platform.faqAnswer(name) }
      ]
    };
    return [key, copy];
  })) as SiteCopy['platformPages'];
}

function buildLocalizedSiteCopy(locale: ExtraLocale): SiteCopy {
  const bundle = LOCALIZED_SITE[locale];
  const option = localeOption(locale);
  return applySharedCopy({
    htmlLang: option.htmlLang,
    ogLocale: option.ogLocale,
    home: {
      title: bundle.homeTitle,
      subtitle: bundle.homeSubtitle,
      meta: { title: bundle.homeMetaTitle, description: bundle.homeMetaDescription }
    },
    common: { brand: 'QuizSolver', ...bundle.common },
    nav: bundle.nav,
    footer: bundle.footer,
    auth: bundle.auth,
    privacyPage: bundle.privacyPage,
    dashboardPage: bundle.dashboardPage,
    creditsPage: bundle.creditsPage,
    quizPage: bundle.quizPage,
    demoPage: bundle.demoPage,
    successPage: bundle.successPage,
    notFoundPage: bundle.notFoundPage,
    platformPages: buildPlatformPages(bundle)
  } as SiteCopy, locale);
}

function enhancePlatformTutorials(copy: SiteCopy, locale: Locale): SiteCopy {
  const templates: Record<Locale, {
    stepsTitle: string;
    genericSteps: (name: string) => string[];
    genericFeatures: string[];
    genericFaq: (name: string) => PlatformCopy['faq'];
    kahootSteps: string[];
    kahootFeatures: string[];
    kahootFaq: PlatformCopy['faq'];
  }> = {
    en: {
      stepsTitle: 'Step-by-step setup',
      genericSteps: (name) => [
        'Install QuizSolver from the Chrome Web Store, pin the QS icon, and sign in to the same account you use on the website.',
        `Open your ${name} quiz and wait until the current question and all visible answer options are loaded.`,
        'Click the QuizSolver extension icon and choose Solve current page. If the page layout is unusual, use FocusScan and draw a box around the question area.',
        'Review the suggested answer and explanation before you submit. Turn on Hint mode when you want a discreet mark instead of automatic clicking.',
        'Save useful questions to History & quiz, add a short note, and later start a practice quiz from the saved set.'
      ],
      genericFeatures: [
        'Detects visible questions, answer choices, typed inputs, checkboxes and dropdowns.',
        'FocusScan helps when a question is inside an image, iframe, custom layout or locked container.',
        'Hint mode can show a subtle clue while leaving the final click to you.',
        'History, notes and practice quizzes turn solved questions into study material.'
      ],
      genericFaq: (name) => [
        { question: `How do I start QuizSolver on ${name}?`, answer: `Open the ${name} quiz, click the QS icon in Chrome, then choose Solve current page. The extension reads only the visible question you ask it to solve.` },
        { question: 'What if the extension does not detect the question?', answer: 'Use FocusScan, drag a box around the question and answer area, then run the scan again. This is useful for images, unusual layouts and embedded frames.' },
        { question: 'Can I review the questions later?', answer: 'Yes. Save solved questions to History & quiz, add notes, mark favorites and create a practice quiz from your saved history.' }
      ],
      kahootSteps: [
        'Open kahoot.it/instructions, the Kahoot lobby or the live answer screen, then click the QS extension icon.',
        'Choose Solve whole quiz when the host shows questions and answer tiles on your device. The extension waits for each new question before suggesting or clicking an answer.',
        'If the host hides questions, copy the Quiz ID from a Kahoot URL after quizId= and paste it into the Kahoot panel.',
        'Use the searchable answer bank to find the current question and read the correct answer. Quiz ID mode does not spend AI credits.',
        'Keep the floating panel open, resize it if needed, and stop auto mode from the main Kahoot action button when you want to take over.'
      ],
      kahootFeatures: [
        'Two workflows: automatic visible-question solving or Quiz ID answer bank.',
        'Quiz ID mode loads known Kahoot questions without spending AI credits.',
        'Searchable floating panel works on desktop and mobile layouts.',
        'Clear status text shows whether auto mode is waiting, solving or stopped.'
      ],
      kahootFaq: [
        { question: 'Is Quiz ID the same as a Kahoot PIN?', answer: 'No. A PIN joins a live game. Quiz ID identifies the quiz itself and is usually visible in a Kahoot URL after quizId=.' },
        { question: 'Why does automatic mode sometimes not start?', answer: 'Some hosts hide questions from player devices. When you cannot see the question text and answer tiles, use Quiz ID mode instead.' },
        { question: 'Does Kahoot Quiz ID mode use credits?', answer: 'No. It displays the quiz answer bank and does not send the question to AI.' }
      ]
    },
    pl: {
      stepsTitle: 'Instrukcja krok po kroku',
      genericSteps: (name) => [
        'Zainstaluj QuizSolver z Chrome Web Store, przypnij ikonę QS i zaloguj się na to samo konto, którego używasz na stronie.',
        `Otwórz quiz na ${name} i poczekaj, aż załaduje się aktualne pytanie oraz widoczne odpowiedzi.`,
        'Kliknij ikonę rozszerzenia QuizSolver i wybierz Rozwiąż bieżącą stronę. Jeżeli układ strony jest nietypowy, użyj FocusScan i zaznacz obszar z pytaniem.',
        'Sprawdź sugerowaną odpowiedź i wyjaśnienie przed wysłaniem. Włącz Hint mode, jeśli chcesz tylko dyskretną podpowiedź zamiast automatycznego kliknięcia.',
        'Zapisz ważne pytania do Historii i quizu, dodaj krótką notatkę, a później uruchom quiz powtórkowy z zapisanych pytań.'
      ],
      genericFeatures: [
        'Wykrywa widoczne pytania, odpowiedzi, pola tekstowe, checkboxy i listy rozwijane.',
        'FocusScan pomaga przy pytaniach w obrazkach, iframe, nietypowym layoucie albo zablokowanym kontenerze.',
        'Hint mode może pokazać subtelną wskazówkę, zostawiając finalne kliknięcie Tobie.',
        'Historia, notatki i quizy powtórkowe zmieniają rozwiązane pytania w materiał do nauki.'
      ],
      genericFaq: (name) => [
        { question: `Jak uruchomić QuizSolver na ${name}?`, answer: `Otwórz quiz na ${name}, kliknij ikonę QS w Chrome i wybierz Rozwiąż bieżącą stronę. Rozszerzenie czyta tylko pytanie, które sam zlecisz do rozwiązania.` },
        { question: 'Co zrobić, gdy pytanie nie zostanie wykryte?', answer: 'Użyj FocusScan, przeciągnij ramkę wokół pytania i odpowiedzi, a potem uruchom skan ponownie. To pomaga przy obrazkach, nietypowych układach i osadzonych ramkach.' },
        { question: 'Czy mogę wrócić do pytań później?', answer: 'Tak. Zapisuj pytania w Historii i quizie, dodawaj notatki, oznaczaj ulubione i twórz quiz powtórkowy z własnej historii.' }
      ],
      kahootSteps: [
        'Wejdź na kahoot.it/instructions, do lobby Kahoota albo na ekran odpowiedzi live, a potem kliknij ikonę QS.',
        'Wybierz Rozwiąż cały quiz, gdy host pokazuje pytania i kafelki odpowiedzi na Twoim urządzeniu. Rozszerzenie będzie czekać na kolejne pytania.',
        'Jeżeli host ukrywa pytania, skopiuj Quiz ID z linku Kahoota po quizId= i wklej go do panelu Kahoot.',
        'Użyj wyszukiwarki w banku odpowiedzi, żeby znaleźć aktualne pytanie i poprawną odpowiedź. Tryb Quiz ID nie zużywa kredytów AI.',
        'Zostaw pływający panel otwarty, dopasuj jego rozmiar i zatrzymaj tryb auto głównym przyciskiem, gdy chcesz przejąć kontrolę.'
      ],
      kahootFeatures: [
        'Dwa tryby: automatyczne rozwiązywanie widocznych pytań albo bank odpowiedzi po Quiz ID.',
        'Tryb Quiz ID ładuje znane pytania Kahoot bez zużywania kredytów AI.',
        'Wyszukiwalny panel działa wygodnie na komputerze i telefonie.',
        'Czytelny status pokazuje, czy tryb auto czeka, rozwiązuje czy jest zatrzymany.'
      ],
      kahootFaq: [
        { question: 'Czy Quiz ID to to samo co PIN Kahoota?', answer: 'Nie. PIN służy do dołączenia do gry na żywo. Quiz ID identyfikuje sam quiz i zwykle znajduje się w adresie URL po quizId=.' },
        { question: 'Dlaczego tryb automatyczny czasem nie startuje?', answer: 'Niektórzy hostowie ukrywają pytania na urządzeniach graczy. Gdy nie widzisz treści pytania i kafelków odpowiedzi, użyj trybu Quiz ID.' },
        { question: 'Czy tryb Kahoot Quiz ID zużywa kredyty?', answer: 'Nie. Pokazuje bank odpowiedzi quizu i nie wysyła pytania do AI.' }
      ]
    },
    de: {
      stepsTitle: 'Schritt-für-Schritt-Anleitung',
      genericSteps: (name) => [
        'Installiere QuizSolver aus dem Chrome Web Store, pinne das QS-Symbol und melde dich mit demselben Konto wie auf der Website an.',
        `Öffne dein ${name}-Quiz und warte, bis die aktuelle Frage und alle sichtbaren Antwortoptionen geladen sind.`,
        'Klicke auf das QuizSolver-Symbol und wähle Aktuelle Seite lösen. Bei ungewöhnlichen Layouts nutze FocusScan und markiere den Fragebereich.',
        'Prüfe die vorgeschlagene Antwort und Erklärung, bevor du absendest. Nutze Hint mode, wenn du nur einen dezenten Hinweis möchtest.',
        'Speichere wichtige Fragen in Historie & Quiz, füge eine Notiz hinzu und starte später ein Übungsquiz.'
      ],
      genericFeatures: ['Erkennt sichtbare Fragen, Optionen, Texteingaben, Checkboxen und Dropdowns.', 'FocusScan hilft bei Bildern, iFrames und ungewöhnlichen Layouts.', 'Hint mode zeigt einen dezenten Hinweis, ohne die Kontrolle zu übernehmen.', 'Historie, Notizen und Übungsquizze machen aus Antworten Lernmaterial.'],
      genericFaq: (name) => [
        { question: `Wie starte ich QuizSolver auf ${name}?`, answer: `Öffne das ${name}-Quiz, klicke auf das QS-Symbol und wähle Aktuelle Seite lösen.` },
        { question: 'Was mache ich, wenn die Frage nicht erkannt wird?', answer: 'Nutze FocusScan und ziehe einen Rahmen um Frage und Antworten.' },
        { question: 'Kann ich Fragen später wiederholen?', answer: 'Ja, speichere sie in Historie & Quiz und starte daraus ein Übungsquiz.' }
      ],
      kahootSteps: ['Öffne kahoot.it/instructions, die Lobby oder den Live-Antwortbildschirm und klicke auf QS.', 'Wähle Ganzes Quiz lösen, wenn Fragen und Antwortfelder sichtbar sind.', 'Wenn der Host Fragen versteckt, kopiere die Quiz ID aus der URL nach quizId=.', 'Suche die aktuelle Frage in der Antwortbank. Quiz-ID-Modus verbraucht keine AI-Credits.', 'Lass das Panel offen und stoppe den Auto-Modus, wenn du selbst übernehmen willst.'],
      kahootFeatures: ['Automatischer Modus oder Quiz-ID-Antwortbank.', 'Quiz-ID-Modus verbraucht keine AI-Credits.', 'Suchbares Panel für Desktop und Mobile.', 'Status zeigt Warten, Lösen oder Gestoppt.'],
      kahootFaq: [
        { question: 'Ist Quiz ID dasselbe wie der Kahoot-PIN?', answer: 'Nein. Der PIN verbindet dich mit dem Live-Spiel, die Quiz ID identifiziert das Quiz.' },
        { question: 'Warum startet Auto-Modus nicht?', answer: 'Wenn der Host Fragen versteckt, nutze den Quiz-ID-Modus.' },
        { question: 'Verbraucht Quiz-ID-Modus Credits?', answer: 'Nein, er zeigt die Antwortbank ohne AI-Anfrage.' }
      ]
    },
    es: {
      stepsTitle: 'Guía paso a paso',
      genericSteps: (name) => [
        'Instala QuizSolver desde Chrome Web Store, fija el icono QS e inicia sesión con la misma cuenta del sitio web.',
        `Abre tu quiz de ${name} y espera a que carguen la pregunta y las respuestas visibles.`,
        'Haz clic en el icono de QuizSolver y elige Resolver página actual. Si el diseño es raro, usa FocusScan y marca el área de la pregunta.',
        'Revisa la respuesta sugerida y la explicación antes de enviar. Usa Hint mode si prefieres una pista discreta.',
        'Guarda preguntas útiles en Historial y quiz, añade una nota y practica después con ese conjunto.'
      ],
      genericFeatures: ['Detecta preguntas visibles, opciones, campos de texto, checkboxes y desplegables.', 'FocusScan ayuda con imágenes, iframes y diseños especiales.', 'Hint mode muestra una pista sin hacer el clic final.', 'Historial, notas y quizzes de práctica convierten respuestas en material de estudio.'],
      genericFaq: (name) => [
        { question: `¿Cómo uso QuizSolver en ${name}?`, answer: `Abre el quiz de ${name}, pulsa el icono QS y elige Resolver página actual.` },
        { question: '¿Qué hago si no detecta la pregunta?', answer: 'Usa FocusScan y dibuja un cuadro alrededor de la pregunta y las opciones.' },
        { question: '¿Puedo repasar preguntas después?', answer: 'Sí, guárdalas en Historial y quiz y crea una práctica desde tu historial.' }
      ],
      kahootSteps: ['Abre kahoot.it/instructions, el lobby o la pantalla de respuestas y pulsa QS.', 'Elige Resolver todo el quiz si ves preguntas y respuestas.', 'Si el host las oculta, copia el Quiz ID de la URL después de quizId=.', 'Busca la pregunta en el banco de respuestas. El modo Quiz ID no usa créditos de IA.', 'Mantén el panel abierto y detén el modo auto cuando quieras tomar control.'],
      kahootFeatures: ['Modo automático o banco de respuestas por Quiz ID.', 'Quiz ID no consume créditos de IA.', 'Panel buscable para escritorio y móvil.', 'Estado claro: esperando, resolviendo o detenido.'],
      kahootFaq: [
        { question: '¿Quiz ID es lo mismo que el PIN de Kahoot?', answer: 'No. El PIN une al juego en vivo; el Quiz ID identifica el quiz.' },
        { question: '¿Por qué no empieza el modo automático?', answer: 'Si el host oculta preguntas, usa el modo Quiz ID.' },
        { question: '¿Quiz ID usa créditos?', answer: 'No, muestra el banco de respuestas sin consultar a la IA.' }
      ]
    },
    fr: {
      stepsTitle: 'Guide étape par étape',
      genericSteps: (name) => [
        'Installez QuizSolver depuis le Chrome Web Store, épinglez l’icône QS et connectez-vous avec le même compte.',
        `Ouvrez votre quiz ${name} et attendez que la question et les réponses visibles soient chargées.`,
        'Cliquez sur l’icône QuizSolver et choisissez Résoudre la page. Si la mise en page est spéciale, utilisez FocusScan.',
        'Vérifiez la réponse proposée et l’explication avant d’envoyer. Activez Hint mode pour un indice discret.',
        'Enregistrez les questions utiles dans Historique et quiz, ajoutez une note et révisez-les plus tard.'
      ],
      genericFeatures: ['Détecte questions visibles, options, champs texte, cases et listes déroulantes.', 'FocusScan aide avec images, iframes et mises en page inhabituelles.', 'Hint mode affiche un indice sans cliquer à votre place.', 'Historique, notes et quiz d’entraînement transforment les réponses en révision.'],
      genericFaq: (name) => [
        { question: `Comment utiliser QuizSolver sur ${name} ?`, answer: `Ouvrez le quiz ${name}, cliquez sur l’icône QS et choisissez Résoudre la page.` },
        { question: 'Et si la question n’est pas détectée ?', answer: 'Utilisez FocusScan et encadrez la question avec les réponses.' },
        { question: 'Puis-je réviser plus tard ?', answer: 'Oui, enregistrez les questions dans Historique et quiz.' }
      ],
      kahootSteps: ['Ouvrez kahoot.it/instructions, le lobby ou l’écran de réponse, puis cliquez sur QS.', 'Choisissez Résoudre tout le quiz si les questions et réponses sont visibles.', 'Si l’hôte les masque, copiez le Quiz ID dans l’URL après quizId=.', 'Cherchez la question dans la banque de réponses. Le mode Quiz ID ne consomme pas de crédits IA.', 'Gardez le panneau ouvert et arrêtez le mode auto quand vous voulez reprendre la main.'],
      kahootFeatures: ['Mode automatique ou banque de réponses par Quiz ID.', 'Quiz ID ne consomme pas de crédits IA.', 'Panneau de recherche desktop et mobile.', 'Statut clair : attente, résolution ou arrêt.'],
      kahootFaq: [
        { question: 'Quiz ID est-il le PIN Kahoot ?', answer: 'Non. Le PIN rejoint le jeu en direct, le Quiz ID identifie le quiz.' },
        { question: 'Pourquoi le mode auto ne démarre-t-il pas ?', answer: 'Si l’hôte cache les questions, utilisez le mode Quiz ID.' },
        { question: 'Quiz ID utilise-t-il des crédits ?', answer: 'Non, il affiche la banque de réponses sans appel IA.' }
      ]
    },
    it: {
      stepsTitle: 'Guida passo passo',
      genericSteps: (name) => [
        'Installa QuizSolver dal Chrome Web Store, fissa l’icona QS e accedi con lo stesso account del sito.',
        `Apri il quiz ${name} e attendi che la domanda e le risposte visibili siano caricate.`,
        'Clicca l’icona QuizSolver e scegli Risolvi pagina corrente. Se il layout è insolito, usa FocusScan.',
        'Controlla risposta e spiegazione prima di inviare. Usa Hint mode per un suggerimento discreto.',
        'Salva le domande utili in Cronologia e quiz, aggiungi una nota e ripassale più tardi.'
      ],
      genericFeatures: ['Rileva domande visibili, opzioni, campi testo, checkbox e menu a tendina.', 'FocusScan aiuta con immagini, iframe e layout insoliti.', 'Hint mode mostra un indizio senza cliccare al posto tuo.', 'Cronologia, note e quiz di pratica trasformano le risposte in studio.'],
      genericFaq: (name) => [
        { question: `Come uso QuizSolver su ${name}?`, answer: `Apri il quiz ${name}, clicca QS e scegli Risolvi pagina corrente.` },
        { question: 'E se non rileva la domanda?', answer: 'Usa FocusScan e seleziona l’area con domanda e risposte.' },
        { question: 'Posso ripassare dopo?', answer: 'Sì, salva le domande in Cronologia e quiz.' }
      ],
      kahootSteps: ['Apri kahoot.it/instructions, la lobby o la schermata risposte e clicca QS.', 'Scegli Risolvi tutto il quiz se domande e risposte sono visibili.', 'Se l’host le nasconde, copia il Quiz ID dall’URL dopo quizId=.', 'Cerca la domanda nel banco risposte. Quiz ID non usa crediti AI.', 'Tieni aperto il pannello e ferma la modalità auto quando vuoi.'],
      kahootFeatures: ['Modalità automatica o banco risposte con Quiz ID.', 'Quiz ID non consuma crediti AI.', 'Pannello cercabile per desktop e mobile.', 'Stato chiaro: attesa, risoluzione o stop.'],
      kahootFaq: [
        { question: 'Quiz ID è il PIN di Kahoot?', answer: 'No. Il PIN entra nella partita live; Quiz ID identifica il quiz.' },
        { question: 'Perché auto non parte?', answer: 'Se l’host nasconde le domande, usa Quiz ID.' },
        { question: 'Quiz ID usa crediti?', answer: 'No, mostra il banco risposte senza IA.' }
      ]
    },
    uk: {
      stepsTitle: 'Покрокова інструкція',
      genericSteps: (name) => [
        'Встанови QuizSolver з Chrome Web Store, закріпи іконку QS і увійди в той самий акаунт, що й на сайті.',
        `Відкрий квіз ${name} і дочекайся, поки завантажаться питання та видимі варіанти відповіді.`,
        'Натисни іконку QuizSolver і вибери Solve current page. Якщо макет незвичний, використай FocusScan.',
        'Перевір запропоновану відповідь і пояснення перед відправкою. Увімкни Hint mode для непомітної підказки.',
        'Збережи корисні питання в History & quiz, додай нотатку і повтори їх пізніше.'
      ],
      genericFeatures: ['Розпізнає видимі питання, варіанти, текстові поля, checkbox і dropdown.', 'FocusScan допомагає з картинками, iframe і незвичними макетами.', 'Hint mode показує підказку без фінального кліку.', 'Історія, нотатки і тренувальні квізи перетворюють відповіді на навчання.'],
      genericFaq: (name) => [
        { question: `Як запустити QuizSolver на ${name}?`, answer: `Відкрий квіз ${name}, натисни QS і вибери Solve current page.` },
        { question: 'Що робити, якщо питання не знайдено?', answer: 'Використай FocusScan і виділи область з питанням та відповідями.' },
        { question: 'Чи можна повторити питання пізніше?', answer: 'Так, збережи їх у History & quiz і створи тренувальний квіз.' }
      ],
      kahootSteps: ['Відкрий kahoot.it/instructions, lobby або екран відповідей і натисни QS.', 'Вибери Solve whole quiz, якщо питання й відповіді видно.', 'Якщо host приховує питання, скопіюй Quiz ID з URL після quizId=.', 'Знайди питання в банку відповідей. Quiz ID не витрачає AI-кредити.', 'Тримай панель відкритою і зупини auto mode, коли хочеш керувати сам.'],
      kahootFeatures: ['Auto mode або банк відповідей через Quiz ID.', 'Quiz ID не витрачає AI-кредити.', 'Панель з пошуком для desktop і mobile.', 'Статус показує очікування, розв’язання або зупинку.'],
      kahootFaq: [
        { question: 'Quiz ID — це PIN Kahoot?', answer: 'Ні. PIN підключає до live-гри, Quiz ID ідентифікує сам квіз.' },
        { question: 'Чому auto mode не стартує?', answer: 'Якщо host приховує питання, використовуй Quiz ID.' },
        { question: 'Quiz ID витрачає кредити?', answer: 'Ні, він показує банк відповідей без AI-запиту.' }
      ]
    }
  };

  const template = templates[locale] || templates.en;
  (Object.entries(copy.platformPages) as Array<[keyof SiteCopy['platformPages'], PlatformCopy]>).forEach(([pageKey, page]) => {
    if (pageKey === 'kahoot') {
      page.stepsTitle = template.stepsTitle;
      page.steps = template.kahootSteps;
      page.features = template.kahootFeatures;
      page.faq = template.kahootFaq;
      return;
    }
    const name = page.shortName || page.platformName;
    page.stepsTitle = template.stepsTitle;
    page.steps = template.genericSteps(name);
    page.features = template.genericFeatures;
    page.faq = template.genericFaq(name);
  });
  return copy;
}

const de = buildLocalizedSiteCopy('de');
const es = buildLocalizedSiteCopy('es');
const fr = buildLocalizedSiteCopy('fr');
const it = buildLocalizedSiteCopy('it');
const uk = buildLocalizedSiteCopy('uk');

applySharedCopy(en, 'en');
applySharedCopy(pl, 'pl');
enhancePlatformTutorials(en, 'en');
enhancePlatformTutorials(pl, 'pl');
enhancePlatformTutorials(de, 'de');
enhancePlatformTutorials(es, 'es');
enhancePlatformTutorials(fr, 'fr');
enhancePlatformTutorials(it, 'it');
enhancePlatformTutorials(uk, 'uk');

export const CONTENT: Record<Locale, SiteCopy> = {
  en: en as SiteCopy,
  pl: pl as SiteCopy,
  de,
  es,
  fr,
  it,
  uk
};

export const PLATFORM_PAGE_KEYS: PageKey[] = [
  'quizSolverAi',
  'testportal',
  'moodle',
  'canvas',
  'googleForms',
  'microsoftForms',
  'blackboard',
  'quizlet',
  'socrative',
  'kahoot',
  'quizizz'
];

export const PAGE_SLUGS: Record<PageKey, string> = {
  home: '',
  dashboard: 'dashboard',
  credits: 'credits',
  quiz: 'quiz',
  demo: 'demo',
  quizSolverAi: 'quiz-solver-ai',
  testportal: 'testportal-quiz-solver',
  moodle: 'moodle-quiz-solver',
  canvas: 'canvas-quiz-solver',
  googleForms: 'google-forms-quiz-solver',
  microsoftForms: 'microsoft-forms-quiz-solver',
  blackboard: 'blackboard-quiz-solver',
  quizlet: 'quizlet-solver',
  socrative: 'socrative-quiz-solver',
  kahoot: 'kahoot-ai-bot',
  quizizz: 'quizizz-solver',
  privacy: 'privacy',
  notFound: '404',
  success: 'success'
};

export const PAGE_ROUTES: Record<PageKey, Record<Locale, string>> = Object.fromEntries(
  Object.entries(PAGE_SLUGS).map(([pageKey, slug]) => [pageKey, routeRecord(slug)])
) as Record<PageKey, Record<Locale, string>>;

export const INDEXED_PAGE_KEYS: PageKey[] = [
  'home',
  'credits',
  'quiz',
  'demo',
  'quizSolverAi',
  'testportal',
  'moodle',
  'canvas',
  'googleForms',
  'microsoftForms',
  'blackboard',
  'quizlet',
  'socrative',
  'kahoot',
  'quizizz',
  'privacy'
];

export function contentFor(locale: Locale): SiteCopy {
  return CONTENT[locale] || CONTENT.en;
}

export function pathFor(pageKey: PageKey, locale: Locale): string {
  return PAGE_ROUTES[pageKey]?.[locale] || PAGE_ROUTES.home[locale];
}

export function abs(path: string): string {
  return `${SITE_URL}${path}`;
}

export function pageData(pageKey: PageKey, locale: Locale): any {
  const copy = contentFor(locale);
  if (pageKey === 'home') return copy['home'];
  if (pageKey === 'privacy') return copy['privacyPage'];
  if (pageKey === 'dashboard') return copy['dashboardPage'];
  if (pageKey === 'credits') return copy['creditsPage'];
  if (pageKey === 'quiz') return copy['quizPage'];
  if (pageKey === 'demo') return copy['demoPage'];
  if (pageKey === 'success') return copy['successPage'];
  if (pageKey === 'notFound') return copy['notFoundPage'];
  return (copy['platformPages'] as any)?.[pageKey];
}

export function platformEntries(locale: Locale): Array<{ pageKey: PageKey; data: any }> {
  const copy = contentFor(locale);
  return PLATFORM_PAGE_KEYS
    .map((pageKey) => ({ pageKey, data: (copy['platformPages'] as any)?.[pageKey] }))
    .filter((entry) => !!entry.data);
}

export function routePathsForPrerender(): string[] {
  return Object.values(PAGE_ROUTES)
    .flatMap((localized) => SUPPORTED_LOCALES.map((locale) => localized[locale.code]))
    .map((path) => path.replace(/^\/+/, '').replace(/\/+$/, ''))
    .map((path) => path || '');
}
