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

const en: SiteCopy = {
  htmlLang: "en",
  ogLocale: "en_US",
  home: {
    title: "AI Quiz Solver Chrome Extension",
    subtitle: "Solve quizzes on Testportal, Moodle, and more using AI",
    meta: {
      title: "QuizSolver | AI Quiz Solver Chrome Extension",
      description: "Solve quizzes on Testportal, Moodle, Canvas, Google Forms, and more using AI. Get instant answers and detailed explanations."
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
    close: "Close"
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
      badge: "Kahoot Practice",
      title: "Kahoot AI Bot & Solver",
      subtitle: "Learn faster and practice Kahoot games with step-by-step AI solutions.",
      meta: { title: "Kahoot AI Bot & Solver | QuizSolver", description: "The ultimate AI assistant for studying and practicing with Kahoot." },
      stepsTitle: "How to use on Kahoot",
      steps: ["Start a Kahoot practice game", "Use the extension to analyze questions and options", "Receive detailed explanations for the correct answers"],
      features: ["Time-aware guidance", "Educational focus", "Works on single-screen views"],
      keywordSections: [
        { title: "Master Kahoot trivia", text: "Kahoot requires quick thinking. Review explanations and correct answers to double-check your knowledge before live classroom tournaments." }
      ],
      faq: [
        { question: "Will I get first place automatically?", answer: "QuizSolver helps you learn the answers so you can click them faster and earn higher scores manually." }
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
    subtitle: "Rozwiązuj quizy na platformach Testportal, Moodle i innych dzięki AI",
    meta: {
      title: "QuizSolver | Rozszerzenie Chrome AI do rozwiązywania testów i quizów",
      description: "Rozwiązuj testy i quizy online na Testportalu, Moodle, Canvasie i Google Forms dzięki AI. Otrzymuj natychmiastowe odpowiedzi z wyjaśnieniem."
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
    close: "Zamknij"
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
      badge: "Kahoot Pomocnik",
      title: "AI Solver i Pomocnik do Kahoot",
      subtitle: "Ucz się efektywnie i trenuj quizy Kahoot z pomocą dokładnych objaśnień AI.",
      meta: { title: "Kahoot AI Bot & Solver | Trenuj i Ucz się z AI", description: "Najlepszy asystent AI do nauki, powtórek i ćwiczeń na platformie Kahoot. Opanuj wiedzę i reaguj szybciej." },
      stepsTitle: "Jak używać na Kahoot",
      steps: ["Uruchom grę ćwiczeniową lub test powtórkowy na platformie Kahoot.", "Użyj rozszerzenia, by błyskawicznie przeanalizować pytanie i warianty odpowiedzi.", "Odbierz szczegółowe, edukacyjne objaśnienie poprawnych opcji."],
      features: ["Optymalizacja pod kątem uciekającego czasu", "Wyraźny nacisk na aspekt edukacyjny i zrozumienie", "Pełne wsparcie dla widoków jednoekranowych"],
      keywordSections: [
        { title: "Opanuj testy Kahoot do perfekcji", text: "Rozgrywka na Kahoot wymaga refleksu. Sprawdź i przeanalizuj poprawność odpowiedzi podczas samodzielnych ćwiczeń, by błyszczeć wiedzą na zajęciach." }
      ],
      faq: [
        { question: "Czy automatycznie zajmę pierwsze miejsce?", answer: "QuizSolver dostarcza Ci wiedzę i wskazuje poprawne odpowiedzi wraz z wyjaśnieniem, dzięki czemu w trakcie gry możesz klikać właściwe opcje znacznie szybciej i bezbłędnie." }
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

export type Locale = 'en' | 'pl';
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

export const CONTENT: Record<Locale, SiteCopy> = {
  en: en as SiteCopy,
  pl: pl as SiteCopy
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

export const PAGE_ROUTES: Record<PageKey, Record<Locale, string>> = {
  home: { en: '/', pl: '/pl/' },
  dashboard: { en: '/dashboard', pl: '/pl/dashboard' },
  credits: { en: '/credits', pl: '/pl/credits' },
  quiz: { en: '/quiz', pl: '/pl/quiz' },
  demo: { en: '/demo', pl: '/pl/demo' },
  quizSolverAi: { en: '/quiz-solver-ai', pl: '/pl/quiz-solver-ai' },
  testportal: { en: '/testportal-quiz-solver', pl: '/pl/testportal-quiz-solver' },
  moodle: { en: '/moodle-quiz-solver', pl: '/pl/moodle-quiz-solver' },
  canvas: { en: '/canvas-quiz-solver', pl: '/pl/canvas-quiz-solver' },
  googleForms: { en: '/google-forms-quiz-solver', pl: '/pl/google-forms-quiz-solver' },
  microsoftForms: { en: '/microsoft-forms-quiz-solver', pl: '/pl/microsoft-forms-quiz-solver' },
  blackboard: { en: '/blackboard-quiz-solver', pl: '/pl/blackboard-quiz-solver' },
  quizlet: { en: '/quizlet-solver', pl: '/pl/quizlet-solver' },
  socrative: { en: '/socrative-quiz-solver', pl: '/pl/socrative-quiz-solver' },
  kahoot: { en: '/kahoot-ai-bot', pl: '/pl/kahoot-ai-bot' },
  quizizz: { en: '/quizizz-solver', pl: '/pl/quizizz-solver' },
  privacy: { en: '/privacy', pl: '/pl/privacy' },
  notFound: { en: '/404', pl: '/pl/404' },
  success: { en: '/success', pl: '/pl/success' }
};

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
    .flatMap((localized) => [localized.en, localized.pl])
    .map((path) => path.replace(/^\/+/, '').replace(/\/+$/, ''))
    .map((path) => path || '');
}
