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

const TRANSLATED_ARTICLE_DRAFTS: Record<string, ArticleDraft> = {
  'testportal-quiz-solver-anleitung': {
    intro: [
      "Testportal-Tests sind oft strenger aufgebaut als ein normales Formular. Du siehst eine Frage pro Bildschirm, einen Timer, gemischte Antwortoptionen und manchmal Hinweise, wenn das Browserfenster den Fokus verliert.",
      "QuizSolver liest den sichtbaren Fragetext, verbindet ihn mit den aktuellen Antwortoptionen und speichert das Ergebnis im Verlauf, damit die Frage später als Lernmaterial nutzbar bleibt."
    ],
    sections: [
      { heading: "Was QuizSolver auf Testportal liest", paragraphs: ["Die Erweiterung sucht nach der echten Frage, nicht nur nach Labels wie \"Frage 5\". Sie erkennt außerdem, ob eine Frage eine oder mehrere richtige Antworten haben kann."], bullets: ["Single-Choice-Fragen", "Multiple-Choice-Fragen", "sichtbare kurze Aufgaben", "Bilder und Diagramme mit FocusScan"] },
      { heading: "Warum Timer den Ablauf verändern", paragraphs: ["Der Timer verändert nicht die KI-Logik, aber er macht einen stabilen Ablauf wichtiger. Wiederholtes Senden derselben Frage durch Doppelklicks, Refresh oder Retry sollte vermieden werden."] },
      { heading: "Wann FocusScan sinnvoll ist", paragraphs: ["Wenn Testportal eine Frage als Bild, PDF-Ausschnitt oder gesperrten Text zeigt, markierst du nur den Bereich mit Frage und Antworten. Eine enge Auswahl liefert der KI saubereren Kontext."] },
      { heading: "Nach der Antwort lernen", paragraphs: ["Speichere schwierige Fragen, füge Notizen hinzu und wiederhole sie später aus dem Verlauf. So wird eine einzelne Antwort zu einem kleinen privaten Übungsset."], bullets: ["Erklärungen speichern", "schwache Themen markieren", "Fragen später als Wiederholung nutzen"] }
    ]
  },
  'guia-testportal-quiz-solver': {
    intro: [
      "Los tests de Testportal suelen ser más estrictos que un formulario normal. Puedes ver una pregunta por pantalla, un temporizador, opciones mezcladas y avisos si la ventana pierde el foco.",
      "QuizSolver lee la pregunta visible, la combina con las respuestas visibles y guarda el resultado en el historial para que puedas repasarlo después."
    ],
    sections: [
      { heading: "Qué lee QuizSolver en Testportal", paragraphs: ["La extensión busca el texto real de la pregunta, no solo etiquetas como \"Pregunta 5\". También detecta si el formato es de opción única o de varias respuestas."], bullets: ["preguntas de opción única", "preguntas de respuesta múltiple", "enunciados cortos visibles", "imágenes y gráficos con FocusScan"] },
      { heading: "Cómo afecta el temporizador", paragraphs: ["El temporizador no cambia el razonamiento de la IA, pero sí exige un flujo estable. Lo importante es no enviar la misma pregunta varias veces por doble clic, recarga o reintento."] },
      { heading: "Cuándo usar FocusScan", paragraphs: ["Si Testportal muestra la pregunta como imagen, PDF o texto bloqueado, selecciona solo la zona de pregunta y respuestas. Cuanto más limpia sea la selección, mejor contexto recibe la IA."] },
      { heading: "Repasar después de responder", paragraphs: ["Guarda las preguntas difíciles, añade notas y vuelve a ellas desde el historial. Así una respuesta rápida se convierte en material de estudio."], bullets: ["guardar explicaciones", "marcar temas débiles", "crear repaso desde el historial"] }
    ]
  },
  'guide-testportal-quiz-solver': {
    intro: [
      "Les tests Testportal sont souvent plus stricts qu’un simple formulaire. Une question peut apparaître par écran avec minuteur, réponses mélangées et alertes lorsque la fenêtre perd le focus.",
      "QuizSolver lit la question visible, l’associe aux réponses affichées et conserve le résultat dans l’historique pour la révision."
    ],
    sections: [
      { heading: "Ce que QuizSolver lit sur Testportal", paragraphs: ["L’extension recherche le vrai texte de la question, pas seulement des libellés comme \"Question 5\". Elle détecte aussi si la question accepte une ou plusieurs réponses."], bullets: ["questions à choix unique", "questions à choix multiple", "consignes courtes visibles", "images et graphiques avec FocusScan"] },
      { heading: "Pourquoi le minuteur compte", paragraphs: ["Le minuteur ne change pas le raisonnement de l’IA, mais rend le flux plus sensible. Il faut éviter de renvoyer la même question après un double clic, une actualisation ou un nouvel essai."] },
      { heading: "Quand utiliser FocusScan", paragraphs: ["Si Testportal affiche une question sous forme d’image, de PDF ou de texte bloqué, sélectionnez seulement la zone de la question et des réponses. Un cadrage propre donne un meilleur contexte."] },
      { heading: "Réviser après la réponse", paragraphs: ["Sauvegardez les questions difficiles, ajoutez une note et revenez-y depuis l’historique. Une réponse isolée devient alors une vraie base de révision."], bullets: ["sauvegarder les explications", "marquer les thèmes faibles", "réviser avec l’historique"] }
    ]
  },
  'guida-testportal-quiz-solver': {
    intro: [
      "I test su Testportal sono spesso più rigidi di un normale modulo. Puoi vedere una domanda per schermata, un timer, risposte mescolate e avvisi quando la finestra perde il focus.",
      "QuizSolver legge la domanda visibile, la collega alle opzioni presenti sullo schermo e salva il risultato nella cronologia per il ripasso."
    ],
    sections: [
      { heading: "Cosa legge QuizSolver su Testportal", paragraphs: ["L’estensione cerca il testo reale della domanda, non solo etichette come \"Domanda 5\". Riconosce anche se la domanda richiede una o più risposte."], bullets: ["scelta singola", "risposta multipla", "brevi prompt visibili", "immagini e grafici con FocusScan"] },
      { heading: "Come cambia il flusso con il timer", paragraphs: ["Il timer non cambia il ragionamento dell’AI, ma rende più importante evitare invii duplicati causati da doppio clic, refresh o retry."] },
      { heading: "Quando usare FocusScan", paragraphs: ["Se Testportal mostra la domanda come immagine, PDF o testo bloccato, seleziona solo l’area con domanda e risposte. Una selezione precisa dà all’AI un contesto migliore."] },
      { heading: "Ripassare dopo la risposta", paragraphs: ["Salva le domande difficili, aggiungi note e ripassale dalla cronologia. Così una risposta veloce diventa materiale di studio."], bullets: ["salvare spiegazioni", "segnare argomenti deboli", "ripassare dalla cronologia"] }
    ]
  },
  'testportal-quiz-solver-posibnyk': {
    intro: [
      "Тести Testportal часто суворіші за звичайну форму: одне питання на екрані, таймер, перемішані варіанти та попередження, коли вікно браузера втрачає фокус.",
      "QuizSolver читає видимий текст питання, зіставляє його з поточними варіантами відповідей і зберігає результат в історії для повторення."
    ],
    sections: [
      { heading: "Що QuizSolver читає в Testportal", paragraphs: ["Розширення шукає справжній текст питання, а не лише написи на кшталт \"Питання 5\". Також воно визначає, чи потрібна одна відповідь, чи кілька."], bullets: ["питання з одним варіантом", "питання з кількома варіантами", "короткі видимі завдання", "зображення та графіки через FocusScan"] },
      { heading: "Як таймер впливає на роботу", paragraphs: ["Таймер не змінює логіку AI, але робить стабільний процес важливішим. Варто уникати повторного надсилання того самого питання через подвійний клік, оновлення або повторну спробу."] },
      { heading: "Коли використовувати FocusScan", paragraphs: ["Якщо питання показано як зображення, PDF або заблокований текст, виділіть лише область питання й відповідей. Чистіша область дає AI кращий контекст."] },
      { heading: "Повторення після відповіді", paragraphs: ["Зберігайте складні питання, додавайте нотатки та повертайтеся до них з історії. Так одна відповідь стає матеріалом для навчання."], bullets: ["зберігати пояснення", "позначати слабкі теми", "повторювати питання з історії"] }
    ]
  },
  'moodle-quiz-solver-anleitung': {
    intro: [
      "Moodle-Quizze wirken einfach, aber viele Kurse nutzen gemischte Antworten, mehrere Seiten, Review-Einschränkungen und verschiedene Fragetypen in einem Versuch.",
      "QuizSolver funktioniert am besten, wenn es den aktuellen Moodle-Frageblock liest, das Antwortformat erkennt und den Kontext für spätere Wiederholung speichert."
    ],
    sections: [
      { heading: "Wichtige Moodle-Layouts", paragraphs: ["Manche Kurse zeigen alle Fragen auf einer Seite, andere teilen den Test auf mehrere Seiten auf. Der Parser sollte nur die sichtbare Frage lösen und Navigationstexte auslassen."], bullets: ["eine Seite", "mehrere Seiten", "gemischte Optionen", "Review-Seiten mit Feedback"] },
      { heading: "Gemischte Antworten", paragraphs: ["Wenn Moodle Antworten mischt, reicht die Position A, B oder C nicht aus. QuizSolver vergleicht den sichtbaren Text jeder Option und arbeitet mit dem tatsächlichen Inhalt."] },
      { heading: "Unterstützte Fragetypen", paragraphs: ["Typische Moodle-Tests enthalten Radio-Buttons, Checkboxen, Dropdowns, Kurzantworten und Bilder. Bei eingebetteten Grafiken hilft FocusScan."] },
      { heading: "Nach dem Absenden wiederholen", paragraphs: ["Review-Seiten in Moodle sind gutes Lernmaterial. Speichere Erklärungen, vergleiche sie mit Feedback und erstelle daraus eine Liste schwacher Themen."] }
    ]
  },
  'guia-moodle-quiz-solver': {
    intro: [
      "Los cuestionarios de Moodle parecen simples, pero muchos cursos usan respuestas mezcladas, intentos en varias páginas, restricciones de revisión y tipos de pregunta mezclados.",
      "QuizSolver funciona mejor cuando lee el bloque actual de Moodle, detecta el formato de respuesta y guarda el contexto para repasar después."
    ],
    sections: [
      { heading: "Diseños de Moodle que importan", paragraphs: ["Algunos cursos muestran todo en una página y otros dividen el intento. El parser debe resolver solo la pregunta visible y evitar textos de navegación o revisión."], bullets: ["intentos en una página", "intentos en varias páginas", "opciones mezcladas", "pantallas de revisión"] },
      { heading: "Respuestas mezcladas", paragraphs: ["Cuando Moodle mezcla respuestas, la posición de la opción no identifica la respuesta. QuizSolver compara el texto visible de cada opción y razona sobre el contenido real."] },
      { heading: "Tipos de pregunta", paragraphs: ["Moodle puede combinar radio, checkboxes, desplegables, respuestas cortas e imágenes. Si la pregunta está dentro de una imagen o documento, FocusScan captura la zona necesaria."] },
      { heading: "Repaso tras enviar", paragraphs: ["Las pantallas de revisión de Moodle son material de estudio valioso. Guarda explicaciones, compáralas con el feedback visible y crea una lista de temas débiles."] }
    ]
  },
  'guide-moodle-quiz-solver': {
    intro: [
      "Les quiz Moodle peuvent sembler simples, mais beaucoup de cours utilisent des réponses mélangées, plusieurs pages, des restrictions de révision et plusieurs types de questions.",
      "QuizSolver est plus fiable lorsqu’il lit le bloc de question actuel, détecte le format de réponse et garde assez de contexte pour la révision."
    ],
    sections: [
      { heading: "Mises en page Moodle importantes", paragraphs: ["Certains cours affichent tout sur une page, d’autres divisent la tentative. Le parser doit résoudre la question visible et ignorer la navigation ou les textes de revue."], bullets: ["tentative sur une page", "tentative sur plusieurs pages", "options mélangées", "écrans de revue"] },
      { heading: "Réponses mélangées", paragraphs: ["Lorsque Moodle mélange les réponses, la position A, B ou C ne suffit pas. QuizSolver compare le texte visible de chaque option et raisonne sur le contenu réel."] },
      { heading: "Types de questions", paragraphs: ["Moodle peut combiner boutons radio, cases à cocher, listes déroulantes, réponses courtes et images. FocusScan aide lorsque le texte est dans une image ou un document."] },
      { heading: "Réviser après l’envoi", paragraphs: ["Les écrans de revue Moodle sont utiles pour apprendre. Sauvegardez les explications, comparez-les au feedback visible et repérez les thèmes faibles."] }
    ]
  },
  'guida-moodle-quiz-solver': {
    intro: [
      "I quiz Moodle possono sembrare semplici, ma molti corsi usano risposte casuali, tentativi su più pagine, limiti alla revisione e tipi di domanda misti.",
      "QuizSolver funziona meglio quando legge il blocco domanda corrente, riconosce il formato della risposta e salva abbastanza contesto per il ripasso."
    ],
    sections: [
      { heading: "Layout Moodle importanti", paragraphs: ["Alcuni corsi mostrano tutto in una pagina, altri dividono il tentativo. Il parser deve risolvere solo la domanda visibile ed evitare testi di navigazione."] , bullets: ["tentativi su una pagina", "tentativi su più pagine", "opzioni casuali", "schermate di revisione"] },
      { heading: "Risposte casuali", paragraphs: ["Quando Moodle mescola le risposte, la posizione A, B o C non basta. QuizSolver confronta il testo visibile di ogni opzione e ragiona sul contenuto reale."] },
      { heading: "Tipi di domanda", paragraphs: ["Moodle può combinare radio, checkbox, menu a tendina, risposte brevi e immagini. FocusScan aiuta quando il testo è dentro un’immagine o un documento."] },
      { heading: "Ripasso dopo l’invio", paragraphs: ["Le schermate di revisione Moodle sono materiale utile. Salva spiegazioni, confrontale con il feedback visibile e crea una lista degli argomenti deboli."] }
    ]
  },
  'moodle-quiz-solver-posibnyk': {
    intro: [
      "Тести Moodle можуть виглядати простими, але багато курсів використовують перемішані відповіді, кілька сторінок, обмеження перегляду та різні типи питань.",
      "QuizSolver найкраще працює, коли читає поточний блок питання Moodle, визначає формат відповіді та зберігає контекст для повторення."
    ],
    sections: [
      { heading: "Важливі макети Moodle", paragraphs: ["Одні курси показують усі питання на одній сторінці, інші розбивають тест. Парсер має розв’язувати лише видиме питання й не додавати навігацію до запиту AI."], bullets: ["одна сторінка", "кілька сторінок", "перемішані варіанти", "екрани перегляду"] },
      { heading: "Перемішані відповіді", paragraphs: ["Коли Moodle перемішує відповіді, позиція A, B або C не є надійним ідентифікатором. QuizSolver порівнює видимий текст кожного варіанта."] },
      { heading: "Типи питань", paragraphs: ["У Moodle можуть бути radio, checkbox, списки, короткі відповіді та зображення. Якщо текст захований у графіці або документі, допомагає FocusScan."] },
      { heading: "Повторення після надсилання", paragraphs: ["Екрани перегляду Moodle корисні для навчання. Зберігайте пояснення, порівнюйте їх із видимим фідбеком і позначайте слабкі теми."] }
    ]
  },
  'canvas-quiz-solver-anleitung': {
    intro: [
      "Canvas kann Quizze als Classic Quizzes oder New Quizzes anzeigen, und die Struktur ist nicht immer gleich. Ein Solver darf Frage, Navigation und Kursanweisungen nicht vermischen.",
      "QuizSolver isoliert die sichtbare Canvas-Frage, erkennt die Antwortfelder und speichert die Erklärung im Verlauf."
    ],
    sections: [
      { heading: "Classic Quizzes und New Quizzes", paragraphs: ["Classic Quizzes haben meist vorhersehbare Blöcke, New Quizzes wirken eher wie eine App. Wichtig bleibt: erst die nächste Frage lesen, dann die sichtbaren Antwortoptionen verbinden."] },
      { heading: "Bilder und Dateien", paragraphs: ["Canvas-Kurse enthalten oft Screenshots, Diagramme, Formeln oder eingebettete Dateien. Wenn HTML-Text fehlt, erfasst FocusScan den relevanten Bereich."], bullets: ["Diagramme", "Formel-Screenshots", "gesperrter Text", "reichere Canvas-Layouts"] },
      { heading: "Mehrere richtige Antworten", paragraphs: ["Checkbox-Fragen brauchen andere Anweisungen als Single-Choice. QuizSolver markiert den Typ, bevor die Frage an AI geht."] },
      { heading: "Erklärungen speichern", paragraphs: ["Canvas-Feedback ist nicht immer dauerhaft verfügbar. Ein gespeicherter Verlauf hilft bei Wiederholungen, Nachprüfungen und ähnlichen Aufgaben."] }
    ]
  },
  'guia-canvas-quiz-solver': {
    intro: [
      "Canvas puede mostrar cuestionarios como Classic Quizzes o New Quizzes, y la estructura no siempre es igual. Un solver no debe mezclar la pregunta con navegación o instrucciones del curso.",
      "QuizSolver intenta aislar la pregunta visible de Canvas, detectar los controles de respuesta y guardar la explicación en el historial."
    ],
    sections: [
      { heading: "Classic Quizzes y New Quizzes", paragraphs: ["Classic Quizzes suele tener bloques previsibles, mientras New Quizzes puede parecer una app. La regla es leer la pregunta cercana y asociarla con las opciones visibles."] },
      { heading: "Imágenes y archivos", paragraphs: ["Los cursos de Canvas pueden incluir capturas, diagramas, fórmulas o archivos incrustados. Si el parser no ve texto suficiente, FocusScan captura la zona correcta."], bullets: ["diagramas", "fórmulas como imagen", "texto bloqueado", "diseños avanzados de Canvas"] },
      { heading: "Preguntas de varias respuestas", paragraphs: ["Los checkboxes necesitan instrucciones distintas a una pregunta de opción única. QuizSolver marca el tipo antes de resolver."] },
      { heading: "Guardar explicaciones", paragraphs: ["El feedback de Canvas no siempre queda disponible. Guardar pregunta, respuesta y explicación crea una ruta de repaso para exámenes o tareas similares."] }
    ]
  },
  'guide-canvas-quiz-solver': {
    intro: [
      "Canvas peut afficher des quiz via Classic Quizzes ou New Quizzes, avec une structure parfois très différente. Un solver ne doit pas mélanger question, navigation et consignes du cours.",
      "QuizSolver isole la question Canvas visible, détecte les contrôles de réponse et conserve l’explication dans l’historique."
    ],
    sections: [
      { heading: "Classic Quizzes et New Quizzes", paragraphs: ["Classic Quizzes expose souvent des blocs prévisibles, tandis que New Quizzes ressemble davantage à une application. Il faut lire la question proche puis l’associer aux choix visibles."] },
      { heading: "Images et fichiers", paragraphs: ["Les cours Canvas incluent souvent captures, diagrammes, formules ou fichiers intégrés. Si le texte HTML manque, FocusScan capture la zone utile."], bullets: ["diagrammes", "formules en image", "texte bloqué", "mises en page Canvas riches"] },
      { heading: "Questions à réponses multiples", paragraphs: ["Les cases à cocher demandent une instruction différente du choix unique. QuizSolver identifie le type avant de résoudre la question."] },
      { heading: "Sauvegarder les explications", paragraphs: ["Le feedback Canvas n’est pas toujours disponible longtemps. Sauvegarder la question, la réponse et l’explication crée une base de révision."] }
    ]
  },
  'guida-canvas-quiz-solver': {
    intro: [
      "Canvas può mostrare quiz come Classic Quizzes o New Quizzes, con strutture diverse. Un solver non deve mescolare domanda, navigazione e istruzioni del corso.",
      "QuizSolver isola la domanda visibile, riconosce i controlli di risposta e salva la spiegazione nella cronologia."
    ],
    sections: [
      { heading: "Classic Quizzes e New Quizzes", paragraphs: ["Classic Quizzes ha spesso blocchi prevedibili, mentre New Quizzes può sembrare un’app. La regola è leggere la domanda più vicina e collegarla alle opzioni visibili."] },
      { heading: "Immagini e file", paragraphs: ["I corsi Canvas includono spesso screenshot, diagrammi, formule o file incorporati. Se manca testo HTML leggibile, FocusScan cattura l’area utile."], bullets: ["diagrammi", "formule in immagine", "testo bloccato", "layout Canvas più ricchi"] },
      { heading: "Domande con più risposte", paragraphs: ["Le checkbox richiedono istruzioni diverse rispetto alla scelta singola. QuizSolver riconosce il tipo prima di risolvere."] },
      { heading: "Salvare le spiegazioni", paragraphs: ["Il feedback di Canvas non resta sempre disponibile. Salvare domanda, risposta e spiegazione crea materiale di ripasso per esami e compiti simili."] }
    ]
  },
  'canvas-quiz-solver-posibnyk': {
    intro: [
      "Canvas може показувати тести через Classic Quizzes або New Quizzes, і структура сторінки не завжди однакова. Важливо не змішувати питання з навігацією чи інструкціями курсу.",
      "QuizSolver ізолює видиме питання Canvas, визначає поля відповідей і зберігає пояснення в історії."
    ],
    sections: [
      { heading: "Classic Quizzes і New Quizzes", paragraphs: ["Classic Quizzes часто має передбачувані блоки, а New Quizzes може виглядати як окрема програма. Правило одне: читати найближче питання й видимі варіанти."] },
      { heading: "Зображення та файли", paragraphs: ["Курси Canvas часто містять скриншоти, діаграми, формули або вкладені файли. Якщо HTML-тексту недостатньо, FocusScan захоплює потрібну область."], bullets: ["діаграми", "формули як зображення", "заблокований текст", "складніші макети Canvas"] },
      { heading: "Питання з кількома відповідями", paragraphs: ["Checkbox-питання потребують іншої інструкції, ніж вибір одного варіанта. QuizSolver визначає тип перед розв’язанням."] },
      { heading: "Збереження пояснень", paragraphs: ["Фідбек Canvas не завжди доступний довго. Збережені питання, відповіді й пояснення створюють матеріал для повторення."] }
    ]
  },
  'erkennt-testportal-tabs-und-fensterwechsel': {
    intro: [
      "Testportal sieht nicht magisch den ganzen Computer, kann aber Ereignisse erkennen, die normale Webseiten im Browser beobachten dürfen.",
      "Dazu gehören Tab-Sichtbarkeit, Fokusverlust, Verlassen des Vollbildmodus und Zeit außerhalb der aktiven Testseite."
    ],
    sections: [
      { heading: "Was Testportal typischerweise erkennt", paragraphs: ["Eine Quizseite kann wissen, dass ihr Tab nicht mehr aktiv ist oder das Browserfenster den Fokus verloren hat. Das sagt nicht exakt, was passiert ist, kann aber im Bericht erscheinen."], bullets: ["Tab- oder Appwechsel", "Vollbild verlassen", "Fokusverlust", "Zeit außerhalb des Tests"] },
      { heading: "Was eine normale Webseite nicht sieht", paragraphs: ["Ohne separate Proctoring-App kann eine Webseite keine Programme scannen, andere Tabs lesen, lokale Dateien öffnen oder den Desktop heimlich beobachten."] },
      { heading: "Welche Rolle Erweiterungen spielen", paragraphs: ["Eine Chrome-Erweiterung läuft im Browser, aber die Testseite kennt nicht automatisch jede installierte Erweiterung. Erkennung passiert meist indirekt."] },
      { heading: "Sicherere KI-Nutzung", paragraphs: ["Am sichersten ist KI vor und nach bewerteten Versuchen: Fragen speichern, Erklärungen lesen, Notizen erstellen und schwache Themen wiederholen."] }
    ]
  },
  'testportal-detecta-pestanas-y-cambio-de-ventana': {
    intro: [
      "Testportal no ve mágicamente todo el ordenador, pero sí puede reaccionar a eventos que una página web normal puede observar.",
      "Los más comunes son cambios de visibilidad de la pestaña, pérdida de foco, salida de pantalla completa y tiempo fuera del test activo."
    ],
    sections: [
      { heading: "Qué suele detectar Testportal", paragraphs: ["Una página de quiz puede saber que su pestaña ya no está activa o que la ventana perdió el foco. No revela exactamente qué hizo el usuario, pero puede registrarse."], bullets: ["cambio de pestaña o app", "salida de pantalla completa", "eventos de foco", "tiempo fuera del test"] },
      { heading: "Qué no ve una web normal", paragraphs: ["Sin una app de supervisión separada, una web no puede leer programas abiertos, inspeccionar otras pestañas, acceder a archivos locales ni mirar el escritorio."] },
      { heading: "Dónde entran las extensiones", paragraphs: ["Una extensión de Chrome corre en el navegador, pero la página del test no conoce automáticamente todas las extensiones instaladas. La detección suele ser indirecta."] },
      { heading: "Uso más seguro de IA", paragraphs: ["Lo más seguro es usar IA antes y después de intentos evaluados: guardar preguntas, leer explicaciones, crear notas y repasar puntos débiles."] }
    ]
  },
  'testportal-detecte-onglets-et-changement-de-fenetre': {
    intro: [
      "Testportal ne voit pas magiquement tout l’ordinateur, mais peut réagir à des événements qu’une page web normale a le droit d’observer.",
      "Les signaux courants sont la perte de visibilité de l’onglet, la perte de focus, la sortie du plein écran et le temps hors de la page active."
    ],
    sections: [
      { heading: "Ce que Testportal détecte généralement", paragraphs: ["Une page de quiz peut savoir que son onglet n’est plus actif ou que la fenêtre a perdu le focus. Cela ne dit pas exactement ce que l’utilisateur a fait, mais peut être journalisé."] , bullets: ["changement d’onglet ou d’application", "sortie du plein écran", "perte de focus", "temps hors du test"] },
      { heading: "Ce qu’une page normale ne voit pas", paragraphs: ["Sans application de surveillance séparée, une page web ne peut pas lire les programmes ouverts, inspecter d’autres onglets, accéder aux fichiers locaux ou voir le bureau."] },
      { heading: "Le rôle des extensions", paragraphs: ["Une extension Chrome fonctionne dans le navigateur, mais la page du test ne connaît pas automatiquement toutes les extensions installées. La détection est souvent indirecte."] },
      { heading: "Usage plus sûr de l’IA", paragraphs: ["L’usage le plus sûr reste avant et après les tentatives évaluées : sauvegarder les questions, lire les explications, créer des notes et réviser les points faibles."] }
    ]
  },
  'testportal-rileva-schede-e-cambio-finestra': {
    intro: [
      "Testportal non vede magicamente tutto il computer, ma può reagire agli eventi che una normale pagina web può osservare.",
      "I segnali più comuni sono cambio di visibilità della scheda, perdita del focus, uscita dallo schermo intero e tempo lontano dalla pagina del test."
    ],
    sections: [
      { heading: "Cosa può rilevare Testportal", paragraphs: ["Una pagina quiz può sapere che la scheda non è più attiva o che la finestra ha perso il focus. Non dice esattamente cosa è successo, ma può essere registrato."] , bullets: ["cambio scheda o app", "uscita da schermo intero", "perdita del focus", "tempo fuori dal test"] },
      { heading: "Cosa non vede una pagina normale", paragraphs: ["Senza un’app di proctoring separata, una pagina non può leggere programmi aperti, ispezionare altre schede, accedere ai file locali o vedere il desktop."] },
      { heading: "Il ruolo delle estensioni", paragraphs: ["Un’estensione Chrome gira nel browser, ma la pagina del test non conosce automaticamente tutte le estensioni installate. La rilevazione è di solito indiretta."] },
      { heading: "Uso più sicuro dell’AI", paragraphs: ["L’uso più sicuro è prima e dopo i tentativi valutati: salvare domande, leggere spiegazioni, creare note e ripassare argomenti deboli."] }
    ]
  },
  'chy-testportal-vyiavliaie-vkladky-ta-zminu-vikna': {
    intro: [
      "Testportal не бачить магічно весь комп’ютер, але може реагувати на події, які звичайна вебсторінка має право спостерігати.",
      "Найчастіше це зміна видимості вкладки, втрата фокусу, вихід із повного екрана та час поза активною сторінкою тесту."
    ],
    sections: [
      { heading: "Що Testportal зазвичай може виявити", paragraphs: ["Сторінка тесту може знати, що її вкладка більше не активна або що вікно втратило фокус. Це не показує точну дію користувача, але може бути записано."] , bullets: ["перехід на іншу вкладку чи програму", "вихід із повного екрана", "втрата фокусу", "час поза тестом"] },
      { heading: "Чого звичайна сторінка не бачить", paragraphs: ["Без окремої програми прокторингу сайт не може читати відкриті програми, переглядати інші вкладки, відкривати локальні файли або бачити робочий стіл."] },
      { heading: "Де тут розширення", paragraphs: ["Chrome-розширення працює у браузері, але сторінка тесту не знає автоматично всі встановлені розширення. Виявлення зазвичай непряме."] },
      { heading: "Безпечніше використання AI", paragraphs: ["Найбезпечніше використовувати AI до і після оцінюваних спроб: зберігати питання, читати пояснення, робити нотатки й повторювати слабкі теми."] }
    ]
  }
};

