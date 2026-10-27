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
  solvedVia?: 'solve' | 'hint' | 'selected' | 'focusscan';
}

interface DemoMethodCard {
  badge: string;
  title: string;
  desc: string;
  actionLabel?: string;
  actionType?: 'overlay' | 'focusscan' | 'tour';
  tourAttr: string;
}

interface DemoOnboardingUiCopy {
  extDetected: string;
  extMissing: string;
  pinReminderTitle: string;
  pinReminderText: string;
  methodsHeading: string;
  methodsSub: string;
  methods: DemoMethodCard[];
  missionBadge: string;
  cornerPointer: string;
  openOverlayBtn: string;
  focusScanBtn: string;
  solvedByExtension: string;
  solvedBySelected: string;
  solvedByFocusScan: string;
  hintActivatedMsg: string;
  stepGuides: Record<DemoQuestionType, string>;
}

const DEFAULT_DEMO_LABELS: DemoLabels = {
  quizMeta: 'Live extension training',
  scoreLabel: 'Score',
  answeredLabel: 'Answered',
  accuracyLabel: 'Accuracy',
  checkAnswer: 'Check my answer',
  showHint: '💡 Hint mode',
  simulateSolver: '✨ Solved with QuizSolver extension',
  resetAnswers: 'Restart quiz',
  correctTitle: 'Correct answer',
  wrongTitle: 'Not quite right',
  emptyTitle: 'Use the extension or choose an answer first',
  hintTitle: 'QuizSolver Hint Mode active',
  explanationLabel: 'Why this answer works',
  resultTitle: 'You mastered the QuizSolver extension!',
  resultText: 'You practiced single-question solving, discreet Hint mode, text inputs, dropdown matching, selected text, and FocusScan. Remember to log in inside the extension popup before your real quiz!',
  finalPrimary: 'Install Chrome Extension',
  finalSecondary: 'Restart training',
  sideTitle: 'QuizSolver in action',
  sideText: 'Practice using the real Chrome extension.'
};

const ONBOARDING_UI_COPY: { pl: DemoOnboardingUiCopy; en: DemoOnboardingUiCopy } = {
  pl: {
    extDetected: 'Wtyczka QuizSolver jest aktywna — przetestuj ją na pytaniach poniżej (0 kredytów)',
    extMissing: 'Zainstaluj i włącz wtyczkę QuizSolver w Chrome, aby rozwiązywać pytania poniżej',
    pinReminderTitle: 'Ważne przed pierwszym prawdziwym testem (żeby wtyczka działała od razu):',
    pinReminderText: '1) Kliknij ikonę puzzli 🧩 w prawym górnym rogu Chrome i przypnij pinezką 📌 QuizSolver. 2) Kliknij ikonę wtyczki i ZALOGUJ SIĘ na swoje konto — na tej stronie demo odpowiedzi kosztują 0 kredytów, ale na prawdziwych testach wymagane jest zalogowane konto z darmowymi kredytami startowymi!',
    methodsHeading: '3 sposoby uruchamiania wtyczki na każdym teście',
    methodsSub: 'Na prawdziwych quizach nie ma przycisków strony — używasz bezpośrednio rozszerzenia QuizSolver jednym z tych 3 sposobów:',
    methods: [
      {
        badge: 'Sposób 1 · Najszybszy',
        title: 'Przycisk „✨ Rozwiąż” w rogu pytania lub Alt+Shift+Q',
        desc: 'Na stronach testów (Testportal, Moodle, Forms, Edupage) wtyczka sama dodaje mały przycisk „✨ Rozwiąż” w prawym górnym rogu wykrytego pytania. Możesz też rozwiązać całą stronę naraz z ikony wtyczki (Alt+Shift+Q).',
        actionLabel: '🎯 Pokaż w tutorialu',
        actionType: 'tour',
        tourAttr: 'method-1'
      },
      {
        badge: 'Sposób 2 · Bez klikania w pasek',
        title: 'Pływający panel na stronie — Quick Overlay (Alt+Q)',
        desc: 'Naciśnij skrót Alt+Q (lub kliknij przycisk poniżej), aby otworzyć podręczne okienko bezpośrednio na ekranie testu. W tym okienku jednym kliknięciem włączysz też dyskretny Tryb ukryty (Hint mode).',
        actionLabel: '⚡ Otwórz panel Alt+Q teraz',
        actionType: 'overlay',
        tourAttr: 'method-2'
      },
      {
        badge: 'Sposób 3 · Na obrazki i trudne strony',
        title: 'FocusScan (Alt+S) lub zaznaczony tekst',
        desc: 'Gdy pytanie jest na obrazku, w PDF-ie, prezentacji albo strona ma nietypowy układ i zwykły parser go nie widzi: naciśnij Alt+S i obrysuj pytanie myszką (FocusScan) albo zaznacz tekst pytania i użyj panelu Alt+Q.',
        actionLabel: '🎯 Wypróbuj FocusScan (Alt+S)',
        actionType: 'focusscan',
        tourAttr: 'method-3'
      }
    ],
    missionBadge: '🎯 Zadanie dla Ciebie (użyj prawdziwej wtyczki)',
    cornerPointer: 'Kliknij przycisk „✨ Rozwiąż” w rogu karty ↗',
    openOverlayBtn: '⚡ Otwórz panel wtyczki (Alt+Q)',
    focusScanBtn: '🎯 Uruchom FocusScan (Alt+S)',
    solvedByExtension: '✅ Rozwiązane prawdziwą wtyczką QuizSolver',
    solvedBySelected: '✅ Rozwiązane z zaznaczonego tekstu (Alt+Q)',
    solvedByFocusScan: '✅ Rozwiązane przez wycinek ekranu FocusScan (Alt+S)',
    hintActivatedMsg: 'Wtyczka podświetliła poprawną odpowiedź w trybie Hint mode! Teraz kliknij wskazaną opcję powyżej.',
    stepGuides: {
      radio: 'Kliknij prawdziwy przycisk „✨ Rozwiąż” w prawym górnym rogu tej karty (wstrzyknięty przez wtyczkę) albo kliknij „Rozwiąż bieżącą stronę” w pływającym okienku Alt+Q.',
      hidden: 'Otwórz pływające okienko Alt+Q (w prawym dolnym rogu ekranu), włącz przełącznik „Tryb ukryty (Hint mode)”, a następnie kliknij „✨ Rozwiąż”. Wtyczka dyskretnie wskaże odpowiedź bez automatycznego klikania!',
      text: 'Wyłącz Tryb ukryty w okienku Alt+Q i kliknij „✨ Rozwiąż” w prawym górnym rogu pytania. Zobacz, jak wtyczka sama wpisuje wynik (96) prosto w pole tekstowe.',
      matching: 'Kliknij „✨ Rozwiąż” w prawym górnym rogu karty lub w okienku Alt+Q. Rozszerzenie automatycznie dopasuje wszystkie 3 pojęcia w listach rozwijanych naraz.',
      selected: 'Kliknij „✂️ Zaznacz tekst pytania” poniżej (lub zaznacz go myszką), a potem w okienku Alt+Q kliknij „Rozwiąż zaznaczony tekst”. Możesz też kliknąć „🎯 Uruchom FocusScan (Alt+S)” i obrysować pytanie ramką!'
    }
  },
  en: {
    extDetected: 'QuizSolver extension is active — test it on the questions below (0 credits used)',
    extMissing: 'Install & enable the QuizSolver Chrome extension to solve the questions below',
    pinReminderTitle: 'Important before your first real quiz (so it works right away):',
    pinReminderText: '1) Click the puzzle icon 🧩 in Chrome’s top-right corner and pin 📌 QuizSolver. 2) Open the extension icon and LOG IN to your account — this demo page costs 0 credits, but real quiz sites require a logged-in account with your free starter credits!',
    methodsHeading: '3 ways to use QuizSolver on any real test',
    methodsSub: 'Real quiz pages don’t have built-in solve buttons — you trigger the QuizSolver extension directly using one of these 3 methods:',
    methods: [
      {
        badge: 'Method 1 · Fastest',
        title: '“✨ Solve” button in the question corner or Alt+Shift+Q',
        desc: 'On standard quiz sites (Moodle, Forms, Canvas, Testportal), the extension injects a small “✨ Solve” button in the top-right corner of each detected question. Or press Alt+Shift+Q to solve the whole page.',
        actionLabel: '🎯 Show in tutorial',
        actionType: 'tour',
        tourAttr: 'method-1'
      },
      {
        badge: 'Method 2 · On-screen panel',
        title: 'Floating Quick Overlay on the page (Alt+Q)',
        desc: 'Press Alt+Q (or click the button below) to open a movable mini-panel right on the test page without touching the browser toolbar. You can also toggle discreet Hint mode right inside it.',
        actionLabel: '⚡ Open Alt+Q panel now',
        actionType: 'overlay',
        tourAttr: 'method-2'
      },
      {
        badge: 'Method 3 · Images & hard pages',
        title: 'FocusScan (Alt+S) or Selected Text',
        desc: 'If a question is inside an image, PDF, presentation, or unusual layout where auto-detect fails: press Alt+S and drag a box around the question (FocusScan), or highlight the text and use Alt+Q.',
        actionLabel: '🎯 Try FocusScan (Alt+S)',
        actionType: 'focusscan',
        tourAttr: 'method-3'
      }
    ],
    missionBadge: '🎯 Your Mission (use the real extension)',
    cornerPointer: 'Click the “✨ Solve” button in the card corner ↗',
    openOverlayBtn: '⚡ Open extension panel (Alt+Q)',
    focusScanBtn: '🎯 Launch FocusScan (Alt+S)',
    solvedByExtension: '✅ Solved with the real QuizSolver extension',
    solvedBySelected: '✅ Solved via Selected Text (Alt+Q)',
    solvedByFocusScan: '✅ Solved via FocusScan screen capture (Alt+S)',
    hintActivatedMsg: 'The extension highlighted the clue in Hint mode! Now click the highlighted option above.',
    stepGuides: {
      radio: 'Click the real “✨ Solve” button in the top-right corner of this card (injected by the extension) or click “Solve current page” in the floating Alt+Q overlay.',
      hidden: 'In the floating Alt+Q panel (bottom-right of your screen), turn ON the “Hidden mode (Hint)” switch, then click “✨ Solve”. The extension will discreetly highlight the answer without clicking for you!',
      text: 'Turn OFF Hidden mode in the Alt+Q panel and click “✨ Solve” in the top-right corner of the question. Watch the extension type the result (96) directly into the input box.',
      matching: 'Click “✨ Solve” in the top-right corner of the card or inside the Alt+Q panel. The extension will match all 3 dropdown definitions simultaneously.',
      selected: 'Click “✂️ Select question text” below (or highlight it with your mouse), then click “Solve selected text” in the Alt+Q panel. Or click “🎯 Launch FocusScan (Alt+S)” and drag a box around the question!'
    }
  }
};

