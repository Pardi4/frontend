import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../seo.service';
import { Locale, CHROME_WEB_STORE_URL } from '../site-content';
import { ShellComponent } from './shell.component';

type DemoQuestionType = 'radio' | 'hidden' | 'text' | 'matching' | 'selected';

interface DemoQuestion {
  id: string;
  type: DemoQuestionType;
  kicker: string;
  title: string;
  instruction: string;
  question: string;
  options?: string[];
  prompts?: string[];
  placeholder?: string;
  correctText: string;
  hint?: string;
  explanation?: string;
}

interface DemoLabels {
  quizMeta: string;
  scoreLabel: string;
  answeredLabel: string;
  accuracyLabel: string;
  checkAnswer: string;
  showHint: string;
  simulateSolver: string;
  resetAnswers: string;
  correctTitle: string;
  wrongTitle: string;
  emptyTitle: string;
  hintTitle: string;
  explanationLabel: string;
  resultTitle: string;
  resultText: string;
  finalPrimary: string;
  finalSecondary: string;
  sideTitle: string;
  sideText: string;
}

interface DemoCopy {
  eyebrow: string;
  title: string;
  lead: string;
  install: string;
  openStore: string;
  demoBadge: string;
  localBadge: string;
  mapTitle: string;
  mapText: string;
  prev: string;
  next: string;
  restart: string;
  startTour: string;
  selectText: string;
  selectedTip: string;
  yourAnswer: string;
  chooseOption: string;
  popupTitle: string;
  popupSteps: string[];
  labels?: Partial<DemoLabels>;
  proofItems?: string[];
  questions: DemoQuestion[];
}

interface DemoAnswerState {
  value?: string;
  matches?: string[];
  checked?: boolean;
  correct?: boolean;
  empty?: boolean;
  hinted?: boolean;
  solved?: boolean;
}

const DEFAULT_DEMO_LABELS: DemoLabels = {
  quizMeta: 'Live practice quiz',
  scoreLabel: 'Score',
  answeredLabel: 'Answered',
  accuracyLabel: 'Accuracy',
  checkAnswer: 'Check my answer',
  showHint: '💡 Show hint (Hint mode)',
  simulateSolver: '✨ Solve with QuizSolver',
  resetAnswers: 'Restart quiz',
  correctTitle: 'Correct answer',
  wrongTitle: 'Not quite right',
  emptyTitle: 'Choose an answer first',
  hintTitle: 'QuizSolver Hint',
  explanationLabel: 'Why this answer works',
  resultTitle: 'Demo complete!',
  resultText: 'You tested choices, hint mode, text input, matching dropdowns, and selected text. QuizSolver works exactly like this on real quiz pages.',
  finalPrimary: 'Install Chrome Extension',
  finalSecondary: 'Restart quiz',
  sideTitle: 'QuizSolver in action',
  sideText: 'Test in browser or use the Chrome extension.'
};

