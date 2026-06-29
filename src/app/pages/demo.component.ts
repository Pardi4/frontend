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
  checkAnswer: 'Check answer',
  showHint: 'Show hint',
  simulateSolver: 'Simulate QuizSolver',
  resetAnswers: 'Reset answers',
  correctTitle: 'Correct',
  wrongTitle: 'Not quite',
  emptyTitle: 'Choose an answer first',
  hintTitle: 'Hint',
  explanationLabel: 'Why this answer works',
  resultTitle: 'Demo complete',
  resultText: 'You have tested radio, hint mode, text input, dropdown matching and selected-text solving. The real extension uses the same workflow on supported quiz pages.',
  finalPrimary: 'Install the extension',
  finalSecondary: 'Restart quiz',
  sideTitle: 'What QuizSolver would do',
  sideText: 'Open the extension on this page, solve the current question, or use the quick overlay for selected text. This demo mirrors the real extension flow without spending credits.'
};

const COPY: Partial<Record<Locale, DemoCopy>> & { en: DemoCopy; pl: DemoCopy } = {
  en: {
    eyebrow: 'Interactive onboarding',
    title: 'Try QuizSolver on a safe demo quiz',
    lead: 'Try the full QuizSolver workflow without spending credits. Pick a predefined everyday question, open the extension, and see how QuizSolver suggests an answer, gives a hint, fills text fields, handles dropdowns and solves selected text.',
    install: 'Install extension',
    openStore: 'Open Chrome Web Store',
    demoBadge: 'No credits used',
    localBadge: 'Guided practice',
    mapTitle: 'How to use this demo',
    mapText: 'Click Start extension tutorial first. The extension will point at this demo quiz step by step; then open the QuizSolver popup, follow the highlighted action, and move to the next question.',
    prev: 'Previous',
    next: 'Next question',
    restart: 'Restart quiz',
    startTour: 'Start extension tutorial',
    selectText: 'Select demo question text',
    selectedTip: 'Select the question text, open the quick overlay, then click Solve selected text.',
    yourAnswer: 'Your answer',
    chooseOption: 'Choose',
    popupTitle: 'Popup flow',
    popupSteps: [
      'Click the QS extension icon in Chrome while this demo page is open.',
      'Click Solve current page and check that the correct answer is selected.',
      'Turn on Hint mode before solving to see a subtle clue instead of an automatic click.',
      'Use the text and dropdown examples to see how non-radio questions are handled.',
      'Open Quick overlay with the popup button or Alt+Q, select question text, then solve only that selection.'
    ],
    labels: {
      quizMeta: 'Safe interactive quiz',
      resultText: 'You have completed a realistic mini quiz with choices, hint mode, typed answers, matching fields and selected text.',
      sideTitle: 'Extension preview',
      sideText: 'Use this page like a real quiz. Answer manually, ask for a hint, or simulate how QuizSolver would fill the current question.'
    },
    proofItems: ['Works without credits on this demo', 'Shows why an answer is correct', 'Built to match real quiz layouts'],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Step 1',
        title: 'Biology multiple choice',
        instruction: 'Answer manually or simulate how QuizSolver selects the best option on a standard quiz card.',
        question: 'Which organelle is mainly responsible for producing ATP in eukaryotic cells?',
        options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Cell membrane'],
        correctText: 'Mitochondrion',
        hint: 'Look for the organelle often called the cell powerhouse.',
        explanation: 'Mitochondria perform cellular respiration and produce most of the ATP used as energy by eukaryotic cells.'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Step 2',
        title: 'Hint mode on a history question',
        instruction: 'Use Hint mode when you want guidance without automatically clicking the answer.',
        question: 'Which source is the strongest example of primary historical evidence?',
        options: ['A textbook chapter', 'A diary written during the event', 'A modern documentary', 'An encyclopedia summary'],
        correctText: 'A diary written during the event',
        hint: 'Primary evidence is created close to the event by someone who directly experienced it.',
        explanation: 'A diary written during the event is a primary source because it records first-hand information from that time.'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Step 3',
        title: 'Typed math answer',
        instruction: 'Type the answer yourself or let the demo fill the text field like the extension would.',
        question: 'What is the value of 12 x 8?',
        placeholder: 'Type the number',
        correctText: '96',
        hint: 'Break it into 10 x 8 plus 2 x 8.',
        explanation: '12 x 8 equals 96 because 10 x 8 is 80 and 2 x 8 is 16, giving 96 together.'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Step 4',
        title: 'Science matching dropdowns',
        instruction: 'Match each concept to its definition. This mirrors dropdown and matching questions found in LMS quizzes.',
        question: 'Match each science term with the correct definition.',
        prompts: ['Photosynthesis', 'Evaporation', 'Gravity'],
        options: ['Plants make glucose using light', 'Liquid changes into gas', 'Force attracting objects with mass'],
        correctText: 'Photosynthesis = Plants make glucose using light, Evaporation = Liquid changes into gas, Gravity = Force attracting objects with mass',
        hint: 'Think about what happens to light in plants, water in heat, and objects with mass.',
        explanation: 'Photosynthesis uses light to make glucose, evaporation changes liquid into gas, and gravity attracts objects with mass.'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Step 5',
        title: 'Quick overlay for selected text',
        instruction: 'Select only the question text, press Alt+Q, and solve the selected fragment instead of the whole page.',
        question: 'Which QuizSolver action is best when a messy page contains extra text around the actual question?',
        options: ['Solve selected text', 'Credit checkout', 'Admin panel', 'Browser history'],
        correctText: 'Solve selected text',
        hint: 'Use the action that works only on the text you highlighted.',
        explanation: 'Solve selected text sends only the highlighted question to QuizSolver, which helps when the full-page parser sees too much unrelated content.'
      }
    ]
  },
  pl: {
    eyebrow: 'Interaktywny onboarding',
    title: 'Przetestuj QuizSolver na bezpiecznym demo',
    lead: 'Przetestuj pełny workflow QuizSolver bez zużywania kredytów. Wybierz gotowe pytanie z codziennego życia, otwórz rozszerzenie i zobacz, jak QuizSolver sugeruje odpowiedź, pokazuje podpowiedź, wypełnia pola tekstowe, obsługuje selecty i rozwiązuje zaznaczony tekst.',
    install: 'Zainstaluj rozszerzenie',
    openStore: 'Otwórz Chrome Web Store',
    demoBadge: 'Bez zużycia kredytów',
    localBadge: 'Tryb treningowy',
    mapTitle: 'Jak korzystać z demo',
    mapText: 'Najpierw kliknij Uruchom tutorial w rozszerzeniu. Rozszerzenie pokaże po kolei, gdzie patrzeć i co kliknąć; potem otwórz popup QuizSolver, wykonaj podświetloną akcję i przejdź do następnego pytania.',
    prev: 'Poprzednie',
    next: 'Następne pytanie',
    restart: 'Uruchom ponownie',
    startTour: 'Uruchom tutorial w rozszerzeniu',
    selectText: 'Zaznacz tekst pytania',
    selectedTip: 'Zaznacz sam tekst pytania, otwórz szybki overlay i kliknij Rozwiąż zaznaczony tekst.',
    yourAnswer: 'Twoja odpowiedź',
    chooseOption: 'Wybierz',
    popupTitle: 'Co klikać w popupie',
    popupSteps: [
      'Kliknij ikonę QS w Chrome, gdy ta strona demo jest otwarta.',
      'Kliknij Rozwiąż bieżącą stronę i sprawdź, czy poprawna odpowiedź została zaznaczona.',
      'Włącz Hint mode przed rozwiązaniem, żeby zobaczyć dyskretną podpowiedź zamiast automatycznego kliknięcia.',
      'Przejdź przez przykład z polem tekstowym i selectami, żeby zobaczyć obsługę innych typów pytań.',
      'Otwórz szybki overlay przyciskiem w popupie albo skrótem Alt+Q, zaznacz tekst pytania i rozwiąż tylko zaznaczenie.'
    ],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Krok 1',
        title: 'Zwykłe rozwiązywanie',
        instruction: 'Kliknij Solve current page w popupie rozszerzenia. QuizSolver powinien zaznaczyć poprawną opcję.',
        question: 'Co warto zabrać, gdy na zewnątrz pada deszcz?',
        options: ['Okulary przeciwsłoneczne', 'Parasol', 'Ręcznik plażowy', 'Łyżwy'],
        correctText: 'Parasol'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Krok 2',
        title: 'Tryb ukryty',
        instruction: 'Włącz Hint mode w popupie przed rozwiązaniem. Odpowiedź zostanie podpowiedziana zamiast kliknięta.',
        question: 'Co najczęściej trzymamy w lodówce, żeby było chłodne?',
        options: ['Koc', 'Mleko', 'Zeszyt', 'Klucze'],
        correctText: 'Mleko'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Krok 3',
        title: 'Odpowiedź wpisywana',
        instruction: 'Rozwiąż stronę, a rozszerzenie wypełni pole tekstowe lokalną odpowiedzią demo.',
        question: 'Ile dni ma zwykły tydzień?',
        placeholder: 'Wpisz odpowiedź tutaj',
        correctText: '7'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Krok 4',
        title: 'Selecty i dopasowanie',
        instruction: 'Ten krok pokazuje dopasowywanie wielu selectów. QuizSolver wypełnia każdy select pasującym pojęciem.',
        question: 'Dopasuj codzienną czynność do miejsca, w którym zwykle się odbywa.',
        prompts: ['Gotowanie', 'Spanie', 'Zakupy'],
        options: ['Kuchnia', 'Sypialnia', 'Sklep'],
        correctText: 'Gotowanie = Kuchnia, Spanie = Sypialnia, Zakupy = Sklep'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Krok 5',
        title: 'Szybki overlay i zaznaczony tekst',
        instruction: 'Zaznacz tekst pytania, naciśnij Alt+Q albo otwórz Quick overlay, a potem rozwiąż zaznaczony tekst.',
        question: 'Które narzędzie QuizSolver otwiera małe okno z szybkimi akcjami?',
        options: ['Szybki overlay', 'Płatność za kredyty', 'Panel admina', 'Historia przeglądarki'],
        correctText: 'Szybki overlay'
      }
    ]
  }
};

