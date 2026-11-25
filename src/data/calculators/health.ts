import { CalculatorDef } from '../../types/calculator.ts';

export const HEALTH_CALCULATORS: CalculatorDef[] = [
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    category: 'health-calculators',
    name: 'BMI Calculator',
    shortName: 'BMI',
    description: 'Compute Body Mass Index, BMI Prime, and healthy weight range in metric or imperial units.',
    keywords: ['bmi', 'body mass index', 'healthy weight', 'obesity', 'underweight'],
    popular: true,
    seoTitle: 'BMI Calculator – Body Mass Index & Healthy Weight Range | CalcAxis',
    seoDescription: 'Calculate your Body Mass Index (BMI), BMI Prime, and recommended healthy weight range in pounds/feet or kilograms/centimeters.',
    formulaText: 'BMI = Weight (kg) ÷ Height (m)²',
    formulaVariables: [
      { symbol: 'Weight', description: 'Body mass in kilograms (or lbs × 0.453592)' },
      { symbol: 'Height', description: 'Standing height in meters' },
    ],
    steps: [
      'Select Imperial (feet/inches, lbs) or Metric (cm, kg) units.',
      'Enter your height and current body weight.',
      'View your BMI score, WHO category, and healthy weight range.',
    ],
    example: {
      title: '5 ft 9 in (175 cm) and 154 lbs (70 kg)',
      inputsSummary: 'Height: 175 cm · Weight: 70 kg',
      calculation: 'BMI = 70 ÷ (1.75)² = 22.86',
      resultSummary: 'BMI is 22.9 (Normal weight); healthy range is 56.7 kg – 76.3 kg.',
    },
    faqs: [
      {
        question: 'What is a healthy adult BMI range?',
        answer: 'For most adults, the World Health Organization defines a normal BMI as 18.5 to 24.9.',
      },
      {
        question: 'Does BMI work for athletes?',
        answer: 'High muscle mass increases weight without increasing body fat, which can push muscular individuals into the Overweight BMI category. Pair BMI with Body Fat or Waist-to-Height Ratio.',
      },
      {
        question: 'What is BMI Prime?',
        answer: 'BMI Prime is the ratio of your BMI to 25.0 (the upper limit of normal weight). Values between 0.74 and 1.00 fall in the normal range.',
      },
    ],
    educationalSections: [
      {
        heading: 'Using BMI Alongside Waist Measurements',
        body: 'BMI is a fast screening indicator, not a clinical diagnosis. Evaluating waist circumference and body composition gives a fuller picture of cardiometabolic health.',
      },
    ],
    relatedSlugs: ['body-fat-calculator', 'ideal-weight-calculator', 'waist-to-height-ratio-calculator', 'calorie-calculator'],
  },
  {
    id: 'bmr-calculator',
    slug: 'bmr-calculator',
    category: 'health-calculators',
    name: 'BMR Calculator',
    shortName: 'BMR',
    description: 'Estimate Basal Metabolic Rate using Mifflin-St Jeor and Harris-Benedict equations.',
    keywords: ['bmr', 'basal metabolic rate', 'resting calories', 'metabolism'],
    seoTitle: 'BMR Calculator – Basal Metabolic Rate (Mifflin-St Jeor) | CalcAxis',
    seoDescription: 'Calculate your daily Basal Metabolic Rate (BMR) and baseline calorie burn across activity levels.',
    formulaText: 'Mifflin-St Jeor:  BMR = 10W + 6.25H − 5A + s  (s = +5 male, −161 female)',
    formulaVariables: [
      { symbol: 'W', description: 'Weight in kilograms' },
      { symbol: 'H', description: 'Height in centimeters' },
      { symbol: 'A', description: 'Age in years' },
    ],
    steps: [
      'Select biological sex and preferred equation (Mifflin-St Jeor recommended).',
      'Enter age, height, and weight.',
      'Review resting BMR plus estimated total daily calories at each activity tier.',
    ],
    example: {
      title: '30-Year-Old Male, 180 cm, 80 kg',
      inputsSummary: 'Sex: Male · Age: 30 · Height: 180 cm · Weight: 80 kg',
      calculation: '10(80) + 6.25(180) − 5(30) + 5 = 1,780 kcal/day',
      resultSummary: 'Resting BMR is 1,780 kcal/day; sedentary maintenance is ~2,136 kcal/day.',
    },
    faqs: [
      {
        question: 'Should I eat only my BMR calories to lose weight?',
        answer: 'No. BMR represents coma/complete-rest energy needs. Daily weight-loss targets should be subtracted from your TDEE, not your BMR.',
      },
      {
        question: 'Which BMR formula is most accurate?',
        answer: 'Clinical nutrition studies generally find the Mifflin-St Jeor equation more accurate for modern populations than the older 1919 Harris-Benedict equation.',
      },
      {
        question: 'Why does BMR decline with age?',
        answer: 'Gradual loss of lean muscle tissue and minor hormonal shifts reduce resting energy expenditure as adults age.',
      },
    ],
    educationalSections: [
      {
        heading: 'Factors That Influence Resting Metabolism',
        body: 'Lean muscle mass, body size, age, thyroid health, and genetics all play roles in resting energy burn.',
      },
    ],
    relatedSlugs: ['tdee-calculator', 'calorie-calculator', 'macro-calculator'],
  },
  {
    id: 'tdee-calculator',
    slug: 'tdee-calculator',
    category: 'health-calculators',
    name: 'TDEE Calculator',
    shortName: 'TDEE',
    description: 'Calculate Total Daily Energy Expenditure based on BMR and weekly physical activity.',
    keywords: ['tdee', 'maintenance calories', 'daily energy expenditure'],
    seoTitle: 'TDEE Calculator – Total Daily Energy Expenditure | CalcAxis',
    seoDescription: 'Find your Total Daily Energy Expenditure (TDEE) to plan weight maintenance, fat loss, or lean muscle gain.',
    formulaText: 'TDEE = BMR × Activity Multiplier (1.2 to 1.9)',
    formulaVariables: [
      { symbol: 'BMR', description: 'Basal Metabolic Rate (Mifflin-St Jeor)' },
      { symbol: 'Multiplier', description: 'Sedentary 1.2, Light 1.375, Moderate 1.55, Active 1.725, Very Active 1.9' },
    ],
    steps: [
      'Enter sex, age, height, and weight.',
      'Choose the activity level that reflects your weekly routine honestly.',
      'View maintenance TDEE alongside mild/moderate fat loss and muscle gain calorie targets.',
    ],
    example: {
      title: 'Moderately Active 30-Year-Old Male (180 cm, 80 kg)',
      inputsSummary: 'BMR = 1,780 kcal · Activity: Moderate (1.55×)',
      calculation: '1,780 × 1.55 = 2,759 kcal/day',
      resultSummary: 'Maintenance TDEE is 2,759 kcal/day; a 500 kcal deficit is 2,259 kcal/day.',
    },
    faqs: [
      {
        question: 'How should I choose an activity multiplier?',
        answer: 'If you have a desk job and exercise 3 days a week, Light (1.375) or Moderate (1.55) is usually more accurate than Active.',
      },
      {
        question: 'How fast should I adjust if weight doesn’t change?',
        answer: 'Track average weekly weight for 2–3 weeks; adjust daily intake by 150–200 kcal if trends differ from your goal.',
      },
      {
        question: 'Are wearable calorie-burn trackers included in TDEE?',
        answer: 'No, TDEE multipliers already include exercise—avoid double-counting workout calories on top of a Moderate/Active multiplier.',
      },
    ],
    educationalSections: [
      {
        heading: 'NEAT and Activity Variability',
        body: 'Non-exercise activity thermogenesis (walking, fidgeting, standing) varies substantially between individuals and explains why TDEE is a starting estimate.',
      },
    ],
    relatedSlugs: ['calorie-calculator', 'bmr-calculator', 'macro-calculator'],
  },
  {
    id: 'calorie-calculator',
    slug: 'calorie-calculator',
    category: 'health-calculators',
    name: 'Calorie Calculator',
    shortName: 'Calorie',
    description: 'Estimate daily calorie targets for weight maintenance, gradual fat loss, or lean weight gain.',
    keywords: ['calorie', 'weight loss', 'calorie deficit', 'daily calories'],
    popular: true,
    seoTitle: 'Calorie Calculator – Daily Target for Loss or Gain | CalcAxis',
    seoDescription: 'Calculate daily calorie needs for maintaining weight, losing 0.5–2 lbs per week, or gaining muscle mass.',
    formulaText: 'Target Calories = TDEE + Goal Offset (−500 kcal/day ≈ −1 lb/wk)',
    formulaVariables: [
      { symbol: 'TDEE', description: 'Daily maintenance energy expenditure' },
      { symbol: 'Offset', description: '−250, −500, −1000 for loss; +250, +500 for gain' },
    ],
    steps: [
      'Enter age, sex, height, and weight in Metric or Imperial units.',
      'Select your typical weekly activity level and weight goal.',
      'Review daily calorie target and suggested macronutrient balance.',
    ],
    example: {
      title: 'Weight Loss Goal (-1 lb/week)',
      inputsSummary: 'Maintenance TDEE: 2,350 kcal · Goal: Lose 1 lb/week (-500 kcal)',
      calculation: '2,350 − 500 = 1,850 kcal/day',
      resultSummary: 'Recommended target is 1,850 kcal/day.',
    },
    faqs: [
      {
        question: 'Why does the calculator keep a 1,200 kcal floor?',
        answer: 'Very low calorie diets below 1,200 kcal/day risk nutrient deficiencies and lean tissue loss unless supervised by a physician.',
      },
      {
        question: 'Is 3,500 calories always equal to 1 pound of fat?',
        answer: '3,500 kcal per pound is a classic rule-of-thumb approximation; actual weight change also reflects water shifts and metabolic adaptation.',
      },
      {
        question: 'Should I eat more protein during a calorie deficit?',
        answer: 'Higher protein intake helps preserve lean muscle mass and increases satiety while losing weight.',
      },
    ],
    educationalSections: [
      {
        heading: 'Sustainable Calorie Deficits',
        body: 'Moderate deficits of 250–500 calories daily are easier to sustain long-term and support better athletic performance than aggressive crash diets.',
      },
    ],
    relatedSlugs: ['tdee-calculator', 'macro-calculator', 'bmr-calculator', 'bmi-calculator'],
  },
  {
    id: 'ideal-weight-calculator',
    slug: 'ideal-weight-calculator',
    category: 'health-calculators',
    name: 'Ideal Weight Calculator',
    shortName: 'Ideal Weight',
    description: 'Compare healthy body weight estimates across Devine, Robinson, Miller, Hamwi, and BMI equations.',
    keywords: ['ideal weight', 'devine formula', 'healthy weight'],
    seoTitle: 'Ideal Weight Calculator – 4 Clinical Formulas & BMI Range | CalcAxis',
    seoDescription: 'Estimate ideal body weight based on height and sex using Devine, Robinson, Miller, Hamwi, and healthy BMI formulas.',
    formulaText: 'Devine (Male): 50 kg + 2.3 kg × (inches over 60)',
    formulaVariables: [
      { symbol: 'inches over 60', description: 'Height in inches minus 5 feet (60 inches)' },
    ],
    steps: [
      'Select biological sex and enter your height in cm or feet/inches.',
      'Compare the four clinical ideal body weight formulas alongside the healthy BMI weight band.',
    ],
    example: {
      title: '5 ft 10 in (70 inches) Adult Male',
      inputsSummary: 'Sex: Male · Height: 70 inches (177.8 cm)',
      calculation: 'Devine: 50 + 2.3 × 10 = 73.0 kg (160.9 lbs)',
      resultSummary: 'Clinical formulas span 70.3–75.0 kg; healthy BMI range is 58.5–78.7 kg.',
    },
    faqs: [
      {
        question: 'Why do the four formulas produce slightly different numbers?',
        answer: 'They were developed in different decades for medical dosing (such as Devine 1974) and insurance tables, each weighting height slightly differently.',
      },
      {
        question: 'Why is a range more useful than one number?',
        answer: 'Bone frame size, muscularity, and body composition vary widely between healthy individuals of the same height.',
      },
      {
        question: 'Does ideal weight apply to children?',
        answer: 'No, pediatric growth is evaluated using age- and sex-specific CDC/WHO growth percentiles.',
      },
    ],
    educationalSections: [
      {
        heading: 'Origin of Ideal Body Weight Equations',
        body: 'Clinicians originally derived equations like Devine and Hamwi to calculate medication dosages based on lean compartment estimates rather than total scale weight.',
      },
    ],
    relatedSlugs: ['bmi-calculator', 'body-fat-calculator', 'waist-to-height-ratio-calculator'],
  },
  {
    id: 'body-fat-calculator',
    slug: 'body-fat-calculator',
    category: 'health-calculators',
    name: 'Body Fat Calculator',
    shortName: 'Body Fat',
    description: 'Estimate body fat percentage, fat mass, and lean mass using the U.S. Navy circumference method.',
    keywords: ['body fat', 'us navy method', 'lean body mass', 'waist measurement'],
    seoTitle: 'Body Fat Calculator – U.S. Navy Body Composition Estimator | CalcAxis',
    seoDescription: 'Calculate body fat percentage, fat mass, and lean muscle mass using the U.S. Navy tape-measure method.',
    formulaText: 'Male %BF = 495 / (1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height)) − 450',
    formulaVariables: [
      { symbol: 'waist, neck, hip', description: 'Circumference measurements in centimeters' },
      { symbol: 'height', description: 'Standing height in centimeters' },
    ],
    steps: [
      'Select sex and enter height and body weight.',
      'Measure neck circumference just below the larynx and waist at the navel (or narrowest point for women, plus widest hip circumference).',
      'Review estimated body fat %, fat mass, lean mass, and ACE category.',
    ],
    example: {
      title: 'Male: 180 cm, 80 kg, Neck 38 cm, Waist 85 cm',
      inputsSummary: 'Height: 180 cm · Weight: 80 kg · Neck: 38 cm · Waist: 85 cm',
      calculation: 'Waist − Neck = 47 cm; Navy logarithmic equation applied',
      resultSummary: 'Estimated body fat is 15.1% (Fitness category), with 67.9 kg lean mass.',
    },
    faqs: [
      {
        question: 'How accurate is the U.S. Navy body fat method?',
        answer: 'When measured consistently with a flexible tape, it typically falls within ±3%–4% of DEXA scans for most adults.',
      },
      {
        question: 'When is the best time to take circumference measurements?',
        answer: 'Measure first thing in the morning before eating or exercising for consistent week-to-week tracking.',
      },
      {
        question: 'What is essential body fat?',
        answer: 'Essential fat (roughly 2–5% in men, 10–13% in women) is necessary for hormone production, nerve insulation, and organ protection.',
      },
    ],
    educationalSections: [
      {
        heading: 'Why Lean Mass Matters',
        body: 'Tracking fat mass versus lean mass ensures weight loss comes primarily from adipose tissue rather than muscle.',
      },
    ],
    relatedSlugs: ['bmi-calculator', 'waist-to-height-ratio-calculator', 'macro-calculator'],
  },
  {
    id: 'pregnancy-calculator',
    slug: 'pregnancy-calculator',
    category: 'health-calculators',
    name: 'Pregnancy Calculator',
    shortName: 'Pregnancy',
    description: 'Track gestational age in weeks and days, current trimester, estimated due date, and milestone dates.',
    keywords: ['pregnancy', 'gestational age', 'trimester', 'due date'],
    popular: true,
    seoTitle: 'Pregnancy Calculator – Gestational Age, Trimester & Milestones | CalcAxis',
    seoDescription: 'Estimate your pregnancy due date, current gestational week, trimester, and key milestone dates from LMP, conception, or due date.',
    formulaText: 'EDD = LMP + 280 days + (Cycle Length − 28 days)',
    formulaVariables: [
      { symbol: 'LMP', description: 'First day of Last Menstrual Period' },
      { symbol: 'EDD', description: 'Estimated Due Date (40 weeks gestational age)' },
    ],
    steps: [
      'Choose your calculation basis (Last Menstrual Period, Conception Date, or Known Due Date).',
      'Enter the date and your average menstrual cycle length.',
      'View current gestational age, trimester progress bar, and milestone dates.',
    ],
    example: {
      title: 'LMP on January 1 with 28-Day Cycle',
      inputsSummary: 'LMP: 2026-01-01 · Cycle: 28 days',
      calculation: 'Jan 1 + 280 days = October 8',
      resultSummary: 'Estimated due date is October 8, 2026.',
    },
    faqs: [
      {
        question: 'Why does pregnancy count from the last period instead of conception?',
        answer: 'Obstetric dating (Naegele’s rule) starts from the first day of the last menstrual period because that date is usually known reliably, adding roughly 2 weeks before ovulation.',
      },
      {
        question: 'How many babies arrive on their exact due date?',
        answer: 'Only about 4%–5% deliver on the exact estimated due date; full-term delivery normally spans 39 to 41 weeks.',
      },
      {
        question: 'Can an ultrasound change my due date?',
        answer: 'Yes—a first-trimester dating ultrasound is the clinical standard and may refine your EDD if cycle ovulation occurred early or late.',
      },
    ],
    educationalSections: [
      {
        heading: 'Understanding the Three Trimesters',
        body: 'Trimester 1 spans weeks 1–12, Trimester 2 spans weeks 13–26, and Trimester 3 runs from week 27 through delivery.',
      },
    ],
    relatedSlugs: ['due-date-calculator', 'ovulation-calculator'],
  },
  {
    id: 'due-date-calculator',
    slug: 'due-date-calculator',
    category: 'health-calculators',
    name: 'Due Date Calculator',
    shortName: 'Due Date',
    description: 'Estimate your baby’s expected arrival date, conception window, and trimester transition dates.',
    keywords: ['due date', 'baby arrival', 'naegele rule', 'edd'],
    seoTitle: 'Due Date Calculator – Estimated Baby Arrival Date | CalcAxis',
    seoDescription: 'Calculate your baby’s estimated due date, conception date, and trimester milestones based on your last period and cycle length.',
    formulaText: 'Due Date = First Day of LMP + 280 + (Cycle − 28) days',
    formulaVariables: [
      { symbol: 'LMP', description: 'First day of last menstrual period' },
      { symbol: 'Cycle', description: 'Average cycle length in days (default 28)' },
    ],
    steps: [
      'Select the first day of your last menstrual period.',
      'Adjust average menstrual cycle length if different from 28 days.',
      'Review estimated due date, conception window, and full-term window.',
    ],
    example: {
      title: '30-Day Cycle Starting March 1',
      inputsSummary: 'LMP: 2026-03-01 · Cycle Length: 30 days',
      calculation: '280 + (30 − 28) = 282 days added',
      resultSummary: 'Estimated due date is December 8, 2026.',
    },
    faqs: [
      {
        question: 'How does cycle length shift the due date?',
        answer: 'Ovulation typically occurs ~14 days before the next period; longer cycles delay ovulation and shift the due date forward accordingly.',
      },
      {
        question: 'What is considered full term?',
        answer: 'The American College of Obstetricians and Gynecologists defines full term as 39 weeks 0 days through 40 weeks 6 days.',
      },
      {
        question: 'Should I confirm with my healthcare provider?',
        answer: 'Yes—always rely on your OB/GYN or midwife’s clinical dating and ultrasound measurements.',
      },
    ],
    educationalSections: [
      {
        heading: 'Planning Ahead for Trimester Milestones',
        body: 'Knowing approximate trimester dates helps expectant parents schedule routine prenatal screenings and prepare leave plans.',
      },
    ],
    relatedSlugs: ['pregnancy-calculator', 'ovulation-calculator'],
  },
  {
    id: 'ovulation-calculator',
    slug: 'ovulation-calculator',
    category: 'health-calculators',
    name: 'Ovulation Calculator',
    shortName: 'Ovulation',
    description: 'Estimate your ovulation day, 6-day fertile window, and upcoming 3-cycle fertility calendar.',
    keywords: ['ovulation', 'fertile window', 'fertility calendar', 'cycle'],
    seoTitle: 'Ovulation Calculator – Fertile Window & 3-Cycle Calendar | CalcAxis',
    seoDescription: 'Predict your most fertile days, next ovulation date, and 3-month cycle forecast based on cycle length.',
    formulaText: 'Ovulation Day = Period Start + (Cycle Length − 14 days)',
    formulaVariables: [
      { symbol: 'Cycle Length', description: 'Days from day 1 of one period to day 1 of the next' },
      { symbol: 'Luteal Phase', description: 'Typically ~14 days prior to the next menstrual period' },
    ],
    steps: [
      'Enter the first day of your most recent menstrual period.',
      'Enter your typical cycle length (between 20 and 45 days).',
      'Inspect your estimated ovulation date, fertile window, and next 3 cycle forecasts.',
    ],
    example: {
      title: '28-Day Cycle Starting May 1',
      inputsSummary: 'LMP: 2026-05-01 · Cycle Length: 28 days',
      calculation: 'Ovulation = May 1 + 14 days = May 15; Fertile window = May 10 – May 16',
      resultSummary: 'Peak fertile window spans May 10 to May 16.',
    },
    faqs: [
      {
        question: 'Why does the fertile window span 6 days?',
        answer: 'Sperm can survive in the reproductive tract for up to 5 days, while an egg remains viable for roughly 12–24 hours after ovulation.',
      },
      {
        question: 'What if my cycle is irregular?',
        answer: 'Calendar estimates are less reliable for irregular cycles; pairing with LH ovulation strips or basal body temperature tracking improves accuracy.',
      },
      {
        question: 'Can this be used as birth control?',
        answer: 'No. Calendar calculators are informational tools and should not be relied upon as standalone contraception.',
      },
    ],
    educationalSections: [
      {
        heading: 'Recognizing Signs of Ovulation',
        body: 'In addition to cycle tracking, changes in cervical mucus consistency and a mid-cycle LH surge help pinpoint fertile days.',
      },
    ],
    relatedSlugs: ['pregnancy-calculator', 'due-date-calculator'],
  },
  {
    id: 'macro-calculator',
    slug: 'macro-calculator',
    category: 'health-calculators',
    name: 'Macro Calculator',
    shortName: 'Macro',
    description: 'Break daily calories into exact grams of protein, carbohydrates, and dietary fats by diet style.',
    keywords: ['macros', 'macronutrients', 'protein', 'carbs', 'keto'],
    seoTitle: 'Macro Calculator – Daily Protein, Carbs & Fat Grams | CalcAxis',
    seoDescription: 'Calculate daily grams of protein, carbohydrates, and fat for Balanced, High-Protein, Low-Carb, or Keto targets.',
    formulaText: 'Protein g = (Cal × %P)/4  |  Carbs g = (Cal × %C)/4  |  Fat g = (Cal × %F)/9',
    formulaVariables: [
      { symbol: '4 kcal/g', description: 'Energy density of protein and carbohydrates' },
      { symbol: '9 kcal/g', description: 'Energy density of dietary fat' },
    ],
    steps: [
      'Enter your target daily calories (or calculate them first via TDEE/Calorie calculator).',
      'Pick a macro split preset (Balanced, Low Carb, High Protein, or Ketogenic).',
      'Inspect daily grams and calorie percentages in the chart.',
    ],
    example: {
      title: '2,200 kcal High-Protein Target (40P / 35C / 25F)',
      inputsSummary: 'Calories: 2,200 · Preset: High Protein',
      calculation: 'Protein: 880/4 = 220g; Carbs: 770/4 = 192.5g; Fat: 550/9 = 61.1g',
      resultSummary: 'Daily targets: 220g protein, 193g carbs, 61g fat.',
    },
    faqs: [
      {
        question: 'Why does fat have 9 calories per gram while protein and carbs have 4?',
        answer: 'Dietary lipids are more energy-dense per gram than amino acids or carbohydrates.',
      },
      {
        question: 'Which macro split is best for strength training?',
        answer: 'High-protein or balanced diets providing 1.6–2.2g of protein per kg of body weight support muscle recovery well.',
      },
      {
        question: 'Do I have to hit macro grams to the exact gram?',
        answer: 'Being within ±5–10 grams on protein and hitting overall weekly calories is practical for most people.',
      },
    ],
    educationalSections: [
      {
        heading: 'Prioritizing Protein and Fiber',
        body: 'Hitting protein targets supports lean tissue retention while fiber-rich carbohydrates support energy and digestive health.',
      },
    ],
    relatedSlugs: ['calorie-calculator', 'tdee-calculator', 'water-intake-calculator'],
  },
  {
    id: 'water-intake-calculator',
    slug: 'water-intake-calculator',
    category: 'health-calculators',
    name: 'Water Intake Calculator',
    shortName: 'Water Intake',
    description: 'Estimate recommended daily fluid intake in liters, ounces, and cups based on weight, exercise, and climate.',
    keywords: ['water intake', 'hydration', 'daily water', 'ounces'],
    seoTitle: 'Water Intake Calculator – Daily Hydration Estimator | CalcAxis',
    seoDescription: 'Calculate how much water to drink per day in liters, fluid ounces, and 8-oz glasses based on body weight and activity.',
    formulaText: 'Liters = (Weight kg × 0.033) + (Exercise mins ÷ 30 × 0.35) + Climate Bonus',
    formulaVariables: [
      { symbol: 'Weight kg', description: 'Body weight in kilograms' },
      { symbol: 'Exercise mins', description: 'Daily moderate-to-vigorous workout duration' },
    ],
    steps: [
      'Enter your body weight in pounds or kilograms.',
      'Enter average daily exercise minutes and select local climate.',
      'View recommended hydration in liters, fluid ounces, and 8-oz cups.',
    ],
    example: {
      title: '165 lb (75 kg) Adult with 45 Mins Exercise in Temperate Climate',
      inputsSummary: 'Weight: 75 kg · Exercise: 45 min · Climate: Temperate',
      calculation: '75 × 0.033 + (45/30) × 0.35 = 2.475 + 0.525 = 3.00 L',
      resultSummary: 'Recommended intake is 3.00 liters (101.4 fl oz / ~12.7 cups).',
    },
    faqs: [
      {
        question: 'Do coffee, tea, and water-rich foods count toward hydration?',
        answer: 'Yes—roughly 20% of daily fluid intake typically comes from fruits, vegetables, and other beverages.',
      },
      {
        question: 'Can you drink too much water?',
        answer: 'Drinking excessive plain water rapidly during endurance events without electrolytes can risk hyponatremia; drink steadily to thirst and sweat loss.',
      },
      {
        question: 'How can I check hydration status easily?',
        answer: 'Pale straw-colored urine is a simple everyday indicator of adequate hydration.',
      },
    ],
    educationalSections: [
      {
        heading: 'Hydration During Exercise and Heat',
        body: 'Hot or humid environments elevate sweat rates significantly, increasing both fluid and electrolyte replacement needs.',
      },
    ],
    relatedSlugs: ['calorie-calculator', 'pace-calculator', 'heart-rate-calculator'],
  },
  {
    id: 'pace-calculator',
    slug: 'pace-calculator',
    category: 'health-calculators',
    name: 'Pace Calculator',
    shortName: 'Pace',
    description: 'Compute running pace per km/mile, speed, and projected 5K, 10K, Half, and Marathon finish times.',
    keywords: ['running pace', 'pace calculator', 'marathon splits', 'min per mile'],
    seoTitle: 'Pace Calculator – Running Pace & Race Finish Splits | CalcAxis',
    seoDescription: 'Calculate running pace per kilometer and mile, speed, and finish time splits for 5K, 10K, Half Marathon, and Marathon.',
    formulaText: 'Pace = Total Time ÷ Distance',
    formulaVariables: [
      { symbol: 'Total Time', description: 'Elapsed duration in hours, minutes, and seconds' },
      { symbol: 'Distance', description: 'Course distance in kilometers or miles' },
    ],
    steps: [
      'Enter race or workout distance and choose km or miles (or pick a standard race preset).',
      'Enter elapsed time in hours, minutes, and seconds.',
      'View pace per km, pace per mile, speed, and projected race splits.',
    ],
    example: {
      title: '10K Run Completed in 48:30',
      inputsSummary: 'Distance: 10 km · Time: 00:48:30',
      calculation: '2,910 seconds ÷ 10 km = 291 sec/km = 4:51 /km',
      resultSummary: 'Pace is 4:51 /km (7:48 /mi) at 12.37 km/h.',
    },
    faqs: [
      {
        question: 'How long is a Half Marathon and Full Marathon?',
        answer: 'A Half Marathon is 21.0975 km (13.1094 mi) and a Marathon is 42.195 km (26.2188 mi).',
      },
      {
        question: 'Does even pacing improve race times?',
        answer: 'Yes—maintaining steady splits avoids early glycogen depletion and typically produces faster overall finish times than starting too fast.',
      },
      {
        question: 'How do treadmill speeds convert to pace?',
        answer: 'Use the km/h or mph speed readout from this calculator directly on treadmill displays.',
      },
    ],
    educationalSections: [
      {
        heading: 'Using Race Splits in Training',
        body: 'Converting target race finish times into per-kilometer or per-mile paces helps structure tempo and interval workouts accurately.',
      },
    ],
    relatedSlugs: ['speed-distance-time-calculator', 'heart-rate-calculator', 'water-intake-calculator'],
  },
  {
    id: 'heart-rate-calculator',
    slug: 'heart-rate-calculator',
    category: 'health-calculators',
    name: 'Heart Rate Calculator',
    shortName: 'Heart Rate',
    description: 'Compute maximum heart rate and five Karvonen training zones using age and resting heart rate.',
    keywords: ['heart rate zones', 'karvonen', 'max heart rate', 'fat burn zone'],
    seoTitle: 'Heart Rate Calculator – Max HR & Karvonen Training Zones | CalcAxis',
    seoDescription: 'Calculate estimated max heart rate (Tanaka & Fox) and personalized Zone 1–5 training BPM ranges using the Karvonen method.',
    formulaText: 'Target HR = Resting HR + %Intensity × (Max HR − Resting HR)',
    formulaVariables: [
      { symbol: 'Max HR', description: 'Tanaka formula: 208 − (0.7 × Age)' },
      { symbol: 'HRR', description: 'Heart Rate Reserve = Max HR − Resting HR' },
    ],
    steps: [
      'Enter your age in years.',
      'Enter your morning resting heart rate in BPM (default 65 BPM).',
      'Inspect your 5 personalized heart rate training zones.',
    ],
    example: {
      title: 'Age 34 Athlete with 58 BPM Resting HR',
      inputsSummary: 'Age: 34 · Resting HR: 58 BPM',
      calculation: 'Max HR (Tanaka) = 184 BPM; HRR = 126 BPM',
      resultSummary: 'Zone 2 (60–70% HRR) is 134–146 BPM; Zone 4 (80–90%) is 159–171 BPM.',
    },
    faqs: [
      {
        question: 'Why use the Karvonen formula instead of % of Max HR?',
        answer: 'Karvonen incorporates resting heart rate, tailoring zones to your current cardiovascular fitness rather than age alone.',
      },
      {
        question: 'How do I measure resting heart rate?',
        answer: 'Measure pulse for 60 seconds immediately upon waking before getting out of bed or drinking caffeine.',
      },
      {
        question: 'Is Zone 2 good for endurance?',
        answer: 'Yes—Zone 2 training builds mitochondrial density and aerobic capacity with low recovery fatigue.',
      },
    ],
    educationalSections: [
      {
        heading: '80/20 Polarized Endurance Training',
        body: 'Many endurance coaches recommend spending roughly 80% of weekly training volume in Zones 1–2 and 20% in Zones 4–5.',
      },
    ],
    relatedSlugs: ['pace-calculator', 'calorie-calculator', 'tdee-calculator'],
  },
  {
    id: 'waist-to-height-ratio-calculator',
    slug: 'waist-to-height-ratio-calculator',
    category: 'health-calculators',
    name: 'Waist-to-Height Ratio Calculator',
    shortName: 'Waist-to-Height',
    description: 'Assess central body fat distribution using the simple keep-your-waist-under-half-your-height rule.',
    keywords: ['waist to height', 'whtr', 'central adiposity', 'waist ratio'],
    recentlyAdded: true,
    seoTitle: 'Waist-to-Height Ratio Calculator – Cardiometabolic Risk Screen | CalcAxis',
    seoDescription: 'Calculate your waist-to-height ratio (WHtR) and compare against clinical guidelines recommending a ratio below 0.50.',
    formulaText: 'WHtR = Waist Circumference ÷ Height',
    formulaVariables: [
      { symbol: 'Waist', description: 'Measured in cm or inches at midpoint between lowest rib and iliac crest' },
      { symbol: 'Height', description: 'Standing height in the same unit' },
    ],
    steps: [
      'Choose Metric (cm) or Imperial (inches).',
      'Enter your waist measurement and height.',
      'Check your WHtR score and target maximum healthy waist circumference.',
    ],
    example: {
      title: '176 cm Tall with 82 cm Waist',
      inputsSummary: 'Waist: 82 cm · Height: 176 cm',
      calculation: '82 ÷ 176 = 0.466',
      resultSummary: 'Ratio is 0.47 (Healthy range, under the 0.50 threshold).',
    },
    faqs: [
      {
        question: 'Why is 0.50 the key threshold?',
        answer: 'Public health guidelines (including NICE in the UK) summarize healthy central adiposity as keeping waist circumference less than half your height.',
      },
      {
        question: 'How does WHtR compare to BMI?',
        answer: 'WHtR specifically tracks abdominal fat around vital organs, making it less prone to misclassifying muscular builds than BMI.',
      },
      {
        question: 'Where exactly should I measure my waist?',
        answer: 'Measure horizontally midway between the bottom of your ribs and the top of your hip bones after a normal exhale.',
      },
    ],
    educationalSections: [
      {
        heading: 'Why Central Fat Distribution Matters',
        body: 'Visceral abdominal fat correlates more closely with metabolic risk than overall weight alone.',
      },
    ],
    relatedSlugs: ['bmi-calculator', 'body-fat-calculator', 'ideal-weight-calculator'],
  },
  {
    id: 'sleep-calculator',
    slug: 'sleep-calculator',
    category: 'health-calculators',
    name: 'Sleep Calculator',
    shortName: 'Sleep',
    description: 'Find optimal bedtimes or wake-up times aligned with 90-minute REM/non-REM sleep cycles.',
    keywords: ['sleep cycles', 'bedtime', 'wake up time', 'rem sleep'],
    recentlyAdded: true,
    seoTitle: 'Sleep Calculator – 90-Minute Sleep Cycle Bedtime Planner | CalcAxis',
    seoDescription: 'Plan when to go to sleep or wake up based on 90-minute sleep cycles and fall-asleep latency so you wake refreshed.',
    formulaText: 'Target Time = Base Time ± (Cycles × 90 min + Sleep Latency)',
    formulaVariables: [
      { symbol: 'Cycles', description: 'Complete 90-minute sleep cycles (typically 5–6 for adults)' },
      { symbol: 'Latency', description: 'Average minutes to fall asleep (default 15 min)' },
    ],
    steps: [
      'Choose whether you want to calculate when to go to bed (given a wake-up time) or when to wake up (going to bed now).',
      'Set the time and average fall-asleep latency in minutes.',
      'Choose a recommended 5-cycle (7.5 hr) or 6-cycle (9 hr) option.',
    ],
    example: {
      title: 'Need to Wake Up at 6:30 AM (15-min Latency)',
      inputsSummary: 'Wake Time: 6:30 AM · Latency: 15 minutes',
      calculation: '5 cycles = 450 min + 15 min = 7h 45m prior',
      resultSummary: 'Recommended bedtimes are 9:15 PM (6 cycles) or 10:45 PM (5 cycles).',
    },
    faqs: [
      {
        question: 'Why do I feel groggy after 8 hours sometimes?',
        answer: 'Waking mid-cycle during deep slow-wave sleep causes sleep inertia; waking at the end of a 90-minute cycle feels noticeably lighter.',
      },
      {
        question: 'How many sleep cycles do adults need?',
        answer: 'Most adults function best on 5 to 6 complete cycles (7.5 to 9 hours of actual sleep).',
      },
      {
        question: 'Are sleep cycles always exactly 90 minutes?',
        answer: '90 minutes is a population average; individual cycles commonly range from 80 to 110 minutes across the night.',
      },
    ],
    educationalSections: [
      {
        heading: 'Consistent Sleep Schedules',
        body: 'Keeping wake times steady within 30 minutes across weekdays and weekends anchors circadian rhythm far better than sleeping in erratically.',
      },
    ],
    relatedSlugs: ['water-intake-calculator', 'calorie-calculator', 'countdown-calculator'],
  },
];
