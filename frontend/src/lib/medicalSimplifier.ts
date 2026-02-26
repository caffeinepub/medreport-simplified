import type { Medication, ActionStep } from '../backend';

// Medical term glossary: maps medical jargon to plain language
const medicalGlossary: Record<string, string> = {
  // Conditions
  'hypertension': 'high blood pressure',
  'hypotension': 'low blood pressure',
  'tachycardia': 'fast heartbeat',
  'bradycardia': 'slow heartbeat',
  'arrhythmia': 'irregular heartbeat',
  'myocardial infarction': 'heart attack',
  'angina': 'chest pain from the heart',
  'atherosclerosis': 'hardening of the arteries',
  'diabetes mellitus': 'diabetes (high blood sugar)',
  'hyperglycemia': 'high blood sugar',
  'hypoglycemia': 'low blood sugar',
  'anemia': 'low red blood cells (tiredness, weakness)',
  'leukocytosis': 'high white blood cell count (possible infection)',
  'leukopenia': 'low white blood cell count (weak immune system)',
  'thrombocytopenia': 'low platelet count (bleeding risk)',
  'thrombocytosis': 'high platelet count',
  'polycythemia': 'too many red blood cells',
  'hypothyroidism': 'underactive thyroid (slow metabolism)',
  'hyperthyroidism': 'overactive thyroid (fast metabolism)',
  'pneumonia': 'lung infection',
  'bronchitis': 'airway inflammation',
  'asthma': 'breathing difficulty (airway tightening)',
  'copd': 'chronic lung disease',
  'urinary tract infection': 'bladder or kidney infection',
  'uti': 'bladder or kidney infection',
  'gastritis': 'stomach lining inflammation',
  'hepatitis': 'liver inflammation',
  'cirrhosis': 'liver scarring',
  'nephritis': 'kidney inflammation',
  'renal failure': 'kidney failure',
  'osteoporosis': 'weak and brittle bones',
  'arthritis': 'joint pain and swelling',
  'rheumatoid arthritis': 'immune system attacking joints',
  'migraine': 'severe headache (often with nausea)',
  'epilepsy': 'seizure disorder',
  'depression': 'persistent sadness and low mood',
  'anxiety': 'excessive worry and nervousness',
  'insomnia': 'difficulty sleeping',
  'obesity': 'excess body weight',
  'malnutrition': 'lack of proper nutrition',
  'sepsis': 'severe infection spreading through the blood',
  'edema': 'swelling from fluid buildup',
  'jaundice': 'yellowing of skin and eyes',
  'dyspnea': 'shortness of breath',
  'dysphagia': 'difficulty swallowing',
  'nausea': 'feeling sick to the stomach',
  'emesis': 'vomiting',
  'diarrhea': 'loose or watery stools',
  'constipation': 'difficulty passing stools',
  'hematuria': 'blood in urine',
  'proteinuria': 'protein in urine',
  'albuminuria': 'albumin protein in urine',
  'pyrexia': 'fever (high body temperature)',
  'febrile': 'having a fever',
  'afebrile': 'no fever',
  'pruritus': 'itching',
  'erythema': 'skin redness',
  'cyanosis': 'bluish skin color (low oxygen)',
  'pallor': 'pale skin',
  'diaphoresis': 'excessive sweating',
  'vertigo': 'dizziness (feeling of spinning)',
  'syncope': 'fainting',
  'palpitations': 'awareness of heartbeat',
  'fatigue': 'tiredness and lack of energy',
  'malaise': 'general feeling of being unwell',
  'cachexia': 'severe weight loss and muscle wasting',

  // Lab values
  'hemoglobin': 'red blood cell protein (carries oxygen)',
  'hematocrit': 'percentage of red blood cells in blood',
  'wbc': 'white blood cells (fight infection)',
  'rbc': 'red blood cells (carry oxygen)',
  'platelets': 'blood cells that help clotting',
  'creatinine': 'waste product filtered by kidneys',
  'bun': 'blood urea nitrogen (kidney waste marker)',
  'alt': 'liver enzyme (ALT)',
  'ast': 'liver enzyme (AST)',
  'alkaline phosphatase': 'liver/bone enzyme',
  'bilirubin': 'yellow pigment from red blood cell breakdown',
  'albumin': 'main protein in blood',
  'glucose': 'blood sugar',
  'cholesterol': 'fat-like substance in blood',
  'triglycerides': 'type of fat in blood',
  'hdl': 'good cholesterol',
  'ldl': 'bad cholesterol',
  'tsh': 'thyroid stimulating hormone',
  't3': 'thyroid hormone (T3)',
  't4': 'thyroid hormone (T4)',
  'hba1c': 'average blood sugar over 3 months',
  'esr': 'inflammation marker in blood',
  'crp': 'C-reactive protein (inflammation marker)',
  'sodium': 'salt level in blood',
  'potassium': 'mineral level in blood',
  'calcium': 'calcium level in blood',
  'magnesium': 'magnesium level in blood',
  'phosphorus': 'phosphorus level in blood',
  'uric acid': 'waste product (high levels cause gout)',
  'ferritin': 'iron storage protein',
  'iron': 'mineral needed for red blood cells',
  'vitamin d': 'vitamin D level',
  'vitamin b12': 'vitamin B12 level',
  'folic acid': 'Folic Acid (B vitamin supplement)',
  'psa': 'prostate specific antigen',
  'inr': 'blood clotting time',
  'prothrombin time': 'prothrombin time (clotting test)',
  'aptt': 'clotting test',

  // Procedures/Tests
  'ecg': 'heart electrical activity test',
  'ekg': 'heart electrical activity test',
  'echocardiogram': 'heart ultrasound',
  'mri': 'magnetic resonance imaging scan',
  'ct scan': 'computed tomography (detailed X-ray)',
  'ultrasound': 'sound wave imaging',
  'biopsy': 'tissue sample test',
  'endoscopy': 'camera examination inside the body',
  'colonoscopy': 'camera examination of the colon',
  'spirometry': 'lung function test',
  'urinalysis': 'urine test',
  'cbc': 'complete blood count (full blood test)',
  'lft': 'liver function test',
  'kft': 'kidney function test',
  'rft': 'kidney function test',
  'lipid profile': 'cholesterol and fat levels test',
  'thyroid profile': 'thyroid hormone levels test',

  // Medications (common)
  'metformin': 'Metformin (diabetes medicine)',
  'insulin': 'Insulin (diabetes injection)',
  'amlodipine': 'Amlodipine (blood pressure medicine)',
  'atorvastatin': 'Atorvastatin (cholesterol medicine)',
  'omeprazole': 'Omeprazole (stomach acid medicine)',
  'pantoprazole': 'Pantoprazole (stomach acid medicine)',
  'amoxicillin': 'Amoxicillin (antibiotic)',
  'azithromycin': 'Azithromycin (antibiotic)',
  'ciprofloxacin': 'Ciprofloxacin (antibiotic)',
  'paracetamol': 'Paracetamol (pain and fever medicine)',
  'acetaminophen': 'Acetaminophen/Paracetamol (pain and fever medicine)',
  'ibuprofen': 'Ibuprofen (pain and inflammation medicine)',
  'aspirin': 'Aspirin (pain relief and blood thinner)',
  'lisinopril': 'Lisinopril (blood pressure medicine)',
  'losartan': 'Losartan (blood pressure medicine)',
  'metoprolol': 'Metoprolol (heart and blood pressure medicine)',
  'atenolol': 'Atenolol (heart and blood pressure medicine)',
  'furosemide': 'Furosemide (water pill for swelling)',
  'hydrochlorothiazide': 'Hydrochlorothiazide (water pill for blood pressure)',
  'levothyroxine': 'Levothyroxine (thyroid hormone medicine)',
  'prednisolone': 'Prednisolone (steroid anti-inflammatory)',
  'prednisone': 'Prednisone (steroid anti-inflammatory)',
  'cetirizine': 'Cetirizine (allergy medicine)',
  'loratadine': 'Loratadine (allergy medicine)',
  'salbutamol': 'Salbutamol (inhaler for breathing)',
  'albuterol': 'Albuterol (inhaler for breathing)',
  'warfarin': 'Warfarin (blood thinner)',
  'clopidogrel': 'Clopidogrel (blood thinner)',
  'sertraline': 'Sertraline (antidepressant)',
  'fluoxetine': 'Fluoxetine (antidepressant)',
  'diazepam': 'Diazepam (anxiety/muscle relaxant)',
  'alprazolam': 'Alprazolam (anxiety medicine)',
  'gabapentin': 'Gabapentin (nerve pain medicine)',
  'pregabalin': 'Pregabalin (nerve pain medicine)',
  'tramadol': 'Tramadol (pain medicine)',
  'codeine': 'Codeine (pain medicine)',
  'morphine': 'Morphine (strong pain medicine)',
  'ondansetron': 'Ondansetron (anti-nausea medicine)',
  'domperidone': 'Domperidone (anti-nausea medicine)',
  'metoclopramide': 'Metoclopramide (anti-nausea medicine)',
  'ranitidine': 'Ranitidine (stomach acid medicine)',
  'calcium carbonate': 'Calcium Carbonate (calcium supplement)',
  'vitamin d3': 'Vitamin D3 (vitamin D supplement)',
  'ferrous sulfate': 'Ferrous Sulfate (iron supplement)',

  // Medical abbreviations
  'od': 'once daily',
  'bd': 'twice daily',
  'tds': 'three times daily',
  'qid': 'four times daily',
  'sos': 'when needed',
  'prn': 'when needed',
  'ac': 'before meals',
  'pc': 'after meals',
  'hs': 'at bedtime',
  'stat': 'immediately',
  'po': 'by mouth (oral)',
  'iv': 'into the vein (intravenous)',
  'im': 'into the muscle (intramuscular)',
  'sc': 'under the skin (subcutaneous)',
  'sl': 'under the tongue (sublingual)',
  'tab': 'tablet',
  'cap': 'capsule',
  'syp': 'syrup',
  'inj': 'injection',
  'oint': 'ointment',
  'susp': 'suspension',
  'mg': 'milligrams',
  'mcg': 'micrograms',
  'ml': 'milliliters',
  'bp': 'blood pressure',
  'hr': 'heart rate',
  'rr': 'breathing rate',
  'spo2': 'oxygen level in blood',
  'bmi': 'body mass index (weight-to-height ratio)',
  'h/o': 'history of',
  'c/o': 'complaining of',
  'k/c/o': 'known case of',
  'dx': 'diagnosis',
  'rx': 'prescription/treatment',
  'fx': 'fracture',
  'hx': 'history',
  'sx': 'symptoms',
  'tx': 'treatment',
  'f/u': 'follow-up',
  'npo': 'nothing by mouth (no food or drink)',
  'icu': 'intensive care unit',
  'er': 'emergency room',
  'op': 'outpatient',
  'ip': 'inpatient',
  'ot': 'operation theatre / occupational therapy',
  'pt': 'physical therapy / prothrombin time',
  'rt': 'respiratory therapy',
};

