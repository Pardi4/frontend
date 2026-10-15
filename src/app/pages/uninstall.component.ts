import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

interface SurveyTranslations {
  metaTitle: string;
  headerTitle: string;
  headerSubtitle: string;
  reasonsLabel: string;
  reasons: Record<string, string>;
  platformLabel: string;
  platformPlaceholder: string;
  feedbackLabel: string;
  feedbackPlaceholder: string;
  emailLabel: string;
  emailSub: string;
  emailPlaceholder: string;
  submitBtn: string;
  submittingBtn: string;
  skipBtn: string;
  errSelectReason: string;
  errInvalidEmail: string;
  errSubmitFailed: string;
  successTitle: string;
  successSubtitle: string;
  homeBtn: string;
  reinstallBtn: string;
  rights: string;
}

const REASON_KEYS: Array<{ key: string; icon: string }> = [
  { key: 'not_working', icon: '⚠️' },
  { key: 'too_expensive', icon: '💰' },
  { key: 'hard_to_use', icon: '🧩' },
  { key: 'exams_finished', icon: '🎓' },
  { key: 'inaccurate_ai', icon: '🤖' },
  { key: 'alternative_found', icon: '🔄' },
  { key: 'privacy_concern', icon: '🛡️' },
  { key: 'other', icon: '✏️' }
];