const COPY: Partial<Record<Locale, DemoCopy>> & { en: DemoCopy; pl: DemoCopy } = {
  en: {
    eyebrow: 'Interactive Practice · 0 Credits Used',
    title: 'See QuizSolver in action',
    lead: 'Test 5 real question formats: multiple choice, discreet Hint mode, typed inputs, matching dropdowns, and quick selected-text solving.',
    install: 'Install extension',
    openStore: 'Open Chrome Web Store',
    demoBadge: 'No credits used',
    localBadge: 'Interactive practice',
    mapTitle: 'How to use this demo',
    mapText: 'Test solving directly in your browser with the buttons below, or open the official QuizSolver Chrome extension on this page.',
    prev: 'Previous',
    next: 'Next question',
    restart: 'Restart quiz',
    startTour: 'Start extension tutorial',
    selectText: '✂️ Select question text',
    selectedTip: 'Select only the question text and click Solve selected text (or press Alt+Q in the extension).',
    yourAnswer: 'Your answer',
    chooseOption: 'Choose',
    popupTitle: 'Popup flow',
    popupSteps: [
      'Click Solve current page and check that the correct answer is selected.',
      'Turn on Hint mode before solving to see a subtle clue instead of an automatic click.',
      'Use the text example to see how typed answers are filled.',
      'Use dropdown matching to test LMS multiple select fields.',
      'Highlight question text and solve only that selection with Quick overlay (Alt+Q).'
    ],
    labels: {
      quizMeta: 'Safe test quiz',
      resultText: 'You have tested choices, hint mode, typed answers, matching fields, and selected text without spending credits.',
      simulateSolver: '✨ Solve with QuizSolver',
      showHint: '💡 Show hint (Hint mode)',
      checkAnswer: 'Check my answer'
    },
    proofItems: ['Works without credits on this demo', 'Shows why an answer is correct', 'Built to match real quiz layouts'],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Step 1 of 5 · Multiple Choice',
        title: 'Biology multiple choice',
        instruction: 'QuizSolver scans the question and automatically selects the correct answer in one click.',
        question: 'Which organelle is mainly responsible for producing ATP in eukaryotic cells?',
        options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Cell membrane'],
        correctText: 'Mitochondrion',
        hint: 'Look for the organelle often called the cell powerhouse.',
        explanation: 'Mitochondria perform cellular respiration and produce most of the ATP used as energy by eukaryotic cells.'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Step 2 of 5 · Hint Mode',
        title: 'History: Hint mode',
        instruction: 'Don’t want the tool to click for you? Hint mode discreetly highlights the clue, keeping you in full control.',
        question: 'Which source is the strongest example of primary historical evidence?',
        options: ['A textbook chapter', 'A diary written during the event', 'A modern documentary', 'An encyclopedia summary'],
        correctText: 'A diary written during the event',
        hint: 'Primary evidence is created during the event by someone who directly experienced it.',
        explanation: 'A diary written during the event is a primary source because it records first-hand information from that time.'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Step 3 of 5 · Text Input',
        title: 'Math: Typed answer',
        instruction: 'QuizSolver accurately fills numbers and short text into quiz form inputs.',
        question: 'What is the value of 12 x 8?',
        placeholder: 'Type your answer',
        correctText: '96',
        hint: 'Break it into 10 x 8 plus 2 x 8.',
        explanation: '12 x 8 equals 96 because 10 x 8 is 80 and 2 x 8 is 16, giving 96 together.'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Step 4 of 5 · Dropdowns',
        title: 'Science matching dropdowns',
        instruction: 'Matches multiple definitions to terms simultaneously, just like in LMS exams.',
        question: 'Match each science term with the correct definition.',
        prompts: ['Photosynthesis', 'Evaporation', 'Gravity'],
        options: ['Plants make glucose using light', 'Liquid changes into gas', 'Force attracting objects with mass'],
        correctText: 'Photosynthesis = Plants make glucose using light, Evaporation = Liquid changes into gas, Gravity = Force attracting objects with mass',
        hint: 'Think about light in plants, water turning to steam, and planetary attraction.',
        explanation: 'Photosynthesis uses light to make glucose, evaporation changes liquid into gas, and gravity attracts objects with mass.'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Step 5 of 5 · Quick Overlay',
        title: 'Selected text solver',
        instruction: 'When a page has cluttered layout or extra text, select only the question and solve it with Alt+Q.',
        question: 'Which QuizSolver action is best when a messy page contains extra text around the actual question?',
        options: ['Solve selected text', 'Credit checkout', 'Admin panel', 'Browser history'],
        correctText: 'Solve selected text',
        hint: 'Use the action that works only on the text you highlighted.',
        explanation: 'Solve selected text sends only the highlighted fragment to QuizSolver, bypassing cluttered full-page layouts.'
      }
    ]
  },
  pl: {
    eyebrow: 'Interaktywne demo · Bez zużycia kredytów',
    title: 'Zobacz, jak działa QuizSolver',
    lead: 'Przetestuj 5 typowych zadań: od pytań jednokrotnego wyboru, przez dyskretny tryb podpowiedzi (Hint mode), po pola tekstowe i dopasowania.',
    install: 'Zainstaluj rozszerzenie',
    openStore: 'Otwórz Chrome Web Store',
    demoBadge: '0 kredytów',
    localBadge: 'Tryb bezpieczny',
    mapTitle: 'Jak to działa?',
    mapText: 'Możesz przetestować rozwiązywanie bezpośrednio na tej stronie za pomocą przycisków lub otworzyć zainstalowane rozszerzenie QuizSolver w Chrome.',
    prev: 'Poprzednie',
    next: 'Następne pytanie',
    restart: 'Zacznij od nowa',
    startTour: 'Uruchom tutorial',
    selectText: '✂️ Zaznacz tekst pytania',
    selectedTip: 'Zaznacz sam tekst pytania i kliknij Rozwiąż zaznaczony fragment (w rozszerzeniu skrót Alt+Q).',
    yourAnswer: 'Twoja odpowiedź',
    chooseOption: 'Wybierz opcję',
    popupTitle: 'QuizSolver w akcji',
    popupSteps: [
      'Automatyczne zaznaczanie poprawnej odpowiedzi',
      'Dyskretna podpowiedź zamiast kliknięcia (Hint mode)',
      'Wpisywanie odpowiedzi w pola tekstowe',
      'Dopasowywanie wartości w dropdownach',
      'Błyskawiczny Quick Overlay dla zaznaczonego tekstu'
    ],
    labels: {
      quizMeta: 'Testowy quiz demo',
      scoreLabel: 'Wynik',
      answeredLabel: 'Ukończone',
      accuracyLabel: 'Skuteczność',
      checkAnswer: 'Sprawdź moją odpowiedź',
      showHint: '💡 Pokaż podpowiedź (Hint mode)',
      simulateSolver: '✨ Rozwiąż z QuizSolver',
      resetAnswers: 'Zacznij od nowa',
      correctTitle: 'Świetnie! Poprawna odpowiedź',
      wrongTitle: 'Nie do końca poprawnie',
      emptyTitle: 'Najpierw wybierz lub wpisz odpowiedź',
      hintTitle: 'Podpowiedź QuizSolver (Hint mode)',
      explanationLabel: 'Dlaczego to działa',
      resultTitle: 'Gratulacje! Przetestowałeś wszystkie 5 funkcji',
      resultText: 'Sprawdziłeś jednokrotny wybór, tryb podpowiedzi, pole tekstowe, dopasowania i Quick Overlay. Dokładnie tak samo QuizSolver działa na Twoich testach i egzaminach.',
      finalPrimary: 'Dodaj QuizSolver do Chrome',
      finalSecondary: 'Uruchom demo ponownie',
      sideTitle: 'Co robi QuizSolver',
      sideText: 'QuizSolver błyskawicznie analizuje stronę i wskazuje właściwą odpowiedź.'
    },
    proofItems: ['Bezpieczny quiz demo (0 kredytów)', 'Wyjaśnienia krok po kroku', 'Wsparcie dla wszystkich formatów pytań'],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Krok 1 z 5 · Jednokrotny wybór',
        title: 'Biologia: jednokrotny wybór',
        instruction: 'QuizSolver błyskawicznie analizuje treść pytania i automatycznie zaznacza właściwą opcję.',
        question: 'Które organellum odpowiada głównie za produkcję ATP w komórkach eukariotycznych?',
        options: ['Jądro komórkowe', 'Mitochondrium', 'Rybosom', 'Błona komórkowa'],
        correctText: 'Mitochondrium',
        hint: 'Szukaj organellum nazywanego często elektrownią komórki.',
        explanation: 'Mitochondria przeprowadzają oddychanie komórkowe i wytwarzają większość ATP, czyli podstawowego nośnika energii w komórkach eukariotycznych.'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Krok 2 z 5 · Tryb podpowiedzi',
        title: 'Historia: tryb podpowiedzi (Hint mode)',
        instruction: 'Nie chcesz automatycznego klikania? Włącz Hint mode – rozszerzenie wskaże subtelną wskazówkę, a ostateczny wybór podejmujesz Ty.',
        question: 'Które źródło jest najlepszym przykładem pierwotnego źródła historycznego?',
        options: ['Rozdział w podręczniku', 'Dziennik napisany podczas wydarzenia', 'Współczesny film dokumentalny', 'Hasło w encyklopedii'],
        correctText: 'Dziennik napisany podczas wydarzenia',
        hint: 'Źródło pierwotne powstaje bezpośrednio w czasie wydarzenia (np. relacja świadka).',
        explanation: 'Dziennik napisany podczas wydarzenia jest źródłem pierwotnym, bo zawiera bezpośredni zapis z danego czasu.'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Krok 3 z 5 · Odpowiedź wpisywana',
        title: 'Matematyka: wpisywanie tekstu',
        instruction: 'QuizSolver potrafi wpisywać liczby i tekst bezpośrednio do pól formularzy quizowych.',
        question: 'Ile wynosi 12 x 8?',
        placeholder: 'Wpisz liczbę',
        correctText: '96',
        hint: 'Rozbij działanie na (10 x 8) + (2 x 8).',
        explanation: '12 x 8 = 96, ponieważ 10 x 8 daje 80, a 2 x 8 daje 16. Razem to 96.'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Krok 4 z 5 · Dopasowanie w selectach',
        title: 'Nauka: listy wyboru i dopasowanie',
        instruction: 'Rozszerzenie radzi sobie z wieloma listami wyboru na raz i precyzyjnie przypisuje pary.',
        question: 'Dopasuj pojęcie naukowe do właściwej definicji.',
        prompts: ['Fotosynteza', 'Parowanie', 'Grawitacja'],
        options: ['Rośliny tworzą glukozę ze światła', 'Ciecz zmienia się w gaz', 'Siła przyciągająca obiekty z masą'],
        correctText: 'Fotosynteza = Rośliny tworzą glukozę ze światła, Parowanie = Ciecz zmienia się w gaz, Grawitacja = Siła przyciągająca obiekty z masą',
        hint: 'Pomyśl o świetle u roślin, wodzie pod wpływem ciepła i obiektach z masą.',
        explanation: 'Fotosynteza wykorzystuje światło do tworzenia glukozy, parowanie zmienia ciecz w gaz, a grawitacja przyciąga obiekty z masą.'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Krok 5 z 5 · Zaznaczony fragment',
        title: 'Quick overlay: zaznaczony tekst',
        instruction: 'Gdy strona ma skomplikowany lub nieczytelny układ, zaznacz sam fragment pytania i użyj Quick overlay (skrót Alt+Q).',
        question: 'Która akcja QuizSolver najlepiej sprawdza się, gdy strona ma dużo dodatkowego tekstu wokół właściwego pytania?',
        options: ['Rozwiąż zaznaczony tekst', 'Płatność za kredyty', 'Panel admina', 'Historia przeglądarki'],
        correctText: 'Rozwiąż zaznaczony tekst',
        hint: 'Wybierz akcję, która pracuje tylko na zaznaczonym fragmencie tekstu.',
        explanation: 'Rozwiąż zaznaczony tekst wysyła do QuizSolver tylko podświetlone pytanie, co pomaga, gdy pełny parser strony widzi zbyt dużo pobocznej treści.'
      }
    ]
  }
};

