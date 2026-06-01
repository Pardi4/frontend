import { Locale } from './site-content';
import rawPosts from './blog-posts.json';

export interface BlogPostMetadata {
  translationKey: string;
  slug: string;
  category: string;
  tags?: string[];
  title: string;
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  dateModified: string;
  excerpt: string;
  author: string;
  locale: Locale;
  readTime: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
}

type ArticleSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type ArticleDraft = {
  intro: string[];
  sections: ArticleSection[];
};

const routeFor = (locale: Locale, slug: string): string => locale === 'en' ? `/${slug}` : `/${locale}/${slug}`;

const ctaFor = (locale: Locale): string => {
  const isPl = locale === 'pl';
  const title = isPl ? 'Sprawdź QuizSolver w praktyce' : 'Try QuizSolver in practice';
  const text = isPl
    ? 'Otwórz bezpieczne demo, uruchom panel rozszerzenia i przejdź przez przykładowe pytania bez zużywania kredytów.'
    : 'Open the safe demo, launch the extension panel and walk through sample questions without spending credits.';
  const button = isPl ? 'Otwórz demo' : 'Open demo';
  return `
    <div class="blog-native-ad">
      <h4 class="blog-native-ad-title">${title}</h4>
      <p class="blog-native-ad-text">${text}</p>
      <a href="${routeFor(locale, 'demo')}" class="blog-native-ad-btn">${button}</a>
    </div>
  `;
};

const renderArticle = (locale: Locale, draft: ArticleDraft): string => `
  <article class="blog-article-content">
    ${draft.intro.map(paragraph => `<p>${paragraph}</p>`).join('')}
    ${ctaFor(locale)}
    ${draft.sections.map(section => `
      <h2>${section.heading}</h2>
      ${(section.paragraphs || []).map(paragraph => `<p>${paragraph}</p>`).join('')}
      ${section.bullets?.length ? `<ul>${section.bullets.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
    `).join('')}
  </article>