const TRANSLATIONS: Record<string, SurveyTranslations> = {
  pl: {
    metaTitle: 'Ankieta odinstalowania rozszerzenia | QuizSolver',
    headerTitle: 'Przykro nam, że odchodzisz...',
    headerSubtitle: 'Twój feedback jest dla nas bezcenny. Powiedz nam, co poszło nie tak, abyśmy mogli to naprawić dla Ciebie i innych użytkowników.',
    reasonsLabel: 'Dlaczego odinstalowujesz QuizSolver? (możesz zaznaczyć kilka)',
    reasons: {
      not_working: 'Nie działało na moim teście / stronie',
      too_expensive: 'Za mało darmowych kredytów / za drogo',
      hard_to_use: 'Skomplikowane w obsłudze / nie wiedziałem jak zacząć',
      exams_finished: 'Skończyłem sesję / egzaminy (już nie potrzebuję)',
      inaccurate_ai: 'AI podawało błędne odpowiedzi',
      alternative_found: 'Znalazłem inne narzędzie',
      privacy_concern: 'Obawy o prywatność lub uprawnienia',
      other: 'Inny powód'
    },
    platformLabel: 'Na jakiej stronie / platformie pojawił się problem?',
    platformPlaceholder: 'np. Testportal, Microsoft Forms, Moodle, Canvas, link do strony...',
    feedbackLabel: 'Co możemy poprawić? Masz dodatkowe uwagi? (opcjonalnie)',
    feedbackPlaceholder: 'Napisz śmiało, co sprawiło problem lub jakiej funkcji Ci zabrakło...',
    emailLabel: 'Twój e-mail (opcjonalnie)',
    emailSub: '— napiszemy, gdy to naprawimy i chętnie przyznamy Ci darmowy pakiet kredytów',
    emailPlaceholder: 'twoj-email@domena.pl',
    submitBtn: 'Wyślij opinię',
    submittingBtn: 'Wysyłanie...',
    skipBtn: 'Przejdź do strony głównej',
    errSelectReason: 'Prosimy o zaznaczenie przynajmniej jednego powodu lub wpisanie uwagi.',
    errInvalidEmail: 'Wprowadzony adres e-mail ma niepoprawny format.',
    errSubmitFailed: 'Wystąpił błąd podczas wysyłania opinii. Dziękujemy za Twój czas!',
    successTitle: 'Dziękujemy za Twoją opinię!',
    successSubtitle: 'Twoje uwagi trafiły bezpośrednio do naszego zespołu. Pomoże nam to ulepszyć QuizSolver w kolejnych aktualizacjach.',
    homeBtn: 'Strona główna',
    reinstallBtn: 'Zainstaluj ponownie ↗',
    rights: 'Wszelkie prawa zastrzeżone.'
  },
  en: {
    metaTitle: 'Uninstall Survey | QuizSolver',
    headerTitle: "We're sorry to see you go...",
    headerSubtitle: 'Your feedback means the world to us. Please tell us what went wrong so we can improve QuizSolver for you and future students.',
    reasonsLabel: 'Why did you uninstall QuizSolver? (select all that apply)',
    reasons: {
      not_working: 'Did not work on my quiz/exam website',
      too_expensive: 'Not enough free credits / too expensive',
      hard_to_use: 'Too complicated / hard to figure out',
      exams_finished: 'Finished my semester/exams (no longer need it)',
      inaccurate_ai: 'AI provided incorrect answers',
      alternative_found: 'Found another alternative tool',
      privacy_concern: 'Privacy or permission concerns',
      other: 'Other reason'
    },
    platformLabel: 'Which website or testing platform did not work?',
    platformPlaceholder: 'e.g. Canvas, Moodle, Testportal, Google Forms, URL...',
    feedbackLabel: 'What could we improve? Any additional details? (optional)',
    feedbackPlaceholder: 'Tell us what was missing or what caused an issue...',
    emailLabel: 'Your email (optional)',
    emailSub: '— we will notify you when fixed and gift you free credits',
    emailPlaceholder: 'your-email@example.com',
    submitBtn: 'Submit feedback',
    submittingBtn: 'Sending...',
    skipBtn: 'Skip & visit homepage',
    errSelectReason: 'Please select at least one reason or provide feedback.',
    errInvalidEmail: 'Invalid email format.',
    errSubmitFailed: 'Could not submit feedback. Thank you for your time!',
    successTitle: 'Thank you for your feedback!',
    successSubtitle: 'Your response was delivered directly to our engineering team. It will directly shape our upcoming updates.',
    homeBtn: 'Go to homepage',
    reinstallBtn: 'Reinstall extension ↗',
    rights: 'All rights reserved.'
  },
  de: {
    metaTitle: 'Deinstallationsumfrage | QuizSolver',
    headerTitle: 'Es tut uns leid, dass du gehst...',
    headerSubtitle: 'Dein Feedback ist für uns unbezahlbar. Bitte sag uns, was schiefgelaufen ist, damit wir QuizSolver für dich und andere verbessern können.',
    reasonsLabel: 'Warum hast du QuizSolver deinstalliert? (Mehrfachauswahl möglich)',
    reasons: {
      not_working: 'Funktionierte auf meiner Test-Website nicht',
      too_expensive: 'Zu wenige kostenlose Credits / zu teuer',
      hard_to_use: 'Zu kompliziert / schwer zu verstehen',
      exams_finished: 'Prüfungen/Semester beendet (nicht mehr benötigt)',
      inaccurate_ai: 'KI hat falsche Antworten geliefert',
      alternative_found: 'Habe ein anderes Tool gefunden',
      privacy_concern: 'Bedenken bezüglich Datenschutz oder Berechtigungen',
      other: 'Anderer Grund'
    },
    platformLabel: 'Auf welcher Website / Plattform trat das Problem auf?',
    platformPlaceholder: 'z.B. Moodle, Canvas, Google Forms, Website-Link...',
    feedbackLabel: 'Was können wir verbessern? Zusätzliche Anmerkungen? (optional)',
    feedbackPlaceholder: 'Schreib uns gerne, was gefehlt hat oder Probleme bereitete...',
    emailLabel: 'Deine E-Mail-Adresse (optional)',
    emailSub: '— wir melden uns bei Behebung und schenken dir gerne Gratis-Credits',
    emailPlaceholder: 'deine-email@beispiel.de',
    submitBtn: 'Feedback senden',
    submittingBtn: 'Wird gesendet...',
    skipBtn: 'Überspringen & zur Startseite',
    errSelectReason: 'Bitte wähle mindestens einen Grund aus oder gib Feedback ein.',
    errInvalidEmail: 'Ungültiges E-Mail-Format.',
    errSubmitFailed: 'Fehler beim Senden des Feedbacks. Vielen Dank für deine Zeit!',
    successTitle: 'Vielen Dank für dein Feedback!',
    successSubtitle: 'Deine Rückmeldung ging direkt an unser Entwicklerteam. Sie hilft uns, QuizSolver in kommenden Updates zu verbessern.',
    homeBtn: 'Zur Startseite',
    reinstallBtn: 'Erweiterung neu installieren ↗',
    rights: 'Alle Rechte vorbehalten.'
  },
  es: {
    metaTitle: 'Encuesta de desinstalación | QuizSolver',
    headerTitle: 'Lamentamos que te vayas...',
    headerSubtitle: 'Tus comentarios son muy valiosos. Cuéntanos qué salió mal para que podamos mejorar QuizSolver para ti y otros estudiantes.',
    reasonsLabel: '¿Por qué desinstalaste QuizSolver? (puedes seleccionar varios)',
    reasons: {
      not_working: 'No funcionó en la página de mi examen/cuestionario',
      too_expensive: 'Pocos créditos gratuitos / demasiado caro',
      hard_to_use: 'Demasiado complicado / difícil de entender',
      exams_finished: 'Terminé mis exámenes/semestre (ya no lo necesito)',
      inaccurate_ai: 'La IA proporcionó respuestas incorrectas',
      alternative_found: 'Encontré otra herramienta alternativa',
      privacy_concern: 'Preocupaciones sobre privacidad o permisos',
      other: 'Otro motivo'
    },
    platformLabel: '¿En qué sitio web o plataforma ocurrió el problema?',
    platformPlaceholder: 'ej. Canvas, Moodle, Google Forms, enlace al sitio...',
    feedbackLabel: '¿Qué podríamos mejorar? ¿Algún detalle adicional? (opcional)',
    feedbackPlaceholder: 'Cuéntanos qué faltó o qué causó problemas...',
    emailLabel: 'Tu correo electrónico (opcional)',
    emailSub: '— te avisaremos cuando esté solucionado y te regalaremos créditos gratis',
    emailPlaceholder: 'tu-email@ejemplo.com',
    submitBtn: 'Enviar comentarios',
    submittingBtn: 'Enviando...',
    skipBtn: 'Omitir e ir a la página principal',
    errSelectReason: 'Por favor, selecciona al menos un motivo o escribe un comentario.',
    errInvalidEmail: 'Formato de correo electrónico no válido.',
    errSubmitFailed: 'Error al enviar los comentarios. ¡Gracias por tu tiempo!',
    successTitle: '¡Gracias por tus comentarios!',
    successSubtitle: 'Tus comentarios llegaron directamente a nuestro equipo de desarrollo. Nos ayudará a mejorar QuizSolver en futuras actualizaciones.',
    homeBtn: 'Página principal',
    reinstallBtn: 'Reinstalar extensión ↗',
    rights: 'Todos los derechos reservados.'
  },
  fr: {
    metaTitle: 'Enquête de désinstallation | QuizSolver',
    headerTitle: 'Nous sommes désolés de vous voir partir...',
    headerSubtitle: "Vos retours sont inestimables. Dites-nous ce qui n'a pas fonctionné afin que nous puissions améliorer QuizSolver pour vous et les futurs étudiants.",
    reasonsLabel: 'Pourquoi avez-vous désinstallé QuizSolver ? (plusieurs choix possibles)',
    reasons: {
      not_working: 'Ne fonctionnait pas sur mon site de quiz/examen',
      too_expensive: 'Pas assez de crédits gratuits / trop cher',
      hard_to_use: 'Trop compliqué / difficile à prendre en main',
      exams_finished: 'Examens/semestre terminés (plus besoin pour le moment)',
      inaccurate_ai: "L'IA a donné des réponses incorrectes",
      alternative_found: "J'ai trouvé un autre outil alternatif",
      privacy_concern: 'Inquiétudes concernant la confidentialité ou les autorisations',
      other: 'Autre raison'
    },
    platformLabel: 'Sur quel site ou plateforme le problème est-il survenu ?',
    platformPlaceholder: 'ex. Moodle, Canvas, Google Forms, lien du site...',
    feedbackLabel: 'Que pouvons-nous améliorer ? Des remarques supplémentaires ? (facultatif)',
    feedbackPlaceholder: 'Dites-nous ce qui a manqué ou ce qui a posé problème...',
    emailLabel: 'Votre adresse e-mail (facultatif)',
    emailSub: '— nous vous préviendrons une fois corrigé et vous offrirons des crédits gratuits',
    emailPlaceholder: 'votre-email@exemple.fr',
    submitBtn: 'Envoyer mon avis',
    submittingBtn: 'Envoi en cours...',
    skipBtn: "Passer et aller à l'accueil",
    errSelectReason: 'Veuillez sélectionner au moins un motif ou laisser un commentaire.',
    errInvalidEmail: "Format d'adresse e-mail invalide.",
    errSubmitFailed: 'Erreur lors de l’envoi de votre avis. Merci pour votre temps !',
    successTitle: 'Merci pour votre avis !',
    successSubtitle: 'Vos commentaires ont été transmis directement à notre équipe technique. Cela nous aidera à améliorer QuizSolver.',
    homeBtn: "Page d'accueil",
    reinstallBtn: "Réinstaller l'extension ↗",
    rights: 'Tous droits réservés.'
  },
  it: {
    metaTitle: 'Sondaggio di disinstallazione | QuizSolver',
    headerTitle: 'Ci dispiace vederti andare via...',
    headerSubtitle: 'Il tuo feedback è prezioso. Raccontaci cosa è andato storto per aiutarci a migliorare QuizSolver per te e per gli altri studenti.',
    reasonsLabel: 'Perché hai disinstallato QuizSolver? (puoi selezionare più opzioni)',
    reasons: {
      not_working: 'Non funzionava sul sito del mio test/esame',
      too_expensive: 'Pochi crediti gratuiti / troppo costoso',
      hard_to_use: 'Troppo complicato / difficile da capire',
      exams_finished: 'Finiti esami/semestre (non ne ho più bisogno)',
      inaccurate_ai: "L'IA ha fornito risposte errate",
      alternative_found: 'Ho trovato un altro strumento alternativo',
      privacy_concern: 'Preoccupazioni per la privacy o i permessi',
      other: 'Altro motivo'
    },
    platformLabel: 'Su quale sito o piattaforma si è verificato il problema?',
    platformPlaceholder: 'es. Moodle, Canvas, Google Forms, link del sito...',
    feedbackLabel: 'Cosa possiamo migliorare? Note aggiuntive? (facoltativo)',
    feedbackPlaceholder: 'Scrivi pure cosa mancava o cosa ha causato problemi...',
    emailLabel: 'La tua email (facoltativo)',
    emailSub: '— ti avviseremo quando risolto e ti regaleremo crediti gratuiti',
    emailPlaceholder: 'tua-email@esempio.it',
    submitBtn: 'Invia feedback',
    submittingBtn: 'Invio in corso...',
    skipBtn: 'Salta e vai alla home',
    errSelectReason: 'Seleziona almeno un motivo o inserisci un commento.',
    errInvalidEmail: 'Formato email non valido.',
    errSubmitFailed: "Errore durante l'invio del feedback. Grazie per il tuo tempo!",
    successTitle: 'Grazie per il tuo feedback!',
    successSubtitle: 'Il tuo feedback è stato inviato direttamente al team di sviluppo. Ci aiuterà a migliorare QuizSolver.',
    homeBtn: 'Pagina principale',
    reinstallBtn: "Reinstalla l'estensione ↗",
    rights: 'Tutti i diritti riservati.'
  },
  uk: {
    metaTitle: 'Опитування щодо видалення | QuizSolver',
    headerTitle: 'Нам шкода, що ви йдете...',
    headerSubtitle: 'Ваш відгук дуже важливий для нас. Розкажіть, що пішло не так, щоб ми могли покращити QuizSolver для вас та інших студентів.',
    reasonsLabel: 'Чому ви видалили QuizSolver? (можна обрати кілька)',
    reasons: {
      not_working: 'Не працювало на моєму тесті або сайті',
      too_expensive: 'Замало безкоштовних кредитів / занадто дорого',
      hard_to_use: 'Занадто складно / важко розібратися',
      exams_finished: 'Закінчилися іспити/сесія (більше не потрібно)',
      inaccurate_ai: 'ШІ давав неправильні відповіді',
      alternative_found: 'Знайшов інший інструмент',
      privacy_concern: 'Занепокоєння щодо конфіденційності чи дозволів',
      other: 'Інша причина'
    },
    platformLabel: 'На якому сайті чи платформі виникла проблема?',
    platformPlaceholder: 'напр. Moodle, Canvas, Testportal, посилання на сайт...',
    feedbackLabel: 'Що ми можемо покращити? Додаткові зауваження? (необов’язково)',
    feedbackPlaceholder: 'Напишіть, що саме пішло не так або якої функції не вистачило...',
    emailLabel: 'Ваш e-mail (необов’язково)',
    emailSub: '— ми напишемо, коли виправимо, та подаруємо безкоштовні кредити',
    emailPlaceholder: 'vash-email@example.com',
    submitBtn: 'Надіслати відгук',
    submittingBtn: 'Надсилання...',
    skipBtn: 'Пропустити та перейти на головну',
    errSelectReason: 'Будь ласка, оберіть хоча б одну причину або напишіть відгук.',
    errInvalidEmail: 'Некоректний формат адреси e-mail.',
    errSubmitFailed: 'Сталася помилка під час надсилання відгуку. Дякуємо за ваш час!',
    successTitle: 'Дякуємо за ваш відгук!',
    successSubtitle: 'Ваші зауваження надійшли безпосередньо до нашої команди. Це допоможе покращити QuizSolver.',
    homeBtn: 'Головна сторінка',
    reinstallBtn: 'Встановити знову ↗',
    rights: 'Усі права захищені.'
  },
  pt: {
    metaTitle: 'Pesquisa de desinstalação | QuizSolver',
    headerTitle: 'Lamentamos ver você partir...',
    headerSubtitle: 'Seu feedback é muito importante para nós. Diga-nos o que deu errado para que possamos melhorar o QuizSolver para você e outros estudantes.',
    reasonsLabel: 'Por que você desinstalou o QuizSolver? (selecione todas que se aplicam)',
    reasons: {
      not_working: 'Não funcionou no site do meu teste/exame',
      too_expensive: 'Poucos créditos gratuitos / muito caro',
      hard_to_use: 'Muito complicado / difícil de usar',
      exams_finished: 'Terminei meus exames/semestre (não preciso mais)',
      inaccurate_ai: 'A IA forneceu respostas incorretas',
      alternative_found: 'Encontrei outra ferramenta alternativa',
      privacy_concern: 'Preocupações com privacidade ou permissões',
      other: 'Outro motivo'
    },
    platformLabel: 'Em qual site ou plataforma ocorreu o problema?',
    platformPlaceholder: 'ex. Canvas, Moodle, Google Forms, link do site...',
    feedbackLabel: 'O que podemos melhorar? Algum comentário adicional? (opcional)',
    feedbackPlaceholder: 'Conte-nos o que faltou ou causou algum problema...',
    emailLabel: 'Seu e-mail (opcional)',
    emailSub: '— avisaremos quando corrigido e enviaremos créditos gratuitos',
    emailPlaceholder: 'seu-email@exemplo.com',
    submitBtn: 'Enviar feedback',
    submittingBtn: 'Enviando...',
    skipBtn: 'Pular e ir para a página inicial',
    errSelectReason: 'Por favor, selecione pelo menos um motivo ou deixe um comentário.',
    errInvalidEmail: 'Formato de e-mail inválido.',
    errSubmitFailed: 'Erro ao enviar o feedback. Obrigado pelo seu tempo!',
    successTitle: 'Obrigado pelo seu feedback!',
    successSubtitle: 'Seus comentários foram enviados diretamente à nossa equipe de desenvolvimento. Isso nos ajudará a aprimorar o QuizSolver.',
    homeBtn: 'Página inicial',
    reinstallBtn: 'Reinstalar extensão ↗',
    rights: 'Todos os direitos reservados.'
  },
  tr: {
    metaTitle: 'Kaldırma Anketi | QuizSolver',
    headerTitle: 'Gittiğinizi görmek bizi üzdü...',
    headerSubtitle: 'Geri bildiriminiz bizim için çok değerli. QuizSolver’ı sizin ve diğer öğrencilerin deneyimi için geliştirebilmemiz adına neyin ters gittiğini lütfen bize bildirin.',
    reasonsLabel: 'QuizSolver’ı neden kaldırdınız? (birden fazla seçebilirsiniz)',
    reasons: {
      not_working: 'Test/sınav sitemde çalışmadı',
      too_expensive: 'Yetersiz ücretsiz kredi / çok pahalı',
      hard_to_use: 'Kullanımı çok karmaşık / çözmesi zor',
      exams_finished: 'Sınavlarım/dönemim bitti (artık ihtiyacım yok)',
      inaccurate_ai: 'Yapay zeka yanlış cevaplar verdi',
      alternative_found: 'Başka bir alternatif araç buldum',
      privacy_concern: 'Gizlilik veya izinlerle ilgili endişeler',
      other: 'Başka bir neden'
    },
    platformLabel: 'Sorun hangi web sitesinde veya platformda ortaya çıktı?',
    platformPlaceholder: 'örn. Moodle, Canvas, Google Forms, web sitesi bağlantısı...',
    feedbackLabel: 'Neyi geliştirebiliriz? Ek yorumlarınız var mı? (isteğe bağlı)',
    feedbackPlaceholder: 'Neyin eksik olduğunu veya neyin sorun yarattığını bize yazın...',
    emailLabel: 'E-posta adresiniz (isteğe bağlı)',
    emailSub: '— düzelttiğimizde size haber verelim ve ücretsiz kredi hediye edelim',
    emailPlaceholder: 'eposta@ornek.com',
    submitBtn: 'Geri bildirimi gönder',
    submittingBtn: 'Gönderiliyor...',
    skipBtn: 'Atla ve ana sayfaya git',
    errSelectReason: 'Lütfen en az bir neden seçin veya görüş bildirin.',
    errInvalidEmail: 'Geçersiz e-posta formatı.',
    errSubmitFailed: 'Geri bildirim gönderilirken bir hata oluştu. Zaman ayırdığınız için teşekkür ederiz!',
    successTitle: 'Geri bildiriminiz için teşekkürler!',
    successSubtitle: 'Görüşleriniz doğrudan mühendislik ekibimize iletildi. Gelecek güncellemelerde QuizSolver’ı geliştirmemize yardımcı olacaktır.',
    homeBtn: 'Ana sayfa',
    reinstallBtn: 'Uzantıyı tekrar yükle ↗',
    rights: 'Tüm hakları saklıdır.'
  },
  ar: {
    metaTitle: 'استبيان إلغاء التثبيت | QuizSolver',
    headerTitle: 'يؤسفنا أنك تغادر...',
    headerSubtitle: 'رأيك مهم جداً بالنسبة لنا. يرجى إخبارنا بما حدث لنتمكن من تحسين QuizSolver لك وللطلاب الآخرين.',
    reasonsLabel: 'لماذا قمت بإلغاء تثبيت QuizSolver؟ (يمكنك تحديد أكثر من خيار)',
    reasons: {
      not_working: 'لم يعمل على موقع اختباري / امتحاني',
      too_expensive: 'رصيد مجاني غير كافٍ / السعر مرتفع جداً',
      hard_to_use: 'معقد جداً / صعوبة في فهم كيفية الاستخدام',
      exams_finished: 'انتهت الامتحانات / الفصل الدراسي (لم أعد بحاجة إليه)',
      inaccurate_ai: 'قدم الذكاء الاصطناعي إجابات غير صحيحة',
      alternative_found: 'وجدت أداة بديلة أخرى',
      privacy_concern: 'مخاوف بشأن الخصوصية أو الأذونات',
      other: 'سبب آخر'
    },
    platformLabel: 'على أي موقع أو منصة اختبار حدثت المشكلة؟',
    platformPlaceholder: 'مثال: Canvas, Moodle, Google Forms, رابط الموقع...',
    feedbackLabel: 'ما الذي يمكننا تحسينه؟ هل لديك أي ملاحظات إضافية؟ (اختياري)',
    feedbackPlaceholder: 'أخبرنا بما كان ينقصك أو ما الذي تسبب في المشكلة...',
    emailLabel: 'بريدك الإلكتروني (اختياري)',
    emailSub: '— سنخبرك عندما يتم إصلاح ذلك ويسعدنا منحك باقة رصيد مجانية',
    emailPlaceholder: 'your-email@example.com',
    submitBtn: 'إرسال التعليقات',
    submittingBtn: 'جارٍ الإرسال...',
    skipBtn: 'تخطي والذهاب إلى الصفحة الرئيسية',
    errSelectReason: 'يرجى اختيار سبب واحد على الأقل أو كتابة ملاحظة.',
    errInvalidEmail: 'صيغة البريد الإلكتروني غير صالحة.',
    errSubmitFailed: 'حدث خطأ أثناء إرسال التعليقات. شكراً لوقتك!',
    successTitle: 'شكراً جزيلاً لرأيك!',
    successSubtitle: 'وصلت ملاحظاتك مباشرة إلى فريق التطوير لدينا. سيساعدنا هذا في تحسين QuizSolver في التحديثات القادمة.',
    homeBtn: 'الصفحة الرئيسية',
    reinstallBtn: 'إعادة تثبيت الإضافة ↗',
    rights: 'جميع الحقوق محفوظة.'
  },
  ja: {
    metaTitle: 'アンインストールアンケート | QuizSolver',
    headerTitle: 'ご利用いただきありがとうございました...',
    headerSubtitle: '皆様のご意見は非常に貴重です。今後の改善に役立てるため、アンインストールされた理由をお聞かせください。',
    reasonsLabel: 'QuizSolverをアンインストールした理由は何ですか？（複数選択可）' ,
    reasons: {
      not_working: 'テストや試験のウェブサイトで動作しなかった',
      too_expensive: '無料クレジットが少ない / 価格が高い',
      hard_to_use: '使い方が複雑 / 始め方が分かりにくかった',
      exams_finished: '試験・学期が終了した（不要になった）',
      inaccurate_ai: 'AIの回答に間違いがあった',
      alternative_found: '別のツールを見つけた',
      privacy_concern: 'プライバシーや権限に関する懸念',
      other: 'その他の理由'
    },
    platformLabel: 'どのウェブサイトやプラットフォームで問題が発生しましたか？',
    platformPlaceholder: '例：Canvas、Moodle、Google Forms、サイトのURLなど...',
    feedbackLabel: '改善点やご意見があればお聞かせください（任意）',
    feedbackPlaceholder: '不足していた機能や問題点などをご自由にご記入ください...',
    emailLabel: 'メールアドレス（任意）',
    emailSub: '— 修正完了時にご連絡し、無料クレジットを進呈いたします',
    emailPlaceholder: 'your-email@example.com',
    submitBtn: 'フィードバックを送信',
    submittingBtn: '送信中...',
    skipBtn: 'スキップしてトップページへ',
    errSelectReason: '少なくとも1つの理由を選択するか、フィードバックをご記入ください。',
    errInvalidEmail: 'メールアドレスの形式が正しくありません。',
    errSubmitFailed: '送信中にエラーが発生しました。お時間いただきありがとうございました。',
    successTitle: 'ご意見ありがとうございました！',
    successSubtitle: 'いただいたご意見は開発チームに直接共有されました。今後のアップデートでの改善に役立てさせていただきます。',
    homeBtn: 'トップページへ',
    reinstallBtn: '拡張機能を再インストール ↗',
    rights: '無断転載を禁じます。'
  },
  ko: {
    metaTitle: '설치 제거 설문조사 | QuizSolver',
    headerTitle: '떠나신다니 정말 아쉽습니다...',
    headerSubtitle: '소중한 의견을 들려주세요. QuizSolver를 더욱 발전시켜 더 나은 경험을 제공할 수 있도록 어떤 점이 불편하셨는지 알려주세요.',
    reasonsLabel: 'QuizSolver를 삭제하신 이유는 무엇인가요? (중복 선택 가능)',
    reasons: {
      not_working: '시험/퀴즈 웹사이트에서 작동하지 않음',
      too_expensive: '무료 크레딧 부족 / 가격이 너무 비쌈',
      hard_to_use: '사용하기 너무 복잡함 / 시작하기 어려움',
      exams_finished: '시험/학기가 끝남 (더 이상 필요 없음)',
      inaccurate_ai: 'AI가 잘못된 정답을 제시함',
      alternative_found: '다른 대체 도구를 찾음',
      privacy_concern: '개인정보 보호 또는 권한 관련 우려',
      other: '기타 이유'
    },
    platformLabel: '어떤 웹사이트 또는 시험 플랫폼에서 문제가 발생했나요?',
    platformPlaceholder: '예: Canvas, Moodle, Google Forms, 웹사이트 링크 등...',
    feedbackLabel: '어떤 점을 개선하면 좋을까요? 추가 의견이 있으신가요? (선택 사항)',
    feedbackPlaceholder: '부족했던 점이나 불편했던 점을 자유롭게 적어주세요...',
    emailLabel: '이메일 주소 (선택 사항)',
    emailSub: '— 문제 해결 시 안내해 드리며 무료 크레딧을 선물해 드립니다',
    emailPlaceholder: 'your-email@example.com',
    submitBtn: '의견 제출하기',
    submittingBtn: '전송 중...',
    skipBtn: '건너뛰고 메인 페이지로 이동',
    errSelectReason: '최소 하나의 사유를 선택하시거나 의견을 입력해 주세요.',
    errInvalidEmail: '올바른 이메일 형식이 아닙니다.',
    errSubmitFailed: '의견 제출 중 오류가 발생했습니다. 시간을 내어주셔서 감사합니다!',
    successTitle: '의견을 주셔서 감사합니다!',
    successSubtitle: '보내주신 의견은 개발팀에 직접 전달되었습니다. 향후 업데이트에서 QuizSolver를 개선하는 데 큰 도움이 됩니다.',
    homeBtn: '홈으로 이동',
    reinstallBtn: '확장 프로그램 다시 설치 ↗',
    rights: '모든 권리 보유.'
  }
};