const COPY: Partial<Record<Locale, DemoCopy>> & { en: DemoCopy; pl: DemoCopy } = {
  en: {
    eyebrow: 'Interactive Extension Training · 0 Credits Used',
    title: 'Learn how to use QuizSolver in 60 seconds',
    lead: 'Practice using the real Chrome extension on 5 question formats: multiple choice, discreet Hint mode, typed inputs, matching dropdowns, and Selected Text / FocusScan.',
    install: 'Install extension',
    openStore: 'Open Chrome Web Store',
    demoBadge: 'No credits used',
    localBadge: 'Real extension training',
    mapTitle: 'How to use this demo',
    mapText: 'Use the "✨ Solve" button in the top-right corner of the question card, the floating Alt+Q panel at the bottom-right, or FocusScan (Alt+S).',
    prev: 'Previous',
    next: 'Next question',
    restart: 'Restart training',
    startTour: 'Interactive tour',
    selectText: '✂️ Select question text',
    selectedTip: 'After selecting the question text, click "Solve selected text" in the floating Alt+Q panel (or right-click menu).',
    yourAnswer: 'Your answer',
    chooseOption: 'Choose',
    popupTitle: 'Popup flow',
    popupSteps: [
      'Click ✨ Solve in the top-right corner of the question or Solve current page in Alt+Q.',
      'Turn on Hidden mode (Hint) in Alt+Q before solving to see a subtle clue instead of an automatic click.',
      'Use the text example to see how typed answers are filled automatically.',
      'Use dropdown matching to test LMS multiple select fields.',
      'Highlight question text with Alt+Q or drag a box with FocusScan (Alt+S).'
    ],
    labels: {
      quizMeta: 'Safe test quiz',
      resultText: 'You practiced choices, hint mode, typed answers, matching fields, selected text, and FocusScan without spending credits.',
      simulateSolver: '✨ Solved with QuizSolver extension',
      showHint: '💡 Hint mode',
      checkAnswer: 'Check my answer manually'
    },
    proofItems: ['Works without credits on this demo', 'Teaches real extension shortcuts (Alt+Q / Alt+S)', 'Built to match real quiz layouts'],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Step 1 of 5 · Multiple Choice',
        title: 'Biology multiple choice',
        instruction: 'Click the "✨ Solve" button in the top-right corner of this card (or inside the extension popup / Alt+Q) to select the correct answer automatically.',
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
        instruction: 'Turn on "Hidden mode (Hint)" inside the extension popup (or Alt+Q panel) and click "✨ Solve" — the extension will discreetly highlight the clue instead of clicking.',
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
        instruction: 'Click "✨ Solve" in the top-right corner of the card — QuizSolver will type the result directly into the input field.',
        question: 'What is the value of 12 x 8?',
        placeholder: 'Click ✨ Solve in the corner (or type your answer)',
        correctText: '96',
        hint: 'Break it into 10 x 8 plus 2 x 8.',
        explanation: '12 x 8 equals 96 because 10 x 8 is 80 and 2 x 8 is 16, giving 96 together.'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Step 4 of 5 · Dropdowns',
        title: 'Science matching dropdowns',
        instruction: 'Click "✨ Solve" in the top-right corner of the card — the extension will match all 3 dropdown definitions at once.',
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
        kicker: 'Step 5 of 5 · Selected Text & FocusScan',
        title: 'Selected text & FocusScan (Alt+S)',
        instruction: 'Highlight the question text and click "Solve selected text" in the Alt+Q panel, or press Alt+S (FocusScan) and drag a box around the question.',
        question: 'Which QuizSolver action is best when a messy page contains extra text around the actual question?',
        options: ['Solve selected text', 'Credit checkout', 'Admin panel', 'Browser history'],
        correctText: 'Solve selected text',
        hint: 'Use the action that works only on the text you highlighted.',
        explanation: 'Solve selected text (Alt+Q) and FocusScan (Alt+S) let you target only the exact question on complex pages or images.'
      }
    ]
  },
  pl: {
    eyebrow: 'Interaktywne Demo · 0 zużytych kredytów',
    title: 'Przetestuj QuizSolver w 60 sekund',
    lead: 'Przeklikaj 5 realnych przykładów: od pytań ABCD, przez dyskretny Hint mode, po wpisywanie tekstu, listy rozwijane oraz FocusScan (Alt+S).',
    install: 'Zainstaluj rozszerzenie',
    openStore: 'Otwórz Chrome Web Store',
    demoBadge: '0 kredytów',
    localBadge: 'Trening wtyczki',
    mapTitle: 'Jak korzystać z tego demo?',
    mapText: 'Kliknij przycisk „✨ Rozwiąż” w prawym górnym rogu pytania, użyj ikony wtyczki w przeglądarce lub skrótów Alt+Q / Alt+S.',
    prev: 'Poprzednie',
    next: 'Następne pytanie',
    restart: 'Zacznij od nowa',
    startTour: 'Uruchom przewodnik',
    selectText: '✂️ Zaznacz tekst pytania',
    selectedTip: 'Po zaznaczeniu tekstu kliknij „Rozwiąż zaznaczony tekst” w oknie wtyczki lub panelu Alt+Q.',
    yourAnswer: 'Twoja odpowiedź',
    chooseOption: 'Wybierz opcję',
    popupTitle: 'QuizSolver w akcji',
    popupSteps: [
      'Automatyczne zaznaczanie poprawnej odpowiedzi przyciskiem ✨ Rozwiąż',
      'Dyskretna podpowiedź zamiast kliknięcia (Tryb ukryty / Hint mode)',
      'Wpisywanie odpowiedzi w pola tekstowe',
      'Dopasowywanie wartości w listach rozwijanych (selectach)',
      'Zaznaczony tekst (Alt+Q) i wycinek ekranu FocusScan (Alt+S)'
    ],
    labels: {
      quizMeta: 'Testowy quiz demo',
      scoreLabel: 'Wynik',
      answeredLabel: 'Ukończone',
      accuracyLabel: 'Skuteczność',
      checkAnswer: 'Sprawdź moją odpowiedź',
      showHint: '💡 Tryb podpowiedzi (Hint mode)',
      simulateSolver: '✨ Rozwiązane wtyczką QuizSolver',
      resetAnswers: 'Zacznij od nowa',
      correctTitle: 'Świetnie! Poprawna odpowiedź',
      wrongTitle: 'Nie do końca poprawnie',
      emptyTitle: 'Użyj wtyczki (✨ Rozwiąż) lub zaznacz odpowiedź',
      hintTitle: 'Tryb podpowiedzi (Hint mode) aktywny',
      explanationLabel: 'Dlaczego to działa',
      resultTitle: 'Gratulacje! Umiesz już korzystać z QuizSolver',
      resultText: 'Przetestowałeś wszystkie 5 trybów działania rozszerzenia bez zużywania kredytów.',
      finalPrimary: 'Dodaj QuizSolver do Chrome',
      finalSecondary: 'Uruchom demo ponownie',
      sideTitle: 'Co robi QuizSolver',
      sideText: 'QuizSolver błyskawicznie analizuje stronę i wskazuje właściwą odpowiedź.'
    },
    proofItems: ['Bezpieczny trening (0 kredytów)', 'Uczy prawdziwych skrótów (Alt+Q i Alt+S)', 'Wsparcie dla wszystkich formatów pytań'],
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Krok 1 z 5 · Jednokrotny wybór',
        title: 'Biologia: jednokrotny wybór',
        instruction: 'Kliknij przycisk „✨ Rozwiąż” w prawym górnym rogu tej karty (lub w ikonie wtyczki / panelu Alt+Q), aby automatycznie zaznaczyć poprawną odpowiedź.',
        question: 'Które organellum odpowiada głównie za produkcję ATP w komórkach eukariotycznych?',
        options: ['Jądro komórkowe', 'Mitochondrium', 'Rybosom', 'Błona komórkowa'],
        correctText: 'Mitochondrium',
        hint: 'Szukaj organellum nazywanego często elektrownią komórki.',
        explanation: 'Mitochondria przeprowadzają oddychanie komórkowe i wytwarzają większość ATP, czyli podstawowego nośnika energii w komórkach eukariotycznych.'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Krok 2 z 5 · Tryb podpowiedzi (Hint mode)',
        title: 'Historia: tryb podpowiedzi (Hint mode)',
        instruction: 'Włącz „Tryb ukryty (Hint mode)” w oknie wtyczki (lub panelu Alt+Q) i kliknij „✨ Rozwiąż” – rozszerzenie dyskretnie podświetli wskazówkę zamiast klikać za Ciebie.',
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
        instruction: 'Kliknij „✨ Rozwiąż” w prawym górnym rogu karty – QuizSolver automatycznie wpisze wynik bezpośrednio do pola tekstowego.',
        question: 'Ile wynosi 12 x 8?',
        placeholder: 'Kliknij „✨ Rozwiąż” w rogu karty (lub wpisz liczbę)',
        correctText: '96',
        hint: 'Rozbij działanie na (10 x 8) + (2 x 8).',
        explanation: '12 x 8 = 96, ponieważ 10 x 8 daje 80, a 2 x 8 daje 16. Razem to 96.'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Krok 4 z 5 · Dopasowanie w selectach',
        title: 'Nauka: listy wyboru i dopasowanie',
        instruction: 'Kliknij „✨ Rozwiąż” w prawym górnym rogu karty – rozszerzenie dopasuje wszystkie odpowiedzi w listach rozwijanych naraz.',
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
        kicker: 'Krok 5 z 5 · Zaznaczony tekst i FocusScan (Alt+S)',
        title: 'Zaznaczony tekst (Alt+Q) i FocusScan (Alt+S)',
        instruction: 'Zaznacz fragment tekstu poniżej i kliknij „Rozwiąż zaznaczony tekst” w panelu Alt+Q albo naciśnij Alt+S (FocusScan) i obrysuj pytanie myszką.',
        question: 'Która akcja QuizSolver najlepiej sprawdza się, gdy strona ma dużo dodatkowego tekstu wokół właściwego pytania?',
        options: ['Rozwiąż zaznaczony tekst', 'Płatność za kredyty', 'Panel admina', 'Historia przeglądarki'],
        correctText: 'Rozwiąż zaznaczony tekst',
        hint: 'Wybierz akcję, która pracuje tylko na zaznaczonym fragmencie tekstu.',
        explanation: 'Rozwiąż zaznaczony tekst (Alt+Q) oraz FocusScan (Alt+S) pozwalają wskazać wtyczce dokładne pytanie na każdej stronie.'
      }
    ]
  }
};

