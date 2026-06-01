import type { Locale } from './site-content';

export type BlogCategorySlug =
  | 'kahoot'
  | 'platform-guides'
  | 'study-workflows'
  | 'privacy-detection'
  | 'focusscan';

export interface BlogCategoryCopy {
  slug: BlogCategorySlug;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  tutorialLabel: string;
  tutorialPage: 'kahoot' | 'quizSolverAi' | 'demo' | 'privacy';
}

export const BLOG_CATEGORY_ORDER: BlogCategorySlug[] = [
  'kahoot',
  'platform-guides',
  'study-workflows',
  'focusscan',
  'privacy-detection'
];

export const BLOG_CATEGORIES: Record<Locale, Record<BlogCategorySlug, BlogCategoryCopy>> = {
  en: {
    kahoot: {
      slug: 'kahoot',
      title: 'Kahoot AI guides',
      shortTitle: 'Kahoot',
      metaTitle: 'Kahoot AI Bot Guides | QuizSolver',
      metaDescription: 'Learn Kahoot Quiz ID, PIN, answer bank mode and visible-question auto mode with responsible QuizSolver guides.',
      description: 'Practical articles about Kahoot Quiz ID, live PINs, hidden questions, answer banks and when automatic solving can read the page.',
      tutorialLabel: 'Open Kahoot tutorial',
      tutorialPage: 'kahoot'
    },
    'platform-guides': {
      slug: 'platform-guides',
      title: 'Platform solver guides',
      shortTitle: 'Platforms',
      metaTitle: 'Quiz Solver Platform Guides | QuizSolver',
      metaDescription: 'Step-by-step guides for Google Forms, Testportal, Moodle, Canvas and other online quiz platforms supported by QuizSolver.',
      description: 'Use these guides when you want a platform-specific workflow: what to open, which mode to use and how to save questions later.',
      tutorialLabel: 'See all platform tutorials',
      tutorialPage: 'quizSolverAi'
    },
    'study-workflows': {
      slug: 'study-workflows',
      title: 'Study workflows',
      shortTitle: 'Study',
      metaTitle: 'AI Study Workflows for Online Quizzes | QuizSolver',
      metaDescription: 'Turn solved quiz questions into notes, practice quizzes, active recall and revision workflows with QuizSolver.',
      description: 'Articles about using AI answers as revision material: explanations, notes, history, favorites and practice quizzes.',
      tutorialLabel: 'Try the study demo',
      tutorialPage: 'demo'
    },
    focusscan: {
      slug: 'focusscan',
      title: 'FocusScan and image questions',
      shortTitle: 'FocusScan',
      metaTitle: 'FocusScan OCR Guides | QuizSolver',
      metaDescription: 'Solve image-based quiz questions, charts, PDF fragments and blocked text with FocusScan OCR in QuizSolver.',
      description: 'Guides for questions that are shown as screenshots, charts, PDF fragments or locked text that normal parsers cannot read cleanly.',
      tutorialLabel: 'Open FocusScan demo',
      tutorialPage: 'demo'
    },
    'privacy-detection': {
      slug: 'privacy-detection',
      title: 'Detection, privacy and safe use',
      shortTitle: 'Privacy',
      metaTitle: 'Quiz Detection and Privacy Guides | QuizSolver',
      metaDescription: 'Understand what quiz platforms can detect, how browser extensions work and how to use QuizSolver responsibly.',
      description: 'Clear explanations of browser focus events, extension limits, privacy controls and realistic platform detection myths.',
      tutorialLabel: 'Read privacy policy',
      tutorialPage: 'privacy'
    }
  },
  pl: {
    kahoot: {
      slug: 'kahoot',
      title: 'Poradniki Kahoot AI',
      shortTitle: 'Kahoot',
      metaTitle: 'Kahoot AI Bot Poradniki | QuizSolver',
      metaDescription: 'Quiz ID, PIN, bank odpowiedzi i tryb auto w Kahoot. Zobacz odpowiedzialne poradniki QuizSolver.',
      description: 'Praktyczne artykuły o Kahoot Quiz ID, PIN-ach gry, ukrytych pytaniach, banku odpowiedzi i trybie automatycznym.',
      tutorialLabel: 'Otwórz tutorial Kahoot',
      tutorialPage: 'kahoot'
    },
    'platform-guides': {
      slug: 'platform-guides',
      title: 'Poradniki dla platform quizowych',
      shortTitle: 'Platformy',
      metaTitle: 'Poradniki Quiz Solver dla Platform | QuizSolver',
      metaDescription: 'Instrukcje dla Google Forms, Testportal, Moodle, Canvas i innych platform quizowych obsługiwanych przez QuizSolver.',
      description: 'Tu znajdziesz workflow dla konkretnych platform: co otworzyć, który tryb wybrać i jak zapisać pytania do powtórki.',
      tutorialLabel: 'Zobacz tutoriale platform',
      tutorialPage: 'quizSolverAi'
    },
    'study-workflows': {
      slug: 'study-workflows',
      title: 'Nauka, notatki i powtórki',
      shortTitle: 'Nauka',
      metaTitle: 'Nauka z AI i Quizami Online | QuizSolver',
      metaDescription: 'Zamieniaj rozwiązane pytania w notatki, quizy powtórkowe i aktywne przypominanie z QuizSolver.',
      description: 'Artykuły o tym, jak używać odpowiedzi AI jako materiału do nauki: wyjaśnienia, historia, notatki i quiz z historii.',
      tutorialLabel: 'Wypróbuj demo nauki',
      tutorialPage: 'demo'
    },
    focusscan: {
      slug: 'focusscan',
      title: 'FocusScan i pytania ze zdjęć',
      shortTitle: 'FocusScan',
      metaTitle: 'FocusScan OCR Poradniki | QuizSolver',
      metaDescription: 'Rozwiązuj pytania ze zdjęć, wykresów, PDF-ów i zablokowanego tekstu dzięki FocusScan OCR w QuizSolver.',
      description: 'Poradniki dla pytań pokazanych jako obraz, wykres, fragment PDF albo tekst, którego zwykły parser nie potrafi odczytać.',
      tutorialLabel: 'Otwórz demo FocusScan',
      tutorialPage: 'demo'
    },
    'privacy-detection': {
      slug: 'privacy-detection',
      title: 'Wykrywanie, prywatność i bezpieczne użycie',
      shortTitle: 'Prywatność',
      metaTitle: 'Wykrywanie Quizów i Prywatność | QuizSolver',
      metaDescription: 'Sprawdź, co platformy quizowe mogą wykryć, jak działają rozszerzenia i jak używać QuizSolver odpowiedzialnie.',
      description: 'Proste wyjaśnienia o focus eventach, ograniczeniach rozszerzeń, prywatności i mitach wokół wykrywania na testach.',
      tutorialLabel: 'Przeczytaj prywatność',
      tutorialPage: 'privacy'
    }
  },
  de: {
    kahoot: {
      slug: 'kahoot',
      title: 'Kahoot KI-Guides',
      shortTitle: 'Kahoot',
      metaTitle: 'Kahoot KI Bot Guides | QuizSolver',
      metaDescription: 'Kahoot Quiz ID, PIN, Antwortbank und Auto-Modus mit verantwortlichen QuizSolver-Guides verstehen.',
      description: 'Praktische Artikel zu Kahoot Quiz ID, Live-PINs, versteckten Fragen, Antwortbanken und automatischer Erkennung.',
      tutorialLabel: 'Kahoot-Tutorial öffnen',
      tutorialPage: 'kahoot'
    },
    'platform-guides': {
      slug: 'platform-guides',
      title: 'Plattform-Guides',
      shortTitle: 'Plattformen',
      metaTitle: 'Quiz Solver Plattform-Guides | QuizSolver',
      metaDescription: 'Schritt-für-Schritt-Guides für Google Forms, Testportal, Moodle, Canvas und weitere Quiz-Plattformen.',
      description: 'Workflows für konkrete Plattformen: was du öffnest, welchen Modus du nutzt und wie du Fragen speicherst.',
      tutorialLabel: 'Alle Plattform-Tutorials ansehen',
      tutorialPage: 'quizSolverAi'
    },
    'study-workflows': {
      slug: 'study-workflows',
      title: 'Lern-Workflows',
      shortTitle: 'Lernen',
      metaTitle: 'KI Lern-Workflows für Online-Quizze | QuizSolver',
      metaDescription: 'Verwandle gelöste Quizfragen in Notizen, Übungsquizze und Wiederholung mit QuizSolver.',
      description: 'Artikel über Erklärungen, Notizen, Historie, Favoriten und Übungsquizze als Lernmaterial.',
      tutorialLabel: 'Lern-Demo testen',
      tutorialPage: 'demo'
    },
    focusscan: {
      slug: 'focusscan',
      title: 'FocusScan und Bildfragen',
      shortTitle: 'FocusScan',
      metaTitle: 'FocusScan OCR Guides | QuizSolver',
      metaDescription: 'Bildfragen, Diagramme, PDF-Fragmente und gesperrten Text mit FocusScan OCR in QuizSolver lösen.',
      description: 'Guides für Fragen als Screenshot, Diagramm, PDF-Fragment oder gesperrten Text.',
      tutorialLabel: 'FocusScan-Demo öffnen',
      tutorialPage: 'demo'
    },
    'privacy-detection': {
      slug: 'privacy-detection',
      title: 'Erkennung, Datenschutz und sichere Nutzung',
      shortTitle: 'Datenschutz',
      metaTitle: 'Quiz-Erkennung und Datenschutz | QuizSolver',
      metaDescription: 'Verstehe, was Quiz-Plattformen erkennen können und wie du QuizSolver verantwortungsvoll nutzt.',
      description: 'Erklärungen zu Browser-Fokus, Extension-Grenzen, Datenschutz und realistischen Erkennungsmythen.',
      tutorialLabel: 'Datenschutz lesen',
      tutorialPage: 'privacy'
    }
  },
  es: {
    kahoot: {
      slug: 'kahoot',
      title: 'Guías Kahoot IA',
      shortTitle: 'Kahoot',
      metaTitle: 'Guías Kahoot AI Bot | QuizSolver',
      metaDescription: 'Aprende Quiz ID, PIN, banco de respuestas y modo automático de Kahoot con guías responsables.',
      description: 'Artículos prácticos sobre Kahoot Quiz ID, PIN en vivo, preguntas ocultas, bancos de respuestas y modo automático.',
      tutorialLabel: 'Abrir tutorial Kahoot',
      tutorialPage: 'kahoot'
    },
    'platform-guides': {
      slug: 'platform-guides',
      title: 'Guías por plataforma',
      shortTitle: 'Plataformas',
      metaTitle: 'Guías de Quiz Solver por Plataforma | QuizSolver',
      metaDescription: 'Guías paso a paso para Google Forms, Testportal, Moodle, Canvas y otras plataformas de quiz.',
      description: 'Workflows por plataforma: qué abrir, qué modo elegir y cómo guardar preguntas para repasar.',
      tutorialLabel: 'Ver tutoriales',
      tutorialPage: 'quizSolverAi'
    },
    'study-workflows': {
      slug: 'study-workflows',
      title: 'Métodos de estudio',
      shortTitle: 'Estudio',
      metaTitle: 'Métodos de Estudio con IA para Quizzes | QuizSolver',
      metaDescription: 'Convierte preguntas resueltas en notas, práctica, historial y repaso activo con QuizSolver.',
      description: 'Artículos sobre respuestas explicadas, historial, notas, favoritos y práctica desde quizzes online.',
      tutorialLabel: 'Probar demo',
      tutorialPage: 'demo'
    },
    focusscan: {
      slug: 'focusscan',
      title: 'FocusScan e imágenes',
      shortTitle: 'FocusScan',
      metaTitle: 'Guías FocusScan OCR | QuizSolver',
      metaDescription: 'Resuelve preguntas con imágenes, gráficos, PDF y texto bloqueado usando FocusScan OCR.',
      description: 'Guías para preguntas en capturas, gráficos, fragmentos PDF o texto bloqueado.',
      tutorialLabel: 'Abrir demo FocusScan',
      tutorialPage: 'demo'
    },
    'privacy-detection': {
      slug: 'privacy-detection',
      title: 'Detección, privacidad y uso seguro',
      shortTitle: 'Privacidad',
      metaTitle: 'Detección de Quizzes y Privacidad | QuizSolver',
      metaDescription: 'Entiende qué pueden detectar las plataformas de quiz y cómo usar QuizSolver de forma responsable.',
      description: 'Explicaciones sobre eventos de foco, límites de extensiones, privacidad y mitos de detección.',
      tutorialLabel: 'Leer privacidad',
      tutorialPage: 'privacy'
    }
  },
  fr: {
    kahoot: {
      slug: 'kahoot',
      title: 'Guides Kahoot IA',
      shortTitle: 'Kahoot',
      metaTitle: 'Guides Kahoot AI Bot | QuizSolver',
      metaDescription: 'Comprenez Quiz ID, PIN, banque de réponses et mode automatique Kahoot avec QuizSolver.',
      description: 'Articles sur Kahoot Quiz ID, PIN live, questions masquées, banque de réponses et détection automatique.',
      tutorialLabel: 'Ouvrir le tutoriel Kahoot',
      tutorialPage: 'kahoot'
    },
    'platform-guides': {
      slug: 'platform-guides',
      title: 'Guides par plateforme',
      shortTitle: 'Plateformes',
      metaTitle: 'Guides Quiz Solver par Plateforme | QuizSolver',
      metaDescription: 'Guides pour Google Forms, Testportal, Moodle, Canvas et autres plateformes de quiz avec QuizSolver.',
      description: 'Workflows par plateforme: quoi ouvrir, quel mode utiliser et comment sauvegarder les questions.',
      tutorialLabel: 'Voir les tutoriels',
      tutorialPage: 'quizSolverAi'
    },
    'study-workflows': {
      slug: 'study-workflows',
      title: 'Méthodes de révision',
      shortTitle: 'Révision',
      metaTitle: 'Méthodes de Révision IA pour Quiz | QuizSolver',
      metaDescription: 'Transformez les questions résolues en notes, quiz de révision et rappel actif avec QuizSolver.',
      description: 'Articles sur explications, notes, historique, favoris et quiz de révision.',
      tutorialLabel: 'Essayer la démo',
      tutorialPage: 'demo'
    },
    focusscan: {
      slug: 'focusscan',
      title: 'FocusScan et questions image',
      shortTitle: 'FocusScan',
      metaTitle: 'Guides FocusScan OCR | QuizSolver',
      metaDescription: 'Résolvez questions en image, graphiques, PDF et texte bloqué avec FocusScan OCR dans QuizSolver.',
      description: 'Guides pour questions en capture, graphique, fragment PDF ou texte non copiable.',
      tutorialLabel: 'Ouvrir la démo FocusScan',
      tutorialPage: 'demo'
    },
    'privacy-detection': {
      slug: 'privacy-detection',
      title: 'Détection, confidentialité et usage sûr',
      shortTitle: 'Confidentialité',
      metaTitle: 'Détection de Quiz et Confidentialité | QuizSolver',
      metaDescription: 'Comprenez ce que les plateformes peuvent détecter et comment utiliser QuizSolver correctement.',
      description: 'Explications sur focus navigateur, limites des extensions, confidentialité et mythes de détection.',
      tutorialLabel: 'Lire la confidentialité',
      tutorialPage: 'privacy'
    }
  },
  it: {
    kahoot: {
      slug: 'kahoot',
      title: 'Guide Kahoot AI',
      shortTitle: 'Kahoot',
      metaTitle: 'Guide Kahoot AI Bot | QuizSolver',
      metaDescription: 'Capisci Quiz ID, PIN, banco risposte e modalità automatica di Kahoot con QuizSolver AI.',
      description: 'Articoli su Kahoot Quiz ID, PIN live, domande nascoste, banco risposte e auto mode.',
      tutorialLabel: 'Apri tutorial Kahoot',
      tutorialPage: 'kahoot'
    },
    'platform-guides': {
      slug: 'platform-guides',
      title: 'Guide per piattaforma',
      shortTitle: 'Piattaforme',
      metaTitle: 'Guide Quiz Solver per Piattaforma | QuizSolver',
      metaDescription: 'Guide per Google Forms, Testportal, Moodle, Canvas e altre piattaforme quiz con QuizSolver.',
      description: 'Workflow per piattaforma: cosa aprire, quale modalità usare e come salvare domande.',
      tutorialLabel: 'Vedi tutorial',
      tutorialPage: 'quizSolverAi'
    },
    'study-workflows': {
      slug: 'study-workflows',
      title: 'Metodi di studio',
      shortTitle: 'Studio',
      metaTitle: 'Metodi di Studio AI per Quiz Online | QuizSolver',
      metaDescription: 'Trasforma domande risolte in note, cronologia, quiz di pratica e ripasso attivo con QuizSolver.',
      description: 'Articoli su spiegazioni, cronologia, note, preferiti e quiz di pratica.',
      tutorialLabel: 'Prova la demo',
      tutorialPage: 'demo'
    },
    focusscan: {
      slug: 'focusscan',
      title: 'FocusScan e domande immagine',
      shortTitle: 'FocusScan',
      metaTitle: 'Guide FocusScan OCR | QuizSolver',
      metaDescription: 'Risolvi domande con immagini, grafici, PDF e testo bloccato usando FocusScan OCR in QuizSolver.',
      description: 'Guide per domande in screenshot, grafici, PDF o testo non copiabile.',
      tutorialLabel: 'Apri demo FocusScan',
      tutorialPage: 'demo'
    },
    'privacy-detection': {
      slug: 'privacy-detection',
      title: 'Rilevamento, privacy e uso sicuro',
      shortTitle: 'Privacy',
      metaTitle: 'Rilevamento Quiz e Privacy | QuizSolver',
      metaDescription: 'Scopri cosa possono rilevare le piattaforme quiz e come usare QuizSolver responsabilmente.',
      description: 'Spiegazioni su focus browser, limiti delle estensioni, privacy e miti sul rilevamento.',
      tutorialLabel: 'Leggi privacy',
      tutorialPage: 'privacy'
    }
  },
  uk: {
    kahoot: {
      slug: 'kahoot',
      title: 'Kahoot AI гайди',
      shortTitle: 'Kahoot',
      metaTitle: 'Kahoot AI Bot Гайди | QuizSolver',
      metaDescription: 'Quiz ID, PIN, банк відповідей і авто-режим Kahoot у відповідальних гайдах QuizSolver.',
      description: 'Практичні статті про Kahoot Quiz ID, PIN, приховані питання, банк відповідей і авто-режим.',
      tutorialLabel: 'Відкрити Kahoot-гайд',
      tutorialPage: 'kahoot'
    },
    'platform-guides': {
      slug: 'platform-guides',
      title: 'Гайди для платформ',
      shortTitle: 'Платформи',
      metaTitle: 'Гайди Quiz Solver для Платформ | QuizSolver',
      metaDescription: 'Покрокові гайди QuizSolver для Google Forms, Testportal, Moodle, Canvas та інших платформ.',
      description: 'Workflow для конкретних платформ: що відкрити, який режим вибрати і як зберегти питання.',
      tutorialLabel: 'Дивитися туторіали',
      tutorialPage: 'quizSolverAi'
    },
    'study-workflows': {
      slug: 'study-workflows',
      title: 'Навчання і повторення',
      shortTitle: 'Навчання',
      metaTitle: 'AI Навчання для Онлайн-Квізів | QuizSolver',
      metaDescription: 'Перетворюй розв’язані питання на нотатки, історію, тренування і повторення з QuizSolver.',
      description: 'Статті про пояснення, історію, нотатки, обране і тренувальні квізи.',
      tutorialLabel: 'Спробувати демо',
      tutorialPage: 'demo'
    },
    focusscan: {
      slug: 'focusscan',
      title: 'FocusScan і питання зображенням',
      shortTitle: 'FocusScan',
      metaTitle: 'FocusScan OCR Гайди | QuizSolver',
      metaDescription: 'Розв’язуй питання з картинок, графіків, PDF і заблокованого тексту через FocusScan OCR.',
      description: 'Гайди для питань у скріншотах, графіках, PDF-фрагментах або тексті, який не копіюється.',
      tutorialLabel: 'Відкрити FocusScan демо',
      tutorialPage: 'demo'
    },
    'privacy-detection': {
      slug: 'privacy-detection',
      title: 'Виявлення, приватність і безпечне використання',
      shortTitle: 'Приватність',
      metaTitle: 'Виявлення Квізів і Приватність | QuizSolver',
      metaDescription: 'Дізнайся, що можуть виявляти платформи квізів і як відповідально користуватися QuizSolver.',
      description: 'Пояснення про фокус браузера, межі розширень, приватність і міфи про виявлення.',
      tutorialLabel: 'Читати приватність',
      tutorialPage: 'privacy'
    }
  }
};

export function categoriesFor(locale: Locale): BlogCategoryCopy[] {
  const registry = BLOG_CATEGORIES[locale] || BLOG_CATEGORIES.en;
  return BLOG_CATEGORY_ORDER.map(slug => registry[slug]).filter(Boolean);
}

export function categoryFor(locale: Locale, slug: string | null | undefined): BlogCategoryCopy | undefined {
  if (!slug) return undefined;
  const registry = BLOG_CATEGORIES[locale] || BLOG_CATEGORIES.en;
  return registry[slug as BlogCategorySlug];
}

export function categoryLabel(locale: Locale, slug: string | null | undefined): string {
  return categoryFor(locale, slug)?.shortTitle || categoryFor(locale, slug)?.title || 'Guide';
}