function normalizeLangCode(val: string | null | undefined): string {
  if (!val) return 'en';
  const clean = val.toLowerCase().trim();
  if (clean.startsWith('pl')) return 'pl';
  if (clean.startsWith('de')) return 'de';
  if (clean.startsWith('es')) return 'es';
  if (clean.startsWith('fr')) return 'fr';
  if (clean.startsWith('it')) return 'it';
  if (clean.startsWith('uk') || clean.startsWith('ua')) return 'uk';
  if (clean.startsWith('pt')) return 'pt';
  if (clean.startsWith('tr')) return 'tr';
  if (clean.startsWith('ar')) return 'ar';
  if (clean.startsWith('ja')) return 'ja';
  if (clean.startsWith('ko')) return 'ko';
  return 'en';
}

@Component({
  selector: 'app-uninstall',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
<div class="u-page" [attr.dir]="isRtl() ? 'rtl' : 'ltr'">
  <div class="u-container">

    <!-- Brand Header -->
    <header class="u-header">
      <a [routerLink]="homeLink()" class="u-logo">
        <span class="u-logo-mark">QS</span>
        <span class="u-logo-text">QuizSolver</span>
      </a>
    </header>

    <!-- Main Card -->
    <div class="u-card">

      <!-- Form View -->
      <div *ngIf="!submitted()">
        <div class="u-head">
          <div class="u-head-icon">😢</div>
          <h1 class="u-title">
            {{ t().headerTitle }}
          </h1>
          <p class="u-subtitle">
            {{ t().headerSubtitle }}
          </p>
        </div>

        <form (ngSubmit)="submit()" class="u-form">

          <!-- Reason checkboxes -->
          <div class="u-field">
            <label class="u-label">
              {{ t().reasonsLabel }}
            </label>
            <div class="u-reasons-grid">
              <label *ngFor="let r of reasonKeys" class="u-reason-card" [class.selected]="selectedReasons[r.key]">
                <input type="checkbox" [(ngModel)]="selectedReasons[r.key]" [name]="r.key" class="u-hidden-check">
                <span class="u-reason-icon">{{ r.icon }}</span>
                <span class="u-reason-label">{{ t().reasons[r.key] || r.key }}</span>
                <span class="u-check-box" [class.checked]="selectedReasons[r.key]">
                  {{ selectedReasons[r.key] ? '✓' : '' }}
                </span>
              </label>
            </div>
          </div>

          <!-- Platform input if not_working selected -->
          <div class="u-field anim-slide" *ngIf="selectedReasons['not_working']">
            <label class="u-label">
              {{ t().platformLabel }}
            </label>
            <input
              type="text"
              class="u-input"
              [(ngModel)]="platformUsed"
              name="platformUsed"
              [placeholder]="t().platformPlaceholder">
          </div>

          <!-- Feedback textarea -->
          <div class="u-field">
            <label class="u-label">
              {{ t().feedbackLabel }}
            </label>
            <textarea
              class="u-textarea"
              rows="4"
              [(ngModel)]="feedback"
              name="feedback"
              [placeholder]="t().feedbackPlaceholder"></textarea>
          </div>

          <!-- Optional Email -->
          <div class="u-field">
            <label class="u-label">
              {{ t().emailLabel }}
              <span class="u-label-sub">
                {{ t().emailSub }}
              </span>
            </label>
            <input
              type="email"
              class="u-input"
              [(ngModel)]="email"
              name="email"
              [placeholder]="t().emailPlaceholder">
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage()" class="u-alert-err">
            {{ errorMessage() }}
          </div>

          <!-- Action Buttons -->
          <div class="u-actions">
            <button
              type="submit"
              class="u-btn-primary"
              [disabled]="loading()">
              {{ loading() ? t().submittingBtn : t().submitBtn }}
            </button>
            <a [routerLink]="homeLink()" class="u-btn-ghost">
              {{ t().skipBtn }}
            </a>
          </div>

        </form>
      </div>

      <!-- Success Thank You View -->
      <div *ngIf="submitted()" class="u-success anim-in">
        <div class="u-success-icon">💚</div>
        <h2 class="u-title">
          {{ t().successTitle }}
        </h2>
        <p class="u-subtitle">
          {{ t().successSubtitle }}
        </p>

        <div style="margin-top:28px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a [routerLink]="homeLink()" class="u-btn-primary">
            {{ t().homeBtn }}
          </a>
          <a href="https://chromewebstore.google.com/detail/quiz-solver-pro/cjchfdnplpjkihigljnicebnhjkpndik" target="_blank" rel="noopener" class="u-btn-ghost">
            {{ t().reinstallBtn }}
          </a>
        </div>
      </div>

    </div>

    <!-- Minimal footer -->
    <footer class="u-footer">
      <span class="xs t3">&copy; {{ year }} QuizSolver. {{ t().rights }}</span>
    </footer>

  </div>
</div>
`,
  styles: [`
    .u-page {
      min-height: 100vh;
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #030712 60%);
      color: #f8fafc;
      font-family: Inter, system-ui, -apple-system, sans-serif;
      padding: 40px 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
    .u-container {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
    }
    .u-header {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .u-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #fff;
    }
    .u-logo-mark {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #06b6d4, #8b5cf6);
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 16px;
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4);
    }
    .u-logo-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .u-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    @media (max-width: 540px) {
      .u-card { padding: 24px 18px; }
    }
    .u-head {
      text-align: center;
      margin-bottom: 28px;
    }
    .u-head-icon {
      font-size: 42px;
      margin-bottom: 12px;
    }
    .u-title {
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 10px;
      letter-spacing: -0.5px;
      color: #fff;
    }
    .u-subtitle {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0;
    }
    .u-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .u-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .u-label {
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .u-label-sub {
      font-size: 12px;
      font-weight: 400;
      color: #64748b;
    }
    .u-reasons-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .u-reason-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .u-reason-card:hover {
      background: rgba(30, 41, 59, 0.9);
      border-color: rgba(255, 255, 255, 0.18);
    }
    .u-reason-card.selected {
      background: rgba(6, 182, 212, 0.12);
      border-color: rgba(6, 182, 212, 0.5);
    }
    .u-hidden-check {
      display: none;
    }
    .u-reason-icon {
      font-size: 18px;
      flex-shrink: 0;
    }
    .u-reason-label {
      flex: 1;
      font-size: 13px;
      color: #f1f5f9;
      font-weight: 500;
    }
    .u-check-box {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      display: grid;
      place-items: center;
      font-size: 12px;
      font-weight: 700;
      color: #030712;
      background: transparent;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .u-check-box.checked {
      background: #06b6d4;
      border-color: #06b6d4;
    }
    .u-input, .u-textarea {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 12px 14px;
      color: #f8fafc;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .u-input:focus, .u-textarea:focus {
      border-color: #06b6d4;
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
    }
    .u-textarea {
      resize: vertical;
      min-height: 90px;
    }
    .u-alert-err {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
    }
    .u-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 8px;
    }
    .u-btn-primary {
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      color: #fff;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      padding: 13px 20px;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
      transition: all 0.2s ease;
    }
    .u-btn-primary:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    .u-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .u-btn-ghost {
      background: transparent;
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 13px;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .u-btn-ghost:hover {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.25);
    }
    .u-success {
      text-align: center;
      padding: 20px 0;
    }
    .u-success-icon {
      font-size: 54px;
      margin-bottom: 14px;
    }
    .u-footer {
      text-align: center;
      margin-top: 24px;
    }
    .xs { font-size: 12px; }
    .t3 { color: #64748b; }
    .anim-slide {
      animation: slideDown 0.2s ease;
    }
    .anim-in {
      animation: fadeIn 0.3s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
    [dir="rtl"] {
      text-align: right;
      direction: rtl;
    }
    [dir="rtl"] .u-actions {
      direction: rtl;
    }
    [dir="rtl"] .u-reason-card {
      text-align: right;
    }
  `]
})
export class UninstallComponent implements OnInit {
  reasonKeys = REASON_KEYS;
  selectedReasons: Record<string, boolean> = {};
  platformUsed = '';
  feedback = '';
  email = '';
  extensionVersion = '';

  loading = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  year = new Date().getFullYear();
  locale = signal<string>('en');

  t = computed<SurveyTranslations>(() => {
    const loc = this.locale();
    return TRANSLATIONS[loc] || TRANSLATIONS['en'];
  });

  isRtl = computed<boolean>(() => this.locale() === 'ar');

  homeLink = computed<string>(() => {
    const loc = this.locale();
    return loc === 'en' ? '/' : `/${loc}`;
  });

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data && data['locale']) {
        this.locale.set(normalizeLangCode(data['locale']));
        this.updateMeta();
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['v']) {
        this.extensionVersion = params['v'];
      }
      if (params['lang']) {
        this.locale.set(normalizeLangCode(params['lang']));
        this.updateMeta();
      }
    });

    this.updateMeta();
  }

  private updateMeta() {
    this.title.setTitle(this.t().metaTitle);
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  async submit() {
    this.errorMessage.set('');

    const chosenReasons = Object.entries(this.selectedReasons)
      .filter(([_, sel]) => Boolean(sel))
      .map(([k]) => k);

    if (chosenReasons.length === 0 && !this.feedback.trim() && !this.platformUsed.trim()) {
      this.errorMessage.set(this.t().errSelectReason);
      return;
    }

    if (this.email && !/^\S+@\S+\.\S+$/.test(this.email.trim())) {
      this.errorMessage.set(this.t().errInvalidEmail);
      return;
    }

    this.loading.set(true);

    try {
      const payload = {
        reasons: chosenReasons,
        feedback: this.feedback.trim(),
        platformUsed: this.platformUsed.trim(),
        email: this.email.trim(),
        extensionVersion: this.extensionVersion,
        lang: this.locale()
      };

      const res = await fetch('/api/feedback/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Server error');
      }

      this.submitted.set(true);
    } catch (e) {
      this.errorMessage.set(this.t().errSubmitFailed);
    } finally {
      this.loading.set(false);
    }
  }
}