const DEMO_LOCALE_COPY: Record<Exclude<Locale, 'en' | 'pl'>, Omit<DemoCopy, 'questions'>> = {
  de: {
    eyebrow: 'Interaktives Erweiterungs-Training',
    title: 'Lerne QuizSolver in 60 Sekunden kennen',
    lead: 'Teste die echte Chrome-Erweiterung an 5 Fragetypen. Diese Seite verbraucht keine Credits.',
    install: 'Erweiterung installieren',
    openStore: 'Chrome Web Store öffnen',
    demoBadge: 'Keine Credits',
    localBadge: 'Echtes Erweiterungs-Training',
    mapTitle: 'So nutzt du die Demo',
    mapText: 'Klicke oben rechts in der Fragekarte auf „✨ Lösen“, nutze das schwebende Alt+Q-Panel oder FocusScan (Alt+S).',
    prev: 'Zurück',
    next: 'Nächste Frage',
    restart: 'Training neu starten',
    startTour: 'Tutorial starten',
    selectText: '✂️ Text markieren',
    selectedTip: 'Markiere den Fragetext und klicke im Alt+Q-Panel auf „Markierten Text lösen“.',
    yourAnswer: 'Deine Antwort',
    chooseOption: 'Auswählen',
    popupTitle: 'Popup-Ablauf',
    popupSteps: ['Einzelauswahl', 'Hinweis-Modus', 'Texteingabe', 'Dropdown-Zuordnung', 'Quick Overlay & FocusScan']
  },
  es: {
    eyebrow: 'Entrenamiento interactivo · 0 créditos',
    title: 'Aprende a usar QuizSolver en 60 segundos',
    lead: 'Practica con la extensión real de Chrome en 5 formatos de pregunta. Esta página no consume créditos.',
    install: 'Instalar extensión',
    openStore: 'Abrir Chrome Web Store',
    demoBadge: 'Sin créditos',
    localBadge: 'Entrenamiento real',
    mapTitle: 'Cómo usar este entrenamiento',
    mapText: 'Usa el botón «✨ Resolver» en la esquina superior derecha de la pregunta, el panel flotante Alt+Q o FocusScan (Alt+S).',
    prev: 'Anterior',
    next: 'Siguiente pregunta',
    restart: 'Reiniciar',
    startTour: 'Iniciar tutorial',
    selectText: '✂️ Seleccionar texto',
    selectedTip: 'Selecciona el texto y pulsa «Resolver texto seleccionado» en el panel Alt+Q.',
    yourAnswer: 'Tu respuesta',
    chooseOption: 'Elegir',
    popupTitle: 'Flujo del popup',
    popupSteps: ['Opción única', 'Modo pista', 'Respuesta escrita', 'Emparejar menús', 'Quick Overlay y FocusScan']
  },
  fr: {
    eyebrow: 'Entraînement interactif · 0 crédit',
    title: 'Apprenez à utiliser QuizSolver en 60 secondes',
    lead: 'Testez la vraie extension Chrome sur 5 formats de questions. Cette page ne consomme pas de crédits.',
    install: 'Installer l’extension',
    openStore: 'Ouvrir Chrome Web Store',
    demoBadge: 'Aucun crédit',
    localBadge: 'Entraînement réel',
    mapTitle: 'Utiliser cette démo',
    mapText: 'Cliquez sur « ✨ Résoudre » en haut à droite de la carte, utilisez le panneau flottant Alt+Q ou FocusScan (Alt+S).',
    prev: 'Précédent',
    next: 'Question suivante',
    restart: 'Recommencer',
    startTour: 'Lancer le tutoriel',
    selectText: '✂️ Sélectionner le texte',
    selectedTip: 'Sélectionnez le texte et cliquez sur « Résoudre le texte sélectionné » dans le panneau Alt+Q.',
    yourAnswer: 'Votre réponse',
    chooseOption: 'Choisir',
    popupTitle: 'Flux du popup',
    popupSteps: ['Choix unique', 'Mode indice', 'Réponse saisie', 'Association déroulante', 'Quick Overlay & FocusScan']
  },
  it: {
    eyebrow: 'Training interattivo · 0 crediti',
    title: 'Impara a usare QuizSolver in 60 secondi',
    lead: 'Prova la vera estensione Chrome su 5 formati di domande. Questa pagina non consuma crediti.',
    install: 'Installa estensione',
    openStore: 'Apri Chrome Web Store',
    demoBadge: 'Nessun credito',
    localBadge: 'Training reale',
    mapTitle: 'Come usare la demo',
    mapText: 'Clicca su «✨ Risolvi» in alto a destra nella domanda, usa il pannello flottante Alt+Q o FocusScan (Alt+S).',
    prev: 'Precedente',
    next: 'Domanda successiva',
    restart: 'Riavvia demo',
    startTour: 'Avvia tutorial',
    selectText: '✂️ Seleziona testo',
    selectedTip: 'Seleziona il testo della domanda e usa il pannello Alt+Q.',
    yourAnswer: 'La tua risposta',
    chooseOption: 'Scegli',
    popupTitle: 'Flusso popup',
    popupSteps: ['Scelta singola', 'Hint mode', 'Risposta scritta', 'Menu a tendina', 'Quick Overlay & FocusScan']
  },
  uk: {
    eyebrow: 'Інтерактивне тренування · 0 кредитів',
    title: 'Навчіться користуватися QuizSolver за 60 секунд',
    lead: 'Протестуйте справжнє розширення Chrome на 5 типах питань. Ця сторінка не витрачає кредити.',
    install: 'Встановити розширення',
    openStore: 'Відкрити Chrome Web Store',
    demoBadge: 'Без кредитів',
    localBadge: 'Тренування розширення',
    mapTitle: 'Як користуватися демо',
    mapText: 'Натискайте кнопку «✨ Вирішити» у правому верхньому кутку питання, панель Alt+Q або FocusScan (Alt+S).',
    prev: 'Назад',
    next: 'Наступне питання',
    restart: 'Почати заново',
    startTour: 'Запустити туторіал',
    selectText: '✂️ Виділити текст',
    selectedTip: 'Виділіть текст питання і скористайтесь панеллю Quick Overlay (Alt+Q).',
    yourAnswer: 'Твоя відповідь',
    chooseOption: 'Вибери',
    popupTitle: 'Popup flow',
    popupSteps: ['Один варіант', 'Hint mode', 'Текстова відповідь', 'Matching', 'Quick Overlay & FocusScan']
  },
  pt: {
    eyebrow: 'Treinamento interativo · 0 créditos',
    title: 'Aprenda a usar o QuizSolver em 60 segundos',
    lead: 'Pratique com a extensão real do Chrome em 5 formatos de perguntas. Esta página não consome créditos.',
    install: 'Instalar extensão',
    openStore: 'Abrir Chrome Web Store',
    demoBadge: 'Sem créditos',
    localBadge: 'Treinamento real',
    mapTitle: 'Como usar a demonstração',
    mapText: 'Use o botão «✨ Resolver» no canto superior direito da questão, o painel flutuante Alt+Q ou o FocusScan (Alt+S).',
    prev: 'Anterior',
    next: 'Próxima pergunta',
    restart: 'Reiniciar demonstração',
    startTour: 'Iniciar tutorial',
    selectText: '✂️ Selecionar texto',
    selectedTip: 'Selecione o texto da pergunta e use o painel Quick Overlay (Alt+Q).',
    yourAnswer: 'Sua resposta',
    chooseOption: 'Escolher',
    popupTitle: 'Fluxo do popup',
    popupSteps: ['Múltipla escolha', 'Modo Dica', 'Resposta escrita', 'Associação em lista', 'Quick Overlay e FocusScan']
  },
  ar: {
    eyebrow: 'تدريب تفاعلي · بدون رصيد',
    title: 'تعلم استخدام QuizSolver في 60 ثانية',
    lead: 'جرب إضافة Chrome الحقيقية على 5 أنواع من الأسئلة. هذه الصفحة لا تستهلك أي أرصدة.',
    install: 'تثبيت الإضافة',
    openStore: 'فتح سوق Chrome الإلكتروني',
    demoBadge: 'مجاني تماماً',
    localBadge: 'تدريب عملي',
    mapTitle: 'كيفية استخدام العرض التجريبي',
    mapText: 'استخدم زر «✨ حل» في الزاوية العلوية للسؤال، أو اللوحة العائمة Alt+Q، أو FocusScan (Alt+S).',
    prev: 'السابق',
    next: 'السؤال التالي',
    restart: 'إعادة تشغيل العرض',
    startTour: 'بدء الجولة الإرشادية',
    selectText: '✂️ تحديد النص',
    selectedTip: 'حدد نص السؤال واستخدم النافذة العائمة السريعة (Alt+Q).',
    yourAnswer: 'إجابتك',
    chooseOption: 'اختر',
    popupTitle: 'خطوات النافذة المنبثقة',
    popupSteps: ['اختيار من متعدد', 'وضع التلميح', 'إجابة نصية', 'المطابقة', 'النافذة العائمة السريعة']
  },
  tr: {
    eyebrow: 'Etkileşimli Alıştırma · 0 Kredi',
    title: 'QuizSolver’ı 60 saniyede kullanmayı öğrenin',
    lead: 'Gerçek Chrome uzantısını 5 soru formatında test edin. Bu sayfa kredi harcamaz.',
    install: 'Uzantıyı yükle',
    openStore: 'Chrome Web Mağazası’nı aç',
    demoBadge: 'Kredi harcanmaz',
    localBadge: 'Gerçek uzantı eğitimi',
    mapTitle: 'Demoyu nasıl kullanabilirsiniz?',
    mapText: 'Soru kartının sağ üst köşesindeki "✨ Çöz" düğmesini, Alt+Q panelini veya FocusScan’i (Alt+S) kullanın.',
    prev: 'Önceki',
    next: 'Sonraki soru',
    restart: 'Demoyu yeniden başlat',
    startTour: 'Rehberi başlat',
    selectText: '✂️ Metni seç',
    selectedTip: 'Sadece soru metnini seçin ve Hızlı Katman (Alt+Q) ile çözün.',
    yourAnswer: 'Cevabınız',
    chooseOption: 'Seçin',
    popupTitle: 'Açılır pencere akışı',
    popupSteps: ['Çoktan seçmeli', 'İpucu modu', 'Yazılı cevap', 'Açılır menü eşleştirme', 'Hızlı Katman & FocusScan']
  },
  ja: {
    eyebrow: 'インタラクティブ体験 · クレジット消費0',
    title: '60秒でQuizSolverの使い方をマスター',
    lead: '実際のChrome拡張機能を使って5つの問題形式をテストできます。クレジットは消費されません。',
    install: '拡張機能をインストール',
    openStore: 'Chromeウェブストアを開く',
    demoBadge: 'クレジット消費なし',
    localBadge: '実践トレーニング',
    mapTitle: 'デモの使い方',
    mapText: '問題カードの右上にある「✨ 解く」ボタン、Alt+Qクイックオーバーレイ、またはFocusScan（Alt+S）を使用してください。',
    prev: '前へ',
    next: '次の問題',
    restart: '最初からやり直す',
    startTour: 'チュートリアルを開始',
    selectText: '✂️ 問題文を選択',
    selectedTip: '問題文だけを選択し、クイックオーバーレイ（Alt+Q）で解答します。',
    yourAnswer: 'あなたの回答',
    chooseOption: '選択してください',
    popupTitle: 'ポップアップの流れ',
    popupSteps: ['単一選択', 'ヒントモード', '記述式入力', 'ドロップダウン一致', 'クイックオーバーレイ']
  },
  ko: {
    eyebrow: '인터랙티브 온보딩 · 크레딧 0 소모',
    title: '60초 만에 QuizSolver 사용법 배우기',
    lead: '실제 Chrome 확장 프로그램으로 5가지 문제 유형을 직접 풀어보세요. 크레딧이 소모되지 않습니다.',
    install: '확장 프로그램 설치',
    openStore: 'Chrome 웹 스토어 열기',
    demoBadge: '크레딧 소모 없음',
    localBadge: '실전 확장 프로그램 연습',
    mapTitle: '데모 이용 방법',
    mapText: '문제 카드 우측 상단의 "✨ 풀기" 버튼, Alt+Q 퀵 오버레이 패널 또는 FocusScan(Alt+S)을 사용하세요.',
    prev: '이전',
    next: '다음 문제',
    restart: '처음부터 다시 시작',
    startTour: '튜토리얼 시작',
    selectText: '✂️ 문제 텍스트 선택',
    selectedTip: '문제 텍스트만 드래그하여 선택한 뒤 퀵 오버레이(Alt+Q)로 해결하세요.',
    yourAnswer: '내 답변',
    chooseOption: '선택하세요',
    popupTitle: '팝업 진행 단계',
    popupSteps: ['객관식 단일 선택', '힌트 모드', '텍스트 입력', '드롭다운 매칭', '퀵 오버레이']
  }
};