// Replace medical terms with plain language equivalents
export function simplifyMedicalText(text: string): string {
  if (!text) return text;

  let simplified = text;

  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = Object.keys(medicalGlossary).sort((a, b) => b.length - a.length);

  for (const term of sortedTerms) {
    const replacement = medicalGlossary[term];
    // Case-insensitive replacement with word boundary awareness
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    simplified = simplified.replace(regex, (match) => {
      // Preserve original capitalization style
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  return simplified;
}

// Extract key findings from report text
export function extractKeyFindings(reportText: string, prescriptionText: string): string[] {
  const findings: string[] = [];
  const combinedText = `${reportText} ${prescriptionText}`.toLowerCase();

  // Check for common conditions
  const conditionPatterns: Array<{ pattern: RegExp; finding: string }> = [
    { pattern: /hypertension|high blood pressure|bp.*elevated|elevated.*bp/i, finding: 'High blood pressure (hypertension) was noted.' },
    { pattern: /diabetes|hyperglycemia|high blood sugar|hba1c.*elevated|elevated.*hba1c/i, finding: 'Elevated blood sugar levels (diabetes-related) were detected.' },
    { pattern: /anemia|low hemoglobin|hemoglobin.*low|low.*hb\b/i, finding: 'Low red blood cell levels (anemia) were found — this can cause tiredness.' },
    { pattern: /infection|bacteria|viral|fever|pyrexia|leukocytosis/i, finding: 'Signs of infection or inflammation were detected.' },
    { pattern: /cholesterol.*high|high.*cholesterol|hypercholesterolemia|ldl.*elevated|elevated.*ldl/i, finding: 'High cholesterol levels were found — this can affect heart health.' },
    { pattern: /thyroid|tsh.*elevated|tsh.*low|hypothyroid|hyperthyroid/i, finding: 'Thyroid hormone levels were abnormal.' },
    { pattern: /kidney|renal|creatinine.*elevated|elevated.*creatinine|kft.*abnormal/i, finding: 'Kidney function markers showed some abnormality.' },
    { pattern: /liver|hepatic|alt.*elevated|ast.*elevated|lft.*abnormal/i, finding: 'Liver function markers showed some abnormality.' },
    { pattern: /vitamin d.*deficient|deficient.*vitamin d|low.*vitamin d/i, finding: 'Vitamin D deficiency was detected.' },
    { pattern: /vitamin b12.*low|low.*vitamin b12|b12.*deficient/i, finding: 'Vitamin B12 deficiency was detected.' },
    { pattern: /iron.*deficient|deficient.*iron|low.*ferritin|ferritin.*low/i, finding: 'Iron deficiency was detected.' },
    { pattern: /normal|within normal|wnl|unremarkable/i, finding: 'Most test results appear to be within normal range.' },
    { pattern: /urine.*infection|uti|urinary tract/i, finding: 'A urinary tract infection (bladder/kidney infection) was detected.' },
    { pattern: /pneumonia|lung infection|chest infection/i, finding: 'A lung infection (pneumonia) was detected.' },
    { pattern: /fracture|broken bone/i, finding: 'A bone fracture (break) was identified.' },
    { pattern: /tumor|cancer|malignant|carcinoma/i, finding: 'Abnormal tissue growth was detected — further evaluation is needed.' },
    { pattern: /benign/i, finding: 'The growth or finding appears to be non-cancerous (benign).' },
    { pattern: /obesity|overweight|bmi.*elevated|elevated.*bmi/i, finding: 'Body weight is above the healthy range.' },
    { pattern: /dehydration|low fluid/i, finding: 'Signs of dehydration (low fluid levels) were noted.' },
    { pattern: /electrolyte|sodium.*low|potassium.*low|low.*sodium|low.*potassium/i, finding: 'Electrolyte (mineral) imbalance was detected.' },
  ];

  for (const { pattern, finding } of conditionPatterns) {
    if (pattern.test(combinedText)) {
      findings.push(finding);
    }
  }

  // If no specific findings, add a general note
  if (findings.length === 0) {
    if (reportText.trim()) {
      findings.push('Your report has been processed. Please review the details with your doctor.');
    }
    if (prescriptionText.trim()) {
      findings.push('A prescription has been provided. Follow the medication instructions carefully.');
    }
  }

  // Add general advice
  findings.push('Always consult your doctor to understand what these results mean for your health.');

  return findings;
}

// Extract medications from prescription text
export function extractMedications(prescriptionText: string): Medication[] {
  if (!prescriptionText.trim()) return [];

  const medications: Medication[] = [];
  const lines = prescriptionText.split(/\n|;/).map(l => l.trim()).filter(l => l.length > 0);

  // Common medication patterns — filter glossary entries that describe medicines
  const medicationPatterns = Object.keys(medicalGlossary).filter(term =>
    medicalGlossary[term].toLowerCase().includes('medicine') ||
    medicalGlossary[term].toLowerCase().includes('antibiotic') ||
    medicalGlossary[term].toLowerCase().includes('tablet') ||
    medicalGlossary[term].toLowerCase().includes('injection') ||
    medicalGlossary[term].toLowerCase().includes('inhaler') ||
    medicalGlossary[term].toLowerCase().includes('supplement') ||
    medicalGlossary[term].toLowerCase().includes('pill') ||
    medicalGlossary[term].toLowerCase().includes('syrup')
  );

  const dosagePatterns: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /\b(\d+)\s*mg\b/i, label: 'mg' },
    { pattern: /\b(\d+)\s*mcg\b/i, label: 'mcg' },
    { pattern: /\b(\d+)\s*ml\b/i, label: 'ml' },
    { pattern: /\b(\d+)\s*g\b/i, label: 'g' },
  ];

  const frequencyMap: Record<string, string> = {
    'od': 'once daily',
    'once daily': 'once daily',
    'once a day': 'once daily',
    'bd': 'twice daily',
    'bid': 'twice daily',
    'twice daily': 'twice daily',
    'twice a day': 'twice daily',
    'tds': 'three times daily',
    'tid': 'three times daily',
    'three times': 'three times daily',
    'qid': 'four times daily',
    'four times': 'four times daily',
    'sos': 'when needed',
    'prn': 'when needed',
    'when needed': 'when needed',
    'as needed': 'when needed',
    'at night': 'at bedtime',
    'hs': 'at bedtime',
    'bedtime': 'at bedtime',
    'morning': 'in the morning',
    'evening': 'in the evening',
  };

  const timingMap: Record<string, string> = {
    'ac': 'before meals',
    'before food': 'before meals',
    'before meal': 'before meals',
    'pc': 'after meals',
    'after food': 'after meals',
    'after meal': 'after meals',
    'with food': 'with food',
    'empty stomach': 'on an empty stomach',
  };

  const foundMeds = new Set<string>();

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Find medication name
    let medName = '';
    let medPurpose = '';

    for (const medTerm of medicationPatterns) {
      if (lowerLine.includes(medTerm) && !foundMeds.has(medTerm)) {
        medName = medicalGlossary[medTerm];
        foundMeds.add(medTerm);

        // Determine purpose based on medication type
        const glossaryValue = medicalGlossary[medTerm].toLowerCase();
        if (glossaryValue.includes('blood pressure')) medPurpose = 'To control blood pressure';
        else if (glossaryValue.includes('diabetes') || glossaryValue.includes('blood sugar')) medPurpose = 'To control blood sugar levels';
        else if (glossaryValue.includes('antibiotic')) medPurpose = 'To fight bacterial infection';
        else if (glossaryValue.includes('pain')) medPurpose = 'To relieve pain';
        else if (glossaryValue.includes('fever')) medPurpose = 'To reduce fever and pain';
        else if (glossaryValue.includes('cholesterol')) medPurpose = 'To lower cholesterol levels';
        else if (glossaryValue.includes('stomach acid')) medPurpose = 'To reduce stomach acid';
        else if (glossaryValue.includes('thyroid')) medPurpose = 'To regulate thyroid hormone';
        else if (glossaryValue.includes('allergy')) medPurpose = 'To relieve allergy symptoms';
        else if (glossaryValue.includes('breathing') || glossaryValue.includes('inhaler')) medPurpose = 'To help with breathing';
        else if (glossaryValue.includes('blood thinner')) medPurpose = 'To prevent blood clots';
        else if (glossaryValue.includes('antidepressant')) medPurpose = 'To improve mood and treat depression';
        else if (glossaryValue.includes('anxiety')) medPurpose = 'To reduce anxiety';
        else if (glossaryValue.includes('supplement') || glossaryValue.includes('vitamin')) medPurpose = 'To supplement nutritional deficiency';
        else if (glossaryValue.includes('iron')) medPurpose = 'To treat iron deficiency';
        else if (glossaryValue.includes('anti-nausea')) medPurpose = 'To prevent nausea and vomiting';
        else if (glossaryValue.includes('water pill')) medPurpose = 'To reduce fluid retention and swelling';
        else if (glossaryValue.includes('nerve pain')) medPurpose = 'To relieve nerve pain';
        else if (glossaryValue.includes('steroid')) medPurpose = 'To reduce inflammation';
        else medPurpose = 'As prescribed by your doctor';

        break;
      }
    }

    if (!medName) continue;

    // Extract dosage
    let dosageStr = '';
    for (const { pattern, label } of dosagePatterns) {
      const match = line.match(pattern);
      if (match) {
        dosageStr = `${match[1]} ${label}`;
        break;
      }
    }

    // Extract frequency
    let frequency = '';
    for (const [key, value] of Object.entries(frequencyMap)) {
      if (lowerLine.includes(key)) {
        frequency = value;
        break;
      }
    }

    // Extract timing
    let timing = '';
    for (const [key, value] of Object.entries(timingMap)) {
      if (lowerLine.includes(key)) {
        timing = value;
        break;
      }
    }

    // Build dosage instruction — explicitly typed as string[]
    const dosageParts: string[] = [];
    if (dosageStr) dosageParts.push(dosageStr);
    if (frequency) dosageParts.push(frequency);
    if (timing) dosageParts.push(timing);

    const dosageInstruction = dosageParts.length > 0
      ? dosageParts.join(', ')
      : 'As directed by your doctor';

    medications.push({
      name: medName,
      purpose: medPurpose,
      dosage: dosageInstruction,
    });
  }

  // If no structured medications found but prescription text exists, try word-by-word scan
  if (medications.length === 0 && prescriptionText.trim()) {
    const words = prescriptionText.split(/\s+/);
    for (const word of words) {
      const lowerWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (medicalGlossary[lowerWord] && !foundMeds.has(lowerWord)) {
        const glossaryValue = medicalGlossary[lowerWord];
        if (
          glossaryValue.toLowerCase().includes('medicine') ||
          glossaryValue.toLowerCase().includes('antibiotic') ||
          glossaryValue.toLowerCase().includes('supplement')
        ) {
          foundMeds.add(lowerWord);
          medications.push({
            name: glossaryValue,
            purpose: 'As prescribed by your doctor',
            dosage: "Follow your doctor's instructions",
          });
        }
      }
    }
  }

  return medications;
}