const ARTICLE_DRAFTS: Record<string, ArticleDraft> = {
  'socrative-quiz-solver-guide': {
    intro: [
      'Socrative is built for live classroom activity: rooms, quick questions, quizzes, exit tickets and fast answer collection. That speed is useful for teachers, but it also means a student often sees one compact question at a time with limited context around it.',
      'QuizSolver works best on Socrative when it focuses on the current visible question, reads the answer choices or short-response field and saves the explanation afterward. The goal is not only to move faster during practice, but to turn live questions into revision material you can study later.'
    ],
    sections: [
      {
        heading: 'What QuizSolver reads on Socrative',
        paragraphs: ['A Socrative activity may show multiple-choice answers, true/false choices, short-answer prompts or exit-ticket questions. QuizSolver tries to isolate the visible prompt and pair it with the controls currently shown on the page instead of sending room labels, navigation text or unrelated classroom UI to AI.'],
        bullets: ['multiple-choice and true/false choices', 'short-response prompts', 'exit-ticket questions', 'visible images or diagrams through FocusScan']
      },
      {
        heading: 'Live rooms need a clean workflow',
        paragraphs: ['Because Socrative questions can change quickly, the safest workflow is simple: wait until the question is fully visible, open QuizSolver, review the suggested answer and avoid repeated clicks on the same prompt. If the question text did not change, saved history can help avoid treating the same item as a fresh solve.']
      },
      {
        heading: 'When FocusScan is better than normal parsing',
        paragraphs: ['Some Socrative activities include screenshots, diagrams, formulas or projected text that is not exposed as clean HTML. In those cases, FocusScan is more reliable: select only the question area and the answer options. A small, focused capture gives AI better context than a full-page screenshot with the room code, timer or extra labels.']
      },
      {
        heading: 'Use explanations after the activity',
        paragraphs: ['The most useful part of a Socrative solve is often the explanation saved afterward. A live question disappears quickly, but saved history keeps the prompt, answer and reasoning available for review before the next class or quiz.'],
        bullets: ['save confusing Socrative questions', 'add notes while the topic is still fresh', 'turn repeated mistakes into a practice set']
      },
      {
        heading: 'Best settings for stable Socrative solving',
        paragraphs: ['Use the extension on the active Socrative tab, keep only the relevant question visible when possible and switch to FocusScan when the parser sees only generic labels. For unusual layouts, a screenshot-based solve is usually cleaner than forcing the universal parser to guess from incomplete page text.']
      }
    ]
  },
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
  },
  'testportal-quiz-solver-guide': {
    intro: [
      'Testportal quiz pages are usually stricter than a simple form. A student may see one question at a time, a visible timer, answer options that are shuffled between attempts and warnings when the browser loses focus. That layout is exactly why a generic copy-paste workflow often fails.',
      'QuizSolver is designed to read the visible question context from the current Testportal screen, match it with the visible answer choices and keep a saved history so the question is useful again after the attempt ends.'
    ],
    sections: [
      {
        heading: 'What QuizSolver reads on Testportal',
        paragraphs: ['The extension looks for the actual question text, not only labels such as "Question 5". It also collects the answer options, detects whether the question is single-choice or multiple-choice and keeps nearby image context when the quiz includes diagrams or screenshots.'],
        bullets: ['single-choice radio questions', 'multiple-answer checkbox questions', 'short visible prompts', 'image and chart questions through FocusScan']
      },
      {
        heading: 'How timers change the workflow',
        paragraphs: ['A timer does not change the AI reasoning, but it changes the ergonomics. The important part is to avoid repeatedly sending the same question because of double clicks, refreshes or retries. QuizSolver stores a normalized question fingerprint and can reuse the saved result instead of spending another credit for the same prompt.']
      },
      {
        heading: 'When to use FocusScan',
        paragraphs: ['If Testportal displays the question as an image, inside a locked document preview or in a layout that does not expose clean HTML text, FocusScan is the safer mode. Select only the question and answer area. A tight selection gives AI cleaner context than a full-page screenshot with navigation, timers and unrelated labels.']
      },
      {
        heading: 'What to do after the answer',
        paragraphs: ['The strongest Testportal workflow starts after the first solve. Save difficult questions, add a note, mark weak topics and review them later from question history. This turns a one-time answer into a private practice set for the next test.'],
        bullets: ['save explanations for review', 'filter weak questions later', 'turn previous Testportal questions into practice material']
      }
    ]
  },
  'testportal-quiz-solver-jak-dziala': {
    intro: [
      'Testportal często działa inaczej niż zwykły formularz. Widzisz jedno pytanie naraz, licznik czasu, przyciski nawigacji, czasem tryb pełnoekranowy i odpowiedzi losowane w innej kolejności. Dlatego samo kopiowanie tekstu do chatu szybko robi się chaotyczne.',
      'QuizSolver skupia się na aktualnie widocznej treści pytania, widocznych odpowiedziach i typie pola. Po rozwiązaniu zapisuje pytanie w historii, żeby później można było wrócić do niego jak do materiału powtórkowego.'
    ],
    sections: [
      {
        heading: 'Co rozszerzenie czyta na Testportalu',
        paragraphs: ['Parser powinien brać prawdziwą treść pytania, a nie same napisy typu "Pytanie 5". QuizSolver łączy tekst pytania z opcjami odpowiedzi, rozpoznaje radio, checkboxy i sytuacje, w których potrzebny jest FocusScan.'],
        bullets: ['pytania jednokrotnego wyboru', 'pytania wielokrotnego wyboru', 'krótkie widoczne polecenia', 'obrazy, wykresy i zablokowany tekst przez FocusScan']
      },
      {
        heading: 'Dlaczego timer jest wazny',
        paragraphs: ['Timer nie zmienia samego rozumowania AI, ale wymusza szybki i stabilny workflow. Najgorszy przypadek to ponowne wysłanie tego samego pytania przez odświeżenie, podwójne kliknięcie albo retry. Dlatego QuizSolver opiera się na odcisku pytania i historii, żeby nie traktować tej samej treści jak nowego zadania.']
      },
      {
        heading: 'Kiedy użyć FocusScan',
        paragraphs: ['Gdy pytanie jest obrazem, fragmentem PDF albo elementem, którego strona nie wystawia jako czystego tekstu HTML, zaznacz tylko obszar pytania i odpowiedzi. Im mniej na screenie licznika, menu i numeracji, tym lepszy kontekst dostaje AI.']
      },
      {
        heading: 'Najlepszy sposób na naukę po teście',
        paragraphs: ['Po rozwiązaniu pytania warto zapisać wyjaśnienie, dodać notatkę i oznaczyć trudny temat. Historia pytań jest mocniejsza niż pojedyncza odpowiedź, bo pozwala zbudować własny zestaw powtórkowy przed kolejnym sprawdzianem.'],
        bullets: ['wracaj do wyjaśnień', 'oznaczaj pytania, które sprawiły problem', 'rób powtórkę z historii zamiast zaczynać od zera']
      }
    ]
  },
  'moodle-quiz-solver-guide': {
    intro: [
      'Moodle quizzes can look simple, but many courses use shuffled answers, multi-page attempts, review restrictions and mixed question types inside the same activity. That makes Moodle one of the platforms where structured parsing matters more than raw page text.',
      'QuizSolver works best when it reads the current Moodle question block, detects the answer format and stores the result with enough context to review it later.'
    ],
    sections: [
      {
        heading: 'Moodle layouts that matter',
        paragraphs: ['Some Moodle courses show all questions on one page. Others split the quiz into pages or use one question per screen. The extension should solve the visible question only and avoid bundling navigation text, page numbers or unrelated review labels into the AI prompt.'],
        bullets: ['one-page attempts', 'multi-page attempts', 'shuffled options', 'review pages with saved feedback']
      },
      {
        heading: 'Shuffled answers and multiple attempts',
        paragraphs: ['When Moodle shuffles answers, option order is not a reliable identifier. QuizSolver compares the text of each visible option and asks AI to reason over the actual choices, so an answer saved from one order does not blindly map to a different order.']
      },
      {
        heading: 'Question types supported',
        paragraphs: ['Typical Moodle quizzes mix radio choices, checkboxes, dropdowns, short answers and matching-like layouts. If a question includes an image, chart or embedded document, FocusScan can capture the exact region that contains the missing context.']
      },
      {
        heading: 'Review after submitting',
        paragraphs: ['Moodle review screens are valuable study material. Save explanations, compare them with instructor feedback when it is visible and build a practice set from the questions that took the longest or had the weakest confidence.']
      }
    ]
  },
  'moodle-quiz-solver-jak-uzyc': {
    intro: [
      'Quizy Moodle potrafią być proste tylko z wyglądu. Kurs może losować odpowiedzi, dzielić test na kilka stron, blokować podgląd po wysłaniu albo mieszać wiele typów pytań w jednym podejściu.',
      'QuizSolver najlepiej działa wtedy, gdy analizuje aktualny blok pytania, rozpoznaje typ odpowiedzi i zapisuje wynik z kontekstem potrzebnym do późniejszej powtórki.'
    ],
    sections: [
      {
        heading: 'Układy Moodle, które trzeba rozróżniać',
        paragraphs: ['Czasem Moodle pokazuje wszystkie pytania na jednej stronie, a czasem tylko jedno pytanie na ekran. Dobry parser nie powinien wysyłać do AI numeracji, panelu nawigacji ani tekstów typu "Następna strona" jako treści pytania.'],
        bullets: ['test na jednej stronie', 'test na wielu stronach', 'losowa kolejność odpowiedzi', 'ekran podglądu po zakończonym podejściu']
      },
      {
        heading: 'Losowe odpowiedzi i kolejne podejścia',
        paragraphs: ['Przy losowych odpowiedziach sama pozycja A, B, C nie wystarcza. QuizSolver powinien porównywać treść widocznych opcji i prosić AI o decyzję na podstawie realnych odpowiedzi, a nie na podstawie starej kolejności z poprzedniego podejścia.']
      },
      {
        heading: 'Typy pytań w Moodle',
        paragraphs: ['Najczęściej trafiają się radio, checkboxy, listy rozwijane, krótkie odpowiedzi i pytania z obrazem. Gdy tekst jest częścią grafiki albo osadzonego dokumentu, FocusScan pozwala zaznaczyć tylko potrzebny fragment.']
      },
      {
        heading: 'Powtórka po wysłaniu quizu',
        paragraphs: ['Ekran podglądu w Moodle jest świetnym materiałem do nauki. Zapisz pytania, sprawdź wyjaśnienia, porównaj je z feedbackiem prowadzącego i zrób listę tematów, które wymagają powrotu.']
      }
    ]
  },
  'canvas-quiz-solver-guide': {
    intro: [
      'Canvas can serve quizzes through Classic Quizzes or New Quizzes, and the page structure is not always the same. A solver that only scrapes a large text blob can mix question content with instructions, navigation and unrelated labels.',
      'QuizSolver aims to isolate the visible Canvas question, identify the answer controls and keep the explanation in history so a solved quiz becomes useful revision material.'
    ],
    sections: [
      {
        heading: 'Classic Quizzes vs New Quizzes',
        paragraphs: ['Classic Quizzes usually expose predictable question blocks, while New Quizzes can use a more app-like layout. The important rule is the same: read the closest question text, then pair it with the visible answer choices before asking AI.']
      },
      {
        heading: 'Image and file-based prompts',
        paragraphs: ['Canvas courses often include screenshots, diagrams, formulas or images inside a prompt. When the normal parser cannot read enough text, FocusScan can capture the prompt and choices as a screenshot-based input.'],
        bullets: ['charts and diagrams', 'formula screenshots', 'locked text or embedded files', 'questions inside richer Canvas layouts']
      },
      {
        heading: 'Multiple-answer questions',
        paragraphs: ['Checkbox questions need different instructions than single-choice questions. QuizSolver marks the type before solving so AI can return one answer for radio fields or multiple answers when the visible control allows it.']
      },
      {
        heading: 'Save explanations for review',
        paragraphs: ['Canvas quiz feedback is not always available forever. Saving the question, answer and explanation creates a personal review trail you can use before finals, retakes or similar assignments.']
      }
    ]
  },
  'canvas-quiz-solver-jak-uzyc': {
    intro: [
      'Canvas ma różne układy quizów: Classic Quizzes, New Quizzes, pytania z obrazem, instrukcje kursu i czasem bardziej aplikacyjny interfejs. Jeżeli solver bierze cały tekst strony, łatwo pomylić polecenie z nawigacją albo opisem kursu.',
      'QuizSolver celuje w widoczną treść pytania, opcje odpowiedzi i typ kontrolki. Potem zapisuje wyjaśnienie, żeby pytanie nie zniknęło po zamknięciu quizu.'
    ],
    sections: [
      {
        heading: 'Classic Quizzes i New Quizzes',
        paragraphs: ['Classic Quizzes zwykle mają bardziej przewidywalne bloki pytań. New Quizzes mogą wyglądać jak osobna aplikacja. W obu przypadkach najważniejsze jest czytanie najbliższego pytania razem z odpowiedziami, a nie losowych tekstów z całej strony.']
      },
      {
        heading: 'Pytania z obrazem i plikiem',
        paragraphs: ['W Canvas często pojawiają się wykresy, screeny, wzory albo elementy wstawione jako obraz. Gdy parser nie widzi pełnego tekstu, FocusScan pozwala zaznaczyć obszar z pytaniem i odpowiedziami.'],
        bullets: ['wykresy i diagramy', 'wzory jako screen', 'zablokowany tekst', 'pytania w bogatszym układzie Canvas']
      },
      {
        heading: 'Pytania wielokrotnego wyboru',
        paragraphs: ['Checkbox wymaga innej instrukcji niż radio. QuizSolver rozpoznaje typ pytania przed wysłaniem do AI, żeby odpowiedź mogła zawierać jedną opcję albo kilka opcji, gdy pytanie tego wymaga.']
      },
      {
        heading: 'Historia jako material do nauki',
        paragraphs: ['Feedback w Canvas nie zawsze jest dostępny długo. Zapisanie pytania, odpowiedzi i wyjaśnienia tworzy prywatną ścieżkę powtórki przed kolokwium, poprawką albo podobnym zadaniem.']
      }
    ]
  },
  'does-testportal-detect-tabs-and-window-switching': {
    intro: [
      'Testportal cannot magically see an entire computer through a normal browser tab, but it can react to events that websites are allowed to observe. The most common signals are tab visibility changes, window focus loss, fullscreen exits and time spent away from the active test page.',
      'That difference matters. A realistic understanding of detection is more useful than myths about hidden screen access, and it also helps students use AI tools more responsibly for preparation and review.'
    ],
    sections: [
      {
        heading: 'What Testportal can usually detect',
        paragraphs: ['A web quiz can know that its tab is no longer active or that the browser window lost focus. That does not reveal exactly what the user did, but the platform may log it as leaving the test environment.'],
        bullets: ['switching to another tab or app', 'leaving fullscreen mode', 'focus loss events', 'time away from the active test tab']
      },
      {
        heading: 'What a normal website cannot see',
        paragraphs: ['Without a separate proctoring app or browser-level permission, a website cannot read the list of open programs, inspect unrelated tabs, access local files or silently watch the full desktop. Browsers intentionally block that kind of access.']
      },
      {
        heading: 'Where extensions fit in',
        paragraphs: ['A Chrome extension runs in the browser, but that does not mean the quiz page automatically knows every extension installed by the user. Detection is usually indirect: focus changes, unusual page behavior, pasted text patterns or external proctoring software.']
      },
      {
        heading: 'Safer AI use for Testportal',
        paragraphs: ['The safest way to use AI is before and after assessed attempts: save practice questions, read explanations, create notes and turn weak areas into review quizzes. QuizSolver history is built for that study loop.']
      }
    ]
  }
};

const metadata = rawPosts as BlogPostMetadata[];

export const BLOG_POST_MANIFEST: BlogPostMetadata[] = metadata;

export const BLOG_POSTS: BlogPost[] = metadata
  .map((post) => ({
    ...post,
    content: renderArticle(post.locale, ARTICLE_DRAFTS[post.slug] || TRANSLATED_ARTICLE_DRAFTS[post.slug] || genericLocalizedDraft(post.locale))
  }))
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished));