const DEMO_QUESTIONS: Record<Exclude<Locale, 'en' | 'pl'>, DemoQuestion[]> = {
  de: [
    { ...COPY.en.questions[0], kicker: 'Schritt 1 von 5', title: 'Biologie: Einzelauswahl', instruction: 'QuizSolver erkennt die Frage und wählt die richtige Option mit einem Klick.', question: 'Welches Organell produziert hauptsächlich ATP in eukaryotischen Zellen?', options: ['Zellkern', 'Mitochondrium', 'Ribosom', 'Zellmembran'], correctText: 'Mitochondrium' },
    { ...COPY.en.questions[1], kicker: 'Schritt 2 von 5', title: 'Hinweis-Modus', instruction: 'Nutze Hint mode im Alt+Q-Panel, wenn du eine diskrete Hilfe statt eines automatischen Klicks möchtest.', question: 'Welche Quelle ist das stärkste Beispiel für eine primäre historische Quelle?', options: ['Ein Lehrbuchkapitel', 'Ein während des Ereignisses geschriebenes Tagebuch', 'Eine moderne Dokumentation', 'Ein Lexikonartikel'], correctText: 'Ein während des Ereignisses geschriebenes Tagebuch' },
    { ...COPY.en.questions[2], kicker: 'Schritt 3 von 5', title: 'Mathe: Texteingabe', instruction: 'QuizSolver trägt Zahlen und kurze Texte fehlerfrei in Formularfelder ein.', question: 'Wie viel ist 12 x 8?', placeholder: 'Antwort eingeben', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Schritt 4 von 5', title: 'Naturwissenschaft: Dropdowns', instruction: 'Ordnet mehrere Begriffe gleichzeitig den passenden Definitionen zu.', question: 'Ordne jeden naturwissenschaftlichen Begriff der richtigen Definition zu.', prompts: ['Fotosynthese', 'Verdunstung', 'Gravitation'], options: ['Pflanzen bilden Glukose mit Licht', 'Flüssigkeit wird zu Gas', 'Kraft, die Objekte mit Masse anzieht'], correctText: 'Fotosynthese = Pflanzen bilden Glukose mit Licht, Verdunstung = Flüssigkeit wird zu Gas, Gravitation = Kraft, die Objekte mit Masse anzieht' },
    { ...COPY.en.questions[4], kicker: 'Schritt 5 von 5', title: 'Quick Overlay & FocusScan', instruction: 'Markiere nur den Fragetext und löse ihn gezielt per Quick Overlay (Alt+Q) oder FocusScan (Alt+S).', question: 'Welches QuizSolver-Werkzeug löst nur den markierten Fragetext?', options: ['Markierten Text lösen', 'Credit checkout', 'Admin panel', 'Browserverlauf'], correctText: 'Markierten Text lösen' }
  ],
  es: [
    { ...COPY.en.questions[0], kicker: 'Paso 1 de 5', title: 'Biología: opción única', instruction: 'QuizSolver analiza la pregunta y selecciona la respuesta correcta en un clic.', question: '¿Qué orgánulo produce principalmente ATP en las células eucariotas?', options: ['Núcleo celular', 'Mitocondria', 'Ribosoma', 'Membrana celular'], correctText: 'Mitocondria' },
    { ...COPY.en.questions[1], kicker: 'Paso 2 de 5', title: 'Modo pista', instruction: 'El modo pista no hace clic por ti: marca una pista sutil para que tú decidas.', question: '¿Qué fuente es el mejor ejemplo de evidencia histórica primaria?', options: ['Un capítulo de libro', 'Un diario escrito durante el evento', 'Un documental moderno', 'Un resumen de enciclopedia'], correctText: 'Un diario escrito durante el evento' },
    { ...COPY.en.questions[2], kicker: 'Paso 3 de 5', title: 'Matemáticas: respuesta escrita', instruction: 'QuizSolver completa números y respuestas de texto directamente en los formularios.', question: '¿Cuánto es 12 x 8?', placeholder: 'Escribe el número', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Paso 4 de 5', title: 'Ciencia: menús desplegables', instruction: 'Empareja múltiples opciones simultáneamente en menús desplegables.', question: 'Relaciona cada término científico con la definición correcta.', prompts: ['Fotosíntesis', 'Evaporación', 'Gravedad'], options: ['Las plantas producen glucosa con luz', 'El líquido cambia a gas', 'Fuerza que atrae objetos con masa'], correctText: 'Fotosíntesis = Las plantas producen glucosa con luz, Evaporación = El líquido cambia a gas, Gravedad = Fuerza que atrae objetos con masa' },
    { ...COPY.en.questions[4], kicker: 'Paso 5 de 5', title: 'Quick Overlay y FocusScan', instruction: 'Selecciona solo el texto de la pregunta y resuélvelo con Alt+Q o FocusScan (Alt+S).', question: '¿Qué herramienta de QuizSolver resuelve solo el texto seleccionado?', options: ['Resolver texto seleccionado', 'Pago de créditos', 'Panel admin', 'Historial del navegador'], correctText: 'Resolver texto seleccionado' }
  ],
  fr: [
    { ...COPY.en.questions[0], kicker: 'Étape 1 sur 5', title: 'Biologie : choix unique', instruction: 'QuizSolver détecte la question et coche la bonne réponse en un seul clic.', question: 'Quel organite produit principalement l’ATP dans les cellules eucaryotes ?', options: ['Noyau cellulaire', 'Mitochondrie', 'Ribosome', 'Membrane cellulaire'], correctText: 'Mitochondrie' },
    { ...COPY.en.questions[1], kicker: 'Étape 2 sur 5', title: 'Mode indice', instruction: 'Vous préférez décider vous-même ? Le mode indice donne un indice subtil.', question: 'Quelle source est le meilleur exemple de preuve historique primaire ?', options: ['Un chapitre de manuel', 'Un journal écrit pendant l’événement', 'Un documentaire moderne', 'Un article d’encyclopédie'], correctText: 'Un journal écrit pendant l’événement' },
    { ...COPY.en.questions[2], kicker: 'Étape 3 sur 5', title: 'Maths : réponse saisie', instruction: 'QuizSolver remplit précisément les champs numériques et textuels.', question: 'Combien font 12 x 8 ?', placeholder: 'Tapez votre réponse', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Étape 4 sur 5', title: 'Sciences : menus déroulants', instruction: 'Associe plusieurs listes déroulantes en une seule opération.', question: 'Associez chaque terme scientifique à la bonne définition.', prompts: ['Photosynthèse', 'Évaporation', 'Gravité'], options: ['Les plantes produisent du glucose avec la lumière', 'Un liquide devient un gaz', 'Force qui attire les objets ayant une masse'], correctText: 'Photosynthèse = Les plantes produisent du glucose avec la lumière, Évaporation = Un liquide devient un gaz, Gravité = Force qui attire les objets ayant une masse' },
    { ...COPY.en.questions[4], kicker: 'Étape 5 sur 5', title: 'Overlay rapide & FocusScan', instruction: 'Surlignez uniquement le texte et résolvez la sélection via Alt+Q ou FocusScan (Alt+S).', question: 'Quel outil QuizSolver résout uniquement le texte sélectionné ?', options: ['Résoudre le texte sélectionné', 'Paiement des crédits', 'Panel admin', 'Historique navigateur'], correctText: 'Résoudre le texte sélectionné' }
  ],
  it: [
    { ...COPY.en.questions[0], kicker: 'Passo 1 di 5', title: 'Biologia: scelta singola', instruction: 'QuizSolver analizza la domanda e seleziona la risposta esatta con un clic.', question: 'Quale organello produce principalmente ATP nelle cellule eucariotiche?', options: ['Nucleo cellulare', 'Mitocondrio', 'Ribosoma', 'Membrana cellulare'], correctText: 'Mitocondrio' },
    { ...COPY.en.questions[1], kicker: 'Passo 2 di 5', title: 'Hint mode', instruction: 'Non vuoi il clic automatico? L’Hint mode offre un indizio discreto.', question: 'Quale fonte è il miglior esempio di prova storica primaria?', options: ['Un capitolo di manuale', 'Un diario scritto durante l’evento', 'Un documentario moderno', 'Una voce di enciclopedia'], correctText: 'Un diario scritto durante l’evento' },
    { ...COPY.en.questions[2], kicker: 'Passo 3 di 5', title: 'Matematica: risposta scritta', instruction: 'QuizSolver compila numeri e testo nei campi dei quiz online.', question: 'Quanto fa 12 x 8?', placeholder: 'Scrivi la risposta', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Passo 4 di 5', title: 'Scienze: menu a tendina', instruction: 'Abbina contemporaneamente più concetti nei menu a tendina.', question: 'Abbina ogni termine scientifico alla definizione corretta.', prompts: ['Fotosintesi', 'Evaporazione', 'Gravità'], options: ['Le piante producono glucosio con la luce', 'Il liquido diventa gas', 'Forza che attrae oggetti con massa'], correctText: 'Fotosintesi = Le piante producono glucosio con la luce, Evaporazione = Il liquido diventa gas, Gravità = Forza che attrae oggetti con massa' },
    { ...COPY.en.questions[4], kicker: 'Passo 5 di 5', title: 'Overlay rapido & FocusScan', instruction: 'Seleziona solo il testo ed esegui la risoluzione rapida con Alt+Q o FocusScan (Alt+S).', question: 'Quale strumento QuizSolver risolve solo il testo selezionato?', options: ['Risolvi testo selezionato', 'Pagamento crediti', 'Pannello admin', 'Cronologia browser'], correctText: 'Risolvi testo selezionato' }
  ],
  uk: [
    { ...COPY.en.questions[0], kicker: 'Крок 1 з 5', title: 'Біологія: один варіант', instruction: 'QuizSolver сканує питання і автоматично обирає правильну відповідь.', question: 'Яка органела переважно виробляє АТФ в еукаріотичних клітинах?', options: ['Клітинне ядро', 'Мітохондрія', 'Рибосома', 'Клітинна мембрана'], correctText: 'Мітохондрія' },
    { ...COPY.en.questions[1], kicker: 'Крок 2 з 5', title: 'Hint mode', instruction: 'Не хочете авто-клік? Режим Hint mode непомітно підказує варіант.', question: 'Яке джерело є найкращим прикладом первинного історичного доказу?', options: ['Розділ підручника', 'Щоденник, написаний під час події', 'Сучасний документальний фільм', 'Енциклопедична стаття'], correctText: 'Щоденник, написаний під час події' },
    { ...COPY.en.questions[2], kicker: 'Крок 3 з 5', title: 'Математика: текстова відповідь', instruction: 'QuizSolver впевнено заповнює числа і текст у поля форми.', question: 'Скільки буде 12 x 8?', placeholder: 'Введіть відповідь', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Крок 4 з 5', title: 'Наука: dropdown і matching', instruction: 'Одночасно зіставляє декілька значень у випадаючих списках.', question: 'Зістав кожен науковий термін із правильною дефініцією.', prompts: ['Фотосинтез', 'Випаровування', 'Гравітація'], options: ['Рослини створюють глюкозу за допомогою світла', 'Рідина перетворюється на газ', 'Сила, що притягує об’єкти з масою'], correctText: 'Фотосинтез = Рослини створюють глюкозу за допомогою світла, Випаровування = Рідина перетворюється на газ, Гравітація = Сила, що притягує об’єкти з масою' },
    { ...COPY.en.questions[4], kicker: 'Крок 5 з 5', title: 'Quick overlay & FocusScan', instruction: 'Виділіть тільки текст питання і розв’яжіть його через Alt+Q або FocusScan (Alt+S).', question: 'Який інструмент QuizSolver розв’язує лише виділений текст?', options: ['Розв’язати виділений текст', 'Оплата кредитів', 'Admin panel', 'Історія браузера'], correctText: 'Розв’язати виділений текст' }
  ],
  pt: [
    { ...COPY.en.questions[0], kicker: 'Passo 1 de 5', title: 'Biologia: múltipla escolha', instruction: 'O QuizSolver detecta a pergunta e marca a alternativa correta em um clique.', question: 'Qual organela celular é a principal responsável pela produção de ATP em células eucarióticas?', options: ['Núcleo celular', 'Mitocôndria', 'Ribossomo', 'Membrana celular'], correctText: 'Mitocôndria' },
    { ...COPY.en.questions[1], kicker: 'Passo 2 de 5', title: 'Modo Dica', instruction: 'Prefere resolver sozinho? O Modo Dica apenas destaca uma sugestão sutil sem clicar automaticamente.', question: 'Qual fonte histórica é o exemplo mais direto de documento primário?', options: ['Um capítulo de livro didático', 'Um diário escrito durante o acontecimento', 'Um documentário moderno', 'Um artigo de enciclopédia'], correctText: 'Um diário escrito durante o acontecimento' },
    { ...COPY.en.questions[2], kicker: 'Passo 3 de 5', title: 'Matemática: resposta digitada', instruction: 'O QuizSolver preenche números e respostas em texto diretamente nos campos.', question: 'Quanto é 12 x 8?', placeholder: 'Digite sua resposta', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Passo 4 de 5', title: 'Ciências: menus suspensos', instruction: 'Associa vários conceitos simultaneamente em menus suspensos.', question: 'Associe cada termo científico à sua definição correta.', prompts: ['Fotossíntese', 'Evaporação', 'Gravidade'], options: ['Plantas produzem glicose com luz solar', 'Líquido se transforma em gás', 'Força que atrai objetos com massa'], correctText: 'Fotossíntese = Plantas produzem glicose com luz solar, Evaporação = Líquido se transforma em gás, Gravidade = Força que atrai objetos com massa' },
    { ...COPY.en.questions[4], kicker: 'Passo 5 de 5', title: 'Quick Overlay & FocusScan', instruction: 'Selecione apenas o texto da questão e resolva com Alt+Q ou FocusScan (Alt+S).', question: 'Qual recurso do QuizSolver resolve apenas o texto selecionado na página?', options: ['Resolver texto selecionado', 'Comprar créditos', 'Painel admin', 'Histórico do navegador'], correctText: 'Resolver texto selecionado' }
  ],
  ar: [
    { ...COPY.en.questions[0], kicker: 'الخطوة 1 من 5', title: 'الأحياء: اختيار فردي', instruction: 'يتعرف QuizSolver على السؤال ويحدد الإجابة الصحيحة بنقرة واحدة.', question: 'ما هي العضية الخلوية المسؤولة بشكل رئيسي عن إنتاج ATP في الخلايا حقيقية النواة؟', options: ['نواة الخلية', 'الميتوكوندريا', 'الريبوسوم', 'غشاء الخلية'], correctText: 'الميتوكوندريا' },
    { ...COPY.en.questions[1], kicker: 'الخطوة 2 من 5', title: 'وضع التلميح', instruction: 'هل تفضل الحل بنفسك؟ وضع التلميح يعرض تلميحاً خفيفاً دون النقر التلقائي.', question: 'أي من المصادر التالية يمثل أوضح مثال على مصدر تاريخي أولي؟', options: ['فصل من كتاب مدرسي', 'مذكرات شخصية كُتبت أثناء الحدث', 'فيلم وثائقي حديث', 'مقال موسوعي'], correctText: 'مذكرات شخصية كُتبت أثناء الحدث' },
    { ...COPY.en.questions[2], kicker: 'الخطوة 3 من 5', title: 'الرياضيات: إدخال نصي', instruction: 'يقوم QuizSolver بملء الأرقام والإجابات النصية بدقة مباشرة في الحقول.', question: 'كم حاصل ضرب 12 × 8؟', placeholder: 'اكتب إجابتك هنا', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'الخطوة 4 من 5', title: 'العلوم: قوائم منسدلة', instruction: 'يطابق مفاهيم متعددة في وقت واحد داخل القوائم المنسدلة.', question: 'طابق كل مصطلح علمي بالتعريف الصحيح له.', prompts: ['التمثيل الضوئي', 'التبخر', 'الجاذبية'], options: ['تصنع النباتات الجلوكوز باستخدام ضوء الشمس', 'يتحول السائل إلى غاز', 'القوة التي تجذب الأجسام ذات الكتلة'], correctText: 'التمثيل الضوئي = تصنع النباتات الجلوكوز باستخدام ضوء الشمس, التبخر = يتحول السائل إلى غاز, الجاذبية = القوة التي تجذب الأجسام ذات الكتلة' },
    { ...COPY.en.questions[4], kicker: 'الخطوة 5 من 5', title: 'النافذة العائمة السريعة', instruction: 'حدد نص السؤال فقط وقم بحله فورياً عبر Alt+Q أو FocusScan (Alt+S).', question: 'ما هي أداة QuizSolver التي تحل النص المحدد فقط في الصفحة؟', options: ['حل النص المحدد', 'شراء الأرصدة', 'لوحة التحكم', 'سجل المتصفح'], correctText: 'حل النص المحدد' }
  ],
  tr: [
    { ...COPY.en.questions[0], kicker: 'Adım 1 / 5', title: 'Biyoloji: Çoktan seçmeli', instruction: 'QuizSolver soruyu tarar ve doğru cevabı tek tıklamayla otomatik seçer.', question: 'Ökaryotik hücrelerde ATP üretiminden esas olarak hangi organel sorumludur?', options: ['Hücre çekirdeği', 'Mitokondri', 'Ribozom', 'Hücre zarı'], correctText: 'Mitokondri' },
    { ...COPY.en.questions[1], kicker: 'Adım 2 / 5', title: 'İpucu modu', instruction: 'Aracın sizin yerinize tıklamasını istemiyor musunuz? İpucu modu ince bir ipucu sunar.', question: 'Hangi kaynak birincil tarihsel kanıtın en güçlü örneğidir?', options: ['Bir ders kitabı bölümü', 'Olay sırasında yazılmış bir günlük', 'Modern bir belgesel', 'Bir ansiklopedi özeti'], correctText: 'Olay sırasında yazılmış bir günlük' },
    { ...COPY.en.questions[2], kicker: 'Adım 3 / 5', title: 'Matematik: Yazılı cevap', instruction: 'QuizSolver sayıları ve kısa metinleri form alanlarına hatasız girer.', question: '12 x 8 kaçtır?', placeholder: 'Cevabı girin', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'Adım 4 / 5', title: 'Fen Bilimleri: Açılır menü eşleştirme', instruction: 'Birden fazla terimi açılır menülerde aynı anda eşleştirin.', question: 'Her bilimsel terimi doğru tanımıyla eşleştirin.', prompts: ['Fotosentez', 'Buharlaşma', 'Yerçekimi'], options: ['Bitkiler ışıkla glikoz üretir', 'Sıvı gaza dönüşür', 'Kütlesi olan nesneleri çeken kuvvet'], correctText: 'Fotosentez = Bitkiler ışıkla glikoz üretir, Buharlaşma = Sıvı gaza dönüşür, Yerçekimi = Kütlesi olan nesneleri çeken kuvvet' },
    { ...COPY.en.questions[4], kicker: 'Adım 5 / 5', title: 'Hızlı Katman & FocusScan', instruction: 'Yalnızca soru metnini vurgulayın ve Alt+Q veya FocusScan (Alt+S) ile doğrudan çözün.', question: 'Hangi QuizSolver aracı yalnızca seçilen metni çözer?', options: ['Seçilen metni çöz', 'Kredi satın alma', 'Yönetici paneli', 'Tarayıcı geçmişi'], correctText: 'Seçilen metni çöz' }
  ],
  ja: [
    { ...COPY.en.questions[0], kicker: 'ステップ 1 / 5', title: '生物：単一選択問題', instruction: 'QuizSolverが問題をスキャンし、ワンクリックで正解を自動選択します。', question: '真核細胞でATPを主に産生する細胞小器官はどれですか？', options: ['細胞核', 'ミトコンドリア', 'リボソーム', '細胞膜'], correctText: 'ミトコンドリア' },
    { ...COPY.en.questions[1], kicker: 'ステップ 2 / 5', title: 'ヒントモード', instruction: '自動クリックしたくない場合は、ヒントモードで控えめに手がかりを表示できます。', question: '一次史料の最も適切な例はどれですか？', options: ['教科書の記述', '当時の出来事中に書かれた日記', '現代のドキュメンタリー番組', '百科事典の要約'], correctText: '当時の出来事中に書かれた日記' },
    { ...COPY.en.questions[2], kicker: 'ステップ 3 / 5', title: '数学：記述式入力', instruction: 'QuizSolverは数値やテキストの入力フォームに正確に入力します。', question: '12 × 8 はいくつですか？', placeholder: '答えを入力', correctText: '96' },
    { ...COPY.en.questions[3], kicker: 'ステップ 4 / 5', title: '理科：ドロップダウン一致', instruction: '複数のドロップダウン項目を同時に正確な定義と一致させます。', question: '各科学用語を正しい定義と一致させてください。', prompts: ['光合成', '蒸発', '重力'], options: ['植物が光を利用して糖を生成する', '液体が気体に変化する', '質量を持つ物体を引き寄せる力'], correctText: '光合成 = 植物が光を利用して糖を生成する, 蒸発 = 液体が気体に変化する, 重力 = 質量を持つ物体を引き寄せる力' },
    { ...COPY.en.questions[4], kicker: 'ステップ 5 / 5', title: 'クイックオーバーレイ & FocusScan', instruction: '問題文だけをハイライトしてAlt+QまたはFocusScan (Alt+S) で解答します。', question: '選択したテキストのみを解析・解答するQuizSolverの機能はどれですか？', options: ['選択テキストを解答', 'クレジット購入', '管理パネル', '閲覧履歴'], correctText: '選択テキストを解答' }
  ],
  ko: [
    { ...COPY.en.questions[0], kicker: '1 / 5단계', title: '생물: 객관식 단일 선택', instruction: 'QuizSolver가 문제를 스캔하여 클릭 한 번으로 정답을 자동 선택합니다.', question: '진핵세포에서 ATP를 주로 생성하는 세포 소기관은 무엇인가요?', options: ['세포핵', '미토콘드리아', '리보솜', '세포막'], correctText: '미토콘드리아' },
    { ...COPY.en.questions[1], kicker: '2 / 5단계', title: '힌트 모드', instruction: '자동 클릭 대신 은밀하게 힌트만 확인하고 싶다면 힌트 모드를 켜두세요.', question: '1차 역사적 사료의 가장 대표적인 예는 무엇인가요?', options: ['교과서 단원', '사건 당시 작성된 일기', '현대 다큐멘터리', '백과사전 요약문'], correctText: '사건 당시 작성된 일기' },
    { ...COPY.en.questions[2], kicker: '3 / 5단계', title: '수학: 직접 입력형', instruction: 'QuizSolver는 숫자나 짧은 텍스트를 입력창에 정확하게 입력합니다.', question: '12 × 8의 값은 얼마인가요?', placeholder: '답 입력', correctText: '96' },
    { ...COPY.en.questions[3], kicker: '4 / 5단계', title: '과학: 드롭다운 매칭', instruction: '여러 개의 드롭다운 항목을 올바른 정의와 한 번에 연결합니다.', question: '각 과학 용어를 올바른 설명과 연결하세요.', prompts: ['광합성', '증발', '중력'], options: ['식물이 빛을 이용해 포도당을 생성함', '액체가 기체로 변함', '질량이 있는 물체를 끌어당기는 힘'], correctText: '광합성 = 식물이 빛을 이용해 포도당을 생성함, 증발 = 액체가 기체로 변함, 중력 = 질량이 있는 물체를 끌어당기는 힘' },
    { ...COPY.en.questions[4], kicker: '5 / 5단계', title: '퀵 오버레이 & FocusScan', instruction: '문제 텍스트만 드래그하여 강조한 뒤 Alt+Q 또는 FocusScan(Alt+S)으로 신속하게 문제를 풉니다.', question: '선택한 텍스트 영역만 분석하여 답변을 찾는 QuizSolver 기능은?', options: ['선택한 텍스트 풀기', '크레딧 구매', '관리자 패널', '브라우저 방문 기록'], correctText: '선택한 텍스트 풀기' }
  ]
};

(['de', 'es', 'fr', 'it', 'uk', 'pt', 'ar', 'tr', 'ja', 'ko'] as const).forEach((locale) => {
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

          <header class="demo-hero">
            <div class="demo-eyebrow-pill">
              <span class="pill-dot"></span>
              <span>{{ copy.eyebrow }}</span>
            </div>
            <h1>{{ copy.title }}</h1>
            <p class="demo-lead">{{ copy.lead }}</p>

            <div class="demo-mode-card glass">
              <div class="mode-info">
                <span class="mode-icon">🧩</span>
                <div>
                  <strong>{{ copy.mapTitle }}</strong>
                  <p>{{ copy.mapText }}</p>
                </div>
              </div>
              <div class="mode-actions">
                <button class="btn btn-outline btn-sm" type="button" data-qs-tour-start (click)="startGuidedTour()">
                  🎯 {{ copy.startTour }}
                </button>
                <a [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-primary btn-sm cta-store-btn">
                  📥 {{ copy.install }}
                </a>
              </div>
            </div>
          </header>

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

          <section class="demo-workspace" *ngIf="currentQuestion() as question">
            <article class="demo-card glass" [attr.data-qs-demo-question]="question.id" data-qs-tour="question-card">

              <div class="card-meta-bar" [class.has-ext-slot]="extensionInstalled()">
                <span class="step-tag">{{ question.kicker }}</span>
                <span class="step-counter">{{ current() + 1 }} / {{ copy.questions.length }}</span>
              </div>

              <h2 class="question-text" data-qs-demo-question-text [attr.data-qs-demo-selectable]="question.type === 'selected' ? 'true' : null">
                {{ question.question }}
              </h2>

              <div class="feature-tip">
                <span class="tip-icon">💡</span>
                <p>{{ question.instruction }}</p>
              </div>

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

              <div class="selected-helper-bar" *ngIf="question.type === 'selected'">
                <button class="btn btn-outline btn-sm" type="button" data-qs-tour="select-text" (click)="selectQuestionText()">
                  {{ copy.selectText }}
                </button>
                <p class="selected-note">{{ copy.selectedTip }}</p>
              </div>

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

              <div class="card-actions">
                <button
                  class="btn btn-outline"
                  type="button"
                  (click)="checkAnswer(question)">
                  ✓ {{ label('checkAnswer') }}
                </button>
              </div>

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

          <section class="demo-finish glass" *ngIf="isDemoComplete()">
            <div class="finish-icon">🎉</div>
            <h2>{{ label('resultTitle') }}</h2>
            <p class="finish-desc">{{ label('resultText') }}</p>

            <div class="finish-checklist">
              <span *ngFor="let item of checklistItems()">✓ {{ item }}</span>
            </div>

            <div class="finish-actions">
              <a *ngIf="!extensionInstalled()" [href]="storeUrl" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
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
      padding: 3rem 0 5rem;
      width: 100%;
      min-height: 100vh;
      background:
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 92, 252, 0.15), transparent),
        radial-gradient(ellipse 60% 40% at 50% 120%, rgba(14, 165, 233, 0.1), transparent),
        #101318;
    }

    .demo-container {
      width: 100%;
      max-width: 880px;
      margin: 0 auto;
      padding: 0 1.25rem;
    }

    /* Hero */
    .demo-hero {
      text-align: center;
      margin-bottom: 1.75rem;
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
      font-size: clamp(1.9rem, 4.2vw, 2.65rem);
      font-weight: 800;
      margin: 0 0 0.65rem;
      letter-spacing: -0.02em;
    }

    .demo-lead {
      font-size: 1.02rem;
      color: var(--text-secondary);
      max-width: 690px;
      margin: 0 auto 1.35rem;
      line-height: 1.55;
    }

    /* Mode Card */
    .demo-mode-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 1.15rem 1.4rem;
      border-radius: 14px;
      background: rgba(23, 28, 36, 0.75);
      border: 1px solid rgba(14, 165, 233, 0.25);
      text-align: left;
    }

    .mode-info {
      display: flex;
      align-items: flex-start;
      gap: 0.9rem;
    }

    .mode-icon {
      font-size: 1.4rem;
      line-height: 1.2;
    }

    .mode-info strong {
      display: block;
      font-size: 0.98rem;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }

    .mode-info p {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.45;
      margin: 0;
    }

    .mode-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 0.65rem;
    }

    /* Stepper Tabs */
    .demo-stepper {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.35rem;
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
      position: relative;
      padding: 1.85rem 2rem;
      border-radius: 16px;
      background: #171c24;
      border: 1px solid var(--border);
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
    }

    .card-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.65rem;
      margin-bottom: 0.85rem;
    }

    .card-meta-bar.has-ext-slot {
      padding-right: 7.5rem;
    }

    .step-tag {
      font-size: 0.82rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #38bdf8;
    }

    .step-counter {
      font-size: 0.8rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.4);
      color: #bae6fd;
    }

    .question-text {
      font-size: clamp(1.3rem, 2.4vw, 1.65rem);
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
      margin-bottom: 1.35rem;
    }

    .tip-icon {
      font-size: 1.05rem;
      line-height: 1.3;
    }

    .feature-tip p {
      font-size: 0.9rem;
      color: #cbd5e1;
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
      display: grid;
      gap: 0.65rem;
      padding: 0.9rem 1.15rem;
      border-radius: 10px;
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.24);
      margin-bottom: 1.5rem;
    }

    .selected-helper-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .selected-note {
      font-size: 0.88rem;
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
      max-width: 620px;
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
    @media (max-width: 780px) {
      .demo-methods-grid {
        grid-template-columns: 1fr;
      }
      .card-meta-bar.has-ext-slot {
        padding-right: 0;
        margin-top: 2rem;
      }
    }

    @media (max-width: 680px) {
      .demo-page { padding: 2rem 0 3.5rem; }
      .demo-card { padding: 1.25rem; }
      .setup-status-row { flex-direction: column; align-items: stretch; }
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
  protected readonly extensionInstalled = signal(false);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private extensionDetectTimer?: ReturnType<typeof setInterval>;

  private readonly handleTourStep = (event: Event) => {
    const step = Number((event as CustomEvent<{ step?: number }>).detail?.step ?? 0);
    const nextStep = Math.min(Math.max(0, step), this.copy.questions.length - 1);
    this.current.set(nextStep);
    this.notifyExtensionStepChanged(false);
    this.scrollToWorkspace();
  };

  private readonly handleExtensionReady = () => {
    this.extensionInstalled.set(true);
  };

  private readonly handleExtensionAction = (event: Event) => {
    this.extensionInstalled.set(true);
    const detail = (event as CustomEvent<{
      type?: 'solve' | 'hint' | 'selected' | 'focusscan';
      questionId?: string;
      answer?: unknown;
    }>).detail || {};
    const question = this.currentQuestion();
    if (!question) return;

    if (detail.type === 'hint') {
      this.updateAnswer(question.id, {
        hinted: true,
        checked: false,
        empty: false,
        solvedVia: 'hint'
      });
      return;
    }

    const solvedVia = detail.type || 'solve';
    if (question.type === 'matching') {
      this.updateAnswer(question.id, {
        matches: this.expectedMatches(question),
        checked: true,
        correct: true,
        empty: false,
        hinted: false,
        solved: true,
        solvedVia
      });
      return;
    }

    this.updateAnswer(question.id, {
      value: question.correctText,
      checked: true,
      correct: true,
      empty: false,
      hinted: false,
      solved: true,
      solvedVia
    });
  };

  ngOnInit(): void {
    this.locale = (this.route.snapshot.data['locale'] as Locale) || 'en';
    this.copy = COPY[this.locale] || COPY.en;
    this.seo.applyPage('demo', this.locale);
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('qs-demo-set-step', this.handleTourStep);
      window.addEventListener('qs-extension-ready', this.handleExtensionReady);
      window.addEventListener('qs-demo-extension-action', this.handleExtensionAction);
      this.checkExtensionPresence();
      this.extensionDetectTimer = setInterval(() => this.checkExtensionPresence(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('qs-demo-set-step', this.handleTourStep);
      window.removeEventListener('qs-extension-ready', this.handleExtensionReady);
      window.removeEventListener('qs-demo-extension-action', this.handleExtensionAction);
      if (this.extensionDetectTimer) clearInterval(this.extensionDetectTimer);
    }
  }

  private checkExtensionPresence(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const hasAttr = document.documentElement.getAttribute('data-qs-extension-installed') === 'true';
    const hasDom = !!document.querySelector('#qs-quick-overlay, .qs-single-solve-btn, #qs-demo-tour-layer');
    if (hasAttr || hasDom) {
      this.extensionInstalled.set(true);
    }
  }

  protected ui(): DemoOnboardingUiCopy {
    return this.locale === 'pl' ? ONBOARDING_UI_COPY.pl : ONBOARDING_UI_COPY.en;
  }

  protected getStepActionGuide(question: DemoQuestion): string {
    const guides = this.ui().stepGuides;
    return guides[question.type] || question.instruction;
  }

  protected triggerMethodAction(actionType?: 'overlay' | 'focusscan' | 'tour'): void {
    if (actionType === 'overlay') {
      this.openQuickOverlay();
    } else if (actionType === 'focusscan') {
      this.startFocusScan();
    } else if (actionType === 'tour') {
      this.startGuidedTour();
    }
  }

  protected openQuickOverlay(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.dispatchEvent(new CustomEvent('qs-demo-open-overlay'));
  }

  protected startFocusScan(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.dispatchEvent(new CustomEvent('qs-demo-start-focusscan'));
  }

  private notifyExtensionStepChanged(reset = false): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('qs-demo-step-changed', {
        detail: {
          step: this.current(),
          questionId: this.currentQuestion()?.id,
          reset
        }
      }));
    }, 20);
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
        hintTitle: 'Hinweis-Modus aktiv',
        wrongTitle: 'Noch nicht',
        emptyTitle: 'Nutze die Erweiterung oder wähle eine Antwort',
        explanationLabel: 'Warum das funktioniert',
        simulateSolver: '✨ Mit QuizSolver-Erweiterung gelöst',
        showHint: '💡 Hinweis-Modus',
        checkAnswer: 'Antwort manuell prüfen',
        resultTitle: 'Training abgeschlossen!',
        resultText: 'Du hast Einzelauswahl, Hinweis-Modus, Texteingabe, Dropdowns, Textauswahl und FocusScan getestet.',
        finalPrimary: 'Erweiterung installieren',
        finalSecondary: 'Training neu starten'
      },
      es: {
        correctTitle: 'Correcta',
        hintTitle: 'Modo pista activo',
        wrongTitle: 'Aún no',
        emptyTitle: 'Usa la extensión o elige una respuesta',
        explanationLabel: 'Por qué funciona',
        simulateSolver: '✨ Resuelto con la extensión QuizSolver',
        showHint: '💡 Modo pista',
        checkAnswer: 'Comprobar respuesta manualmente',
        resultTitle: '¡Entrenamiento completado!',
        resultText: 'Has probado opción única, modo pista, respuesta escrita, desplegables, texto seleccionado y FocusScan.',
        finalPrimary: 'Instalar extensión',
        finalSecondary: 'Reiniciar entrenamiento'
      },
      fr: {
        correctTitle: 'Correct',
        hintTitle: 'Mode indice actif',
        wrongTitle: 'Pas tout à fait',
        emptyTitle: 'Utilisez l’extension ou choisissez une réponse',
        explanationLabel: 'Pourquoi ça fonctionne',
        simulateSolver: '✨ Résolu avec l’extension QuizSolver',
        showHint: '💡 Mode indice',
        checkAnswer: 'Vérifier ma réponse manuellement',
        resultTitle: 'Entraînement terminé !',
        resultText: 'Vous avez testé le choix unique, le mode indice, la saisie, les menus déroulants, le texte sélectionné et FocusScan.',
        finalPrimary: 'Installer l’extension',
        finalSecondary: 'Recommencer'
      },
      it: {
        correctTitle: 'Corretto',
        hintTitle: 'Hint mode attivo',
        wrongTitle: 'Non ancora',
        emptyTitle: 'Usa l’estensione o scegli una risposta',
        explanationLabel: 'Perché funziona',
        simulateSolver: '✨ Risolto con l’estensione QuizSolver',
        showHint: '💡 Hint mode',
        checkAnswer: 'Verifica risposta manualmente',
        resultTitle: 'Training completato!',
        resultText: 'Hai testato scelta singola, hint mode, risposta scritta, menu a tendina, testo selezionato e FocusScan.',
        finalPrimary: 'Installa estensione',
        finalSecondary: 'Riavvia demo'
      },
      uk: {
        correctTitle: 'Правильно',
        hintTitle: 'Режим підказки активний',
        wrongTitle: 'Ще ні',
        emptyTitle: 'Скористайтесь розширенням або виберіть відповідь',
        explanationLabel: 'Чому це працює',
        simulateSolver: '✨ Розв’язано розширенням QuizSolver',
        showHint: '💡 Режим підказки',
        checkAnswer: 'Перевірити відповідь вручну',
        resultTitle: 'Тренування завершено!',
        resultText: 'Ви протестували один варіант, режим Hint mode, текстову відповідь, списки, виділений текст та FocusScan.',
        finalPrimary: 'Встановити розширення',
        finalSecondary: 'Почати заново'
      },
      pt: {
        correctTitle: 'Correto',
        hintTitle: 'Modo Dica ativo',
        wrongTitle: 'Ainda não',
        emptyTitle: 'Use a extensão ou escolha uma resposta',
        explanationLabel: 'Por que funciona',
        simulateSolver: '✨ Resolvido com a extensão QuizSolver',
        showHint: '💡 Modo Dica',
        checkAnswer: 'Conferir resposta manualmente',
        resultTitle: 'Treinamento concluído!',
        resultText: 'Você testou múltipla escolha, modo dica, resposta digitada, menus suspensos, texto selecionado e FocusScan.',
        finalPrimary: 'Instalar extensão',
        finalSecondary: 'Reiniciar demonstração'
      },
      ar: {
        correctTitle: 'صحيح',
        hintTitle: 'وضع التلميح نشط',
        wrongTitle: 'حاول مجدداً',
        emptyTitle: 'استخدم الإضافة أو اختر إجابة أولاً',
        explanationLabel: 'لماذا هذه الإجابة صحيحة',
        simulateSolver: '✨ تم الحل بواسطة إضافة QuizSolver',
        showHint: '💡 وضع التلميح',
        checkAnswer: 'التحقق من إجابتي يدوياً',
        resultTitle: 'اكتمل التدريب!',
        resultText: 'لقد جربت الاختيار من متعدد، وضع التلميح، الإجابة المكتوبة، القوائم المنسدلة، النص المحدد و FocusScan.',
        finalPrimary: 'تثبيت الإضافة',
        finalSecondary: 'إعادة التجربة'
      },
      tr: {
        correctTitle: 'Doğru',
        hintTitle: 'İpucu modu aktif',
        wrongTitle: 'Henüz değil',
        emptyTitle: 'Uzantıyı kullanın veya bir cevap seçin',
        explanationLabel: 'Bu cevap neden doğru',
        simulateSolver: '✨ QuizSolver uzantısı ile çözüldü',
        showHint: '💡 İpucu modu',
        checkAnswer: 'Cevabımı manuel kontrol et',
        resultTitle: 'Eğitim tamamlandı!',
        resultText: 'Çoktan seçmeli, ipucu modu, yazılı cevap, açılır menü eşleştirme, seçili metin ve FocusScan’i test ettiniz.',
        finalPrimary: 'Uzantıyı yükle',
        finalSecondary: 'Demoyu yeniden başlat'
      },
      ja: {
        correctTitle: '正解',
        hintTitle: 'ヒントモード有効',
        wrongTitle: '不正解',
        emptyTitle: '拡張機能を使うか、回答を選択してください',
        explanationLabel: '解説・根拠',
        simulateSolver: '✨ QuizSolver拡張機能で解答済み',
        showHint: '💡 ヒントモード',
        checkAnswer: '回答を手動で確認する',
        resultTitle: 'トレーニング完了！',
        resultText: '選択式、ヒントモード、記述式入力、ドロップダウン一致、選択テキスト解答、FocusScanをすべて体験しました。',
        finalPrimary: '拡張機能をインストール',
        finalSecondary: '最初からやり直す'
      },
      ko: {
        correctTitle: '정답입니다',
        hintTitle: '힌트 모드 활성',
        wrongTitle: '다시 시도해 보세요',
        emptyTitle: '확장 프로그램을 사용하거나 답변을 선택하세요',
        explanationLabel: '정답 이유 및 해설',
        simulateSolver: '✨ QuizSolver 확장 프로그램으로 해결됨',
        showHint: '💡 힌트 모드',
        checkAnswer: '내 답안 수동 확인하기',
        resultTitle: '연습 완료!',
        resultText: '객관식 선택, 힌트 모드, 텍스트 입력, 드롭다운 매칭, 선택 텍스트 및 FocusScan을 모두 체험했습니다.',
        finalPrimary: '확장 프로그램 설치',
        finalSecondary: '처음부터 다시 시작'
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
    this.notifyExtensionStepChanged(false);
    this.restoreScroll(scrollSnapshot);
  }

  protected getStepShortLabel(index: number): string {
    const labels: Record<Locale, string[]> = {
      pl: ['1. Wybór ABCD', '2. Tryb Hint', '3. Wpisywanie', '4. Dopasowanie', '5. Alt+Q / Alt+S'],
      en: ['1. Choice', '2. Hint mode', '3. Input', '4. Matching', '5. Alt+Q / Alt+S'],
      de: ['1. Auswahl', '2. Hinweis', '3. Eingabe', '4. Zuordnung', '5. Alt+Q / Alt+S'],
      es: ['1. Opción', '2. Pista', '3. Escrita', '4. Emparejar', '5. Alt+Q / Alt+S'],
      fr: ['1. Choix', '2. Indice', '3. Saisie', '4. Association', '5. Alt+Q / Alt+S'],
      it: ['1. Scelta', '2. Hint', '3. Scritta', '4. Tendina', '5. Alt+Q / Alt+S'],
      uk: ['1. Варіант', '2. Hint', '3. Введення', '4. Matching', '5. Alt+Q / Alt+S'],
      pt: ['1. Múltipla escolha', '2. Modo Dica', '3. Digitação', '4. Associação', '5. Alt+Q / Alt+S'],
      ar: ['1. اختيار متعدد', '2. وضع التلميح', '3. إدخال نصي', '4. مطابقة', '5. Alt+Q / Alt+S'],
      tr: ['1. Çoktan seçmeli', '2. İpucu modu', '3. Yazılı cevap', '4. Eşleştirme', '5. Alt+Q / Alt+S'],
      ja: ['1. 選択問題', '2. ヒント', '3. 記述式', '4. ドロップダウン', '5. Alt+Q / Alt+S'],
      ko: ['1. 객관식', '2. 힌트', '3. 텍스트 입력', '4. 매칭', '5. Alt+Q / Alt+S']
    };
    const list = labels[this.locale] || labels.en;
    return list[index] || `Krok ${index + 1}`;
  }

  protected checklistItems(): string[] {
    const map: Record<Locale, string[]> = {
      pl: ['Przycisk ✨ Rozwiąż w rogu pytania', 'Dyskretny tryb Hint mode', 'Wpisywanie odpowiedzi w pola', 'Dopasowywanie selectów', 'Panel Alt+Q oraz FocusScan (Alt+S)'],
      en: ['✨ Solve button on questions', 'Discreet Hint mode', 'Typed input support', 'Dropdown matching', 'Alt+Q Overlay & FocusScan (Alt+S)'],
      de: ['✨ Lösen-Button', 'Diskreter Hinweis-Modus', 'Texteingabe', 'Dropdown-Zuordnung', 'Alt+Q & FocusScan (Alt+S)'],
      es: ['Botón ✨ Resolver', 'Modo pista discreto', 'Respuesta escrita', 'Emparejar menús', 'Alt+Q y FocusScan (Alt+S)'],
      fr: ['Bouton ✨ Résoudre', 'Mode indice discret', 'Réponse saisie', 'Association déroulante', 'Alt+Q & FocusScan (Alt+S)'],
      it: ['Pulsante ✨ Risolvi', 'Hint mode discreto', 'Risposta scritta', 'Associazione a tendina', 'Alt+Q & FocusScan (Alt+S)'],
      uk: ['Кнопка ✨ Вирішити', 'Непомітний Hint mode', 'Текстова відповідь', 'Matching у списках', 'Alt+Q та FocusScan (Alt+S)'],
      pt: ['Botão ✨ Resolver', 'Modo Dica discreto', 'Preenchimento de respostas', 'Associação em lista', 'Alt+Q e FocusScan (Alt+S)'],
      ar: ['زر ✨ حل التلقائي', 'وضع التلميح الهادئ', 'ملء الإجابات المكتوبة', 'مطابقة القوائم المنسدلة', 'Alt+Q و FocusScan (Alt+S)'],
      tr: ['✨ Çöz düğmesi', 'Gizli İpucu modu', 'Yazılı cevap desteği', 'Açılır menü eşleştirme', 'Alt+Q & FocusScan (Alt+S)'],
      ja: ['✨ 解くボタン', '目立たないヒントモード', '記述式フォーム入力', 'ドロップダウン一致', 'Alt+Q & FocusScan (Alt+S)'],
      ko: ['✨ 풀기 버튼', '은밀한 힌트 모드', '텍스트 입력 지원', '드롭다운 매칭', 'Alt+Q & FocusScan (Alt+S)']
    };
    return map[this.locale] || map.en;
  }

  protected isQuestionCompleted(questionId: string): boolean {
    const state = this.answers()[questionId];
    return !!state?.correct || !!state?.solved;
  }

  protected setAnswer(question: DemoQuestion, value: string): void {
    const prev = this.answers()[question.id];
    const isNowCorrect = this.normalizeAnswer(value) === this.normalizeAnswer(question.correctText);
    if (prev?.hinted && isNowCorrect) {
      this.updateAnswer(question.id, {
        value,
        checked: true,
        correct: true,
        empty: false,
        hinted: false,
        solved: true,
        solvedVia: 'hint'
      });
      return;
    }
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
    const expected = this.expectedMatches(question);
    const allMatched = expected.length > 0 && expected.every((ans, idx) =>
      this.normalizeAnswer(current[idx]) === this.normalizeAnswer(ans)
    );
    this.updateAnswer(question.id, {
      matches: current,
      checked: allMatched,
      correct: allMatched,
      empty: false,
      solved: allMatched
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
      if (state?.solvedVia === 'focusscan') {
        return `${this.ui().solvedByFocusScan}: ${question.correctText}`;
      }
      if (state?.solvedVia === 'selected') {
        return `${this.ui().solvedBySelected}: ${question.correctText}`;
      }
      if (state?.solved) {
        return `${this.ui().solvedByExtension}: ${question.correctText}`;
      }
      return question.correctText;
    }
    if (kind === 'hint') {
      return this.ui().hintActivatedMsg;
    }
    if (kind === 'empty') return this.getStepActionGuide(question);
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
    this.notifyExtensionStepChanged(true);
    this.scrollToWorkspace();
  }

  protected next(): void {
    const scrollSnapshot = this.captureScroll();
    this.current.update((value) => value >= this.copy.questions.length - 1 ? 0 : value + 1);
    this.notifyExtensionStepChanged(false);
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
    this.notifyExtensionStepChanged(false);
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
    this.openQuickOverlay();
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