`;

const genericLocalizedDraft = (locale: Locale): ArticleDraft => {
  const drafts: Record<Locale, ArticleDraft> = {
    en: {
      intro: [
        'QuizSolver is a Chrome extension for students who want faster feedback while studying with online quizzes. It reads visible questions, suggests answers and explains the reasoning so you can review the topic instead of only memorizing the option.',
        'The most useful workflow is simple: open a quiz, start QuizSolver, review the suggested answer, save important questions and return to them later as a practice set.'
      ],
      sections: [
        {
          heading: 'What QuizSolver does on a quiz page',
          paragraphs: ['The extension looks for question text, answer choices, checkboxes, dropdowns and short-answer fields that are visible on the current page. If the layout is unusual, FocusScan lets you select a screen region manually.'],
          bullets: ['AI answer suggestions with explanations.', 'FocusScan OCR for images and blocked text.', 'History, notes and practice quizzes for later review.']
        },
        {
          heading: 'Why explanations matter',
          paragraphs: ['A plain answer is useful for speed, but an explanation is what helps you remember the concept. Saved explanations become a personal revision library that you can revisit before the next test.']
        }
      ]
    },
    pl: {
      intro: [
        'QuizSolver to rozszerzenie do Chrome stworzone dla osób, które chcą szybciej sprawdzać pytania z quizów online i jednocześnie lepiej rozumieć odpowiedzi. Narzędzie rozpoznaje widoczną treść pytania, analizuje opcje i pokazuje uzasadnienie.',
        'Najlepszy schemat pracy jest prosty: otwierasz quiz, uruchamiasz QuizSolver, sprawdzasz podpowiedź, zapisujesz ważne pytania i wracasz do nich później jako do własnej powtórki.'
      ],
      sections: [
        {
          heading: 'Co QuizSolver robi na stronie quizu',
          paragraphs: ['Rozszerzenie szuka tekstu pytania, odpowiedzi jednokrotnego wyboru, checkboxów, list rozwijanych i pól tekstowych. Jeśli układ strony jest nietypowy, FocusScan pozwala ręcznie zaznaczyć fragment ekranu.'],
          bullets: ['Podpowiedzi AI z uzasadnieniem.', 'FocusScan OCR dla obrazów i zablokowanego tekstu.', 'Historia, notatki i quizy powtórkowe po rozwiązaniu pytań.']
        },
        {
          heading: 'Dlaczego wyjaśnienia są ważniejsze niż sama litera odpowiedzi',
          paragraphs: ['Sama odpowiedź pomaga szybko przejść dalej, ale dopiero wyjaśnienie pozwala zapamiętać zasadę. Zapisane odpowiedzi i notatki tworzą prywatną bazę powtórkową przed kolejnym testem.']
        }
      ]
    },
    de: {
      intro: [
        'QuizSolver ist eine Chrome-Erweiterung für Online-Quizze, die sichtbare Fragen analysiert, Antwortvorschläge liefert und die Begründung erklärt.',
        'So entsteht aus jeder Frage nicht nur eine schnelle Antwort, sondern auch Material für spätere Wiederholung.'
      ],
      sections: [
        { heading: 'Der typische Ablauf', paragraphs: ['Öffne dein Quiz, starte QuizSolver, prüfe den Vorschlag und speichere wichtige Fragen im Verlauf. Bei Bildern oder gesperrtem Text hilft FocusScan.'], bullets: ['KI-Hinweise direkt im Browser.', 'OCR für Screenshots und Diagramme.', 'Notizen und Übungsquizze aus dem Verlauf.'] },
        { heading: 'Besser lernen statt nur klicken', paragraphs: ['Die Erklärung zeigt, warum eine Antwort passt. Dadurch wird der Verlauf zu einem echten Lernarchiv.'] }
      ]
    },
    es: {
      intro: [
        'QuizSolver es una extensión de Chrome para estudiar con quizzes online. Detecta preguntas visibles, analiza opciones y muestra explicaciones con IA.',
        'La idea es usar cada respuesta como material de repaso, no solo como una solución rápida.'
      ],
      sections: [
        { heading: 'Flujo recomendado', paragraphs: ['Abre el quiz, activa QuizSolver, revisa la sugerencia y guarda las preguntas importantes. Si el texto no se puede copiar, usa FocusScan.'], bullets: ['Sugerencias con explicación.', 'OCR para imágenes y texto bloqueado.', 'Historial, notas y práctica desde tus preguntas.'] },
        { heading: 'Por qué guardar el historial', paragraphs: ['El historial convierte preguntas sueltas en una biblioteca personal para repasar antes de exámenes.'] }
      ]
    },
    fr: {
      intro: [
        'QuizSolver est une extension Chrome qui aide à analyser les quiz en ligne, lire les questions visibles et proposer des explications avec IA.',
        'L’objectif est de transformer chaque question en support de révision clair.'
      ],
      sections: [
        { heading: 'Comment l’utiliser', paragraphs: ['Ouvrez le quiz, lancez QuizSolver, lisez la suggestion et gardez les questions importantes dans l’historique. FocusScan aide quand le texte est une image.'], bullets: ['Réponses suggérées avec explications.', 'OCR pour images et textes bloqués.', 'Historique et quiz de révision.'] },
        { heading: 'Apprendre avec les explications', paragraphs: ['Une explication courte aide à comprendre la règle et à mieux préparer le prochain test.'] }
      ]
    },
    it: {
      intro: [
        'QuizSolver è un’estensione Chrome per quiz online che riconosce domande visibili, suggerisce risposte e mostra spiegazioni con AI.',
        'Ogni domanda salvata può diventare materiale di ripasso per studiare in modo più ordinato.'
      ],
      sections: [
        { heading: 'Uso consigliato', paragraphs: ['Apri il quiz, avvia QuizSolver, controlla la risposta suggerita e salva le domande importanti. FocusScan aiuta con immagini e testo non copiabile.'], bullets: ['Suggerimenti con spiegazione.', 'OCR per screenshot e grafici.', 'Cronologia, note e quiz di pratica.'] },
        { heading: 'Perché non basta la risposta', paragraphs: ['La spiegazione rende più facile ricordare il concetto e ripassare prima del test successivo.'] }
      ]
    },
    uk: {
      intro: [
        'QuizSolver — це розширення Chrome для онлайн-квізів, яке розпізнає видимі питання, пропонує відповідь і пояснює логіку.',
        'Збережені питання можна використовувати пізніше як матеріал для повторення.'
      ],
      sections: [
        { heading: 'Як працювати з QuizSolver', paragraphs: ['Відкрийте квіз, запустіть QuizSolver, перевірте підказку та збережіть важливі питання. Якщо текст є зображенням, використайте FocusScan.'], bullets: ['AI-підказки з поясненнями.', 'OCR для зображень і заблокованого тексту.', 'Історія, нотатки та тренувальні квізи.'] },
        { heading: 'Навчання через пояснення', paragraphs: ['Пояснення допомагає зрозуміти правило, а не просто вибрати варіант відповіді.'] }
      ]
    }
  };
  return drafts[locale] || drafts.en;
};

const ARTICLE_DRAFTS: Record<string, ArticleDraft> = {
  'czy-testportal-wykrywa-karty': {
    intro: [
      'Testportal nie widzi magicznie całego Twojego komputera, ale potrafi rejestrować zdarzenia dostępne dla zwykłej strony internetowej. Najczęściej chodzi o utratę fokusu okna, opuszczenie karty, przełączenie aplikacji albo wyjście z trybu pełnoekranowego.',
      'Warto rozumieć te mechanizmy, bo wiele mitów o Testportalu bierze się z mieszania realnych zdarzeń przeglądarki z wyobrażeniem, że nauczyciel ma podgląd pulpitu.'
    ],
    sections: [
      {
        heading: 'Co jest realnie wykrywalne',
        paragraphs: ['Strona quizu może dostać informację, że karta przestała być aktywna. To nie mówi, co dokładnie zrobił użytkownik, ale w raporcie może pojawić się jako opuszczenie testu.'],
        bullets: ['zmiana aktywnej karty lub okna', 'kliknięcie w inną aplikację', 'utrata trybu pełnoekranowego', 'czas spędzony poza aktywną kartą testu']
      },
      {
        heading: 'Czego platforma zwykle nie widzi',
        paragraphs: ['Bez dodatkowego oprogramowania egzaminacyjnego strona nie może po prostu przeskanować listy programów, zobaczyć innych kart ani odczytać plików z komputera. To ograniczenie wynika z bezpieczeństwa przeglądarki.']
      },
      {
        heading: 'Jak korzystać z AI rozsądniej',
        paragraphs: ['Najbezpieczniejszy kierunek to używanie AI do przygotowania i powtórek: zapisuj pytania, dodawaj notatki, twórz quiz z historii i sprawdzaj, czy naprawdę rozumiesz odpowiedź.']
      }
    ]
  },
  'jak-przygotowac-sie-do-testu-online-z-ai': {
    intro: [
      'Największy błąd przed testem online to uczenie się przez losowe kopiowanie pytań do chatu. Działa to chwilowo, ale nie tworzy żadnego systemu powtórki.',
      'QuizSolver pomaga zbudować prosty proces: wykrycie pytania, wyjaśnienie, notatka, zapis w historii i powtórka w formie własnego quizu.'
    ],
    sections: [
      {
        heading: 'Krok 1: zbierz materiał',
        paragraphs: ['Podczas ćwiczeń zapisuj pytania, które sprawiają problem. Nie zapisuj wszystkiego bezmyślnie; oznaczaj te, do których chcesz wrócić.'],
        bullets: ['pytania z błędnymi odpowiedziami', 'zadania z obrazkiem lub wykresem', 'pojęcia, które wymagają definicji', 'tematy, które powtarzają się w różnych quizach']
      },
      {
        heading: 'Krok 2: dopisz własną notatkę',
        paragraphs: ['Najlepsza notatka jest krótka: jedno zdanie z zasadą, wzorem albo pułapką. Dzięki temu historia pytań nie jest archiwum chaosu, tylko mapą do powtórki.']
      },
      {
        heading: 'Krok 3: wróć do pytań po czasie',
        paragraphs: ['Po kilku dniach uruchom quiz z historii i sprawdź, czy umiesz odpowiedzieć bez patrzenia na podpowiedź. To aktywne przypominanie, czyli jedna z najskuteczniejszych metod nauki.']
      }
    ]
  },
  'kahoot-quiz-id-jak-znalezc-i-uzyc': {
    intro: [
      'W Kahoot są dwa różne identyfikatory, które często się mylą: PIN gry i Quiz ID. PIN służy do dołączenia do rozgrywki live, a Quiz ID identyfikuje konkretny zestaw pytań.',
      'Jeżeli prowadzący ukrywa pytania na urządzeniach uczestników, tryb Quiz ID może pokazać bazę pytań i odpowiedzi bez wysyłania zapytań do AI.'
    ],
    sections: [
      {
        heading: 'Gdzie znaleźć Quiz ID',
        paragraphs: ['Najczęściej Quiz ID pojawia się w adresie URL jako wartość po parametrze quizId=. To długi ciąg znaków, a nie krótki PIN gry wpisywany przez uczestników.'],
        bullets: ['otwórz stronę lobby lub podgląd quizu', 'sprawdź pasek adresu', 'skopiuj wartość po quizId=', 'wklej ją w panel QuizSolver na Kahoot']
      },
      {
        heading: 'Kiedy użyć trybu automatycznego',
        paragraphs: ['Jeżeli pytania i opcje odpowiedzi są widoczne na ekranie uczestnika, możesz użyć trybu automatycznego. Rozszerzenie wykrywa wtedy aktualne pytanie i próbuje kliknąć najlepszą odpowiedź.']
      },
      {
        heading: 'Kiedy użyć banku odpowiedzi',
        paragraphs: ['Jeżeli host ukrywa treść pytań, automatyczne wykrywanie nie ma z czego czytać. Wtedy sens ma tryb Quiz ID, czyli przeszukiwalna lista pytań i poprawnych odpowiedzi.']
      }
    ]
  },
  'google-forms-quiz-solver-jak-dziala': {
    intro: [
      'Google Forms wygląda prosto, ale quiz może zawierać różne typy pól: radio, checkboxy, krótkie odpowiedzi, listy rozwijane, obrazy i sekcje wielostronicowe.',
      'Dobry solver nie powinien zakładać, że każde pytanie ma jedną odpowiedź. Dlatego QuizSolver rozpoznaje typ pola i wysyła do AI informację, czy możliwy jest wybór wielu odpowiedzi.'
    ],
    sections: [
      {
        heading: 'Najważniejsze typy pytań',
        paragraphs: ['Rozpoznanie typu pytania wpływa na jakość odpowiedzi. Checkbox oznacza, że poprawnych opcji może być kilka, a pytanie tekstowe wymaga innej formy odpowiedzi niż test ABCD.'],
        bullets: ['jednokrotny wybór', 'wielokrotny wybór', 'krótka odpowiedź', 'lista rozwijana', 'pytania z obrazem']
      },
      {
        heading: 'Co zrobić przy nietypowym układzie',
        paragraphs: ['Jeżeli formularz jest osadzony w ramce albo pytanie znajduje się na obrazku, użyj FocusScan. Zaznaczasz obszar z pytaniem i odpowiedziami, a OCR przygotowuje tekst dla AI.']
      },
      {
        heading: 'Jak zachować porządek po quizie',
        paragraphs: ['Po rozwiązaniu zapisz ważne pytania w historii. W panelu /quiz możesz oznaczać ulubione, dopisywać notatki i tworzyć własne powtórki.']
      }
    ]
  },
  'focusscan-pytania-ze-zdjecia-i-wykresu': {
    intro: [
      'Nie każde pytanie da się skopiować. Czasem treść jest obrazkiem, wykresem, fragmentem PDF albo elementem strony, który blokuje zaznaczanie tekstu.',
      'FocusScan rozwiązuje ten problem przez zaznaczenie fragmentu ekranu. OCR odczytuje tekst z obrazu, a AI dostaje czysty kontekst zamiast przypadkowego zrzutu całej strony.'
    ],
    sections: [
      {
        heading: 'Kiedy używać FocusScan',
        paragraphs: ['FocusScan warto uruchomić wtedy, gdy zwykłe wykrywanie strony nie daje pełnego pytania albo pomija ważny obraz. Zaznacz tylko potrzebny fragment, żeby nie mieszać AI zbędnym tekstem.'],
        bullets: ['pytania jako obraz', 'wykresy i diagramy', 'wzory matematyczne', 'PDF i osadzone ramki', 'strony blokujące kopiowanie']
      },
      {
        heading: 'Jak poprawić jakość odpowiedzi',
        paragraphs: ['Najlepszy wynik daje zaznaczenie pytania razem z odpowiedziami. Jeśli zadanie ma obraz, obejmij go w zaznaczeniu. Jeżeli tekst jest mały, powiększ stronę przed skanowaniem.']
      },
      {
        heading: 'Dlaczego to jest przydatne do nauki',
        paragraphs: ['Pytania obrazkowe często są najtrudniejsze do powtórki. Po zapisaniu ich w historii możesz dopisać własną notatkę i wrócić do schematu przed egzaminem.']
      }
    ]
  },
  'historia-pytan-notatki-i-quiz-powtorkowy': {
    intro: [
      'Historia pytań to coś więcej niż lista ostatnich odpowiedzi. Dobrze używana działa jak prywatny zeszyt ćwiczeń: masz pytanie, odpowiedź, wyjaśnienie, notatkę i status powtórki.',
      'To właśnie tutaj QuizSolver zmienia się z narzędzia do szybkiego sprawdzania odpowiedzi w pełny system nauki.'
    ],
    sections: [
      {
        heading: 'Co warto zapisywać',
        paragraphs: ['Nie każde pytanie musi trafić do powtórki. Największą wartość mają pytania, które pokazują lukę w wiedzy albo często powtarzający się schemat.'],
        bullets: ['pytania oznaczone jako trudne', 'błędne odpowiedzi', 'zadania z obrazkami', 'definicje i pojęcia', 'pytania, które mogą wrócić na sprawdzianie']
      },
      {
        heading: 'Jak działa quiz z historii',
        paragraphs: ['Wybierasz zapisane pytania i uruchamiasz własny quiz powtórkowy. Dzięki temu sprawdzasz pamięć aktywnie, zamiast tylko czytać gotowe odpowiedzi.']
      },
      {
        heading: 'Jak notować, żeby nie utonąć w tekście',
        paragraphs: ['Dobra notatka ma być krótsza niż pytanie. Zapisz zasadę, wyjątek albo powód, dla którego dana odpowiedź jest poprawna. Tyle wystarczy, żeby wrócić do tematu później.']
      }
    ]
  },
  'does-canvas-or-moodle-detect-extensions': {
    intro: [
      'Canvas and Moodle run inside the browser sandbox. That means they can observe what happens on their own page, but they cannot freely inspect your computer, your installed extensions or other private tabs.',
      'The confusing part is that quiz platforms can still log focus changes, page visibility and copy restrictions. Understanding that difference helps you avoid myths.'
    ],
    sections: [
      {
        heading: 'What LMS quiz pages can usually detect',
        paragraphs: ['A quiz page can receive browser events when it loses focus or becomes hidden. Teachers may see logs such as stopped viewing the quiz page, page left or time away from the quiz.'],
        bullets: ['tab or window focus changes', 'page visibility changes', 'copy and paste attempts if blocked by the page', 'time spent away from the active quiz window']
      },
      {
        heading: 'What they cannot normally inspect',
        paragraphs: ['Without a locked-down exam browser or separate proctoring software, a normal website cannot list your browser extensions, read unrelated tabs or scan files on your device.']
      },
      {
        heading: 'Where QuizSolver fits',
        paragraphs: ['QuizSolver is most valuable as a study assistant: it explains questions, saves your history and helps you revise. The side-panel workflow reduces unnecessary tab switching while you review visible quiz content.']
      }
    ]
  },
  'how-to-study-smarter-ai-quiz-solvers': {
    intro: [
      'AI quiz solvers are most useful when they become part of a study loop, not when they are treated as a magic answer button.',
      'A good workflow turns every solved question into something reusable: an explanation, a note, a favorite item or a practice question for later.'
    ],
    sections: [
      {
        heading: 'Use AI for explanations first',
        paragraphs: ['The answer tells you what to choose. The explanation tells you why. If you read the reasoning and compare it with your own intuition, the same topic is easier to recall later.']
      },
      {
        heading: 'Build a revision library',
        paragraphs: ['Save questions that reveal a weak point. Add one short note in your own words. Mark questions as favorite or weak so your review session has a clear order.'],
        bullets: ['save difficult questions', 'add short notes', 'review favorites', 'generate practice quizzes from history']
      },
      {
        heading: 'Use FocusScan only when structure is hard to read',
        paragraphs: ['If a page blocks copying or renders the question as an image, FocusScan gives the AI better context by selecting only the relevant screen area.']
      }
    ]
  },
  'kahoot-quiz-id-answer-bank-guide': {
    intro: [
      'Kahoot has two different identifiers: the live game PIN and the Quiz ID. The PIN gets you into a live session. The Quiz ID points to the underlying quiz set.',
      'When questions are hidden by the host, a Quiz ID answer bank is often more useful than automatic page detection because the page itself may not show the question text.'
    ],
    sections: [
      {
        heading: 'Where to find the Quiz ID',
        paragraphs: ['Look for a quizId parameter in the Kahoot URL. It is usually a long ID string, not the short numeric PIN used by players.'],
        bullets: ['open the lobby, preview or instruction page', 'check the address bar', 'copy the value after quizId=', 'paste it into the QuizSolver Kahoot panel']
      },
      {
        heading: 'Auto mode vs answer bank',
        paragraphs: ['Auto mode works when the current question and answers are visible. Answer bank mode is better when the host hides them from player devices.']
      },
      {
        heading: 'Why this mode does not need AI credits',
        paragraphs: ['The answer bank reads quiz structure instead of asking an AI model to reason from scratch, so it can be shown without spending credits.']
      }
    ]
  },
  'google-forms-quiz-solver-guide': {
    intro: [
      'Google Forms quizzes look simple, but they may include radio questions, checkboxes, dropdowns, short answers, images and multiple sections.',
      'QuizSolver improves answer quality by identifying the question type before sending context to AI.'
    ],
    sections: [
      {
        heading: 'Why question type matters',
        paragraphs: ['A checkbox question can have several correct answers. A short answer field needs a text response. A dropdown should be handled differently from a radio group.'],
        bullets: ['single choice', 'multiple choice', 'short answer', 'dropdowns', 'image-based prompts']
      },
      {
        heading: 'When to use FocusScan',
        paragraphs: ['If the form is embedded in an unusual layout or the question is an image, select the question region with FocusScan so OCR can prepare clean text for AI.']
      },
      {
        heading: 'Review after submission',
        paragraphs: ['Saved questions become a study set. Use notes and practice quizzes to revisit the topics that appeared in the form.']
      }
    ]
  },
  'solve-image-questions-with-focusscan': {
    intro: [
      'Image-based quiz questions are frustrating because normal text extraction often fails. A chart, screenshot, PDF fragment or locked question can break a standard parser.',
      'FocusScan lets you draw a box around the relevant area and sends that cropped context through OCR before AI analysis.'
    ],
    sections: [
      {
        heading: 'Best use cases',
        paragraphs: ['Use FocusScan whenever the visible page structure does not contain enough text or when the important information is inside an image.'],
        bullets: ['screenshots', 'charts and diagrams', 'math formulas', 'PDF fragments', 'blocked copy text']
      },
      {
        heading: 'How to capture a useful region',
        paragraphs: ['Include the question, all answer options and any diagram needed to solve it. Avoid selecting the whole page because extra text can confuse the model.']
      },
      {
        heading: 'Save the result for later',
        paragraphs: ['If the explanation is useful, save the question and add a short note. Image questions often repeat as concepts, even when the exact picture changes.']
      }
    ]
  },
  'turn-quiz-history-into-practice-tests': {
    intro: [
      'Your saved quiz history can become a personal practice system. Instead of rereading answers, you can generate a quiz from previous questions and test yourself again.',
      'This is active recall: it forces your brain to retrieve the answer, which is usually more effective than passive reading.'
    ],
    sections: [
      {
        heading: 'Choose the right questions',
        paragraphs: ['Do not practice everything at once. Start with weak or favorite questions, then add new items as your course moves forward.'],
        bullets: ['weak questions', 'favorite explanations', 'image-based tasks', 'definitions', 'questions you answered incorrectly']
      },
      {
        heading: 'Keep notes short',
        paragraphs: ['A useful note should capture the rule, exception or memory hook. If it is longer than the explanation, it becomes hard to review.']
      },
      {
        heading: 'Share when studying in a group',
        paragraphs: ['If you study with classmates, selected history questions can become a shared practice set. Comparing explanations is often more valuable than comparing only final answers.']
      }
    ]
  },
  'czy-da-sie-oszukiwac-na-kahoot': {
    intro: [
      'Ludzie wpisują w Google „jak oszukiwać na Kahoot”, bo chcą szybko wygrać live quiz albo zrozumieć, dlaczego ktoś zna odpowiedzi wcześniej. Sensowna odpowiedź zaczyna się od rozróżnienia dwóch rzeczy: live PIN-u i Quiz ID.',
      'Ten poradnik nie jest instrukcją łamania zasad. Pokazuje, co technicznie oznaczają ukryte pytania, kiedy QuizSolver może czytać widoczną stronę i jak użyć Quiz ID do nauki albo powtórki bez zużywania kredytów.'
    ],
    sections: [
      {
        heading: 'PIN gry to nie Quiz ID',
        paragraphs: ['PIN Kahoot służy do wejścia do aktualnej rozgrywki. Quiz ID identyfikuje konkretny zestaw pytań utworzony przez autora quizu. QuizSolver potrzebuje Quiz ID tylko wtedy, gdy chcesz zobaczyć bank pytań dla publicznego zestawu albo gdy host ukrywa pytania na urządzeniach graczy.'],
        bullets: ['PIN jest krótki i zmienia się dla sesji live.', 'Quiz ID jest dłuższy i zwykle pojawia się w adresie URL po quizId=.', 'Tryb Quiz ID nie wysyła pytania do AI, więc nie zużywa kredytów.']
      },
      {
        heading: 'Co zrobić, gdy pytania są widoczne',
        paragraphs: ['Jeżeli na ekranie widzisz pytanie i odpowiedzi, użyj trybu automatycznego. Rozszerzenie może wtedy odczytać treść strony, wysłać ją do AI i wskazać najlepszą opcję. Ten tryb jest zależny od tego, co faktycznie jest widoczne w przeglądarce.']
      },
      {
        heading: 'Co zrobić, gdy host ukrywa pytania',
        paragraphs: ['Jeżeli gracz widzi tylko kafelki odpowiedzi bez treści pytania, automatyczne wykrywanie nie ma kontekstu. W takiej sytuacji panel Kahoot w QuizSolver prosi o Quiz ID i pokazuje przeszukiwalną listę pytań oraz poprawnych odpowiedzi, jeżeli zestaw da się pobrać.']
      },
      {
        heading: 'Najlepszy sposób użycia przed quizem',
        paragraphs: ['Najmocniejszy workflow to przejrzenie banku pytań przed rozgrywką, zapisanie trudnych tematów i zrobienie własnej powtórki. Zamiast zgadywać kafelki w live grze, wiesz, których pojęć jeszcze nie rozumiesz.']
      }
    ]
  },
  'can-you-cheat-on-kahoot': {
    intro: [
      'People search “can you cheat on Kahoot” because Kahoot mixes speed, hidden screens and public question sets. The useful answer is not a magic trick; it is understanding the difference between a live game PIN and a Quiz ID.',
      'This guide explains the limits without giving a rule-breaking playbook. It shows when QuizSolver can read visible questions, when hidden questions require Quiz ID mode and how to use the answer bank for practice.'
    ],
    sections: [
      {
        heading: 'A Kahoot PIN is not a Quiz ID',
        paragraphs: ['The PIN joins a live session. The Quiz ID identifies the underlying question set. QuizSolver only asks for a Quiz ID when visible page detection is not enough or when you want to review the question bank.'],
        bullets: ['The PIN is short and session-specific.', 'The Quiz ID is usually a longer URL value after quizId=.', 'Quiz ID mode does not spend AI credits because it loads quiz structure instead of asking AI.']
      },
      {
        heading: 'When auto mode works',
        paragraphs: ['If the player screen shows the question and answer text, auto mode can parse the page, ask AI for the best answer and click or suggest the matching choice. If the page only shows colored tiles, there is not enough visible context.']
      },
      {
        heading: 'When hidden questions need an answer bank',
        paragraphs: ['Some hosts hide questions on player devices. In that case, Quiz ID mode opens a searchable panel with the quiz questions and correct answers when the public Kahoot data is available.']
      },
      {
        heading: 'Use it as review, not a shortcut',
        paragraphs: ['The strongest way to use Quiz ID mode is before or after a session: review the question bank, mark weak topics and turn them into notes or practice questions.']
      }
    ]
  },
  'kahoot-pin-vs-quiz-id': {
    intro: [
      'Najczęstszy błąd w panelu Kahoot to wklejenie PIN-u gry zamiast Quiz ID. PIN pozwala wejść do sesji live, ale nie mówi rozszerzeniu, jaki zestaw pytań ma pobrać.',
      'Quiz ID to identyfikator konkretnego kahoota. Właśnie dlatego jest potrzebny w trybie banku odpowiedzi.'
    ],
    sections: [
      {
        heading: 'Jak rozpoznać PIN',
        paragraphs: ['PIN gry jest krótki, zwykle numeryczny i wpisuje się go na stronie kahoot.it, żeby dołączyć do rozgrywki. Działa tylko dla aktualnej sesji uruchomionej przez hosta.']
      },
      {
        heading: 'Jak rozpoznać Quiz ID',
        paragraphs: ['Quiz ID jest częścią linku do konkretnego quizu. Najczęściej znajdziesz go w adresie URL po fragmencie quizId=. To ten kod wklejasz w panel QuizSolver, gdy pytania są ukryte.']
      },
      {
        heading: 'Który tryb wybrać',
        bullets: ['Pytania i odpowiedzi są widoczne: użyj trybu automatycznego.', 'Widzisz tylko kafelki lub host ukrywa treść: użyj Quiz ID.', 'Chcesz powtórzyć pytania bez AI: użyj banku odpowiedzi.']
      }
    ]
  },
  'kahoot-pin-vs-quiz-id-explained': {
    intro: [
      'The fastest way to fix Kahoot setup problems is to stop mixing two codes: the live PIN and the Quiz ID. They look similar in conversation, but they do different jobs.',
      'The PIN joins the game. The Quiz ID points to the quiz set that QuizSolver can load in answer bank mode.'
    ],
    sections: [
      {
        heading: 'What the PIN does',
        paragraphs: ['The PIN is the short code players type on kahoot.it to join the current live session. It changes between sessions and is not enough to fetch the question bank.']
      },
      {
        heading: 'What the Quiz ID does',
        paragraphs: ['The Quiz ID usually appears in a URL after quizId=. It identifies the original Kahoot quiz, which is why QuizSolver asks for it when questions are hidden.']
      },
      {
        heading: 'Which mode to use',
        bullets: ['Visible question text: use auto mode.', 'Only answer tiles are visible: use Quiz ID mode.', 'Practice without AI credits: use the answer bank.']
      }
    ]
  },
  'najlepszy-ai-quiz-solver-chrome': {
    intro: [
      'Dobry AI quiz solver nie powinien być tylko przyciskiem „daj odpowiedź”. Jeżeli ma pomagać naprawdę, musi rozpoznawać typ pytania, radzić sobie z obrazami, zapisywać historię i jasno pokazywać, kiedy zużywa kredyty.',
      'Ta lista pomaga porównać rozszerzenia do Chrome bez łapania się na puste obietnice i spam słów kluczowych.'
    ],
    sections: [
      {
        heading: 'Rozpoznawanie typów pytań',
        paragraphs: ['Sprawdź, czy rozszerzenie rozróżnia radio, checkboxy, dropdowny, krótkie odpowiedzi i pytania z obrazem. Checkbox jest szczególnie ważny, bo oznacza możliwość kilku poprawnych odpowiedzi.']
      },
      {
        heading: 'OCR i pytania obrazkowe',
        paragraphs: ['W quizach często pojawiają się wykresy, screenshoty i fragmenty PDF. Dlatego FocusScan albo podobny tryb OCR jest ważniejszy niż kolejny marketingowy slogan.']
      },
      {
        heading: 'Historia, notatki i powtórka',
        paragraphs: ['Jeżeli odpowiedź znika po zamknięciu strony, tracisz większość wartości. Dobry solver zapisuje pytania, pozwala dodać notatkę i wrócić do nich jako quiz powtórkowy.']
      },
      {
        heading: 'Prywatność i jasne limity',
        paragraphs: ['Użytkownik powinien wiedzieć, co jest wysyłane do AI, kiedy zużywany jest kredyt i jakie dane zostają lokalnie albo na koncie. To buduje zaufanie bardziej niż obietnica „działa wszędzie”.']
      }
    ]
  },
  'best-ai-quiz-solver-chrome-extension': {
    intro: [
      'The best AI quiz solver extension is not the one with the loudest promise. It is the one that detects question structure reliably, explains answers, handles images and makes saved questions useful later.',
      'Use this checklist before installing any quiz solver for Chrome.'
    ],
    sections: [
      {
        heading: 'Question type detection',
        paragraphs: ['A serious solver should distinguish radio questions, checkboxes, dropdowns, short answers and image-based prompts. Multiple-answer questions need a different AI instruction than single-choice questions.']
      },
      {
        heading: 'OCR for screenshots and charts',
        paragraphs: ['Online quizzes often include charts, PDF fragments and locked text. A FocusScan-style OCR tool lets the extension read the relevant screen region instead of guessing from incomplete HTML.']
      },
      {
        heading: 'History and practice mode',
        paragraphs: ['Saved history turns a quick answer into study material. Look for notes, favorites, weak-question filters and a way to build practice quizzes from previous questions.']
      },
      {
        heading: 'Privacy and transparent credits',
        paragraphs: ['A trustworthy extension should explain what is sent to AI, when a credit is spent and which data is saved. Transparent limits are better than vague claims that the tool works everywhere.']
      }
    ]
  }
};

const metadata = rawPosts as BlogPostMetadata[];

export const BLOG_POST_MANIFEST: BlogPostMetadata[] = metadata;

export const BLOG_POSTS: BlogPost[] = metadata
  .map((post) => ({
    ...post,
    content: renderArticle(post.locale, ARTICLE_DRAFTS[post.slug] || genericLocalizedDraft(post.locale))
  }))
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