const DEMO_LOCALE_COPY: Record<Exclude<Locale, 'en' | 'pl'>, Omit<DemoCopy, 'questions'>> = {
  de: {
    eyebrow: 'Interaktives Onboarding',
    title: 'Teste QuizSolver in einem sicheren Demo-Quiz',
    lead: 'Fünf vorbereitete Alltagsfragen zeigen, wie die Erweiterung funktioniert. Diese Seite verbraucht keine Credits.',
    install: 'Erweiterung installieren',
    openStore: 'Chrome Web Store öffnen',
    demoBadge: 'Keine Credits',
    localBadge: 'Testmodus',
    mapTitle: 'So nutzt du die Demo',
    mapText: 'Du kannst das Quiz direkt im Browser testen oder die offizielle QuizSolver-Erweiterung in Chrome öffnen.',
    prev: 'Zurück',
    next: 'Nächste Frage',
    restart: 'Demo neu starten',
    startTour: 'Tutorial starten',
    selectText: '✂️ Text markieren',
    selectedTip: 'Markiere den Fragetext und nutze Quick Overlay (Alt+Q).',
    yourAnswer: 'Deine Antwort',
    chooseOption: 'Auswählen',
    popupTitle: 'Popup-Ablauf',
    popupSteps: ['Einzelauswahl', 'Hinweis-Modus', 'Texteingabe', 'Dropdown-Zuordnung', 'Quick Overlay']
  },
  es: {
    eyebrow: 'Onboarding interactivo',
    title: 'Prueba QuizSolver en un demo seguro',
    lead: 'Cinco preguntas cotidianas muestran cómo funciona la extensión. Esta página no consume créditos.',
    install: 'Instalar extensión',
    openStore: 'Abrir Chrome Web Store',
    demoBadge: 'Sin créditos',
    localBadge: 'Modo de prueba',
    mapTitle: 'Cómo usar este demo',
    mapText: 'Puedes probar la resolución directamente en tu navegador o abrir la extensión QuizSolver en Chrome.',
    prev: 'Anterior',
    next: 'Siguiente pregunta',
    restart: 'Reiniciar demo',
    startTour: 'Iniciar tutorial',
    selectText: '✂️ Seleccionar texto',
    selectedTip: 'Selecciona el texto y usa Quick Overlay (Alt+Q).',
    yourAnswer: 'Tu respuesta',
    chooseOption: 'Elegir',
    popupTitle: 'Flujo del popup',
    popupSteps: ['Opción única', 'Modo pista', 'Respuesta escrita', 'Emparejar menús', 'Quick Overlay']
  },
  fr: {
    eyebrow: 'Onboarding interactif',
    title: 'Essayez QuizSolver sur une démo sûre',
    lead: 'Cinq questions du quotidien montrent le fonctionnement de l’extension. Cette page ne consomme pas de crédits.',
    install: 'Installer l’extension',
    openStore: 'Ouvrir Chrome Web Store',
    demoBadge: 'Aucun crédit',
    localBadge: 'Mode test',
    mapTitle: 'Utiliser cette démo',
    mapText: 'Testez directement dans le navigateur avec les boutons ou utilisez l’extension QuizSolver Chrome.',
    prev: 'Précédent',
    next: 'Question suivante',
    restart: 'Recommencer',
    startTour: 'Lancer le tutoriel',
    selectText: '✂️ Sélectionner le texte',
    selectedTip: 'Sélectionnez le texte et utilisez Quick Overlay (Alt+Q).',
    yourAnswer: 'Votre réponse',
    chooseOption: 'Choisir',
    popupTitle: 'Flux du popup',
    popupSteps: ['Choix unique', 'Mode indice', 'Réponse saisie', 'Association déroulante', 'Quick Overlay']
  },
  it: {
    eyebrow: 'Onboarding interattivo',
    title: 'Prova QuizSolver in una demo sicura',
    lead: 'Cinque domande quotidiane mostrano come funziona l’estensione. Questa pagina non consuma crediti.',
    install: 'Installa estensione',
    openStore: 'Apri Chrome Web Store',
    demoBadge: 'Nessun credito',
    localBadge: 'Modalità test',
    mapTitle: 'Come usare la demo',
    mapText: 'Puoi provare le risposte direttamente nel browser o aprire l’estensione QuizSolver in Chrome.',
    prev: 'Precedente',
    next: 'Domanda successiva',
    restart: 'Riavvia demo',
    startTour: 'Avvia tutorial',
    selectText: '✂️ Seleziona testo',
    selectedTip: 'Seleziona il testo della domanda e usa Quick Overlay (Alt+Q).',
    yourAnswer: 'La tua risposta',
    chooseOption: 'Scegli',
    popupTitle: 'Flusso popup',
    popupSteps: ['Scelta singola', 'Hint mode', 'Risposta scritta', 'Menu a tendina', 'Quick Overlay']
  },
  uk: {
    eyebrow: 'Інтерактивний onboarding',
    title: 'Спробуй QuizSolver у безпечному демо',
    lead: 'П’ять повсякденних питань показують роботу розширення. Ця сторінка не витрачає кредити.',
    install: 'Встановити розширення',
    openStore: 'Відкрити Chrome Web Store',
    demoBadge: 'Без кредитів',
    localBadge: 'Тестовий режим',
    mapTitle: 'Як користуватися демо',
    mapText: 'Ви можете спробувати розв’язання прямо у браузері або відкрити розширення QuizSolver для Chrome.',
    prev: 'Назад',
    next: 'Наступне питання',
    restart: 'Почати заново',
    startTour: 'Запустити tutorial',
    selectText: '✂️ Виділити текст',
    selectedTip: 'Виділіть текст питання і скористайтесь Quick Overlay (Alt+Q).',
    yourAnswer: 'Твоя відповідь',
    chooseOption: 'Вибери',
    popupTitle: 'Popup flow',
    popupSteps: ['Один варіант', 'Hint mode', 'Текстова відповідь', 'Matching', 'Quick Overlay']
  }
};