COPY.pl = {
  eyebrow: 'Interaktywne demo',
  title: 'Sprawdź QuizSolver na quizie, który działa jak prawdziwy',
  lead: 'Odpowiedz samodzielnie, poproś o podpowiedź albo zasymuluj działanie rozszerzenia. Demo pokazuje wybór odpowiedzi, tryb podpowiedzi, pole tekstowe, dopasowania i rozwiązywanie zaznaczonego tekstu bez zużywania kredytów.',
  install: 'Zainstaluj rozszerzenie',
  openStore: 'Otwórz Chrome Web Store',
  demoBadge: 'Bez zużycia kredytów',
  localBadge: 'Prawdziwy przepływ quizu',
  mapTitle: 'Jak przejść demo',
  mapText: 'Przejdź pytania jak zwykły quiz. Możesz sprawdzić własną odpowiedź, zobaczyć hint albo kliknąć symulację QuizSolver, żeby zobaczyć jak rozszerzenie pomaga na realnych stronach.',
  prev: 'Poprzednie',
  next: 'Następne pytanie',
  restart: 'Zacznij od nowa',
  startTour: 'Uruchom tutorial rozszerzenia',
  selectText: 'Zaznacz tekst pytania',
  selectedTip: 'Zaznacz sam tekst pytania, otwórz szybki overlay i kliknij rozwiązywanie zaznaczonego tekstu.',
  yourAnswer: 'Twoja odpowiedź',
  chooseOption: 'Wybierz',
  popupTitle: 'Podgląd pracy rozszerzenia',
  popupSteps: [
    'Odpowiedz ręcznie albo użyj przycisku Symuluj QuizSolver.',
    'Włącz podpowiedź, żeby zobaczyć delikatną wskazówkę zamiast gotowego kliknięcia.',
    'Sprawdź pole tekstowe i zobacz, że demo zachowuje się jak formularz quizowy.',
    'Przejdź dopasowania w dropdownach, tak jak w LMS-ach i formularzach.',
    'Na końcu zaznacz tekst pytania i sprawdź przepływ Quick overlay.'
  ],
  labels: {
    quizMeta: 'Bezpieczny quiz testowy',
    scoreLabel: 'Wynik',
    answeredLabel: 'Sprawdzone',
    accuracyLabel: 'Skuteczność',
    checkAnswer: 'Sprawdź odpowiedź',
    showHint: 'Pokaż podpowiedź',
    simulateSolver: 'Symuluj QuizSolver',
    resetAnswers: 'Wyczyść odpowiedzi',
    correctTitle: 'Poprawnie',
    wrongTitle: 'Jeszcze nie',
    emptyTitle: 'Najpierw wybierz odpowiedź',
    hintTitle: 'Podpowiedź',
    explanationLabel: 'Dlaczego to działa',
    resultTitle: 'Demo ukończone',
    resultText: 'To był pełny mini-quiz: wybór odpowiedzi, hint mode, pole tekstowe, dropdowny i zaznaczony tekst. Takie typy pytań QuizSolver obsługuje na realnych stronach.',
    finalPrimary: 'Zainstaluj rozszerzenie',
    finalSecondary: 'Uruchom ponownie',
    sideTitle: 'Co zrobiłby QuizSolver',
    sideText: 'Otwórz rozszerzenie na tej stronie, rozwiąż aktualne pytanie albo użyj Quick overlay dla zaznaczonego tekstu. Ten quiz pokazuje realny przepływ bez zużywania kredytów.'
  },
  proofItems: ['Nie zużywa kredytów w demo', 'Tłumaczy poprawną odpowiedź', 'Pokazuje realne typy quizów'],
  questions: [
    {
      id: 'demo-radio',
      type: 'radio',
      kicker: 'Krok 1',
      title: 'Biologia: jednokrotny wybór',
      instruction: 'Wybierz odpowiedź samodzielnie albo zasymuluj działanie rozszerzenia na typowej karcie pytania.',
      question: 'Które organellum odpowiada głównie za produkcję ATP w komórkach eukariotycznych?',
      options: ['Jądro komórkowe', 'Mitochondrium', 'Rybosom', 'Błona komórkowa'],
      correctText: 'Mitochondrium',
      hint: 'Szukaj organellum nazywanego często elektrownią komórki.',
      explanation: 'Mitochondria przeprowadzają oddychanie komórkowe i wytwarzają większość ATP, czyli podstawowego nośnika energii w komórkach eukariotycznych.'
    },
    {
      id: 'demo-hidden',
      type: 'hidden',
      kicker: 'Krok 2',
      title: 'Historia: tryb podpowiedzi',
      instruction: 'Ten krok pokazuje sytuację, w której użytkownik chce wskazówkę, a nie automatyczne kliknięcie.',
      question: 'Które źródło jest najlepszym przykładem pierwotnego źródła historycznego?',
      options: ['Rozdział w podręczniku', 'Dziennik napisany podczas wydarzenia', 'Współczesny film dokumentalny', 'Hasło w encyklopedii'],
      correctText: 'Dziennik napisany podczas wydarzenia',
      hint: 'Źródło pierwotne powstaje blisko opisywanego wydarzenia i zwykle pochodzi od bezpośredniego świadka.',
      explanation: 'Dziennik napisany podczas wydarzenia jest źródłem pierwotnym, bo zawiera bezpośredni zapis z czasu, którego dotyczy.'
    },
    {
      id: 'demo-text',
      type: 'text',
      kicker: 'Krok 3',
      title: 'Matematyka: odpowiedź wpisywana',
      instruction: 'Wpisz wynik w pole tekstowe albo pozwól demo uzupełnić je tak, jak zrobiłoby to rozszerzenie.',
      question: 'Ile wynosi 12 x 8?',
      placeholder: 'Wpisz liczbę',
      correctText: '96',
      hint: 'Rozbij działanie na 10 x 8 oraz 2 x 8.',
      explanation: '12 x 8 = 96, ponieważ 10 x 8 daje 80, a 2 x 8 daje 16. Razem to 96.'
    },
    {
      id: 'demo-matching',
      type: 'matching',
      kicker: 'Krok 4',
      title: 'Nauka: dropdowny i dopasowanie',
      instruction: 'Dopasuj pojęcia do definicji. Tak wyglądają pytania spotykane w LMS-ach i formularzach.',
      question: 'Dopasuj pojęcie naukowe do właściwej definicji.',
      prompts: ['Fotosynteza', 'Parowanie', 'Grawitacja'],
      options: ['Rośliny tworzą glukozę ze światła', 'Ciecz zmienia się w gaz', 'Siła przyciągająca obiekty z masą'],
      correctText: 'Fotosynteza = Rośliny tworzą glukozę ze światła, Parowanie = Ciecz zmienia się w gaz, Grawitacja = Siła przyciągająca obiekty z masą',
      hint: 'Pomyśl o świetle u roślin, wodzie pod wpływem ciepła i obiektach posiadających masę.',
      explanation: 'Fotosynteza wykorzystuje światło do tworzenia glukozy, parowanie zmienia ciecz w gaz, a grawitacja przyciąga obiekty z masą.'
    },
    {
      id: 'demo-selected',
      type: 'selected',
      kicker: 'Krok 5',
      title: 'Quick overlay i zaznaczony tekst',
      instruction: 'Zaznacz tylko tekst pytania, użyj Alt+Q i rozwiąż fragment zamiast całej strony.',
      question: 'Która akcja QuizSolver najlepiej sprawdza się, gdy strona ma dużo dodatkowego tekstu wokół właściwego pytania?',
      options: ['Rozwiąż zaznaczony tekst', 'Płatność za kredyty', 'Panel admina', 'Historia przeglądarki'],
      correctText: 'Rozwiąż zaznaczony tekst',
      hint: 'Wybierz akcję, która pracuje tylko na zaznaczonym fragmencie.',
      explanation: 'Rozwiąż zaznaczony tekst wysyła do QuizSolver tylko podświetlone pytanie, co pomaga, gdy pełny parser strony widzi zbyt dużo pobocznej treści.'
    }
  ]
};

