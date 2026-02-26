export type Language = 'en' | 'hi' | 'es' | 'fr' | 'ar' | 'bn';

export interface Translations {
  // Navigation
  appName: string;
  history: string;
  back: string;
  newReport: string;

  // Input Screen
  inputTitle: string;
  inputSubtitle: string;
  pathReportLabel: string;
  pathReportPlaceholder: string;
  prescriptionLabel: string;
  prescriptionPlaceholder: string;
  simplifyButton: string;
  simplifyingButton: string;
  inputRequired: string;

  // Results Screen
  resultsTitle: string;
  keyFindings: string;
  medications: string;
  whatToDoNext: string;
  medicationName: string;
  medicationPurpose: string;
  medicationDosage: string;
  noFindings: string;
  noMedications: string;
  noActions: string;
  language: string;
  shareReport: string;
  copiedToClipboard: string;

  // History Screen
  historyTitle: string;
  historyEmpty: string;
  historyEmptySubtitle: string;
  viewReport: string;
  reportOn: string;

  // Common
  loading: string;
  error: string;
  retry: string;
  noData: string;

  // Footer
  builtWith: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'MediClear',
    history: 'History',
    back: 'Back',
    newReport: 'New Report',
    inputTitle: 'Simplify Your Report',
    inputSubtitle: 'Paste your medical report or prescription below and we\'ll explain it in simple words.',
    pathReportLabel: 'Pathological / Lab Report',
    pathReportPlaceholder: 'Paste your lab report or pathological report here...\n\nExample: Blood test results, CBC report, urine analysis, biopsy report, etc.',
    prescriptionLabel: 'Doctor\'s Prescription',
    prescriptionPlaceholder: 'Paste your doctor\'s prescription here...\n\nExample: Medication names, dosages, instructions, diagnosis notes, etc.',
    simplifyButton: 'Simplify Report',
    simplifyingButton: 'Simplifying...',
    inputRequired: 'Please enter at least one report or prescription.',
    resultsTitle: 'Your Simplified Report',
    keyFindings: 'Key Findings',
    medications: 'Medications',
    whatToDoNext: 'What To Do Next',
    medicationName: 'Medicine',
    medicationPurpose: 'Purpose',
    medicationDosage: 'How to Take',
    noFindings: 'No specific findings detected.',
    noMedications: 'No medications listed.',
    noActions: 'No specific action steps.',
    language: 'Language',
    shareReport: 'Copy Summary',
    copiedToClipboard: 'Copied to clipboard!',
    historyTitle: 'Report History',
    historyEmpty: 'No reports yet',
    historyEmptySubtitle: 'Your simplified reports will appear here after you process them.',
    viewReport: 'View Report',
    reportOn: 'Report from',
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    retry: 'Try Again',
    noData: 'No data available.',
    builtWith: 'Built with',
  },
  hi: {
    appName: 'MediClear',
    history: 'इतिहास',
    back: 'वापस',
    newReport: 'नई रिपोर्ट',
    inputTitle: 'अपनी रिपोर्ट सरल बनाएं',
    inputSubtitle: 'अपनी मेडिकल रिपोर्ट या पर्चा नीचे पेस्ट करें, हम इसे सरल भाषा में समझाएंगे।',
    pathReportLabel: 'पैथोलॉजी / लैब रिपोर्ट',
    pathReportPlaceholder: 'अपनी लैब रिपोर्ट यहाँ पेस्ट करें...',
    prescriptionLabel: 'डॉक्टर का पर्चा',
    prescriptionPlaceholder: 'अपना डॉक्टर का पर्चा यहाँ पेस्ट करें...',
    simplifyButton: 'रिपोर्ट सरल बनाएं',
    simplifyingButton: 'प्रक्रिया हो रही है...',
    inputRequired: 'कृपया कम से कम एक रिपोर्ट या पर्चा दर्ज करें।',
    resultsTitle: 'आपकी सरल रिपोर्ट',
    keyFindings: 'मुख्य निष्कर्ष',
    medications: 'दवाइयाँ',
    whatToDoNext: 'आगे क्या करें',
    medicationName: 'दवा',
    medicationPurpose: 'उद्देश्य',
    medicationDosage: 'कैसे लें',
    noFindings: 'कोई विशेष निष्कर्ष नहीं मिला।',
    noMedications: 'कोई दवाइयाँ सूचीबद्ध नहीं।',
    noActions: 'कोई विशेष कदम नहीं।',
    language: 'भाषा',
    shareReport: 'सारांश कॉपी करें',
    copiedToClipboard: 'क्लिपबोर्ड पर कॉपी हो गया!',
    historyTitle: 'रिपोर्ट इतिहास',
    historyEmpty: 'अभी तक कोई रिपोर्ट नहीं',
    historyEmptySubtitle: 'आपकी सरल रिपोर्ट यहाँ दिखाई देंगी।',
    viewReport: 'रिपोर्ट देखें',
    reportOn: 'रिपोर्ट दिनांक',
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
    retry: 'पुनः प्रयास करें',
    noData: 'कोई डेटा उपलब्ध नहीं।',
    builtWith: 'के साथ बनाया गया',
  },
  es: {
    appName: 'MediClear',
    history: 'Historial',
    back: 'Volver',
    newReport: 'Nuevo Informe',
    inputTitle: 'Simplifica Tu Informe',
    inputSubtitle: 'Pega tu informe médico o receta abajo y lo explicaremos en palabras simples.',
    pathReportLabel: 'Informe Patológico / de Laboratorio',
    pathReportPlaceholder: 'Pega tu informe de laboratorio aquí...',
    prescriptionLabel: 'Receta Médica',
    prescriptionPlaceholder: 'Pega la receta de tu médico aquí...',
    simplifyButton: 'Simplificar Informe',
    simplifyingButton: 'Simplificando...',
    inputRequired: 'Por favor ingresa al menos un informe o receta.',
    resultsTitle: 'Tu Informe Simplificado',
    keyFindings: 'Hallazgos Clave',
    medications: 'Medicamentos',
    whatToDoNext: 'Qué Hacer Ahora',
    medicationName: 'Medicamento',
    medicationPurpose: 'Propósito',
    medicationDosage: 'Cómo Tomar',
    noFindings: 'No se detectaron hallazgos específicos.',
    noMedications: 'No hay medicamentos listados.',
    noActions: 'No hay pasos de acción específicos.',
    language: 'Idioma',
    shareReport: 'Copiar Resumen',
    copiedToClipboard: '¡Copiado al portapapeles!',
    historyTitle: 'Historial de Informes',
    historyEmpty: 'Sin informes aún',
    historyEmptySubtitle: 'Tus informes simplificados aparecerán aquí.',
    viewReport: 'Ver Informe',
    reportOn: 'Informe del',
    loading: 'Cargando...',
    error: 'Algo salió mal. Por favor intenta de nuevo.',
    retry: 'Intentar de Nuevo',
    noData: 'No hay datos disponibles.',
    builtWith: 'Construido con',
  },
  fr: {
    appName: 'MediClear',
    history: 'Historique',
    back: 'Retour',
    newReport: 'Nouveau Rapport',
    inputTitle: 'Simplifiez Votre Rapport',
    inputSubtitle: 'Collez votre rapport médical ou ordonnance ci-dessous et nous l\'expliquerons en termes simples.',
    pathReportLabel: 'Rapport Pathologique / de Laboratoire',
    pathReportPlaceholder: 'Collez votre rapport de laboratoire ici...',
    prescriptionLabel: 'Ordonnance Médicale',
    prescriptionPlaceholder: 'Collez l\'ordonnance de votre médecin ici...',
    simplifyButton: 'Simplifier le Rapport',
    simplifyingButton: 'Simplification...',
    inputRequired: 'Veuillez saisir au moins un rapport ou une ordonnance.',
    resultsTitle: 'Votre Rapport Simplifié',
    keyFindings: 'Résultats Clés',
    medications: 'Médicaments',
    whatToDoNext: 'Que Faire Ensuite',
    medicationName: 'Médicament',
    medicationPurpose: 'Objectif',
    medicationDosage: 'Comment Prendre',
    noFindings: 'Aucun résultat spécifique détecté.',
    noMedications: 'Aucun médicament répertorié.',
    noActions: 'Aucune étape d\'action spécifique.',
    language: 'Langue',
    shareReport: 'Copier le Résumé',
    copiedToClipboard: 'Copié dans le presse-papiers!',
    historyTitle: 'Historique des Rapports',
    historyEmpty: 'Aucun rapport pour l\'instant',
    historyEmptySubtitle: 'Vos rapports simplifiés apparaîtront ici.',
    viewReport: 'Voir le Rapport',
    reportOn: 'Rapport du',
    loading: 'Chargement...',
    error: 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    retry: 'Réessayer',
    noData: 'Aucune donnée disponible.',
    builtWith: 'Construit avec',
  },
  ar: {
    appName: 'MediClear',
    history: 'السجل',
    back: 'رجوع',
    newReport: 'تقرير جديد',
    inputTitle: 'بسّط تقريرك',
    inputSubtitle: 'الصق تقريرك الطبي أو وصفتك أدناه وسنشرحها بكلمات بسيطة.',
    pathReportLabel: 'التقرير المرضي / المختبري',
    pathReportPlaceholder: 'الصق تقرير المختبر هنا...',
    prescriptionLabel: 'وصفة الطبيب',
    prescriptionPlaceholder: 'الصق وصفة طبيبك هنا...',
    simplifyButton: 'تبسيط التقرير',
    simplifyingButton: 'جارٍ التبسيط...',
    inputRequired: 'يرجى إدخال تقرير أو وصفة واحدة على الأقل.',
    resultsTitle: 'تقريرك المبسّط',
    keyFindings: 'النتائج الرئيسية',
    medications: 'الأدوية',
    whatToDoNext: 'ماذا تفعل بعد ذلك',
    medicationName: 'الدواء',
    medicationPurpose: 'الغرض',
    medicationDosage: 'كيفية الأخذ',
    noFindings: 'لم يتم اكتشاف نتائج محددة.',
    noMedications: 'لا توجد أدوية مدرجة.',
    noActions: 'لا توجد خطوات محددة.',
    language: 'اللغة',
    shareReport: 'نسخ الملخص',
    copiedToClipboard: 'تم النسخ إلى الحافظة!',
    historyTitle: 'سجل التقارير',
    historyEmpty: 'لا توجد تقارير بعد',
    historyEmptySubtitle: 'ستظهر تقاريرك المبسّطة هنا.',
    viewReport: 'عرض التقرير',
    reportOn: 'تقرير من',
    loading: 'جارٍ التحميل...',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    retry: 'حاول مرة أخرى',
    noData: 'لا توجد بيانات متاحة.',
    builtWith: 'مبني بـ',
  },
  bn: {
    appName: 'MediClear',
    history: 'ইতিহাস',
    back: 'ফিরে যান',
    newReport: 'নতুন রিপোর্ট',
    inputTitle: 'আপনার রিপোর্ট সহজ করুন',
    inputSubtitle: 'আপনার মেডিকেল রিপোর্ট বা প্রেসক্রিপশন নিচে পেস্ট করুন, আমরা সহজ ভাষায় বুঝিয়ে দেব।',
    pathReportLabel: 'প্যাথলজি / ল্যাব রিপোর্ট',
    pathReportPlaceholder: 'আপনার ল্যাব রিপোর্ট এখানে পেস্ট করুন...',
    prescriptionLabel: 'ডাক্তারের প্রেসক্রিপশন',
    prescriptionPlaceholder: 'আপনার ডাক্তারের প্রেসক্রিপশন এখানে পেস্ট করুন...',
    simplifyButton: 'রিপোর্ট সহজ করুন',
    simplifyingButton: 'প্রক্রিয়া চলছে...',
    inputRequired: 'অনুগ্রহ করে কমপক্ষে একটি রিপোর্ট বা প্রেসক্রিপশন দিন।',
    resultsTitle: 'আপনার সহজ রিপোর্ট',
    keyFindings: 'মূল ফলাফল',
    medications: 'ওষুধ',
    whatToDoNext: 'এরপর কী করবেন',
    medicationName: 'ওষুধ',
    medicationPurpose: 'উদ্দেশ্য',
    medicationDosage: 'কীভাবে নেবেন',
    noFindings: 'কোনো নির্দিষ্ট ফলাফল পাওয়া যায়নি।',
    noMedications: 'কোনো ওষুধ তালিকাভুক্ত নেই।',
    noActions: 'কোনো নির্দিষ্ট পদক্ষেপ নেই।',
    language: 'ভাষা',
    shareReport: 'সারসংক্ষেপ কপি করুন',
    copiedToClipboard: 'ক্লিপবোর্ডে কপি হয়েছে!',
    historyTitle: 'রিপোর্ট ইতিহাস',
    historyEmpty: 'এখনো কোনো রিপোর্ট নেই',
    historyEmptySubtitle: 'আপনার সহজ রিপোর্টগুলি এখানে দেখাবে।',
    viewReport: 'রিপোর্ট দেখুন',
    reportOn: 'রিপোর্ট তারিখ',
    loading: 'লোড হচ্ছে...',
    error: 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।',
    retry: 'আবার চেষ্টা করুন',
    noData: 'কোনো ডেটা পাওয়া যায়নি।',
    builtWith: 'দিয়ে তৈরি',
  },
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  bn: 'বাংলা',
};

export const rtlLanguages: Language[] = ['ar'];