const DEMO_QUESTIONS: Record<Exclude<Locale, 'en' | 'pl'>, DemoQuestion[]> = {
  de: [
    { ...COPY.en.questions[0], kicker: 'Schritt 1 von 5', title: 'Biologie: Einzelauswahl', instruction: 'QuizSolver erkennt die Frage und wählt die richtige Option mit einem Klick.', question: 'Welches Organell produziert hauptsächlich ATP in eukaryotischen Zellen?', options: ['Zellkern', 'Mitochondrium', 'Ribosom', 'Zellmembran'], correctText: 'Mitochondrium' },
    { ...COPY.en.questions[1], kicker: 'Schritt 2 von 5', title: 'Hinweis-Modus', instruction: 'Nutze Hint mode, wenn du eine diskrete Hilfe statt eines automatischen Klicks möchtest.', question: 'Welche Quelle ist das stärkste Beispiel für eine primäre historische Quelle?', options: ['Ein Lehrbuchkapitel', 'Ein während des Ereignisses geschriebenes Tagebuch', 'Eine moderne Dokumentation', 'Ein Lexikonartikel'], correctText: 'Ein während des Ereignisses geschriebenes Tagebuch' },
    { ...COPY.en.questions[2], kicker: 'Schritt 3 von 5', title: 'Mathe: Texteingabe', instruction: 'QuizSolver trägt Zahlen und kurze Texte fehlerfrei in Formularfelder ein.', question: 'Wie viel ist 12 x 8?', placeholder: 'Antwort eingeben', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Schritt 4 von 5', title: 'Naturwissenschaft: Dropdowns', instruction: 'Ordnet mehrere Begriffe gleichzeitig den passenden Definitionen zu.', question: 'Ordne jeden naturwissenschaftlichen Begriff der richtigen Definition zu.', prompts: ['Fotosynthese', 'Verdunstung', 'Gravitation'], options: ['Pflanzen bilden Glukose mit Licht', 'Flüssigkeit wird zu Gas', 'Kraft, die Objekte mit Masse anzieht'], correctText: 'Fotosynthese = Pflanzen bilden Glukose mit Licht, Verdunstung = Flüssigkeit wird zu Gas, Gravitation = Kraft, die Objekte mit Masse anzieht' },
    { ...COPY.en.questions[4], kicker: 'Schritt 5 von 5', title: 'Quick overlay', instruction: 'Markiere nur den Fragetext und löse ihn gezielt per Quick Overlay (Alt+Q).', question: 'Welches QuizSolver-Werkzeug löst nur den markierten Fragetext?', options: ['Markierten Text lösen', 'Credit checkout', 'Admin panel', 'Browserverlauf'], correctText: 'Markierten Text lösen' }
  ],
  es: [
    { ...COPY.en.questions[0], kicker: 'Paso 1 de 5', title: 'Biología: opción única', instruction: 'QuizSolver analiza la pregunta y selecciona la respuesta correcta en un clic.', question: '¿Qué orgánulo produce principalmente ATP en las células eucariotas?', options: ['Núcleo celular', 'Mitocondria', 'Ribosoma', 'Membrana celular'], correctText: 'Mitocondria' },
    { ...COPY.en.questions[1], kicker: 'Paso 2 de 5', title: 'Modo pista', instruction: 'El modo pista no hace clic por ti: marca una pista sutil para que tú decidas.', question: '¿Qué fuente es el mejor ejemplo de evidencia histórica primaria?', options: ['Un capítulo de libro', 'Un diario escrito durante el evento', 'Un documental moderno', 'Un resumen de enciclopedia'], correctText: 'Un diario escrito durante el evento' },
    { ...COPY.en.questions[2], kicker: 'Paso 3 de 5', title: 'Matemáticas: respuesta escrita', instruction: 'QuizSolver completa números y respuestas de texto directamente en los formularios.', question: '¿Cuánto es 12 x 8?', placeholder: 'Escribe el número', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Paso 4 de 5', title: 'Ciencia: menús desplegables', instruction: 'Empareja múltiples opciones simultáneamente en menús desplegables.', question: 'Relaciona cada término científico con la definición correcta.', prompts: ['Fotosíntesis', 'Evaporación', 'Gravedad'], options: ['Las plantas producen glucosa con luz', 'El líquido cambia a gas', 'Fuerza que atrae objetos con masa'], correctText: 'Fotosíntesis = Las plantas producen glucosa con luz, Evaporación = El líquido cambia a gas, Gravedad = Fuerza que atrae objetos con masa' },
    { ...COPY.en.questions[4], kicker: 'Paso 5 de 5', title: 'Quick overlay', instruction: 'Selecciona solo el texto de la pregunta y resuélvelo al instante con Alt+Q.', question: '¿Qué herramienta de QuizSolver resuelve solo el texto seleccionado?', options: ['Resolver texto seleccionado', 'Pago de créditos', 'Panel admin', 'Historial del navegador'], correctText: 'Resolver texto seleccionado' }
  ],
  fr: [
    { ...COPY.en.questions[0], kicker: 'Étape 1 sur 5', title: 'Biologie : choix unique', instruction: 'QuizSolver détecte la question et coche la bonne réponse en un seul clic.', question: 'Quel organite produit principalement l’ATP dans les cellules eucaryotes ?', options: ['Noyau cellulaire', 'Mitochondrie', 'Ribosome', 'Membrane cellulaire'], correctText: 'Mitochondrie' },
    { ...COPY.en.questions[1], kicker: 'Étape 2 sur 5', title: 'Mode indice', instruction: 'Vous préférez décider vous-même ? Le mode indice donne un indice subtil.', question: 'Quelle source est le meilleur exemple de preuve historique primaire ?', options: ['Un chapitre de manuel', 'Un journal écrit pendant l’événement', 'Un documentaire moderne', 'Un article d’encyclopédie'], correctText: 'Un journal écrit pendant l’événement' },
    { ...COPY.en.questions[2], kicker: 'Étape 3 sur 5', title: 'Maths : réponse saisie', instruction: 'QuizSolver remplit précisément les champs numériques et textuels.', question: 'Combien font 12 x 8 ?', placeholder: 'Tapez votre réponse', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Étape 4 sur 5', title: 'Sciences : menus déroulants', instruction: 'Associe plusieurs listes déroulantes en une seule opération.', question: 'Associez chaque terme scientifique à la bonne définition.', prompts: ['Photosynthèse', 'Évaporation', 'Gravité'], options: ['Les plantes produisent du glucose avec la lumière', 'Un liquide devient un gaz', 'Force qui attire les objets ayant une masse'], correctText: 'Photosynthèse = Les plantes produisent du glucose avec la lumière, Évaporation = Un liquide devient un gaz, Gravité = Force qui attire les objets ayant une masse' },
    { ...COPY.en.questions[4], kicker: 'Étape 5 sur 5', title: 'Overlay rapide', instruction: 'Surlignez uniquement le texte et résolvez la sélection via Alt+Q.', question: 'Quel outil QuizSolver résout uniquement le texte sélectionné ?', options: ['Résoudre le texte sélectionné', 'Paiement des crédits', 'Panel admin', 'Historique navigateur'], correctText: 'Résoudre le texte sélectionné' }
  ],
  it: [
    { ...COPY.en.questions[0], kicker: 'Passo 1 di 5', title: 'Biologia: scelta singola', instruction: 'QuizSolver analizza la domanda e seleziona la risposta esatta con un clic.', question: 'Quale organello produce principalmente ATP nelle cellule eucariotiche?', options: ['Nucleo cellulare', 'Mitocondrio', 'Ribosoma', 'Membrana cellulare'], correctText: 'Mitocondrio' },
    { ...COPY.en.questions[1], kicker: 'Passo 2 di 5', title: 'Hint mode', instruction: 'Non vuoi il clic automatico? L’Hint mode offre un indizio discreto.', question: 'Quale fonte è il miglior esempio di prova storica primaria?', options: ['Un capitolo di manuale', 'Un diario scritto durante l’evento', 'Un documentario moderno', 'Una voce di enciclopedia'], correctText: 'Un diario scritto durante l’evento' },
    { ...COPY.en.questions[2], kicker: 'Passo 3 di 5', title: 'Matematica: risposta scritta', instruction: 'QuizSolver compila numeri e testo nei campi dei quiz online.', question: 'Quanto fa 12 x 8?', placeholder: 'Scrivi la risposta', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Passo 4 di 5', title: 'Scienze: menu a tendina', instruction: 'Abbina contemporaneamente più concetti nei menu a tendina.', question: 'Abbina ogni termine scientifico alla definizione corretta.', prompts: ['Fotosintesi', 'Evaporazione', 'Gravità'], options: ['Le piante producono glucosio con la luce', 'Il liquido diventa gas', 'Forza che attrae oggetti con massa'], correctText: 'Fotosintesi = Le piante producono glucosio con la luce, Evaporazione = Il liquido diventa gas, Gravità = Forza che attrae oggetti con massa' },
    { ...COPY.en.questions[4], kicker: 'Passo 5 di 5', title: 'Overlay rapido', instruction: 'Seleziona solo il testo ed esegui la risoluzione rapida con Alt+Q.', question: 'Quale strumento QuizSolver risolve solo il testo selezionato?', options: ['Risolvi testo selezionato', 'Pagamento crediti', 'Pannello admin', 'Cronologia browser'], correctText: 'Risolvi testo selezionato' }
  ],
  uk: [
    { ...COPY.en.questions[0], kicker: 'Крок 1 з 5', title: 'Біологія: один варіант', instruction: 'QuizSolver сканує питання і автоматично обирає правильну відповідь.', question: 'Яка органела переважно виробляє АТФ в еукаріотичних клітинах?', options: ['Клітинне ядро', 'Мітохондрія', 'Рибосома', 'Клітинна мембрана'], correctText: 'Мітохондрія' },
    { ...COPY.en.questions[1], kicker: 'Крок 2 з 5', title: 'Hint mode', instruction: 'Не хочете авто-клік? Режим Hint mode непомітно підказує варіант.', question: 'Яке джерело є найкращим прикладом первинного історичного доказу?', options: ['Розділ підручника', 'Щоденник, написаний під час події', 'Сучасний документальний фільм', 'Енциклопедична стаття'], correctText: 'Щоденник, написаний під час події' },
    { ...COPY.en.questions[2], kicker: 'Крок 3 з 5', title: 'Математика: текстова відповідь', instruction: 'QuizSolver впевнено заповнює числа і текст у поля форми.', question: 'Скільки буде 12 x 8?', placeholder: 'Введіть відповідь', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Крок 4 з 5', title: 'Наука: dropdown і matching', instruction: 'Одночасно зіставляє декілька значень у випадаючих списках.', question: 'Зістав кожен науковий термін із правильною дефініцією.', prompts: ['Фотосинтез', 'Випаровування', 'Гравітація'], options: ['Рослини створюють глюкозу за допомогою світла', 'Рідина перетворюється на газ', 'Сила, що притягує об’єкти з масою'], correctText: 'Фотосинтез = Рослини створюють глюкозу за допомогою світла, Випаровування = Рідина перетворюється на газ, Гравітація = Сила, що притягує об’єкти з масою' },
    { ...COPY.en.questions[4], kicker: 'Крок 5 з 5', title: 'Quick overlay', instruction: 'Виділіть тільки текст питання і розв’яжіть його через Alt+Q.', question: 'Який інструмент QuizSolver розв’язує лише виділений текст?', options: ['Розв’язати виділений текст', 'Оплата кредитів', 'Admin panel', 'Історія браузера'], correctText: 'Розв’язати виділений текст' }
  ]
};

(['de', 'es', 'fr', 'it', 'uk'] as const).forEach((locale) => {
  COPY[locale] = {
    ...DEMO_LOCALE_COPY[locale],
    questions: DEMO_QUESTIONS[locale]
  };
});

@Component({
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <qs-shell [locale]="locale" pageKey="demo">
      <div class="demo-page" data-qs-demo-root="onboarding">
        <div class="demo-container">

          <!-- CLEAN HEADER -->
          <header class="demo-hero">
            <div class="demo-eyebrow-pill">
              <span class="pill-dot"></span>
              <span>{{ copy.eyebrow }}</span>
            </div>
            <h1>{{ copy.title }}</h1>
            <p class="demo-lead">{{ copy.lead }}</p>

            <!-- HELPER BANNER (CLEAN & FRIENDLY, NO ALARMS) -->
            <div class="demo-mode-card glass">
              <div class="mode-left">
                <span class="mode-badge">💡 {{ copy.localBadge }}</span>
                <p>{{ copy.mapText }}</p>
              </div>
              <div class="mode-actions">
                <button class="btn btn-outline btn-sm" type="button" data-qs-tour-start (click)="startGuidedTour()">
                  🎯 {{ copy.startTour }}
                </button>
                <a [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-subtle btn-sm cta-store-btn">
                  📥 {{ copy.install }}
                </a>
              </div>
            </div>
          </header>

          <!-- 5-STEP STEPPER TABS -->
          <nav class="demo-stepper" aria-label="Demo steps">
            <button
              *ngFor="let q of copy.questions; let i = index"
              type="button"
              class="stepper-tab"
              [class.active]="i === current()"
              [class.done]="isQuestionCompleted(q.id)"
              (click)="setStep(i)">
              <span class="stepper-idx">
                <span *ngIf="isQuestionCompleted(q.id)">✓</span>
                <span *ngIf="!isQuestionCompleted(q.id)">{{ i + 1 }}</span>
              </span>
              <span class="stepper-title">{{ getStepShortLabel(i) }}</span>
            </button>
          </nav>

          <!-- ACTIVE QUESTION CARD (FOCUSED & SPACIOUS) -->
          <section class="demo-workspace" *ngIf="currentQuestion() as question">
            <article class="demo-card glass" [attr.data-qs-demo-question]="question.id" data-qs-tour="question-card">

              <!-- TOP CARD BAR -->
              <div class="card-meta-bar">
                <span class="step-tag">{{ question.kicker }}</span>
                <span class="step-counter">{{ current() + 1 }} / {{ copy.questions.length }}</span>
              </div>

              <!-- QUESTION TEXT -->
              <h2 class="question-text" data-qs-demo-question-text [attr.data-qs-demo-selectable]="question.type === 'selected' ? 'true' : null">
                {{ question.question }}
              </h2>

              <!-- FEATURE TIP (SINGLE CLEAN HINT INSTEAD OF 3 PARAGRAPHS) -->
              <div class="feature-tip">
                <span class="feature-icon">✨</span>
                <p>{{ question.instruction }}</p>
              </div>

              <!-- INPUTS: 1. RADIO / HIDDEN / SELECTED -->
              <fieldset class="demo-options" *ngIf="question.type === 'radio' || question.type === 'hidden' || question.type === 'selected'">
                <legend class="sr-only">{{ question.question }}</legend>
                <label
                  class="demo-option"
                  *ngFor="let option of question.options; let i = index"
                  [class.selected]="answerValue(question.id) === option"
                  [class.correct-reveal]="isChecked(question) && option === question.correctText"
                  [class.wrong-reveal]="isChecked(question) && answerValue(question.id) === option && option !== question.correctText"
                  [class.hint-reveal]="isHinted(question) && option === question.correctText">
                  <div class="option-left">
                    <input
                      type="radio"
                      [name]="question.id"
                      [value]="option"
                      [checked]="answerValue(question.id) === option"
                      (change)="setAnswer(question, option)">
                    <span class="option-label">{{ option }}</span>
                  </div>
                  <span class="option-badge" *ngIf="isHinted(question) && option === question.correctText">💡 {{ label('hintTitle') }}</span>
                  <span class="option-badge check" *ngIf="isChecked(question) && option === question.correctText">✓ {{ label('correctTitle') }}</span>
                </label>
              </fieldset>

              <!-- INPUTS: 2. TEXT ANSWER -->
              <div class="text-answer-box" *ngIf="question.type === 'text'">
                <label class="text-label" [for]="question.id + '-input'">{{ copy.yourAnswer }}:</label>
                <input
                  type="text"
                  [id]="question.id + '-input'"
                  [name]="question.id + '-answer'"
                  [placeholder]="question.placeholder || ''"
                  [value]="answerValue(question.id)"
                  (input)="setAnswer(question, $any($event.target).value)">
              </div>

              <!-- INPUTS: 3. MATCHING DROPDOWNS -->
              <div class="matching-grid" *ngIf="question.type === 'matching'">
                <div class="match-item match-row" *ngFor="let prompt of question.prompts; let i = index">
                  <span class="match-prompt">{{ prompt }}</span>
                  <span class="match-arrow">→</span>
                  <select
                    class="form-select match-select"
                    [name]="question.id + '-' + i"
                    [value]="matchValue(question.id, i)"
                    (change)="setMatchAnswer(question, i, $any($event.target).value)">
                    <option value="">{{ copy.chooseOption }}</option>
                    <option *ngFor="let option of question.options" [value]="option">{{ option }}</option>
                  </select>
                </div>
              </div>

              <!-- INPUTS: 4. SELECTED TEXT HELPER -->
              <div class="selected-helper-bar" *ngIf="question.type === 'selected'">
                <button class="btn btn-outline btn-sm" type="button" data-qs-tour="select-text" (click)="selectQuestionText()">
                  {{ copy.selectText }}
                </button>
                <p class="selected-note">{{ copy.selectedTip }}</p>
              </div>

              <!-- FEEDBACK & EXPLANATION -->
              <div
                class="demo-feedback-card"
                *ngIf="feedbackVisible(question)"
                [class.success]="feedbackKind(question) === 'correct'"
                [class.warning]="feedbackKind(question) === 'wrong'"
                [class.info]="feedbackKind(question) === 'hint'"
                [class.empty]="feedbackKind(question) === 'empty'">
                <div class="feedback-head">
                  <span class="feedback-badge">{{ feedbackTitle(question) }}</span>
                </div>
                <p class="feedback-msg">{{ feedbackMessage(question) }}</p>
                <div class="feedback-explanation" *ngIf="showExplanation(question)">
                  <span class="exp-title">{{ label('explanationLabel') }}</span>
                  <p>{{ question.explanation }}</p>
                </div>
              </div>

              <!-- CLEAR ACTION BUTTONS -->
              <div class="card-actions">
                <!-- Hint mode button on step 2 -->
                <button
                  class="btn btn-hint"
                  type="button"
                  *ngIf="question.type === 'hidden'"
                  data-qs-tour="mock-hint"
                  (click)="showHint(question)">
                  {{ label('showHint') }}
                </button>

                <!-- Primary AI Solve button -->
                <button
                  class="btn btn-primary btn-solve"
                  type="button"
                  [attr.data-qs-tour]="question.type === 'selected' ? 'mock-overlay' : 'mock-solve'"
                  (click)="simulateSolver(question)">
                  {{ label('simulateSolver') }}
                </button>

                <!-- Secondary Manual check -->
                <button
                  class="btn btn-outline"
                  type="button"
                  (click)="checkAnswer(question)">
                  {{ label('checkAnswer') }}
                </button>
              </div>

              <!-- BOTTOM NAVIGATION -->
              <div class="card-footer-nav">
                <button
                  class="btn btn-ghost btn-sm"
                  type="button"
                  (click)="previous()"
                  [disabled]="current() === 0">
                  {{ copy.prev }}
                </button>

                <button
                  class="btn btn-primary btn-sm"
                  type="button"
                  data-qs-tour="next"
                  (click)="nextOrRestart()">
                  {{ current() === copy.questions.length - 1 ? (isDemoComplete() ? label('finalSecondary') : copy.restart) : copy.next }}
                </button>
              </div>

            </article>
          </section>

          <!-- COMPLETION SCREEN -->
          <section class="demo-finish glass" *ngIf="isDemoComplete()">
            <div class="finish-icon">🎉</div>
            <h2>{{ label('resultTitle') }}</h2>
            <p class="finish-desc">{{ label('resultText') }}</p>

            <div class="finish-checklist">
              <span *ngFor="let item of checklistItems()">✓ {{ item }}</span>
            </div>

            <div class="finish-actions">
              <a [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
                📥 {{ label('finalPrimary') }}
              </a>
              <button class="btn btn-outline" type="button" (click)="resetAnswers()">
                🔄 {{ label('finalSecondary') }}
              </button>
            </div>
          </section>

        </div>
      </div>
    </qs-shell>
  `,
  styles: [`
    .demo-page {
      padding: 3.5rem 0 5rem;
      width: 100%;
      min-height: 100vh;
      background:
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 92, 252, 0.15), transparent),
        radial-gradient(ellipse 60% 40% at 50% 120%, rgba(14, 165, 233, 0.1), transparent),
        #101318;
    }

    .demo-container {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      padding: 0 1.25rem;
    }

    /* Hero */
    .demo-hero {
      text-align: center;
      margin-bottom: 2rem;
    }

    .demo-eyebrow-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.95rem;
      border-radius: 999px;
      background: rgba(124, 92, 252, 0.1);
      border: 1px solid rgba(124, 92, 252, 0.28);
      color: #c4b5fd;
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .pill-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 8px #22c55e;
    }

    .demo-hero h1 {
      font-size: clamp(2rem, 4.5vw, 2.75rem);
      font-weight: 800;
      margin: 0 0 0.75rem;
      letter-spacing: -0.02em;
    }

    .demo-lead {
      font-size: 1.05rem;
      color: var(--text-secondary);
      max-width: 660px;
      margin: 0 auto 1.5rem;
      line-height: 1.55;
    }

    /* Helper mode card */
    .demo-mode-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      background: rgba(23, 28, 36, 0.75);
      border: 1px solid rgba(14, 165, 233, 0.2);
      text-align: left;
    }

    .mode-left {
      flex: 1;
    }

    .mode-badge {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38bdf8;
      margin-bottom: 0.25rem;
    }

    .mode-left p {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.45;
      margin: 0;
    }

    .mode-actions {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex-shrink: 0;
    }

    .btn-subtle {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-weight: 600;
    }
    .btn-subtle:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    /* Stepper Tabs */
    .demo-stepper {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.75rem;
    }

    .stepper-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.65rem 0.4rem;
      border-radius: 10px;
      background: rgba(29, 36, 48, 0.6);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .stepper-tab:hover {
      border-color: rgba(14, 165, 233, 0.4);
      color: var(--text-primary);
      background: rgba(29, 36, 48, 0.9);
    }

    .stepper-tab.active {
      background: linear-gradient(135deg, rgba(124, 92, 252, 0.2), rgba(14, 165, 233, 0.18));
      border-color: rgba(14, 165, 233, 0.7);
      color: #fff;
      box-shadow: 0 4px 16px rgba(14, 165, 233, 0.15);
    }

    .stepper-tab.done {
      border-color: rgba(34, 197, 94, 0.4);
    }

    .stepper-idx {
      display: grid;
      place-items: center;
      width: 1.35rem;
      height: 1.35rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      font-size: 0.75rem;
      font-weight: 800;
    }

    .stepper-tab.active .stepper-idx {
      background: var(--grad-primary);
      color: #fff;
    }

    .stepper-tab.done .stepper-idx {
      background: rgba(34, 197, 94, 0.2);
      color: #34d399;
    }

    /* Card */
    .demo-card {
      padding: 2rem;
      border-radius: 16px;
      background: #171c24;
      border: 1px solid var(--border);
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
    }

    .card-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .step-tag {
      font-size: 0.82rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #38bdf8;
    }

    .step-counter {
      font-size: 0.85rem;
      font-weight: 800;
      padding: 0.25rem 0.65rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.4);
      color: #bae6fd;
    }

    .question-text {
      font-size: clamp(1.35rem, 2.5vw, 1.75rem);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 1rem;
      line-height: 1.35;
    }

    .feature-tip {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: rgba(124, 92, 252, 0.08);
      border: 1px solid rgba(124, 92, 252, 0.2);
      margin-bottom: 1.5rem;
    }

    .feature-icon {
      font-size: 1.1rem;
      line-height: 1.3;
    }

    .feature-tip p {
      font-size: 0.92rem;
      color: #dbeafe;
      line-height: 1.45;
      margin: 0;
    }

    /* Radio Options */
    .demo-options {
      display: grid;
      gap: 0.75rem;
      border: 0;
      margin-bottom: 1.5rem;
      padding: 0;
    }

    .demo-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.95rem 1.15rem;
      border-radius: 12px;
      border: 1px solid #2b3545;
      background: #1d2430;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .demo-option:hover {
      border-color: rgba(14, 165, 233, 0.4);
      background: rgba(29, 36, 48, 0.9);
    }

    .demo-option.selected {
      border-color: rgba(14, 165, 233, 0.7);
      background: rgba(14, 165, 233, 0.12);
    }

    .demo-option.correct-reveal {
      border-color: rgba(34, 197, 94, 0.8);
      background: rgba(34, 197, 94, 0.12);
    }

    .demo-option.wrong-reveal {
      border-color: rgba(248, 113, 113, 0.7);
      background: rgba(248, 113, 113, 0.1);
    }

    .demo-option.hint-reveal {
      border-color: rgba(245, 158, 11, 0.7);
      background: rgba(245, 158, 11, 0.1);
    }

    .option-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .demo-option input {
      width: 1.15rem;
      height: 1.15rem;
      accent-color: #0ea5e9;
      cursor: pointer;
    }

    .option-label {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .option-badge {
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      background: rgba(245, 158, 11, 0.2);
      color: #fde68a;
      border: 1px solid rgba(245, 158, 11, 0.35);
      white-space: nowrap;
    }

    .option-badge.check {
      background: rgba(34, 197, 94, 0.2);
      color: #bbf7d0;
      border-color: rgba(34, 197, 94, 0.4);
    }

    /* Text Input */
    .text-answer-box {
      display: grid;
      gap: 0.55rem;
      margin-bottom: 1.5rem;
    }

    .text-label {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .text-answer-box input {
      width: 100%;
      min-height: 3.25rem;
      padding: 0 1rem;
      border-radius: 10px;
      border: 1px solid #2b3545;
      background: #101318;
      color: var(--text-primary);
      font-size: 1.05rem;
      outline: none;
      transition: all 0.2s ease;
    }

    .text-answer-box input:focus {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
    }

    /* Matching */
    .matching-grid {
      display: grid;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .match-item {
      display: grid;
      grid-template-columns: 140px 24px 1fr;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: #1d2430;
      border: 1px solid #2b3545;
      border-radius: 10px;
    }

    .match-prompt {
      font-weight: 750;
      color: var(--text-primary);
    }

    .match-arrow {
      color: var(--text-tertiary);
      text-align: center;
    }

    .match-select {
      min-height: 2.75rem;
      background-color: #101318;
    }

    /* Selected text helper */
    .selected-helper-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.15rem;
      border-radius: 10px;
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.22);
      margin-bottom: 1.5rem;
    }

    .selected-note {
      font-size: 0.9rem;
      color: #fde68a;
      line-height: 1.45;
      margin: 0;
    }

    /* Feedback Card */
    .demo-feedback-card {
      display: grid;
      gap: 0.5rem;
      padding: 1.15rem 1.25rem;
      border-radius: 12px;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.2);
      margin-bottom: 1.5rem;
      animation: fadeIn 0.25s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .feedback-head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .feedback-badge {
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .feedback-msg {
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
      color: var(--text-primary);
    }

    .demo-feedback-card.success {
      background: rgba(34, 197, 94, 0.08);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .demo-feedback-card.success .feedback-badge { color: #4ade80; }

    .demo-feedback-card.info {
      background: rgba(14, 165, 233, 0.08);
      border-color: rgba(14, 165, 233, 0.35);
    }
    .demo-feedback-card.info .feedback-badge { color: #38bdf8; }

    .demo-feedback-card.warning {
      background: rgba(248, 113, 113, 0.08);
      border-color: rgba(248, 113, 113, 0.35);
    }
    .demo-feedback-card.warning .feedback-badge { color: #f87171; }

    .demo-feedback-card.empty {
      background: rgba(245, 158, 11, 0.08);
      border-color: rgba(245, 158, 11, 0.35);
    }
    .demo-feedback-card.empty .feedback-badge { color: #fbbf24; }

    .feedback-explanation {
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .exp-title {
      display: block;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38bdf8;
      margin-bottom: 0.25rem;
    }

    .feedback-explanation p {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    /* Action buttons */
    .card-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(43, 53, 69, 0.7);
    }

    .btn-solve {
      background: var(--grad-primary);
      color: #fff;
      font-weight: 750;
      box-shadow: 0 4px 18px rgba(124, 92, 252, 0.25);
    }
    .btn-solve:hover {
      background: var(--grad-primary-hover);
      box-shadow: 0 6px 24px rgba(14, 165, 233, 0.35);
    }

    .btn-hint {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      font-weight: 750;
      box-shadow: 0 4px 18px rgba(245, 158, 11, 0.25);
    }
    .btn-hint:hover {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
    }

    /* Card footer nav */
    .card-footer-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px dashed rgba(43, 53, 69, 0.6);
    }

    /* Finish Card */
    .demo-finish {
      margin-top: 2rem;
      padding: 2.25rem;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(14, 165, 233, 0.06)), #171c24;
      border: 1px solid rgba(34, 197, 94, 0.3);
      text-align: center;
    }

    .finish-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .demo-finish h2 {
      font-size: 1.65rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .finish-desc {
      max-width: 600px;
      margin: 0 auto 1.5rem;
      font-size: 0.98rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .finish-checklist {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.65rem;
      margin-bottom: 1.75rem;
    }

    .finish-checklist span {
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #bbf7d0;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .finish-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.85rem;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }

    /* Responsive */
    @media (max-width: 680px) {
      .demo-page { padding: 2rem 0 3.5rem; }
      .demo-card { padding: 1.25rem; }
      .demo-mode-card { flex-direction: column; align-items: stretch; }
      .mode-actions { flex-direction: column; }
      .mode-actions .btn { width: 100%; }
      .demo-stepper {
        overflow-x: auto;
        display: flex;
        padding-bottom: 0.5rem;
      }
      .stepper-tab {
        flex: 0 0 auto;
        padding: 0.5rem 0.75rem;
      }
      .match-item {
        grid-template-columns: 1fr;
        gap: 0.4rem;
      }
      .match-arrow { display: none; }
      .card-actions {
        flex-direction: column;
        align-items: stretch;
      }
      .card-actions .btn {
        width: 100%;
      }
      .finish-actions {
        flex-direction: column;
      }
      .finish-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class DemoComponent implements OnInit, OnDestroy {
  protected locale: Locale = 'en';
  protected readonly storeUrl = CHROME_WEB_STORE_URL;

  protected copy = COPY.en;
  protected readonly current = signal(0);
  protected readonly answers = signal<Record<string, DemoAnswerState>>({});
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly handleTourStep = (event: Event) => {
    const step = Number((event as CustomEvent<{ step?: number }>).detail?.step ?? 0);
    const nextStep = Math.min(Math.max(0, step), this.copy.questions.length - 1);
    this.current.set(nextStep);
    this.scrollToWorkspace();
  };

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) || 'en';
    this.copy = COPY[this.locale] || COPY.en;
    this.seo.applyPage('demo', this.locale);
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('qs-demo-set-step', this.handleTourStep);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('qs-demo-set-step', this.handleTourStep);
    }
  }

  protected currentQuestion(): DemoQuestion {
    return this.copy.questions[this.current()];
  }

  protected label(key: keyof DemoLabels): string {
    const localizedDefaults: Record<Locale, Partial<DemoLabels>> = {
      en: DEFAULT_DEMO_LABELS,
      pl: COPY.pl.labels || {},
      de: {
        correctTitle: 'Richtig',
        hintTitle: 'Hinweis',
        wrongTitle: 'Noch nicht',
        emptyTitle: 'Wähle zuerst eine Antwort',
        explanationLabel: 'Warum das funktioniert',
        simulateSolver: '✨ Mit QuizSolver lösen',
        showHint: '💡 Hinweis anzeigen',
        checkAnswer: 'Meine Antwort prüfen',
        resultTitle: 'Demo abgeschlossen!',
        resultText: 'Du hast Einzelauswahl, Hinweis-Modus, Texteingabe, Dropdowns und Textauswahl getestet.',
        finalPrimary: 'Erweiterung installieren',
        finalSecondary: 'Demo neu starten'
      },
      es: {
        correctTitle: 'Correcta',
        hintTitle: 'Pista',
        wrongTitle: 'Aún no',
        emptyTitle: 'Elige una respuesta primero',
        explanationLabel: 'Por qué funciona',
        simulateSolver: '✨ Resolver con QuizSolver',
        showHint: '💡 Mostrar pista',
        checkAnswer: 'Comprobar mi respuesta',
        resultTitle: '¡Demo completada!',
        resultText: 'Has probado opción única, modo pista, respuesta escrita, desplegables y texto seleccionado.',
        finalPrimary: 'Instalar extensión',
        finalSecondary: 'Reiniciar demo'
      },
      fr: {
        correctTitle: 'Correct',
        hintTitle: 'Indice',
        wrongTitle: 'Pas tout à fait',
        emptyTitle: 'Choisissez d’abord une réponse',
        explanationLabel: 'Pourquoi ça fonctionne',
        simulateSolver: '✨ Résoudre avec QuizSolver',
        showHint: '💡 Afficher l’indice',
        checkAnswer: 'Vérifier ma réponse',
        resultTitle: 'Démo terminée !',
        resultText: 'Vous avez testé le choix unique, le mode indice, la saisie, les menus déroulants et le texte sélectionné.',
        finalPrimary: 'Installer l’extension',
        finalSecondary: 'Recommencer'
      },
      it: {
        correctTitle: 'Corretto',
        hintTitle: 'Indizio',
        wrongTitle: 'Non ancora',
        emptyTitle: 'Scegli prima una risposta',
        explanationLabel: 'Perché funziona',
        simulateSolver: '✨ Risolvi con QuizSolver',
        showHint: '💡 Mostra suggerimento',
        checkAnswer: 'Verifica la mia risposta',
        resultTitle: 'Demo completata!',
        resultText: 'Hai testato scelta singola, hint mode, risposta scritta, menu a tendina e testo selezionato.',
        finalPrimary: 'Installa estensione',
        finalSecondary: 'Riavvia demo'
      },
      uk: {
        correctTitle: 'Правильно',
        hintTitle: 'Підказка',
        wrongTitle: 'Ще ні',
        emptyTitle: 'Спочатку виберіть відповідь',
        explanationLabel: 'Чому це працює',
        simulateSolver: '✨ Розв’язати з QuizSolver',
        showHint: '💡 Показати підказку',
        checkAnswer: 'Перевірити відповідь',
        resultTitle: 'Демо завершено!',
        resultText: 'Ви протестували один варіант, режим Hint mode, текстову відповідь, списки та виділений текст.',
        finalPrimary: 'Встановити розширення',
        finalSecondary: 'Почати заново'
      }
    };

    return this.copy.labels?.[key] || localizedDefaults[this.locale]?.[key] || DEFAULT_DEMO_LABELS[key];
  }

  protected proofItems(): string[] {
    return this.copy.proofItems?.length ? this.copy.proofItems : (COPY.en.proofItems || []);
  }

  protected answerValue(questionId: string): string {
    return this.answers()[questionId]?.value || '';
  }

  protected matchValue(questionId: string, index: number): string {
    return this.answers()[questionId]?.matches?.[index] || '';
  }

  protected setStep(index: number): void {
    const scrollSnapshot = this.captureScroll();
    this.current.set(index);
    this.restoreScroll(scrollSnapshot);
  }

  protected getStepShortLabel(index: number): string {
    const labels: Record<Locale, string[]> = {
      pl: ['1. Wybór ABCD', '2. Tryb Hint', '3. Wpisywanie', '4. Dopasowanie', '5. Zaznaczenie'],
      en: ['1. Choice', '2. Hint mode', '3. Input', '4. Matching', '5. Selected'],
      de: ['1. Auswahl', '2. Hinweis', '3. Eingabe', '4. Zuordnung', '5. Markiert'],
      es: ['1. Opción', '2. Pista', '3. Escrita', '4. Emparejar', '5. Selección'],
      fr: ['1. Choix', '2. Indice', '3. Saisie', '4. Association', '5. Sélection'],
      it: ['1. Scelta', '2. Hint', '3. Scritta', '4. Tendina', '5. Selezione'],
      uk: ['1. Варіант', '2. Hint', '3. Введення', '4. Matching', '5. Виділення']
    };
    const list = labels[this.locale] || labels.en;
    return list[index] || `Krok ${index + 1}`;
  }

  protected checklistItems(): string[] {
    const map: Record<Locale, string[]> = {
      pl: ['Automatyczny wybór ABCD', 'Dyskretny tryb Hint mode', 'Wpisywanie odpowiedzi w pola', 'Dopasowywanie selectów', 'Quick overlay (Alt+Q)'],
      en: ['Single choice solving', 'Discreet Hint mode', 'Typed input support', 'Dropdown matching', 'Quick overlay (Alt+Q)'],
      de: ['Einzelauswahl', 'Diskreter Hinweis-Modus', 'Texteingabe', 'Dropdown-Zuordnung', 'Quick Overlay (Alt+Q)'],
      es: ['Opción única', 'Modo pista discreto', 'Respuesta escrita', 'Emparejar menús', 'Quick overlay (Alt+Q)'],
      fr: ['Choix unique', 'Mode indice discret', 'Réponse saisie', 'Association déroulante', 'Quick overlay (Alt+Q)'],
      it: ['Scelta singola', 'Hint mode discreto', 'Risposta scritta', 'Associazione a tendina', 'Quick overlay (Alt+Q)'],
      uk: ['Один варіант', 'Непомітний Hint mode', 'Текстова відповідь', 'Matching у списках', 'Quick overlay (Alt+Q)']
    };
    return map[this.locale] || map.en;
  }

  protected isQuestionCompleted(questionId: string): boolean {
    const state = this.answers()[questionId];
    return !!state?.correct || !!state?.solved;
  }

  protected setAnswer(question: DemoQuestion, value: string): void {
    this.updateAnswer(question.id, {
      value,
      checked: false,
      correct: false,
      empty: false,
      solved: false
    });
  }

  protected setMatchAnswer(question: DemoQuestion, index: number, value: string): void {
    const current = [...(this.answers()[question.id]?.matches || [])];
    current[index] = value;
    this.updateAnswer(question.id, {
      matches: current,
      checked: false,
      correct: false,
      empty: false,
      solved: false
    });
  }

  protected showHint(question: DemoQuestion): void {
    this.updateAnswer(question.id, {
      hinted: true,
      checked: false,
      empty: false
    });
  }

  protected checkAnswer(question: DemoQuestion): void {
    const empty = !this.hasAnswer(question);
    this.updateAnswer(question.id, {
      checked: true,
      correct: !empty && this.isAnswerCorrect(question),
      empty,
      hinted: false,
      solved: false
    });
  }

  protected simulateSolver(question: DemoQuestion): void {
    if (question.type === 'matching') {
      this.updateAnswer(question.id, {
        matches: this.expectedMatches(question),
        checked: true,
        correct: true,
        empty: false,
        hinted: false,
        solved: true
      });
      return;
    }

    this.updateAnswer(question.id, {
      value: question.correctText,
      checked: true,
      correct: true,
      empty: false,
      hinted: false,
      solved: true
    });
  }

  protected isChecked(question: DemoQuestion): boolean {
    const state = this.answers()[question.id];
    return !!state?.checked && !state.empty;
  }

  protected isHinted(question: DemoQuestion): boolean {
    return !!this.answers()[question.id]?.hinted;
  }

  protected isCorrect(question: DemoQuestion): boolean {
    return !!this.answers()[question.id]?.correct;
  }

  protected feedbackVisible(question: DemoQuestion): boolean {
    const state = this.answers()[question.id];
    return !!state && (!!state.hinted || !!state.checked || !!state.empty);
  }

  protected feedbackKind(question: DemoQuestion): 'correct' | 'wrong' | 'hint' | 'empty' {
    const state = this.answers()[question.id];
    if (state?.hinted && !state.checked) return 'hint';
    if (state?.empty) return 'empty';
    if (state?.correct) return 'correct';
    return 'wrong';
  }

  protected feedbackTitle(question: DemoQuestion): string {
    const kind = this.feedbackKind(question);
    if (kind === 'correct') return this.label('correctTitle');
    if (kind === 'hint') return this.label('hintTitle');
    if (kind === 'empty') return this.label('emptyTitle');
    return this.label('wrongTitle');
  }

  protected feedbackMessage(question: DemoQuestion): string {
    const state = this.answers()[question.id];
    const kind = this.feedbackKind(question);
    if (kind === 'correct') {
      return state?.solved ? `${this.label('simulateSolver')}: ${question.correctText}` : question.correctText;
    }
    if (kind === 'empty') return question.instruction;
    return question.hint || question.instruction;
  }

  protected showExplanation(question: DemoQuestion): boolean {
    const state = this.answers()[question.id];
    return !!question.explanation && !!state?.checked && !state.empty;
  }

  protected score(): number {
    return this.copy.questions.filter(question => this.answers()[question.id]?.correct).length;
  }

  protected answeredCount(): number {
    return this.copy.questions.filter(question => {
      const state = this.answers()[question.id];
      return !!state?.checked && !state.empty;
    }).length;
  }

  protected isDemoComplete(): boolean {
    return this.answeredCount() >= this.copy.questions.length;
  }

  protected resetAnswers(): void {
    this.answers.set({});
    this.current.set(0);
    this.scrollToWorkspace();
  }

  protected next(): void {
    const scrollSnapshot = this.captureScroll();
    this.current.update((value) => value >= this.copy.questions.length - 1 ? 0 : value + 1);
    this.restoreScroll(scrollSnapshot);
  }

  protected nextOrRestart(): void {
    if (this.current() >= this.copy.questions.length - 1) {
      if (this.isDemoComplete()) {
        this.scrollToWorkspace();
      } else {
        this.resetAnswers();
      }
      return;
    }
    this.next();
  }

  protected previous(): void {
    const scrollSnapshot = this.captureScroll();
    this.current.update((value) => Math.max(0, value - 1));
    this.restoreScroll(scrollSnapshot);
  }

  protected selectQuestionText(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const selector = `[data-qs-demo-question="${this.currentQuestion().id}"] [data-qs-demo-selectable="true"]`;
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  protected startGuidedTour(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.dispatchEvent(new CustomEvent('qs-demo-start-tour'));
  }

  private updateAnswer(questionId: string, patch: DemoAnswerState): void {
    this.answers.update((answers) => ({
      ...answers,
      [questionId]: {
        ...(answers[questionId] || {}),
        ...patch
      }
    }));
  }

  private hasAnswer(question: DemoQuestion): boolean {
    const state = this.answers()[question.id];
    if (question.type === 'matching') {
      const expectedCount = question.prompts?.length || 0;
      return expectedCount > 0
        && this.expectedMatches(question).length === expectedCount
        && Array.from({ length: expectedCount }).every((_, index) => !!state?.matches?.[index]);
    }
    return !!this.normalizeAnswer(state?.value);
  }

  private isAnswerCorrect(question: DemoQuestion): boolean {
    const state = this.answers()[question.id];
    if (question.type === 'matching') {
      const expected = this.expectedMatches(question);
      return expected.length > 0 && expected.every((answer, index) =>
        this.normalizeAnswer(state?.matches?.[index]) === this.normalizeAnswer(answer)
      );
    }
    return this.normalizeAnswer(state?.value) === this.normalizeAnswer(question.correctText);
  }

  private expectedMatches(question: DemoQuestion): string[] {
    if (question.type !== 'matching') return [];
    return String(question.correctText || '')
      .split(',')
      .map((part) => part.split('=').pop()?.trim() || '')
      .filter(Boolean);
  }

  private normalizeAnswer(value: string | undefined): string {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (/^-?\d+(?:[.,]\d+)?$/.test(normalized)) {
      return normalized.replace(',', '.').replace(/\.0+$/, '');
    }
    return normalized;
  }

  private scrollToWorkspace(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      document.querySelector('.demo-workspace')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  private captureScroll(): { x: number; y: number } | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return { x: window.scrollX, y: window.scrollY };
  }

  private restoreScroll(snapshot: { x: number; y: number } | null): void {
    if (!snapshot || !isPlatformBrowser(this.platformId)) return;
    const restore = () => window.scrollTo(snapshot.x, snapshot.y);
    requestAnimationFrame(() => {
      restore();
      setTimeout(restore, 0);
    });
  }
}