const DEMO_LOCALE_COPY: Record<Exclude<Locale, 'en' | 'pl'>, Omit<DemoCopy, 'questions'>> = {
  de: {
    eyebrow: 'Interaktives Onboarding',
    title: 'Teste QuizSolver in einem sicheren Demo-Quiz',
    lead: 'Fünf vorbereitete Alltagsfragen zeigen, wie die Erweiterung funktioniert. Diese Seite verbraucht keine Credits.',
    install: 'Erweiterung installieren',
    openStore: 'Chrome Web Store öffnen',
    demoBadge: 'Keine Credits',
    localBadge: 'Geführtes Training',
    mapTitle: 'So nutzt du die Demo',
    mapText: 'Starte das Erweiterungs-Tutorial und öffne dann das QuizSolver-Popup auf dieser Seite.',
    prev: 'Zurück',
    next: 'Nächste Frage',
    restart: 'Demo neu starten',
    startTour: 'Tutorial starten',
    selectText: 'Demo-Fragetext markieren',
    selectedTip: 'Markiere den Fragetext, öffne das Quick Overlay und löse die Auswahl.',
    yourAnswer: 'Deine Antwort',
    chooseOption: 'Auswählen',
    popupTitle: 'Popup-Ablauf',
    popupSteps: ['Klicke auf das QS-Symbol in Chrome.', 'Nutze „Aktuelle Seite lösen“.', 'Aktiviere den Hinweis-Modus.', 'Öffne Quick Overlay oder drücke Alt+Q.', 'Markiere Text und löse nur die Auswahl.']
  },
  es: {
    eyebrow: 'Onboarding interactivo',
    title: 'Prueba QuizSolver en un demo seguro',
    lead: 'Cinco preguntas cotidianas muestran cómo funciona la extensión. Esta página no consume créditos.',
    install: 'Instalar extensión',
    openStore: 'Abrir Chrome Web Store',
    demoBadge: 'Sin créditos',
    localBadge: 'Práctica guiada',
    mapTitle: 'Cómo usar este demo',
    mapText: 'Inicia el tutorial de la extensión y abre el popup de QuizSolver en esta página.',
    prev: 'Anterior',
    next: 'Siguiente pregunta',
    restart: 'Reiniciar demo',
    startTour: 'Iniciar tutorial',
    selectText: 'Seleccionar texto de la pregunta',
    selectedTip: 'Selecciona el texto, abre el overlay rápido y resuelve la selección.',
    yourAnswer: 'Tu respuesta',
    chooseOption: 'Elegir',
    popupTitle: 'Flujo del popup',
    popupSteps: ['Haz clic en el icono QS en Chrome.', 'Usa Resolver página actual.', 'Activa Hint mode.', 'Abre Quick overlay o pulsa Alt+Q.', 'Selecciona texto y resuelve solo esa selección.']
  },
  fr: {
    eyebrow: 'Onboarding interactif',
    title: 'Essayez QuizSolver sur une démo sûre',
    lead: 'Cinq questions du quotidien montrent le fonctionnement de l’extension. Cette page ne consomme pas de crédits.',
    install: 'Installer l’extension',
    openStore: 'Ouvrir Chrome Web Store',
    demoBadge: 'Aucun crédit',
    localBadge: 'Pratique guidée',
    mapTitle: 'Utiliser cette démo',
    mapText: 'Lancez le tutoriel de l’extension puis ouvrez le popup QuizSolver sur cette page.',
    prev: 'Précédent',
    next: 'Question suivante',
    restart: 'Recommencer',
    startTour: 'Lancer le tutoriel',
    selectText: 'Sélectionner le texte',
    selectedTip: 'Sélectionnez la question, ouvrez l’overlay rapide et résolvez la sélection.',
    yourAnswer: 'Votre réponse',
    chooseOption: 'Choisir',
    popupTitle: 'Flux du popup',
    popupSteps: ['Cliquez sur l’icône QS dans Chrome.', 'Utilisez Résoudre la page.', 'Activez le mode indice.', 'Ouvrez Quick overlay ou Alt+Q.', 'Sélectionnez du texte et résolvez seulement cette sélection.']
  },
  it: {
    eyebrow: 'Onboarding interattivo',
    title: 'Prova QuizSolver in una demo sicura',
    lead: 'Cinque domande quotidiane mostrano come funziona l’estensione. Questa pagina non consuma crediti.',
    install: 'Installa estensione',
    openStore: 'Apri Chrome Web Store',
    demoBadge: 'Nessun credito',
    localBadge: 'Pratica guidata',
    mapTitle: 'Come usare la demo',
    mapText: 'Avvia il tutorial dell’estensione e poi apri il popup QuizSolver su questa pagina.',
    prev: 'Precedente',
    next: 'Domanda successiva',
    restart: 'Riavvia demo',
    startTour: 'Avvia tutorial',
    selectText: 'Seleziona testo domanda',
    selectedTip: 'Seleziona il testo, apri l’overlay rapido e risolvi la selezione.',
    yourAnswer: 'La tua risposta',
    chooseOption: 'Scegli',
    popupTitle: 'Flusso popup',
    popupSteps: ['Clicca l’icona QS in Chrome.', 'Usa Risolvi pagina corrente.', 'Attiva Hint mode.', 'Apri Quick overlay o premi Alt+Q.', 'Seleziona testo e risolvi solo quello.']
  },
  uk: {
    eyebrow: 'Інтерактивний onboarding',
    title: 'Спробуй QuizSolver у безпечному демо',
    lead: 'П’ять повсякденних питань показують роботу розширення. Ця сторінка не витрачає кредити.',
    install: 'Встановити розширення',
    openStore: 'Відкрити Chrome Web Store',
    demoBadge: 'Без кредитів',
    localBadge: 'Покрокова практика',
    mapTitle: 'Як користуватися демо',
    mapText: 'Запусти tutorial розширення, а потім відкрий popup QuizSolver на цій сторінці.',
    prev: 'Назад',
    next: 'Наступне питання',
    restart: 'Почати заново',
    startTour: 'Запустити tutorial',
    selectText: 'Виділити текст питання',
    selectedTip: 'Виділи текст, відкрий швидкий overlay і розв’яжи виділення.',
    yourAnswer: 'Твоя відповідь',
    chooseOption: 'Вибери',
    popupTitle: 'Popup flow',
    popupSteps: ['Натисни іконку QS у Chrome.', 'Використай Solve current page.', 'Увімкни Hint mode.', 'Відкрий Quick overlay або Alt+Q.', 'Виділи текст і розв’яжи тільки його.']
  }
};