// Generate action steps based on findings
export function generateActionSteps(reportText: string, prescriptionText: string): ActionStep[] {
  const steps: ActionStep[] = [];
  const combinedText = `${reportText} ${prescriptionText}`.toLowerCase();

  // Always include medication compliance if prescription exists
  if (prescriptionText.trim()) {
    steps.push({ description: '💊 Take all prescribed medicines exactly as directed by your doctor. Do not skip doses.' });
  }

  // Condition-specific advice
  if (/hypertension|high blood pressure/i.test(combinedText)) {
    steps.push({ description: '🧂 Reduce salt in your diet and avoid processed foods to help lower blood pressure.' });
    steps.push({ description: '🚶 Exercise regularly (30 minutes of walking daily) to help control blood pressure.' });
  }

  if (/diabetes|blood sugar|hyperglycemia/i.test(combinedText)) {
    steps.push({ description: '🍎 Follow a low-sugar, low-carbohydrate diet. Avoid sweets, white rice, and sugary drinks.' });
    steps.push({ description: '📊 Monitor your blood sugar levels regularly as advised by your doctor.' });
  }

  if (/cholesterol|ldl|lipid/i.test(combinedText)) {
    steps.push({ description: '🥗 Eat a heart-healthy diet: more vegetables, fruits, and whole grains; less fried and fatty foods.' });
  }

  if (/anemia|low hemoglobin|iron deficient/i.test(combinedText)) {
    steps.push({ description: '🥩 Eat iron-rich foods like spinach, lentils, beans, and lean meat to help improve blood levels.' });
  }

  if (/vitamin d.*deficient|low.*vitamin d/i.test(combinedText)) {
    steps.push({ description: '☀️ Get 15-20 minutes of sunlight daily and take Vitamin D supplements as prescribed.' });
  }

  if (/infection|bacteria|viral|fever/i.test(combinedText)) {
    steps.push({ description: '🛏️ Rest well and drink plenty of fluids (water, soups) to help your body fight the infection.' });
    steps.push({ description: '🌡️ Monitor your temperature. If fever goes above 103°F (39.4°C), seek immediate medical attention.' });
  }

  if (/kidney|renal/i.test(combinedText)) {
    steps.push({ description: '💧 Drink adequate water (6-8 glasses daily) to support kidney function.' });
    steps.push({ description: '🚫 Avoid excessive salt, protein, and over-the-counter pain medicines that can stress the kidneys.' });
  }

  if (/liver|hepatic/i.test(combinedText)) {
    steps.push({ description: '🚫 Avoid alcohol completely to protect your liver.' });
    steps.push({ description: '🥦 Eat a balanced diet with plenty of vegetables and avoid fatty, fried foods.' });
  }

  // General follow-up advice
  steps.push({ description: '📅 Schedule a follow-up appointment with your doctor to review these results and your progress.' });
  steps.push({ description: '❓ Write down any questions or new symptoms to discuss with your doctor at your next visit.' });

  // Emergency warning
  if (/severe|critical|urgent|emergency|immediately/i.test(combinedText)) {
    steps.unshift({ description: '🚨 IMPORTANT: Your report contains urgent findings. Please contact your doctor or go to the emergency room immediately.' });
  }

  return steps;
}

// Main simplification function
export function simplifyReport(reportText: string, prescriptionText: string): {
  keyFindings: string[];
  medications: Medication[];
  actionSteps: ActionStep[];
} {
  const keyFindings = extractKeyFindings(reportText, prescriptionText);
  const medications = extractMedications(prescriptionText);
  const actionSteps = generateActionSteps(reportText, prescriptionText);

  return { keyFindings, medications, actionSteps };
}
