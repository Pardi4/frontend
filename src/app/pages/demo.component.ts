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
  questions: DemoQuestion[];
}

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
    restart: 'Restart demo',
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
    questions: [
      {
        id: 'demo-radio',
        type: 'radio',
        kicker: 'Step 1',
        title: 'Standard solve',
        instruction: 'Click Solve current page in the extension popup. QuizSolver should choose the correct option.',
        question: 'What should you take when it is raining outside?',
        options: ['Sunglasses', 'Umbrella', 'Beach towel', 'Ice skates'],
        correctText: 'Umbrella'
      },
      {
        id: 'demo-hidden',
        type: 'hidden',
        kicker: 'Step 2',
        title: 'Hidden mode',
        instruction: 'Turn on Hint mode in the popup before solving. The answer should be hinted instead of clicked.',
        question: 'Which item do people usually keep in a fridge?',
        options: ['Blanket', 'Milk', 'Notebook', 'Keys'],
        correctText: 'Milk'
      },
      {
        id: 'demo-text',
        type: 'text',
        kicker: 'Step 3',
        title: 'Typed answer',
        instruction: 'Solve the page and the extension will fill the text input with a local demo answer.',
        question: 'How many days are in a normal week?',
        placeholder: 'Type the answer here',
        correctText: '7'
      },
      {
        id: 'demo-matching',
        type: 'matching',
        kicker: 'Step 4',
        title: 'Dropdown and matching',
        instruction: 'This step shows multi-select matching. QuizSolver fills each dropdown with the matching concept.',
        question: 'Match each everyday activity with the place where it usually happens.',
        prompts: ['Cooking', 'Sleeping', 'Shopping'],
        options: ['Kitchen', 'Bedroom', 'Store'],
        correctText: 'Cooking = Kitchen, Sleeping = Bedroom, Shopping = Store'
      },
      {
        id: 'demo-selected',
        type: 'selected',
        kicker: 'Step 5',
        title: 'Quick overlay and selected text',
        instruction: 'Select the question text, press Alt+Q or open Quick overlay, then solve selected text.',
        question: 'Which QuizSolver tool opens a small window with fast actions?',
        options: ['Quick overlay', 'Credit checkout', 'Admin panel', 'Browser history'],
        correctText: 'Quick overlay'
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
    restart: 'Zacznij od nowa',
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
            </aside>
          </div>
        </section>

        <section class="container demo-workspace" *ngIf="currentQuestion() as question">
          <aside class="demo-side glass">
            <p class="eyebrow">{{ copy.popupTitle }}</p>
            <h2>{{ question.title }}</h2>
            <p>{{ question.instruction }}</p>
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

            <fieldset class="demo-options" *ngIf="question.type === 'radio' || question.type === 'hidden' || question.type === 'selected'">
              <legend class="sr-only">{{ question.question }}</legend>
              <label class="demo-option" *ngFor="let option of question.options; let i = index">
                <input type="radio" [name]="question.id" [value]="i">
                <span>{{ option }}</span>
              </label>
            </fieldset>

            <label class="text-answer" *ngIf="question.type === 'text'">
              <span>{{ copy.yourAnswer }}</span>
              <input type="text" [name]="question.id + '-answer'" [placeholder]="question.placeholder || ''">
            </label>

            <div class="matching-board" *ngIf="question.type === 'matching'">
              <label class="match-row" *ngFor="let prompt of question.prompts; let i = index">
                <span>{{ prompt }}</span>
                <select [name]="question.id + '-' + i">
                  <option value="">{{ copy.chooseOption }}</option>
                  <option *ngFor="let option of question.options" [value]="option">{{ option }}</option>
                </select>
              </label>
            </div>

            <div class="selected-tip" *ngIf="question.type === 'selected'">
              <button class="btn btn-outline btn-sm" type="button" data-qs-tour="select-text" (click)="selectQuestionText()">{{ copy.selectText }}</button>
              <p>{{ copy.selectedTip }}</p>
            </div>

            <div class="demo-nav">
              <button class="btn btn-outline" type="button" (click)="previous()" [disabled]="current() === 0">{{ copy.prev }}</button>
              <button class="btn btn-primary" type="button" data-qs-tour="next" (click)="next()">
                {{ current() === copy.questions.length - 1 ? copy.restart : copy.next }}
              </button>
            </div>
          </article>
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

    .demo-nav {
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
      .demo-actions .btn {
        width: 100%;
        justify-content: center;
        text-align: center;
        white-space: normal;
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
    return warnings[this.locale] || warnings.en;
  }

  protected copy = COPY.en;
  protected readonly current = signal(0);
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

  protected next(): void {
    const scrollSnapshot = this.captureScroll();
    this.current.update((value) => value >= this.copy.questions.length - 1 ? 0 : value + 1);
    this.restoreScroll(scrollSnapshot);
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