const DEMO_QUESTIONS: Record<Exclude<Locale, 'en' | 'pl'>, DemoQuestion[]> = {
  de: [
    { ...COPY.en.questions[0], kicker: 'Schritt 1', title: 'Normales Lösen', instruction: 'Klicke im Popup auf „Aktuelle Seite lösen“. QuizSolver sollte die richtige Option wählen.', question: 'Was nimmt man mit, wenn es draußen regnet?', options: ['Sonnenbrille', 'Regenschirm', 'Strandtuch', 'Schlittschuhe'], correctText: 'Regenschirm' },
    { ...COPY.en.questions[1], kicker: 'Schritt 2', title: 'Hinweis-Modus', instruction: 'Aktiviere Hint mode vor dem Lösen. Die Antwort wird nur angedeutet.', question: 'Was bewahrt man normalerweise im Kühlschrank auf?', options: ['Decke', 'Milch', 'Heft', 'Schlüssel'], correctText: 'Milch' },
    { ...COPY.en.questions[2], kicker: 'Schritt 3', title: 'Texteingabe', instruction: 'Die Erweiterung füllt das Textfeld mit einer lokalen Demo-Antwort.', question: 'Wie viele Tage hat eine normale Woche?', placeholder: 'Antwort hier eingeben', correctText: '7' },
    { ...COPY.en.questions[3], kicker: 'Schritt 4', title: 'Dropdowns', instruction: 'QuizSolver wählt passende Begriffe in mehreren Selects.', question: 'Ordne Alltagstätigkeiten dem typischen Ort zu.', prompts: ['Kochen', 'Schlafen', 'Einkaufen'], options: ['Küche', 'Schlafzimmer', 'Geschäft'], correctText: 'Kochen = Küche, Schlafen = Schlafzimmer, Einkaufen = Geschäft' },
    { ...COPY.en.questions[4], kicker: 'Schritt 5', title: 'Quick overlay', instruction: 'Markiere den Fragetext und löse die Auswahl.', question: 'Welches QuizSolver-Tool öffnet ein kleines Fenster mit schnellen Aktionen?', options: ['Quick overlay', 'Credit checkout', 'Admin panel', 'Browserverlauf'], correctText: 'Quick overlay' }
  ],
  es: [
    { ...COPY.en.questions[0], kicker: 'Paso 1', title: 'Resolución normal', instruction: 'Haz clic en Resolver página actual. QuizSolver debería elegir la opción correcta.', question: '¿Qué llevas cuando llueve afuera?', options: ['Gafas de sol', 'Paraguas', 'Toalla de playa', 'Patines'], correctText: 'Paraguas' },
    { ...COPY.en.questions[1], kicker: 'Paso 2', title: 'Modo pista', instruction: 'Activa Hint mode antes de resolver. La respuesta se mostrará como pista.', question: '¿Qué se guarda normalmente en la nevera?', options: ['Manta', 'Leche', 'Cuaderno', 'Llaves'], correctText: 'Leche' },
    { ...COPY.en.questions[2], kicker: 'Paso 3', title: 'Respuesta escrita', instruction: 'La extensión llenará el campo con una respuesta local de demo.', question: '¿Cuántos días tiene una semana normal?', placeholder: 'Escribe la respuesta', correctText: '7' },
    { ...COPY.en.questions[3], kicker: 'Paso 4', title: 'Dropdowns', instruction: 'QuizSolver completa varios selects con conceptos correctos.', question: 'Relaciona cada actividad cotidiana con su lugar habitual.', prompts: ['Cocinar', 'Dormir', 'Comprar'], options: ['Cocina', 'Dormitorio', 'Tienda'], correctText: 'Cocinar = Cocina, Dormir = Dormitorio, Comprar = Tienda' },
    { ...COPY.en.questions[4], kicker: 'Paso 5', title: 'Quick overlay', instruction: 'Selecciona el texto y resuelve solo esa selección.', question: '¿Qué herramienta abre una ventana pequeña con acciones rápidas?', options: ['Quick overlay', 'Pago de créditos', 'Panel admin', 'Historial del navegador'], correctText: 'Quick overlay' }
  ],
  fr: [
    { ...COPY.en.questions[0], kicker: 'Étape 1', title: 'Résolution standard', instruction: 'Cliquez sur Résoudre la page dans le popup. QuizSolver doit choisir la bonne option sans utiliser de crédits.', question: 'Que faut-il prendre quand il pleut dehors ?', options: ['Lunettes de soleil', 'Parapluie', 'Serviette de plage', 'Patins'], correctText: 'Parapluie' },
    { ...COPY.en.questions[1], kicker: 'Étape 2', title: 'Mode indice', instruction: 'Activez Hint mode avant de résoudre. La réponse sera indiquée discrètement au lieu d’être cliquée.', question: 'Quel produit garde-t-on généralement au réfrigérateur ?', options: ['Couverture', 'Lait', 'Cahier', 'Clés'], correctText: 'Lait' },
    { ...COPY.en.questions[2], kicker: 'Étape 3', title: 'Réponse saisie', instruction: 'L’extension remplit le champ avec une réponse locale de démonstration.', question: 'Combien de jours compte une semaine normale ?', placeholder: 'Tapez la réponse', correctText: '7' },
    { ...COPY.en.questions[3], kicker: 'Étape 4', title: 'Menus déroulants', instruction: 'QuizSolver associe chaque activité à son lieu habituel.', question: 'Associez chaque activité quotidienne au lieu où elle se déroule.', prompts: ['Cuisiner', 'Dormir', 'Faire les courses'], options: ['Cuisine', 'Chambre', 'Magasin'], correctText: 'Cuisiner = Cuisine, Dormir = Chambre, Faire les courses = Magasin' },
    { ...COPY.en.questions[4], kicker: 'Étape 5', title: 'Overlay rapide', instruction: 'Sélectionnez le texte de la question, ouvrez l’overlay et résolvez uniquement cette sélection.', question: 'Quel outil QuizSolver ouvre une petite fenêtre avec des actions rapides ?', options: ['Quick overlay', 'Paiement des crédits', 'Panel admin', 'Historique navigateur'], correctText: 'Quick overlay' }
  ],
  it: [
    { ...COPY.en.questions[0], kicker: 'Passo 1', title: 'Risoluzione standard', instruction: 'Clicca Risolvi pagina corrente nel popup. QuizSolver deve selezionare l’opzione corretta senza usare crediti.', question: 'Cosa porti con te quando fuori piove?', options: ['Occhiali da sole', 'Ombrello', 'Telo mare', 'Pattini'], correctText: 'Ombrello' },
    { ...COPY.en.questions[1], kicker: 'Passo 2', title: 'Hint mode', instruction: 'Attiva Hint mode prima di risolvere. La risposta viene suggerita invece di essere cliccata.', question: 'Quale cosa si conserva di solito in frigorifero?', options: ['Coperta', 'Latte', 'Quaderno', 'Chiavi'], correctText: 'Latte' },
    { ...COPY.en.questions[2], kicker: 'Passo 3', title: 'Risposta scritta', instruction: 'L’estensione riempie il campo con una risposta demo locale.', question: 'Quanti giorni ha una settimana normale?', placeholder: 'Scrivi la risposta', correctText: '7' },
    { ...COPY.en.questions[3], kicker: 'Passo 4', title: 'Menu a tendina', instruction: 'QuizSolver abbina ogni attività al luogo corretto.', question: 'Abbina ogni attività quotidiana al luogo in cui avviene di solito.', prompts: ['Cucinare', 'Dormire', 'Fare la spesa'], options: ['Cucina', 'Camera da letto', 'Negozio'], correctText: 'Cucinare = Cucina, Dormire = Camera da letto, Fare la spesa = Negozio' },
    { ...COPY.en.questions[4], kicker: 'Passo 5', title: 'Overlay rapido', instruction: 'Seleziona il testo della domanda, apri l’overlay e risolvi solo quella selezione.', question: 'Quale strumento QuizSolver apre una piccola finestra con azioni rapide?', options: ['Quick overlay', 'Pagamento crediti', 'Pannello admin', 'Cronologia browser'], correctText: 'Quick overlay' }
  ],
  uk: [
    { ...COPY.en.questions[0], kicker: 'Крок 1', title: 'Звичайне розв’язання', instruction: 'Натисни Solve current page у popup. QuizSolver має вибрати правильний варіант без витрати кредитів.', question: 'Що варто взяти, коли надворі дощ?', options: ['Сонцезахисні окуляри', 'Парасолю', 'Пляжний рушник', 'Ковзани'], correctText: 'Парасолю' },
    { ...COPY.en.questions[1], kicker: 'Крок 2', title: 'Hint mode', instruction: 'Увімкни Hint mode перед розв’язанням. Відповідь буде підказана, а не натиснута автоматично.', question: 'Що зазвичай зберігають у холодильнику?', options: ['Ковдру', 'Молоко', 'Зошит', 'Ключі'], correctText: 'Молоко' },
    { ...COPY.en.questions[2], kicker: 'Крок 3', title: 'Текстова відповідь', instruction: 'Розширення заповнить поле локальною демо-відповіддю.', question: 'Скільки днів має звичайний тиждень?', placeholder: 'Введи відповідь', correctText: '7' },
    { ...COPY.en.questions[3], kicker: 'Крок 4', title: 'Dropdown і matching', instruction: 'QuizSolver підбирає правильний варіант у кожному списку.', question: 'Зістав повсякденну дію з місцем, де вона зазвичай відбувається.', prompts: ['Готування', 'Сон', 'Покупки'], options: ['Кухня', 'Спальня', 'Магазин'], correctText: 'Готування = Кухня, Сон = Спальня, Покупки = Магазин' },
    { ...COPY.en.questions[4], kicker: 'Крок 5', title: 'Quick overlay', instruction: 'Виділи текст питання, відкрий overlay і розв’яжи тільки виділення.', question: 'Який інструмент QuizSolver відкриває маленьке вікно зі швидкими діями?', options: ['Quick overlay', 'Оплата кредитів', 'Admin panel', 'Історія браузера'], correctText: 'Quick overlay' }
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
        <section class="demo-hero">
          <div class="container demo-hero-grid">
            <div class="demo-copy">
              <p class="eyebrow">{{ copy.eyebrow }}</p>
              <h1>{{ copy.title }}</h1>
              <p class="demo-lead">{{ copy.lead }}</p>
              <div class="demo-badges" aria-label="Demo guarantees">
                <span>{{ copy.demoBadge }}</span>
                <span>{{ copy.localBadge }}</span>
                <span>{{ label('quizMeta') }}</span>
              </div>

              <div class="demo-proof" *ngIf="proofItems().length">
                <span *ngFor="let item of proofItems()">{{ item }}</span>
              </div>

              <!-- Warning Card -->
              <div class="demo-extension-warning glass">
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                  <h3>{{ getExtensionWarning().title }}</h3>
                  <p>{{ getExtensionWarning().text }}</p>
                </div>
              </div>

              <div class="demo-actions">
                <button class="btn btn-primary btn-lg" type="button" data-qs-tour-start (click)="startGuidedTour()">{{ copy.startTour }}</button>
                <a [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-outline btn-lg cta-store-btn">
                  {{ copy.install }}
                </a>
              </div>
            </div>

            <aside class="demo-map glass">
              <h2>{{ copy.mapTitle }}</h2>
              <p>{{ copy.mapText }}</p>
              <ol>
                <li *ngFor="let step of copy.popupSteps; let i = index" [class.active]="i === current()">
                  <span>{{ i + 1 }}</span>
                  <p>{{ step }}</p>
                </li>
              </ol>

              <div class="demo-score-panel">
                <div class="score-head">
                  <span>{{ label('scoreLabel') }}</span>
                  <strong>{{ score() }} / {{ copy.questions.length }}</strong>
                </div>
                <div class="score-meter" aria-hidden="true">
                  <i [style.width.%]="progressPercent()"></i>
                </div>
                <dl class="score-stats">
                  <div>
                    <dt>{{ label('answeredLabel') }}</dt>
                    <dd>{{ answeredCount() }}</dd>
                  </div>
                  <div>
                    <dt>{{ label('accuracyLabel') }}</dt>
                    <dd>{{ accuracyPercent() }}%</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </section>

        <section class="container demo-workspace" *ngIf="currentQuestion() as question">
          <aside class="demo-side glass">
            <p class="eyebrow">{{ copy.popupTitle }}</p>
            <h2>{{ label('sideTitle') }}</h2>
            <p>{{ label('sideText') }}</p>
            <div class="demo-current-step">
              <span>{{ question.kicker }}</span>
              <strong>{{ question.title }}</strong>
              <p>{{ question.instruction }}</p>
            </div>
            <div class="mock-popup" aria-hidden="true">
              <div class="mock-popup-head">
                <strong>QS</strong>
                <span>QuizSolver</span>
              </div>
              <div class="mock-action primary" data-qs-tour="mock-solve">Solve current page</div>
              <div class="mock-action">FocusScan</div>
              <div class="mock-action" data-qs-tour="mock-overlay">Quick overlay</div>
              <div class="mock-toggle" [class.on]="question.type === 'hidden'" data-qs-tour="mock-hint">
                <span>Hint mode</span><i></i>
              </div>
            </div>
          </aside>

          <article class="demo-card glass" [attr.data-qs-demo-question]="question.id" data-qs-tour="question-card">
            <div class="question-top">
              <div>
                <p class="eyebrow">{{ question.kicker }}</p>
                <h2 class="question-text" data-qs-demo-question-text [attr.data-qs-demo-selectable]="question.type === 'selected' ? 'true' : null">
                  {{ question.question }}
                </h2>
              </div>
              <span class="question-count">{{ current() + 1 }} / {{ copy.questions.length }}</span>
            </div>

            <p class="question-instruction">{{ question.instruction }}</p>

            <fieldset class="demo-options" *ngIf="question.type === 'radio' || question.type === 'hidden' || question.type === 'selected'">
              <legend class="sr-only">{{ question.question }}</legend>
              <label
                class="demo-option"
                *ngFor="let option of question.options; let i = index"
                [class.selected]="answerValue(question.id) === option"
                [class.correct-reveal]="isChecked(question) && option === question.correctText"
                [class.wrong-reveal]="isChecked(question) && answerValue(question.id) === option && option !== question.correctText">
                <input
                  type="radio"
                  [name]="question.id"
                  [value]="option"
                  [checked]="answerValue(question.id) === option"
                  (change)="setAnswer(question, option)">
                <span>{{ option }}</span>
              </label>
            </fieldset>

            <label class="text-answer" *ngIf="question.type === 'text'">
              <span>{{ copy.yourAnswer }}</span>
              <input
                type="text"
                [name]="question.id + '-answer'"
                [placeholder]="question.placeholder || ''"
                [value]="answerValue(question.id)"
                (input)="setAnswer(question, $any($event.target).value)">
            </label>

            <div class="matching-board" *ngIf="question.type === 'matching'">
              <label class="match-row" *ngFor="let prompt of question.prompts; let i = index">
                <span>{{ prompt }}</span>
                <select [name]="question.id + '-' + i" [value]="matchValue(question.id, i)" (change)="setMatchAnswer(question, i, $any($event.target).value)">
                  <option value="">{{ copy.chooseOption }}</option>
                  <option *ngFor="let option of question.options" [value]="option">{{ option }}</option>
                </select>
              </label>
            </div>

            <div class="selected-tip" *ngIf="question.type === 'selected'">
              <button class="btn btn-outline btn-sm" type="button" data-qs-tour="select-text" (click)="selectQuestionText()">{{ copy.selectText }}</button>
              <p>{{ copy.selectedTip }}</p>
            </div>

            <section
              class="demo-feedback"
              *ngIf="feedbackVisible(question)"
              [class.success]="feedbackKind(question) === 'correct'"
              [class.warning]="feedbackKind(question) === 'wrong'"
              [class.info]="feedbackKind(question) === 'hint'"
              [class.empty]="feedbackKind(question) === 'empty'">
              <strong>{{ feedbackTitle(question) }}</strong>
              <p>{{ feedbackMessage(question) }}</p>
              <div class="demo-explanation" *ngIf="showExplanation(question)">
                <span>{{ label('explanationLabel') }}</span>
                <p>{{ question.explanation }}</p>
              </div>
            </section>

            <div class="demo-controls">
              <button class="btn btn-outline" type="button" (click)="showHint(question)">{{ label('showHint') }}</button>
              <button class="btn btn-outline" type="button" data-qs-tour="mock-solve" (click)="simulateSolver(question)">{{ label('simulateSolver') }}</button>
              <button class="btn btn-primary" type="button" (click)="checkAnswer(question)">{{ label('checkAnswer') }}</button>
            </div>

            <div class="demo-nav">
              <button class="btn btn-outline" type="button" (click)="previous()" [disabled]="current() === 0">{{ copy.prev }}</button>
              <button class="btn btn-primary" type="button" data-qs-tour="next" (click)="nextOrRestart()">
                {{ current() === copy.questions.length - 1 ? copy.restart : copy.next }}
              </button>
            </div>
          </article>
        </section>

        <section class="container demo-finish" *ngIf="isDemoComplete()">
          <div>
            <p class="eyebrow">{{ label('scoreLabel') }} {{ score() }} / {{ copy.questions.length }}</p>
            <h2>{{ label('resultTitle') }}</h2>
            <p>{{ label('resultText') }}</p>
            <div class="demo-finish-stats" aria-label="Quiz result">
              <span>{{ label('scoreLabel') }}: <strong>{{ score() }} / {{ copy.questions.length }}</strong></span>
              <span>{{ label('answeredLabel') }}: <strong>{{ answeredCount() }}</strong></span>
              <span>{{ label('accuracyLabel') }}: <strong>{{ accuracyPercent() }}%</strong></span>
            </div>
          </div>
          <div class="demo-finish-actions">
            <a [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-primary">{{ label('finalPrimary') }}</a>
            <button class="btn btn-outline" type="button" (click)="resetAnswers()">{{ label('finalSecondary') }}</button>
          </div>
        </section>
      </div>
    </qs-shell>
  `,
  styles: [`
    .demo-page {
      padding: 4.5rem 0 5rem;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
      background:
        linear-gradient(180deg, rgba(16, 19, 24, 0.98), rgba(13, 17, 25, 0.98)),
        #101318;
    }

    .demo-hero {
      padding: 1.5rem 0 2.5rem;
      max-width: 100vw;
      overflow-x: hidden;
      border-bottom: 1px solid rgba(43, 53, 69, 0.72);
    }

    .demo-hero-grid,
    .demo-workspace {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(340px, 0.92fr);
      gap: 1.25rem;
      align-items: stretch;
    }

    .demo-copy,
    .demo-map,
    .demo-side,
    .demo-card {
      min-width: 0;
    }

    .demo-copy h1 {
      max-width: 780px;
      margin: 0.75rem 0 0.9rem;
      overflow-wrap: anywhere;
    }

    .demo-lead {
      max-width: 720px;
      font-size: 1.08rem;
      overflow-wrap: break-word;
    }

    .demo-badges,
    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.2rem;
    }

    .demo-badges span {
      min-width: 0;
      border: 1px solid rgba(16, 185, 129, 0.28);
      background: rgba(16, 185, 129, 0.08);
      color: #b7f7d1;
      border-radius: 999px;
      padding: 0.45rem 0.75rem;
      font-size: 0.85rem;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .demo-proof {
      display: grid;
      gap: 0.55rem;
      margin-top: 1.15rem;
      max-width: 720px;
    }

    .demo-proof span {
      position: relative;
      padding-left: 1.35rem;
      color: #dbeafe;
      font-size: 0.94rem;
      line-height: 1.45;
    }

    .demo-proof span::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.48rem;
      width: 0.48rem;
      height: 0.48rem;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
    }

    .demo-map,
    .demo-side,
    .demo-card {
      border: 1px solid #2b3545;
      border-radius: 12px;
      background: #171c24;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.26);
      padding: 1.1rem;
    }

    .demo-map h2,
    .demo-side h2 {
      font-size: 1.2rem;
      margin-bottom: 0.65rem;
    }

    .demo-map ol {
      display: grid;
      gap: 0.5rem;
      margin-top: 0.9rem;
    }

    .demo-map li {
      display: grid;
      grid-template-columns: 1.8rem 1fr;
      gap: 0.65rem;
      align-items: center;
      padding: 0.65rem;
      border: 1px solid rgba(43, 53, 69, 0.9);
      border-radius: 10px;
      background: #1d2430;
    }

    .demo-map li.active {
      border-color: rgba(14, 165, 233, 0.62);
      background: linear-gradient(135deg, rgba(124, 92, 252, 0.16), rgba(14, 165, 233, 0.12));
    }

    .demo-map li span {
      display: grid;
      place-items: center;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 8px;
      background: linear-gradient(135deg, #7c5cfc, #0ea5e9);
      color: #ffffff;
      font-weight: 900;
    }

    .demo-map li p {
      color: var(--text-primary);
      font-size: 0.9rem;
      line-height: 1.35;
    }

    .demo-score-panel {
      display: grid;
      gap: 0.75rem;
      margin-top: 1rem;
      padding: 0.9rem;
      border: 1px solid rgba(14, 165, 233, 0.26);
      border-radius: 10px;
      background: rgba(14, 165, 233, 0.08);
    }

    .score-head,
    .score-stats,
    .score-stats div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .score-head span,
    .score-stats dt {
      color: var(--text-secondary);
      font-size: 0.84rem;
      font-weight: 800;
    }

    .score-head strong,
    .score-stats dd {
      color: var(--text-primary);
      font-weight: 900;
    }

    .score-meter {
      height: 0.6rem;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(148, 163, 184, 0.16);
    }

    .score-meter i {
      display: block;
      height: 100%;
      min-width: 0.35rem;
      border-radius: inherit;
      background: linear-gradient(90deg, #22c55e, #0ea5e9);
      transition: width 0.22s ease;
    }

    .score-stats {
      margin: 0;
    }

    .score-stats div {
      flex: 1 1 0;
      padding: 0.55rem 0.65rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.22);
    }

    .demo-workspace {
      grid-template-columns: minmax(280px, 0.42fr) minmax(0, 1fr);
      align-items: start;
      margin-top: 1.75rem;
    }

    .demo-side {
      position: sticky;
      top: 6rem;
    }

    .demo-side > p:not(.eyebrow) {
      margin-bottom: 1rem;
    }

    .demo-current-step {
      display: grid;
      gap: 0.25rem;
      margin: 1rem 0;
      padding: 0.85rem;
      border: 1px solid rgba(124, 92, 252, 0.22);
      border-radius: 10px;
      background: rgba(124, 92, 252, 0.08);
    }

    .demo-current-step span {
      color: #c4b5fd;
      font-size: 0.78rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .demo-current-step strong {
      color: var(--text-primary);
      font-size: 1rem;
    }

    .demo-current-step p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.45;
      margin: 0;
    }

    .mock-popup {
      display: grid;
      gap: 0.6rem;
      margin-top: 1.15rem;
      padding: 0.85rem;
      border: 1px solid #2b3545;
      border-radius: 12px;
      background: #101318;
    }

    .mock-popup-head {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      padding-bottom: 0.35rem;
      color: var(--text-primary);
      font-weight: 800;
    }

    .mock-popup-head strong {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.6rem;
      background: var(--grad-primary);
    }

    .mock-action,
    .mock-toggle {
      min-height: 2.65rem;
      border: 1px solid #2b3545;
      border-radius: 10px;
      padding: 0.7rem 0.8rem;
      background: #1d2430;
      color: var(--text-primary);
      font-weight: 800;
    }

    .mock-action.primary {
      background: var(--grad-primary);
      color: white;
    }

    .mock-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .mock-toggle i {
      width: 2.35rem;
      height: 1.25rem;
      border-radius: 999px;
      background: rgba(148, 163, 184, 0.25);
      position: relative;
    }

    .mock-toggle i::after {
      content: '';
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      width: 0.85rem;
      height: 0.85rem;
      border-radius: 50%;
      background: white;
      transition: transform 0.2s ease;
    }

    .mock-toggle.on i {
      background: rgba(16, 185, 129, 0.55);
    }

    .mock-toggle.on i::after {
      transform: translateX(1.1rem);
    }

    .question-top {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.3rem;
    }

    .question-text {
      margin-top: 0.35rem;
      font-size: clamp(1.5rem, 3vw, 2.25rem);
    }

    .question-instruction {
      margin: -0.45rem 0 1.1rem;
      color: var(--text-secondary);
      font-size: 0.96rem;
      line-height: 1.55;
    }

    .question-count {
      flex: 0 0 auto;
      height: 2.3rem;
      padding: 0.42rem 0.7rem;
      border-radius: 10px;
      border: 1px solid #2b3545;
      color: #bae6fd;
      font-weight: 900;
    }

    .demo-options {
      display: grid;
      gap: 0.75rem;
      border: 0;
    }

    .demo-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-height: 3.35rem;
      padding: 0.8rem 0.9rem;
      border: 1px solid #2b3545;
      border-radius: 10px;
      background: #1d2430;
      color: var(--text-primary);
      font-weight: 750;
    }

    .demo-option:hover {
      border-color: rgba(6, 182, 212, 0.35);
      background: rgba(6, 182, 212, 0.08);
    }

    .demo-option.selected {
      border-color: rgba(14, 165, 233, 0.62);
      background: rgba(14, 165, 233, 0.13);
    }

    .demo-option.correct-reveal {
      border-color: rgba(34, 197, 94, 0.7);
      background: rgba(34, 197, 94, 0.12);
    }

    .demo-option.wrong-reveal {
      border-color: rgba(248, 113, 113, 0.68);
      background: rgba(248, 113, 113, 0.1);
    }

    .demo-option input {
      width: 1.15rem;
      height: 1.15rem;
      accent-color: var(--accent-cyan);
    }

    .text-answer {
      display: grid;
      gap: 0.55rem;
      color: var(--text-primary);
      font-weight: 800;
    }

    .text-answer input,
    .match-row select {
      width: 100%;
      min-height: 3.2rem;
      border: 1px solid #2b3545;
      border-radius: 10px;
      background: #101318;
      color: var(--text-primary);
      padding: 0 0.9rem;
      outline: none;
    }

    .text-answer input:focus,
    .match-row select:focus {
      border-color: rgba(6, 182, 212, 0.55);
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.14);
    }

    .matching-board {
      display: grid;
      gap: 0.85rem;
    }

    .match-row {
      display: grid;
      grid-template-columns: minmax(120px, 0.35fr) minmax(0, 1fr);
      gap: 0.85rem;
      align-items: center;
    }

    .match-row > span {
      color: var(--text-primary);
      font-weight: 900;
    }

    .selected-tip,
    .demo-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.85rem;
      flex-wrap: wrap;
      margin-top: 1.2rem;
    }

    .selected-tip {
      justify-content: flex-start;
      border: 1px solid rgba(245, 158, 11, 0.18);
      background: rgba(245, 158, 11, 0.07);
      border-radius: 10px;
      padding: 0.75rem;
    }

    .selected-tip p {
      flex: 1 1 260px;
      color: #fde68a;
      font-size: 0.92rem;
    }

    .demo-feedback {
      display: grid;
      gap: 0.5rem;
      margin-top: 1.15rem;
      padding: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 10px;
      background: rgba(15, 23, 42, 0.42);
    }

    .demo-feedback strong {
      color: var(--text-primary);
      font-size: 1rem;
    }

    .demo-feedback > p,
    .demo-explanation p {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.55;
    }

    .demo-feedback.success {
      border-color: rgba(34, 197, 94, 0.42);
      background: rgba(34, 197, 94, 0.09);
    }

    .demo-feedback.warning {
      border-color: rgba(248, 113, 113, 0.38);
      background: rgba(248, 113, 113, 0.08);
    }

    .demo-feedback.info {
      border-color: rgba(14, 165, 233, 0.4);
      background: rgba(14, 165, 233, 0.08);
    }

    .demo-feedback.empty {
      border-color: rgba(245, 158, 11, 0.38);
      background: rgba(245, 158, 11, 0.08);
    }

    .demo-explanation {
      display: grid;
      gap: 0.35rem;
      margin-top: 0.35rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
    }

    .demo-explanation span {
      color: #bae6fd;
      font-size: 0.78rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .demo-controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(43, 53, 69, 0.72);
    }

    .demo-nav {
      justify-content: flex-end;
    }

    .demo-finish {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.75rem;
      padding: 1.25rem;
      border: 1px solid rgba(34, 197, 94, 0.26);
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(14, 165, 233, 0.08));
    }

    .demo-finish h2 {
      margin: 0.25rem 0 0.35rem;
      font-size: 1.45rem;
    }

    .demo-finish p {
      max-width: 760px;
      color: var(--text-secondary);
      line-height: 1.55;
      margin: 0;
    }

    .demo-finish-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 0.9rem;
    }

    .demo-finish-stats span {
      padding: 0.52rem 0.7rem;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.28);
      color: var(--text-secondary);
      font-size: 0.88rem;
      font-weight: 800;
    }

    .demo-finish-stats strong {
      color: var(--text-primary);
    }

    .demo-finish-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }

    @media (max-width: 900px) {
      .demo-hero-grid,
      .demo-workspace {
        grid-template-columns: minmax(0, 1fr);
      }

      .demo-side {
        position: static;
      }
    }

    @media (max-width: 640px) {
      .demo-page {
        padding-top: 3rem;
        overflow-x: hidden;
      }

      .demo-hero {
        padding-top: 1rem;
      }

      .demo-copy h1 {
        font-size: 2rem;
      }

      .demo-hero-grid,
      .demo-workspace,
      .demo-copy,
      .demo-card,
      .demo-map,
      .demo-side {
        max-width: 100%;
        overflow-x: hidden;
      }

      .demo-hero .container,
      .demo-workspace.container {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .demo-lead,
      .demo-map p,
      .demo-map li p,
      .demo-side p {
        max-width: calc(100vw - 2rem);
      }

      .demo-badges,
      .demo-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .demo-badges span,
      .demo-actions .btn,
      .demo-controls .btn,
      .demo-finish-actions .btn {
        width: 100%;
        justify-content: center;
        text-align: center;
        white-space: normal;
      }

      .demo-proof {
        max-width: calc(100vw - 2rem);
      }

      .score-stats,
      .demo-controls,
      .demo-finish,
      .demo-finish-stats,
      .demo-finish-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .match-row,
      .question-top {
        grid-template-columns: 1fr;
      }

      .question-top {
        display: grid;
      }

      .question-count {
        width: max-content;
      }
    }

    .demo-extension-warning {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-top: 1.5rem;
      padding: 1.25rem 1.5rem;
      border: 1px solid rgba(234, 179, 8, 0.3);
      background: rgba(234, 179, 8, 0.04);
      border-radius: 8px;
      text-align: left;
    }
    .demo-extension-warning h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #fef08a;
      margin: 0 0 0.25rem;
    }
    .demo-extension-warning p {
      font-size: 0.925rem;
      color: var(--text-secondary);
      line-height: 1.45;
      margin: 0;
    }
    .warning-icon {
      font-size: 1.5rem;
      line-height: 1;
    }
    .cta-store-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
  `]
})
export class DemoComponent implements OnInit, OnDestroy {
  protected locale: Locale = 'en';
  protected readonly storeUrl = CHROME_WEB_STORE_URL;

  protected getExtensionWarning(): { title: string; text: string } {
    const warnings: Record<Locale, { title: string; text: string }> = {
      en: {
        title: 'Chrome Extension Required',
        text: 'To test this interactive demo, you must have the official QuizSolver Chrome extension installed and active. Download it directly from the Chrome Web Store.'
      },
      pl: {
        title: 'Wymagane rozszerzenie Chrome',
        text: 'Aby przetestować to interaktywne demo, musisz mieć zainstalowane i włączone oficjalne rozszerzenie QuizSolver. Pobierz je bezpośrednio z Chrome Web Store.'
      },
      de: {
        title: 'Chrome-Erweiterung erforderlich',
        text: 'Um diese interaktive Demo zu testen, müssen Sie die offizielle QuizSolver-Chrome-Erweiterung installiert und aktiviert haben. Laden Sie sie direkt aus dem Chrome Web Store herunter.'
      },
      es: {
        title: 'Se requiere la extensión de Chrome',
        text: 'Para probar este demo interactivo, debes tener instalada y activada la extensión oficial de Chrome de QuizSolver. Descárgala directamente desde Chrome Web Store.'
      },
      fr: {
        title: 'Extension Chrome requise',
        text: 'Pour tester cette démo interactive, vous devez avoir installé et activé l’extension Chrome officielle de QuizSolver. Téléchargez-la directement depuis le Chrome Web Store.'
      },
      it: {
        title: 'Estensione Chrome richiesta',
        text: 'Per testare questa demo interattiva, devi avere installata e attiva l’estensione ufficiale Chrome di QuizSolver. Scaricala direttamente dal Chrome Web Store.'
      },
      uk: {
        title: 'Необхідно встановити розширення Chrome',
        text: 'Щоб протестувати це інтерактивне демо, у вас має бути встановлене та увімкнене офіційне розширення QuizSolver для Chrome. Завантажте його безкоштовно з Chrome Web Store.'
      }
    };
    if (this.locale === 'pl') {
      return {
        title: 'Wymagane rozszerzenie Chrome',
        text: 'Aby przetestować demo razem z prawdziwym popupem QuizSolver, zainstaluj i włącz oficjalne rozszerzenie Chrome.'
      };
    }
    return warnings[this.locale] || warnings.en;
  }

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
    return this.copy.labels?.[key] || DEFAULT_DEMO_LABELS[key];
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

  protected progressPercent(): number {
    return Math.round((this.answeredCount() / Math.max(1, this.copy.questions.length)) * 100);
  }

  protected accuracyPercent(): number {
    const answered = this.answeredCount();
    return answered ? Math.round((this.score() / answered) * 100) : 0;
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
      this.resetAnswers();
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
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
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
