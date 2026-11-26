import type { CalculatorDef } from '../../types/calculator.ts';

export const FINANCIAL_CALCULATORS: CalculatorDef[] = [
  {
    id: 'mortgage-calculator',
    slug: 'mortgage-calculator',
    category: 'financial-calculators',
    name: 'Mortgage Calculator',
    shortName: 'Mortgage',
    description: 'Estimate monthly mortgage payments with taxes, insurance, PMI, and a full amortization schedule.',
    keywords: ['mortgage', 'home loan', 'house payment', 'pmi', 'amortization', 'escrow'],
    popular: true,
    seoTitle: 'Mortgage Calculator – Monthly Payment & Amortization Schedule | mysmartcalc.net',
    seoDescription: 'Calculate monthly mortgage payments including principal, interest, property tax, home insurance, and PMI with interactive charts.',
    formulaText: 'M = P · [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]',
    formulaVariables: [
      { symbol: 'M', description: 'Monthly principal and interest payment' },
      { symbol: 'P', description: 'Loan principal (Home Price minus Down Payment)' },
      { symbol: 'r', description: 'Monthly interest rate (Annual Rate ÷ 12 ÷ 100)' },
      { symbol: 'n', description: 'Total number of monthly payments (Years × 12)' },
    ],
    steps: [
      'Enter the total home purchase price and your down payment in dollars or percent.',
      'Choose your loan term (typically 15, 20, or 30 years) and expected annual interest rate.',
      'Optionally include annual property taxes, homeowners insurance, HOA dues, and PMI if down payment is below 20%.',
      'Review your monthly breakdown chart, total interest paid, and year-by-year amortization schedule.',
    ],
    example: {
      title: '$400,000 Home with 20% Down at 6.25%',
      inputsSummary: 'Home Price: $400,000 · Down Payment: $80,000 (20%) · Term: 30 years · Rate: 6.25% · Tax: $4,800/yr · Insurance: $1,500/yr',
      calculation: 'Principal P = $320,000, r = 0.0625 / 12 = 0.0052083, n = 360 months',
      resultSummary: 'Monthly P&I is $1,970.29; total monthly payment including tax & insurance is $2,495.29.',
    },
    faqs: [
      {
        question: 'When is Private Mortgage Insurance (PMI) required?',
        answer: 'Conventional lenders typically require PMI when your down payment is less than 20% of the home purchase price. Once your loan-to-value ratio reaches 78%–80%, PMI can usually be removed.',
      },
      {
        question: 'How much difference does a 15-year vs. 30-year mortgage make?',
        answer: 'A 15-year mortgage carries a higher monthly payment but dramatically lowers total interest paid because principal decreases much faster and interest rates are often lower.',
      },
      {
        question: 'Are property taxes and insurance included in the amortization table?',
        answer: 'Amortization tracks only loan principal and interest. Property taxes, homeowners insurance, and HOA fees are added to your monthly escrow total separately.',
      },
    ],
    educationalSections: [
      {
        heading: 'Understanding PITI (Principal, Interest, Taxes, Insurance)',
        body: 'Lenders evaluate housing affordability using PITI—your combined monthly principal, interest, property taxes, and homeowners insurance. Keeping PITI within 28% of gross monthly income is a common underwriting benchmark.',
      },
    ],
    relatedSlugs: ['amortization-calculator', 'mortgage-refinance-calculator', 'loan-calculator', 'auto-loan-calculator'],
  },
  {
    id: 'loan-calculator',
    slug: 'loan-calculator',
    category: 'financial-calculators',
    name: 'Loan Calculator',
    shortName: 'Loan',
    description: 'Compute periodic payments, total interest, and payoff schedule for fixed-rate loans.',
    keywords: ['loan', 'payment', 'installment', 'interest', 'biweekly', 'monthly'],
    popular: true,
    seoTitle: 'Loan Calculator – Monthly, Biweekly & Total Interest | mysmartcalc.net',
    seoDescription: 'Calculate fixed-rate loan payments, total interest costs, and amortization schedules for monthly, biweekly, or weekly schedules.',
    formulaText: 'PMT = P · [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]',
    formulaVariables: [
      { symbol: 'PMT', description: 'Periodic loan payment' },
      { symbol: 'P', description: 'Initial loan principal' },
      { symbol: 'r', description: 'Periodic interest rate (Annual Rate ÷ Periods per Year)' },
      { symbol: 'n', description: 'Total number of payment periods' },
    ],
    steps: [
      'Enter the total loan amount you plan to borrow.',
      'Input the annual percentage interest rate and loan duration in years.',
      'Select your payment frequency (monthly, biweekly, or weekly) to compare interest savings.',
    ],
    example: {
      title: '$25,000 Fixed Loan Over 5 Years at 7.0%',
      inputsSummary: 'Principal: $25,000 · Rate: 7.0% · Term: 5 years · Monthly payments',
      calculation: 'r = 0.07 / 12, n = 60',
      resultSummary: 'Monthly payment is $495.03 with $4,701.80 in total interest.',
    },
    faqs: [
      {
        question: 'Does paying biweekly reduce total interest?',
        answer: 'Yes. Making 26 biweekly payments per year equals 13 monthly payments instead of 12, accelerating principal reduction and trimming interest.',
      },
      {
        question: 'What happens if the interest rate is 0%?',
        answer: 'At 0% interest, each payment equals the loan principal divided evenly by the number of payment periods.',
      },
      {
        question: 'Can I use this for business or equipment loans?',
        answer: 'Yes, any fully amortizing fixed-rate installment loan follows the same present-value annuity formula.',
      },
    ],
    educationalSections: [
      {
        heading: 'Comparing Loan Offers Effectively',
        body: 'Always compare both the monthly payment and total lifetime interest. Extending a loan term reduces the monthly obligation while increasing cumulative interest expense.',
      },
    ],
    relatedSlugs: ['personal-loan-calculator', 'auto-loan-calculator', 'amortization-calculator', 'interest-rate-calculator'],
  },
  {
    id: 'auto-loan-calculator',
    slug: 'auto-loan-calculator',
    category: 'financial-calculators',
    name: 'Auto Loan Calculator',
    shortName: 'Auto Loan',
    description: 'Calculate car loan monthly payments factoring in down payment, trade-in value, sales tax, and fees.',
    keywords: ['auto loan', 'car payment', 'vehicle finance', 'trade-in', 'sales tax'],
    popular: true,
    seoTitle: 'Auto Loan Calculator – Car Payment & Total Cost Estimator | mysmartcalc.net',
    seoDescription: 'Estimate monthly car loan payments with trade-in value, down payment, dealer fees, and state sales tax.',
    formulaText: 'Loan = Vehicle Price − Trade-In − Down Payment + Sales Tax + Fees',
    formulaVariables: [
      { symbol: 'Loan', description: 'Net financed principal' },
      { symbol: 'Sales Tax', description: '(Vehicle Price − Trade-In) × Tax Rate' },
      { symbol: 'r', description: 'Monthly interest rate' },
    ],
    steps: [
      'Enter the negotiated vehicle purchase price.',
      'Add your cash down payment and trade-in allowance.',
      'Enter local sales tax rate, title/dealer fees, loan term in months, and APR.',
    ],
    example: {
      title: '$34,000 Vehicle with $5,000 Down and $4,000 Trade-In',
      inputsSummary: 'Price: $34,000 · Down: $5,000 · Trade-In: $4,000 · Tax: 6.5% · Term: 60 months · Rate: 5.9%',
      calculation: 'Tax = ($34,000 − $4,000) × 6.5% = $1,950; Loan = $26,950',
      resultSummary: 'Monthly payment is $519.79 with $4,237.54 in total interest.',
    },
    faqs: [
      {
        question: 'Does a trade-in reduce sales tax?',
        answer: 'In most U.S. states, sales tax applies only to the price difference after subtracting your trade-in value.',
      },
      {
        question: 'What is a reasonable auto loan term?',
        answer: 'Terms of 36 to 60 months keep interest costs manageable and reduce the risk of owing more than the vehicle is worth.',
      },
      {
        question: 'Should I roll fees into the loan?',
        answer: 'Paying taxes and registration fees upfront lowers your financed principal and saves interest over the life of the loan.',
      },
    ],
    educationalSections: [
      {
        heading: 'Avoiding Negative Equity',
        body: 'Vehicles depreciate rapidly in the first three years. Putting at least 15%–20% down helps keep your loan balance below the car’s market value.',
      },
    ],
    relatedSlugs: ['loan-calculator', 'personal-loan-calculator', 'fuel-cost-calculator'],
  },
  {
    id: 'personal-loan-calculator',
    slug: 'personal-loan-calculator',
    category: 'financial-calculators',
    name: 'Personal Loan Calculator',
    shortName: 'Personal Loan',
    description: 'Determine monthly payments, net cash proceeds after origination fees, and effective APR.',
    keywords: ['personal loan', 'origination fee', 'effective apr', 'unsecured loan'],
    seoTitle: 'Personal Loan Calculator – Monthly Payment & Effective APR | mysmartcalc.net',
    seoDescription: 'Calculate personal loan payments, origination fee deductions, net proceeds, and true effective APR.',
    formulaText: 'Net Proceeds = Loan Amount × (1 − Origination Fee %)',
    formulaVariables: [
      { symbol: 'Loan Amount', description: 'Gross face value of the promissory note' },
      { symbol: 'Origination Fee', description: 'Upfront lender fee deducted from disbursement' },
      { symbol: 'Effective APR', description: 'True annual cost based on net proceeds received' },
    ],
    steps: [
      'Enter the requested loan amount and quoted interest rate.',
      'Choose the repayment length in months.',
      'Enter any origination fee percentage to inspect net proceeds and true effective APR.',
    ],
    example: {
      title: '$15,000 Personal Loan with 3% Origination Fee',
      inputsSummary: 'Amount: $15,000 · Rate: 10.5% · Term: 36 months · Origination Fee: 3%',
      calculation: 'Fee = $450, Net Proceeds = $14,550, Monthly Payment = $487.54',
      resultSummary: 'True effective APR on net proceeds is 12.69%.',
    },
    faqs: [
      {
        question: 'Why is effective APR higher than the stated interest rate?',
        answer: 'Because an origination fee reduces the cash you actually receive while you still repay interest on the full face amount.',
      },
      {
        question: 'Are personal loans good for credit card consolidation?',
        answer: 'If the personal loan APR including fees is substantially lower than your credit card APRs, consolidation can reduce interest and set a fixed payoff date.',
      },
      {
        question: 'Do personal loans have prepayment penalties?',
        answer: 'Most major consumer lenders do not charge prepayment penalties, though you should always confirm in the loan agreement.',
      },
    ],
    educationalSections: [
      {
        heading: 'Evaluating Origination Fees',
        body: 'When comparing a zero-fee loan at 11.5% against a 10.5% loan with a 4% origination fee, always compare the effective APR and total dollars repaid.',
      },
    ],
    relatedSlugs: ['loan-calculator', 'debt-payoff-calculator', 'credit-card-payoff-calculator'],
  },
  {
    id: 'compound-interest-calculator',
    slug: 'compound-interest-calculator',
    category: 'financial-calculators',
    name: 'Compound Interest Calculator',
    shortName: 'Compound Interest',
    description: 'Project investment growth over time with recurring monthly contributions and compounding schedules.',
    keywords: ['compound interest', 'savings growth', 'apy', 'compounding', 'future value'],
    popular: true,
    seoTitle: 'Compound Interest Calculator – Growth Chart & Yearly Schedule | mysmartcalc.net',
    seoDescription: 'Calculate compound interest with regular monthly contributions, customizable compounding frequency, and year-by-year charts.',
    formulaText: 'A = P(1 + r/n)^(nt) + PMT · [((1 + i)^m − 1) / i]',
    formulaVariables: [
      { symbol: 'A', description: 'Final accumulated balance' },
      { symbol: 'P', description: 'Initial principal deposit' },
      { symbol: 'r', description: 'Annual nominal interest rate' },
      { symbol: 'n', description: 'Compounding frequency per year' },
      { symbol: 'PMT', description: 'Recurring monthly contribution' },
    ],
    steps: [
      'Enter your starting principal and planned monthly deposit.',
      'Set the expected annual return rate and number of years.',
      'Select how often interest compounds (daily, monthly, quarterly, or annually).',
    ],
    example: {
      title: '$10,000 Initial Deposit + $300/mo for 20 Years at 7%',
      inputsSummary: 'Principal: $10,000 · Monthly Contribution: $300 · Rate: 7% · Years: 20 · Monthly Compounding',
      calculation: 'Total contributions = $82,000; compounded growth adds $114,625',
      resultSummary: 'Ending balance reaches $196,625.25.',
    },
    faqs: [
      {
        question: 'How does compounding frequency affect returns?',
        answer: 'More frequent compounding (daily or monthly vs. annually) produces slightly higher effective annual yield (APY) because interest begins earning interest sooner.',
      },
      {
        question: 'What is the Rule of 72?',
        answer: 'Dividing 72 by your annual percentage return estimates the number of years required to double your money without additional deposits.',
      },
      {
        question: 'Should I account for taxes or inflation?',
        answer: 'Yes—use the optional tax rate field here or pair with our Inflation Calculator to estimate real after-tax purchasing power.',
      },
    ],
    educationalSections: [
      {
        heading: 'Exponential Growth and Consistency',
        body: 'In the final five years of a 25-year compounding horizon, annual interest earned frequently exceeds annual contributions combined.',
      },
    ],
    relatedSlugs: ['investment-calculator', 'savings-calculator', 'retirement-calculator', 'simple-interest-calculator'],
  },
  {
    id: 'simple-interest-calculator',
    slug: 'simple-interest-calculator',
    category: 'financial-calculators',
    name: 'Simple Interest Calculator',
    shortName: 'Simple Interest',
    description: 'Compute non-compounding interest earned or owed over years, months, or days.',
    keywords: ['simple interest', 'i=prt', 'short term loan', 'principal'],
    seoTitle: 'Simple Interest Calculator – I = P × r × t | mysmartcalc.net',
    seoDescription: 'Calculate simple interest and total balance using principal, annual rate, and time in years, months, or days.',
    formulaText: 'I = P · r · t,   A = P + I',
    formulaVariables: [
      { symbol: 'I', description: 'Simple interest earned or owed' },
      { symbol: 'P', description: 'Principal amount' },
      { symbol: 'r', description: 'Annual interest rate as a decimal' },
      { symbol: 't', description: 'Time period in years' },
    ],
    steps: [
      'Enter the principal sum.',
      'Provide the annual interest rate percentage.',
      'Enter the duration and pick years, months, or days.',
    ],
    example: {
      title: '$5,000 Principal at 6% for 3 Years',
      inputsSummary: 'P = $5,000 · r = 6% · t = 3 years',
      calculation: 'I = 5000 × 0.06 × 3 = $900',
      resultSummary: 'Total interest is $900.00 and final amount is $5,900.00.',
    },
    faqs: [
      {
        question: 'Where is simple interest used in real life?',
        answer: 'Short-term promissory notes, treasury bills, and many daily-accrual auto loans calculate interest on a simple basis rather than compounding unpaid interest.',
      },
      {
        question: 'How are days converted to years?',
        answer: 'This calculator uses a 365-day calendar year convention (days ÷ 365).',
      },
      {
        question: 'How does simple interest differ from compound interest?',
        answer: 'Simple interest grows linearly on the original principal alone, while compound interest grows exponentially on principal plus prior interest.',
      },
    ],
    educationalSections: [
      {
        heading: 'Linear Interest Growth',
        body: 'Because simple interest accrues strictly on initial principal, each year adds the exact same dollar amount.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'loan-calculator', 'savings-calculator'],
  },
  {
    id: 'savings-calculator',
    slug: 'savings-calculator',
    category: 'financial-calculators',
    name: 'Savings Calculator',
    shortName: 'Savings',
    description: 'Plan emergency funds and savings goals with initial deposit, monthly additions, APY, and tax estimates.',
    keywords: ['savings', 'high yield savings', 'apy', 'emergency fund', 'goal'],
    seoTitle: 'Savings Calculator – High-Yield Savings Growth & Tax Impact | mysmartcalc.net',
    seoDescription: 'Project your savings account balance over time with recurring deposits, APY, and optional interest tax estimates.',
    formulaText: 'FV = P(1 + i)^m + PMT · [((1 + i)^m − 1) / i]',
    formulaVariables: [
      { symbol: 'FV', description: 'Ending savings balance' },
      { symbol: 'P', description: 'Starting deposit' },
      { symbol: 'PMT', description: 'Monthly contribution' },
      { symbol: 'i', description: 'Effective monthly interest rate' },
    ],
    steps: [
      'Enter your current savings balance and monthly savings target.',
      'Input your bank account APY and savings timeline in years.',
      'Optionally add your marginal tax rate on interest to see after-tax balance.',
    ],
    example: {
      title: '$5,000 Emergency Fund + $400/mo at 4.5% APY for 5 Years',
      inputsSummary: 'Initial: $5,000 · Monthly: $400 · APY: 4.5% · Term: 5 years',
      calculation: 'Total deposits = $29,000; interest earned = $4,209',
      resultSummary: 'Ending savings balance reaches $33,209 before taxes.',
    },
    faqs: [
      {
        question: 'What is the difference between APR and APY?',
        answer: 'APY (Annual Percentage Yield) already includes the effect of compounding within the year, making it ideal for comparing bank savings accounts.',
      },
      {
        question: 'How large should an emergency fund be?',
        answer: 'Most financial planners suggest 3 to 6 months of essential living expenses held in liquid, FDIC-insured accounts.',
      },
      {
        question: 'Is savings interest taxable?',
        answer: 'Yes, interest earned in standard savings accounts and CDs is generally taxed as ordinary income.',
      },
    ],
    educationalSections: [
      {
        heading: 'Automating Savings Momentum',
        body: 'Setting up automatic transfers on payday ensures consistent contributions before discretionary spending occurs.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'budget-calculator', 'inflation-calculator'],
  },
  {
    id: 'investment-calculator',
    slug: 'investment-calculator',
    category: 'financial-calculators',
    name: 'Investment Calculator',
    shortName: 'Investment',
    description: 'Forecast portfolio value with inflation-adjusted purchasing power and recurring contributions.',
    keywords: ['investment', 'portfolio', 'stock market', 'return', 'inflation adjusted'],
    seoTitle: 'Investment Calculator – Portfolio Growth & Real Return | mysmartcalc.net',
    seoDescription: 'Estimate long-term investment portfolio growth with inflation adjustment, recurring deposits, and visual projections.',
    formulaText: 'Real Value = Future Value / (1 + inflation)^t',
    formulaVariables: [
      { symbol: 'Future Value', description: 'Nominal ending portfolio balance' },
      { symbol: 'inflation', description: 'Expected annual inflation rate' },
      { symbol: 't', description: 'Investment horizon in years' },
    ],
    steps: [
      'Enter your starting investment capital and recurring contribution amount.',
      'Select monthly or annual contribution cadence.',
      'Specify expected annual return and estimated annual inflation to compare nominal vs. real value.',
    ],
    example: {
      title: '$20,000 Portfolio + $500/mo for 15 Years at 8% Return',
      inputsSummary: 'Start: $20,000 · Monthly: $500 · Return: 8% · Inflation: 2.5% · 15 years',
      calculation: 'Nominal balance = $239,144; deflated by (1.025)^15',
      resultSummary: 'Inflation-adjusted value in today’s dollars is $165,121.',
    },
    faqs: [
      {
        question: 'Why look at inflation-adjusted returns?',
        answer: 'Nominal dollars grow larger over decades, but inflation reduces what each dollar buys. Real value expresses your future portfolio in today’s purchasing power.',
      },
      {
        question: 'What is a typical long-term stock market return?',
        answer: 'Historically, diversified U.S. equities have averaged roughly 7%–10% nominally before inflation over multi-decade spans, though annual returns vary widely.',
      },
      {
        question: 'Does this include investment fees?',
        answer: 'Subtract your fund’s annual expense ratio from your expected return rate to model net-of-fee performance.',
      },
    ],
    educationalSections: [
      {
        heading: 'Asset Allocation & Time Horizon',
        body: 'Longer horizons allow investors to tolerate short-term equity volatility in pursuit of higher real growth above inflation.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'retirement-calculator', 'roi-calculator'],
  },
  {
    id: 'retirement-calculator',
    slug: 'retirement-calculator',
    category: 'financial-calculators',
    name: 'Retirement Calculator',
    shortName: 'Retirement',
    description: 'Project retirement nest egg, sustainable monthly drawdown, and readiness gap across your lifespan.',
    keywords: ['retirement', '401k', 'ira', 'nest egg', 'pension', 'drawdown'],
    seoTitle: 'Retirement Calculator – Nest Egg & Monthly Income Planner | mysmartcalc.net',
    seoDescription: 'Calculate how much you need to retire, project your 401(k)/IRA nest egg, and test sustainable retirement income.',
    formulaText: 'Required Nest Egg = PMT_ret · [ 1 − (1 + r)^−n ] / r',
    formulaVariables: [
      { symbol: 'PMT_ret', description: 'Desired monthly retirement income' },
      { symbol: 'r', description: 'Post-retirement monthly investment return' },
      { symbol: 'n', description: 'Months spent in retirement' },
    ],
    steps: [
      'Enter your current age, target retirement age, and planning life expectancy.',
      'Input your current retirement savings, monthly contributions, and expected returns.',
      'Set your desired annual retirement income to view surplus or shortfall projections.',
    ],
    example: {
      title: 'Age 32 Retiring at 65 with $45,000 Saved',
      inputsSummary: 'Current Age: 32 · Retire: 65 · Life Exp: 90 · Saved: $45,000 · Monthly: $800 · Pre-Ret: 7% · Post-Ret: 5%',
      calculation: '33 years accumulation followed by 25 years distribution',
      resultSummary: 'Projected nest egg exceeds $1.68M, supporting over $9,800/month.',
    },
    faqs: [
      {
        question: 'What is the 4% Rule?',
        answer: 'The 4% Rule suggests withdrawing 4% of your initial retirement portfolio in year one and adjusting for inflation thereafter for a 30-year horizon.',
      },
      {
        question: 'Should I include Social Security?',
        answer: 'Reduce your desired annual income from portfolio savings by your estimated annual Social Security benefit.',
      },
      {
        question: 'Why use a lower post-retirement return?',
        answer: 'Retirees typically shift toward a more conservative bond/cash mix to reduce sequence-of-returns risk.',
      },
    ],
    educationalSections: [
      {
        heading: 'Sequence-of-Returns Risk',
        body: 'Market downturns right before or early in retirement impact portfolio longevity more severely than downturns later on.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'investment-calculator', 'inflation-calculator'],
  },
  {
    id: 'credit-card-payoff-calculator',
    slug: 'credit-card-payoff-calculator',
    category: 'financial-calculators',
    name: 'Credit Card Payoff Calculator',
    shortName: 'Credit Card Payoff',
    description: 'Find out how many months and how much interest it takes to eliminate credit card debt.',
    keywords: ['credit card payoff', 'apr', 'revolving debt', 'minimum payment'],
    seoTitle: 'Credit Card Payoff Calculator – Months & Interest Saved | mysmartcalc.net',
    seoDescription: 'Calculate exact months to pay off a credit card balance, total interest charges, and payoff timeline.',
    formulaText: 'Interest_m = Balance_(m−1) × (APR ÷ 12)',
    formulaVariables: [
      { symbol: 'APR', description: 'Annual Percentage Rate on the card' },
      { symbol: 'Balance', description: 'Remaining principal balance each month' },
    ],
    steps: [
      'Enter your current credit card balance and APR.',
      'Specify the fixed monthly payment you can commit to.',
      'Check the payoff timeline and total interest, or raise your payment to test faster payoff.',
    ],
    example: {
      title: '$6,000 Balance at 21.99% APR Paying $220/Month',
      inputsSummary: 'Balance: $6,000 · APR: 21.99% · Monthly Payment: $220',
      calculation: 'First month interest = $109.95; remaining $110.05 reduces principal',
      resultSummary: 'Paid off in 38 months with $2,213.68 in total interest.',
    },
    faqs: [
      {
        question: 'What happens if my payment is less than monthly interest?',
        answer: 'Your balance will never be paid off and will continue growing. You must pay more than the monthly interest charge to reduce principal.',
      },
      {
        question: 'How can I pay off high-APR cards faster?',
        answer: 'Avoid new charges, direct windfalls toward the highest-APR balance, or evaluate a 0% balance transfer if you can clear it within the promo window.',
      },
      {
        question: 'Why are minimum payments a trap?',
        answer: 'Minimum payments shrink alongside your balance, stretching a modest balance across 15+ years of compounding interest.',
      },
    ],
    educationalSections: [
      {
        heading: 'How Daily/Monthly Revolving Interest Compounds',
        body: 'Because credit card APRs commonly exceed 20%, every extra $50 paid toward principal saves substantial compounding interest.',
      },
    ],
    relatedSlugs: ['debt-payoff-calculator', 'personal-loan-calculator', 'budget-calculator'],
  },
  {
    id: 'debt-payoff-calculator',
    slug: 'debt-payoff-calculator',
    category: 'financial-calculators',
    name: 'Debt Payoff Calculator',
    shortName: 'Debt Payoff',
    description: 'Compare Debt Avalanche vs. Debt Snowball strategies across multiple loans and credit cards.',
    keywords: ['debt snowball', 'debt avalanche', 'debt payoff', 'multiple debts'],
    seoTitle: 'Debt Payoff Calculator – Avalanche vs. Snowball Comparison | mysmartcalc.net',
    seoDescription: 'Add multiple debts and compare Debt Avalanche vs. Debt Snowball payoff dates and total interest saved.',
    formulaText: 'Avalanche: max(APR) priority  |  Snowball: min(Balance) priority',
    formulaVariables: [
      { symbol: 'Extra Payment', description: 'Additional monthly cash applied after all minimums are paid' },
      { symbol: 'Rollover', description: 'Freed minimum payments rolled into the next target debt' },
    ],
    steps: [
      'List each debt with its balance, APR, and minimum monthly payment.',
      'Enter any extra monthly amount you can add to your debt payoff plan.',
      'Compare total interest and payoff order under Avalanche vs. Snowball.',
    ],
    example: {
      title: 'Three Debts with $250 Extra Monthly Rollover',
      inputsSummary: 'Card ($4,000 @ 22%), Auto ($9,500 @ 6%), Student ($12,000 @ 5%) + $250 extra',
      calculation: 'Avalanche targets 22% card first, then 6% auto, then 5% student loan',
      resultSummary: 'Avalanche minimizes total interest; Snowball delivers earlier small-balance wins.',
    },
    faqs: [
      {
        question: 'Which saves more money: Avalanche or Snowball?',
        answer: 'Debt Avalanche always saves equal or more interest mathematically because it targets the highest APR first.',
      },
      {
        question: 'Why do people choose Debt Snowball?',
        answer: 'Eliminating the smallest balance quickly provides psychological momentum and frees up cash flow sooner.',
      },
      {
        question: 'What happens to minimum payments once a debt is paid off?',
        answer: 'Both strategies roll the freed minimum payment into the next target debt automatically, accelerating momentum.',
      },
    ],
    educationalSections: [
      {
        heading: 'Choosing the Strategy You Will Stick With',
        body: 'If interest rates differ dramatically, Avalanche yields major savings. If balances are close in rate, Snowball helps maintain motivation.',
      },
    ],
    relatedSlugs: ['credit-card-payoff-calculator', 'personal-loan-calculator', 'budget-calculator'],
  },
  {
    id: 'amortization-calculator',
    slug: 'amortization-calculator',
    category: 'financial-calculators',
    name: 'Amortization Calculator',
    shortName: 'Amortization',
    description: 'Generate complete monthly and annual loan amortization schedules with extra payment savings.',
    keywords: ['amortization', 'amortization schedule', 'extra payment', 'principal vs interest'],
    seoTitle: 'Amortization Calculator – Schedule & Extra Payment Savings | mysmartcalc.net',
    seoDescription: 'Generate a full loan amortization table and calculate time and interest saved by adding extra monthly principal payments.',
    formulaText: 'Principal_m = Payment − (Balance_(m−1) × r) + Extra',
    formulaVariables: [
      { symbol: 'Principal_m', description: 'Principal reduction in month m' },
      { symbol: 'r', description: 'Monthly interest rate' },
      { symbol: 'Extra', description: 'Optional recurring extra principal payment' },
    ],
    steps: [
      'Enter loan amount, annual interest rate, and term in years.',
      'Add an optional extra monthly payment toward principal.',
      'Inspect total interest saved, months shaved off, and export the schedule to CSV.',
    ],
    example: {
      title: '$250,000 Loan at 6.0% for 30 Years + $150/mo Extra',
      inputsSummary: 'Loan: $250,000 · Rate: 6.0% · Term: 30 yrs · Extra: $150/mo',
      calculation: 'Base monthly P&I = $1,498.88; accelerated monthly = $1,648.88',
      resultSummary: 'Saves over $59,000 in interest and pays off the loan 5.4 years early.',
    },
    faqs: [
      {
        question: 'Do extra payments reduce my required monthly bill?',
        answer: 'No, your contractual monthly payment remains the same, but your loan finishes months or years ahead of schedule.',
      },
      {
        question: 'Can I download the amortization table?',
        answer: 'Yes, use the Download CSV button in the results section to export the full schedule for spreadsheet analysis.',
      },
      {
        question: 'Should extra payments be specified as principal-only?',
        answer: 'Yes, always instruct your loan servicer to apply extra funds directly to principal rather than advancing future due dates.',
      },
    ],
    educationalSections: [
      {
        heading: 'Reading an Amortization Curve',
        body: 'Plotting annual principal vs. interest reveals the crossover point where more than half of each payment builds equity rather than paying interest.',
      },
    ],
    relatedSlugs: ['mortgage-calculator', 'loan-calculator', 'mortgage-refinance-calculator'],
  },
  {
    id: 'interest-rate-calculator',
    slug: 'interest-rate-calculator',
    category: 'financial-calculators',
    name: 'Interest Rate Calculator',
    shortName: 'Interest Rate',
    description: 'Solve for the implied annual interest rate (APR) from any loan amount, term, and monthly payment.',
    keywords: ['interest rate', 'implied apr', 'solve rate', 'loan apr'],
    seoTitle: 'Interest Rate Calculator – Solve Implied Loan APR | mysmartcalc.net',
    seoDescription: 'Find the exact annual interest rate of a loan or financing offer given the principal, monthly payment, and term.',
    formulaText: 'Solve r in:  M = P · [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]',
    formulaVariables: [
      { symbol: 'M', description: 'Known monthly payment' },
      { symbol: 'P', description: 'Loan amount' },
      { symbol: 'n', description: 'Total monthly payments' },
    ],
    steps: [
      'Enter the amount financed (principal).',
      'Enter the quoted monthly payment and total loan term in months or years.',
      'The solver computes the implied annual interest rate and total interest cost.',
    ],
    example: {
      title: '$30,000 Financed at $594.04/mo for 60 Months',
      inputsSummary: 'Loan: $30,000 · Payment: $594.04 · Term: 60 months',
      calculation: 'Binary/Newton solver converges on r = 0.0058333 monthly',
      resultSummary: 'Implied annual interest rate is 7.00% APR.',
    },
    faqs: [
      {
        question: 'Why does a dealer quote monthly payments instead of APR?',
        answer: 'Monthly quotes can disguise high interest rates or extended terms. Solving for the implied APR lets you verify the true borrowing cost.',
      },
      {
        question: 'What if Payment × Months is less than Loan Amount?',
        answer: 'That implies a negative interest rate; the solver returns 0% because total payments do not exceed principal.',
      },
      {
        question: 'How accurate is the solver?',
        answer: 'It runs 80 iterations of bisection on the exact annuity equation, achieving sub-basis-point precision.',
      },
    ],
    educationalSections: [
      {
        heading: 'Checking Dealer & Retail Financing Offers',
        body: 'Before signing any installment contract, plug the principal, payment, and number of months here to verify the stated APR matches the math.',
      },
    ],
    relatedSlugs: ['loan-calculator', 'auto-loan-calculator', 'personal-loan-calculator'],
  },
  {
    id: 'inflation-calculator',
    slug: 'inflation-calculator',
    category: 'financial-calculators',
    name: 'Inflation Calculator',
    shortName: 'Inflation',
    description: 'Measure how annual inflation erodes purchasing power and increases future living costs.',
    keywords: ['inflation', 'purchasing power', 'cpi', 'future cost'],
    seoTitle: 'Inflation Calculator – Future Cost & Purchasing Power | mysmartcalc.net',
    seoDescription: 'Calculate the future cost of goods and purchasing power erosion over time for any annual inflation rate.',
    formulaText: 'Future Cost = Present · (1 + i)^t   |   Real Value = Present / (1 + i)^t',
    formulaVariables: [
      { symbol: 'Present', description: 'Dollar amount in today’s money' },
      { symbol: 'i', description: 'Annual inflation rate' },
      { symbol: 't', description: 'Number of years' },
    ],
    steps: [
      'Enter a dollar amount in today’s terms.',
      'Set an expected annual inflation rate (e.g., 2.5% to 3.5%).',
      'Choose a time horizon in years to view both future equivalent price and purchasing power erosion.',
    ],
    example: {
      title: '$1,000 Over 20 Years at 3% Annual Inflation',
      inputsSummary: 'Amount: $1,000 · Rate: 3.0% · Years: 20',
      calculation: 'Future Cost = 1000 × (1.03)^20 = $1,806.11',
      resultSummary: 'Goods costing $1,000 today will cost $1,806.11; $1,000 cash will buy only $553.68 worth.',
    },
    faqs: [
      {
        question: 'What is a typical long-term inflation assumption?',
        answer: 'Central banks often target 2%, while long-run U.S. historical CPI averages roughly 3% per year.',
      },
      {
        question: 'How do I protect cash from inflation?',
        answer: 'Assets whose returns outpace inflation—such as high-yield savings, TIPS, equities, or real estate—preserve long-term purchasing power.',
      },
      {
        question: 'Does inflation affect fixed-rate debt?',
        answer: 'Yes—fixed-rate mortgage payments become cheaper in real terms over time during inflationary periods.',
      },
    ],
    educationalSections: [
      {
        heading: 'Nominal vs. Real Dollars',
        body: 'Always distinguish nominal account balances from real purchasing power when planning multi-decade financial goals.',
      },
    ],
    relatedSlugs: ['investment-calculator', 'retirement-calculator', 'savings-calculator'],
  },
  {
    id: 'salary-calculator',
    slug: 'salary-calculator',
    category: 'financial-calculators',
    name: 'Salary Calculator',
    shortName: 'Salary',
    description: 'Convert pay seamlessly between hourly, daily, weekly, biweekly, semi-monthly, monthly, and annual rates.',
    keywords: ['salary', 'hourly to annual', 'paycheck', 'biweekly', 'wage'],
    seoTitle: 'Salary Calculator – Hourly, Biweekly, Monthly & Annual Pay | mysmartcalc.net',
    seoDescription: 'Convert any wage or salary across hourly, daily, weekly, biweekly, semi-monthly, monthly, and annual pay periods.',
    formulaText: 'Annual = Hourly × Hours/Week × Weeks/Year',
    formulaVariables: [
      { symbol: 'Hours/Week', description: 'Standard weekly working hours (default 40)' },
      { symbol: 'Weeks/Year', description: 'Paid weeks per year (default 52)' },
    ],
    steps: [
      'Enter your pay amount and select its frequency (hourly through annual).',
      'Adjust hours per week, days per week, and paid weeks per year if part-time or unpaid leave applies.',
      'Compare every equivalent pay period side by side.',
    ],
    example: {
      title: '$38.50/Hour Full-Time (40 hrs/wk, 52 wks/yr)',
      inputsSummary: 'Rate: $38.50/hr · 40 hrs/wk · 52 wks/yr',
      calculation: '38.50 × 2,080 hours = $80,080',
      resultSummary: 'Annual salary is $80,080 ($6,673.33/mo, $3,080.00 biweekly).',
    },
    faqs: [
      {
        question: 'What is the difference between biweekly and semi-monthly?',
        answer: 'Biweekly pays every two weeks (26 paychecks/year), whereas semi-monthly pays twice per month (24 paychecks/year).',
      },
      {
        question: 'How many work hours are in a standard full-time year?',
        answer: '40 hours/week × 52 weeks = 2,080 hours per year.',
      },
      {
        question: 'Are these numbers before or after taxes?',
        answer: 'These figures represent gross pay. Use our Income Tax Calculator to estimate take-home pay.',
      },
    ],
    educationalSections: [
      {
        heading: 'Comparing Job Offers Across Pay Structures',
        body: 'Converting an hourly contract rate to an equivalent annual figure makes it easy to compare against salaried roles.',
      },
    ],
    relatedSlugs: ['income-tax-calculator', 'budget-calculator', 'net-worth-calculator'],
  },
  {
    id: 'income-tax-calculator',
    slug: 'income-tax-calculator',
    category: 'financial-calculators',
    name: 'Income Tax Calculator',
    shortName: 'Income Tax',
    description: 'Estimate federal progressive tax brackets, Social Security, Medicare, state tax, and net take-home pay.',
    keywords: ['income tax', 'tax bracket', 'take home pay', 'fica', 'effective tax rate'],
    recentlyAdded: true,
    seoTitle: 'Income Tax Calculator – Federal Brackets & Take-Home Pay | mysmartcalc.net',
    seoDescription: 'Estimate U.S. federal income tax by filing status, FICA payroll taxes, state taxes, effective rate, and net take-home pay.',
    formulaText: 'Taxable Income = Gross − Pre-Tax Contributions − Deduction',
    formulaVariables: [
      { symbol: 'Pre-Tax', description: '401(k), HSA, or traditional IRA deductions' },
      { symbol: 'Deduction', description: 'Standard deduction or itemized deduction' },
      { symbol: 'FICA', description: '6.2% Social Security (up to wage cap) + 1.45% Medicare' },
    ],
    steps: [
      'Select your filing status (Single, Married Filing Jointly, or Head of Household).',
      'Enter gross annual income, pre-tax retirement/HSA deductions, and optional itemized deductions.',
      'Add an estimated state income tax rate to inspect marginal bracket, effective rate, and take-home pay.',
    ],
    example: {
      title: '$95,000 Single Filer with $5,000 401(k) & 4% State Tax',
      inputsSummary: 'Gross: $95,000 · Single · Pre-Tax: $5,000 · Standard Deduction: $15,000 · State: 4%',
      calculation: 'Taxable Income = $75,000; progressive federal brackets applied incrementally',
      resultSummary: 'Estimated annual take-home pay is ~$68,140 ($5,678/month).',
    },
    faqs: [
      {
        question: 'Does moving into a higher tax bracket tax all of my income at that rate?',
        answer: 'No. Progressive brackets only apply the higher marginal rate to dollars earned above each bracket threshold.',
      },
      {
        question: 'What is the difference between marginal and effective tax rate?',
        answer: 'Your marginal rate is the bracket of your last dollar earned; your effective rate is total tax divided by total gross income.',
      },
      {
        question: 'Are FICA payroll taxes reduced by the standard deduction?',
        answer: 'No. Social Security and Medicare taxes apply to gross wages before the standard deduction.',
      },
    ],
    educationalSections: [
      {
        heading: 'How Pre-Tax Contributions Lower Taxable Income',
        body: 'Contributing to a traditional 401(k) or HSA reduces your federal taxable income dollar-for-dollar at your marginal bracket.',
      },
    ],
    relatedSlugs: ['salary-calculator', 'budget-calculator', 'retirement-calculator'],
  },
  {
    id: 'budget-calculator',
    slug: 'budget-calculator',
    category: 'financial-calculators',
    name: 'Budget Calculator',
    shortName: 'Budget',
    description: 'Organize monthly income and expenses against the 50/30/20 Needs, Wants, and Savings benchmark.',
    keywords: ['budget', '50 30 20', 'monthly expenses', 'cash flow'],
    seoTitle: 'Budget Calculator – 50/30/20 Monthly Cash Flow Planner | mysmartcalc.net',
    seoDescription: 'Track monthly income against housing, food, debt, wants, and savings with automatic 50/30/20 rule analysis.',
    formulaText: 'Cash Flow = Monthly Net Income − (Needs + Wants + Savings)',
    formulaVariables: [
      { symbol: 'Needs (50%)', description: 'Housing, utilities, groceries, transport, healthcare, minimum debt' },
      { symbol: 'Wants (30%)', description: 'Dining, travel, subscriptions, discretionary spending' },
      { symbol: 'Savings (20%)', description: 'Emergency fund, retirement, extra debt payoff' },
    ],
    steps: [
      'Enter your monthly after-tax household income.',
      'Fill in monthly amounts across housing, utilities, food, transport, debt, savings, and discretionary categories.',
      'Compare your actual split to the 50/30/20 target and spot surpluses or deficits.',
    ],
    example: {
      title: '$6,000 Monthly Take-Home Household Budget',
      inputsSummary: 'Income: $6,000 · Needs: $3,000 · Wants: $1,700 · Savings: $1,300',
      calculation: 'Needs = 50%, Wants = 28.3%, Savings = 21.7%',
      resultSummary: 'Balanced budget exceeding the 20% savings benchmark.',
    },
    faqs: [
      {
        question: 'Should I budget using gross or net income?',
        answer: 'Always build your monthly spending budget using net (after-tax) take-home pay.',
      },
      {
        question: 'Where do extra debt payments go in 50/30/20?',
        answer: 'Minimum required payments belong in Needs; extra principal payments belong in the 20% Savings/Debt-Reduction bucket.',
      },
      {
        question: 'What if housing exceeds 30% in a high-cost city?',
        answer: 'Adjust Wants downward to keep your Savings rate intact while covering higher essential housing costs.',
      },
    ],
    educationalSections: [
      {
        heading: 'Zero-Based vs. 50/30/20 Budgeting',
        body: 'The 50/30/20 framework gives quick macro guardrails without requiring you to track every minor receipt.',
      },
    ],
    relatedSlugs: ['salary-calculator', 'savings-calculator', 'debt-payoff-calculator'],
  },
  {
    id: 'net-worth-calculator',
    slug: 'net-worth-calculator',
    category: 'financial-calculators',
    name: 'Net Worth Calculator',
    shortName: 'Net Worth',
    description: 'Tally all liquid, investment, and property assets minus liabilities to track financial health.',
    keywords: ['net worth', 'assets', 'liabilities', 'balance sheet'],
    seoTitle: 'Net Worth Calculator – Personal Balance Sheet & Debt Ratio | mysmartcalc.net',
    seoDescription: 'Calculate your personal net worth, total assets, total liabilities, and debt-to-asset ratio with visual charts.',
    formulaText: 'Net Worth = Total Assets − Total Liabilities',
    formulaVariables: [
      { symbol: 'Assets', description: 'Cash, brokerage, retirement, home equity/value, vehicles' },
      { symbol: 'Liabilities', description: 'Mortgage balance, auto loans, student debt, credit cards' },
    ],
    steps: [
      'Enter current market values for cash, investments, retirement accounts, real estate, and property.',
      'Enter remaining payoff balances for mortgages, student loans, auto loans, and cards.',
      'Review your net worth and debt-to-asset ratio.',
    ],
    example: {
      title: 'Homeowner Personal Balance Sheet',
      inputsSummary: 'Assets: $520,000 · Liabilities: $290,000',
      calculation: 'Net Worth = 520,000 − 290,000',
      resultSummary: 'Net worth is $230,000 with a 55.8% debt-to-asset ratio.',
    },
    faqs: [
      {
        question: 'Should I include my home at purchase price or current value?',
        answer: 'Use a conservative estimate of current market value on the asset side and the remaining mortgage payoff on the liability side.',
      },
      {
        question: 'How often should I track net worth?',
        answer: 'Checking quarterly or semi-annually reveals long-term progress without obsessing over daily market fluctuations.',
      },
      {
        question: 'Is a negative net worth normal early in a career?',
        answer: 'Yes—graduates with student loans often start with negative net worth before savings and debt payoff turn it positive.',
      },
    ],
    educationalSections: [
      {
        heading: 'Assets That Grow vs. Assets That Depreciate',
        body: 'Shifting cash flow from depreciating purchases toward appreciating investments and debt reduction accelerates net worth growth.',
      },
    ],
    relatedSlugs: ['retirement-calculator', 'investment-calculator', 'budget-calculator'],
  },
  {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    category: 'financial-calculators',
    name: 'ROI Calculator',
    shortName: 'ROI',
    description: 'Calculate total Return on Investment (ROI) and annualized CAGR over any holding period.',
    keywords: ['roi', 'return on investment', 'cagr', 'annualized return'],
    seoTitle: 'ROI Calculator – Total & Annualized Return on Investment | mysmartcalc.net',
    seoDescription: 'Measure net profit, total ROI percentage, and annualized CAGR for investments, projects, or business campaigns.',
    formulaText: 'ROI = (Returned − Initial) / Initial × 100  |  CAGR = (Returned / Initial)^(1/t) − 1',
    formulaVariables: [
      { symbol: 'Initial', description: 'Total capital invested' },
      { symbol: 'Returned', description: 'Final value or total proceeds returned' },
      { symbol: 't', description: 'Investment holding period in years' },
    ],
    steps: [
      'Enter the initial investment cost.',
      'Enter the final value or total amount returned.',
      'Enter the holding duration in years to see annualized CAGR alongside total ROI.',
    ],
    example: {
      title: '$10,000 Investment Growing to $14,641 in 4 Years',
      inputsSummary: 'Initial: $10,000 · Returned: $14,641 · Time: 4 years',
      calculation: 'ROI = 46.41%; CAGR = (1.4641)^(1/4) − 1 = 10.0%',
      resultSummary: 'Net profit is $4,641.00, total ROI is 46.41%, and annualized ROI is 10.00%.',
    },
    faqs: [
      {
        question: 'Why does annualized ROI (CAGR) matter?',
        answer: 'A 40% total return earned over 1 year is far stronger than a 40% return earned over 8 years; CAGR normalizes returns to an annual rate.',
      },
      {
        question: 'Can ROI be negative?',
        answer: 'Yes, if the returned value is less than the initial investment, both ROI and net profit are negative.',
      },
      {
        question: 'Should fees be included in Initial Investment?',
        answer: 'Yes, include commissions, closing costs, or improvement expenses in your initial cost basis for an accurate net ROI.',
      },
    ],
    educationalSections: [
      {
        heading: 'Comparing Opportunities Using Annualized Returns',
        body: 'Using CAGR allows apples-to-apples comparison between real estate deals, index funds, and business capital projects of different durations.',
      },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'net-worth-calculator'],
  },
  {
    id: 'mortgage-refinance-calculator',
    slug: 'mortgage-refinance-calculator',
    category: 'financial-calculators',
    name: 'Mortgage Refinance Calculator',
    shortName: 'Mortgage Refinance',
    description: 'Compare your current mortgage against a refinance offer to find monthly savings and break-even month.',
    keywords: ['refinance', 'break even', 'mortgage rate', 'closing costs'],
    seoTitle: 'Mortgage Refinance Calculator – Savings & Break-Even Point | mysmartcalc.net',
    seoDescription: 'Evaluate whether refinancing your mortgage makes financial sense with monthly savings, break-even months, and lifetime interest comparison.',
    formulaText: 'Break-Even Months = Closing Costs ÷ (Current Payment − New Payment)',
    formulaVariables: [
      { symbol: 'Closing Costs', description: 'Upfront refinance origination, appraisal, and title fees' },
      { symbol: 'Monthly Savings', description: 'Difference between old and new P&I payments' },
    ],
    steps: [
      'Enter your remaining mortgage balance, current interest rate, and years left.',
      'Enter the proposed new interest rate, new loan term, and estimated closing costs.',
      'Review monthly payment savings, break-even timeline, and lifetime interest difference.',
    ],
    example: {
      title: '$280,000 Remaining @ 7.25% Refinanced to 5.85%',
      inputsSummary: 'Balance: $280,000 · Current: 7.25% (25 yrs left) · New: 5.85% (25 yrs) · Costs: $4,200',
      calculation: 'Current P&I = $2,023.86; New P&I = $1,778.30; Monthly Savings = $245.56',
      resultSummary: 'Break-even occurs in 17.1 months with $69,468 in net lifetime interest savings.',
    },
    faqs: [
      {
        question: 'When is refinancing worth it?',
        answer: 'Refinancing is generally advantageous if you plan to stay in the home longer than the break-even period and avoid resetting a 20-year balance back to 30 years unnecessarily.',
      },
      {
        question: 'Why can resetting to 30 years raise lifetime interest?',
        answer: 'Even at a lower rate, stretching remaining principal over 30 fresh years can increase total cumulative interest unless you keep making your old payment amount.',
      },
      {
        question: 'What closing costs are typical?',
        answer: 'Refinance closing costs commonly range from 1.5% to 3% of the loan amount.',
      },
    ],
    educationalSections: [
      {
        heading: 'Watch the Remaining Term',
        body: 'Matching your new loan term closely to your remaining years—or choosing a 15-year or 20-year term—locks in genuine lifetime interest savings.',
      },
    ],
    relatedSlugs: ['mortgage-calculator', 'amortization-calculator', 'loan-calculator'],
  },
  {
    id: 'end-of-service-calculator',
    slug: 'end-of-service-calculator',
    category: 'financial-calculators',
    name: 'End-of-Service Gratuity Calculator',
    shortName: 'End-of-Service',
    popular: true,
    recentlyAdded: true,
    description:
      'Calculate statutory end-of-service indemnity, resignation tiers, and unused leave payout under Kuwait, UAE, and Saudi labor laws.',
    keywords: [
      'end of service',
      'gratuity calculator',
      'kuwait labor law',
      'uae gratuity',
      'saudi end of service',
      'indemnity',
    ],
    seoTitle: 'End-of-Service Gratuity Calculator (Kuwait, UAE, Saudi Arabia) | mysmartcalc.net',
    seoDescription:
      'Estimate end-of-service benefits, resignation multipliers, statutory caps, and unused annual leave encashment for Kuwait, UAE, and Saudi Arabia.',
    formulaText:
      'Kuwait: (15d × Y₁₋₅ + 26d × Y₆₊) × (Salary ÷ 26) × Tier  |  UAE: (21d × Y₁₋₅ + 30d × Y₆₊) × (Basic ÷ 30)',
    formulaVariables: [
      { symbol: 'Y₁₋₅', description: 'Completed years (and prorated months) up to first 5 years' },
      { symbol: 'Y₆₊', description: 'Years of service beyond the 5th year' },
      { symbol: 'Tier', description: 'Statutory resignation multiplier (e.g., 50% or 2/3 in Kuwait; 1/3 or 2/3 in KSA)' },
    ],
    steps: [
      'Select the applicable labor jurisdiction (Kuwait, UAE, or Saudi Arabia) and currency.',
      'Choose whether the separation is an Employer Termination / Contract Expiry or a Resignation.',
      'Enter your monthly salary (total remuneration in Kuwait/KSA, basic salary in UAE), exact years & months of service, and unused leave days.',
    ],
    example: {
      title: 'Kuwait Private Sector Resignation After 6 Years (1,000 KWD/mo)',
      inputsSummary: 'Jurisdiction: Kuwait · Reason: Resignation · Salary: 1,000 KWD · Service: 6 years · Leave: 10 days',
      calculation: 'First 5 yrs = 5 × 15 × (1000/26) = 2,884.62; Year 6 = 1,000; Tier (5–10 yrs) = 2/3 → Gratuity = 2,589.74 KWD',
      resultSummary: 'Net gratuity is 2,589.74 KWD plus 384.62 KWD leave payout = 2,974.36 KWD total settlement.',
    },
    faqs: [
      {
        question: 'How is Kuwait end-of-service indemnity calculated on a 26-day month?',
        answer:
          'Under Kuwait Labor Law No. 6 of 2010, monthly-paid workers earn 15 days of remuneration per year for the first 5 years and 1 full month per year thereafter, dividing monthly remuneration by 26 working days and capping total gratuity at 18 months of salary.',
      },
      {
        question: 'Do UAE resigning employees still lose part of their gratuity?',
        answer:
          'Under UAE Federal Decree-Law No. 33 of 2021, employees who complete at least 1 continuous year of service receive 100% of their accrued 21/30-day gratuity on both termination and resignation, capped at 24 months of basic wage.',
      },
      {
        question: 'How do Saudi Arabia Art. 85 resignation tiers work?',
        answer:
          'In Saudi Arabia, resigning employees receive 0% under 2 years, 1/3 between 2 and 5 years, 2/3 between 5 and 10 years, and 100% after 10 years of service.',
      },
    ],
    educationalSections: [
      {
        heading: 'Comparing GCC End-of-Service Frameworks',
        body: 'While all three GCC frameworks increase accrual after the fifth year of service, they differ in salary basis (total remuneration vs. basic wage), daily divisor (26 vs. 30 days), resignation multipliers, and maximum statutory caps.',
      },
    ],
    relatedSlugs: ['salary-calculator', 'retirement-calculator', 'savings-calculator'],
  },
  {
    id: 'zakat-calculator',
    slug: 'zakat-calculator',
    category: 'financial-calculators',
    name: 'Zakat Calculator (Cash, Gold & Silver)',
    shortName: 'Zakat Calculator',
    popular: true,
    recentlyAdded: true,
    description:
      'Calculate Zakat on cash, 24K/22K/21K/18K gold, and silver at 2.5% using live global gold and silver prices per gram (85g 24K gold and 595g silver Nisab).',
    keywords: [
      'zakat calculator',
      'zakat cash gold silver',
      'nisab 85g gold',
      'nisab 595g silver',
      'zakat on gold',
      'zakat on silver',
      'live gold price zakat',
    ],
    seoTitle: 'Zakat Calculator (Cash, Gold & Silver) – Live Global Prices | mysmartcalc.net',
    seoDescription:
      'Calculate Islamic Zakat on money, 24K/22K/21K/18K gold, and silver at 2.5% using automatically updated live global gold and silver prices across 168 currencies.',
    formulaText:
      'Total Zakat Due = Cash Zakat (Cash × 2.5%) + Gold Zakat (if Pure 24K Gold ≥ 85g: ∑(Weight × Karat Price) × 2.5%) + Silver Zakat (if Silver ≥ 595g: Weight × Silver Price × 2.5%)',
    formulaVariables: [
      { symbol: 'Rate', description: '2.5% (1/40) Sharia Zakat rate' },
      { symbol: 'Gold Nisab', description: '85g pure 24K gold equivalent (24K + 22K×22/24 + 21K×21/24 + 18K×18/24)' },
      { symbol: 'Silver Nisab', description: '595g pure silver at the live global silver spot price' },
    ],
    steps: [
      'Select your preferred world currency; live global 24K/22K/21K/18K gold and silver prices per gram update automatically every 10 minutes.',
      'Use the Cash, Gold, and Silver tabs to enter your cash amount, add gold items by weight and karat (24K, 22K, 21K, 18K), and enter silver weight in grams.',
      'Review the live Zakat Summary panel showing Money Zakat, Gold Zakat, Silver Zakat, and Total Due at 2.5%.',
    ],
    example: {
      title: 'Cash, Multi-Karat Gold & Silver Zakat Example',
      inputsSummary: '24K Gold: $110/g (21K: $96.25/g) · Silver: $1.20/g · Cash: $10,000 · Gold: 100g of 21K (= 87.5g pure 24K) · Silver: 600g',
      calculation: 'Cash Zakat = $10,000 × 2.5% = $250 · Gold Value = 100 × $96.25 = $9,625 (≥ 85g 24K) → $240.63 · Silver Value = 600 × $1.20 = $720 (≥ 595g) → $18.00',
      resultSummary: 'Total Zakat due across cash, gold, and silver is $508.63.',
    },
    faqs: [
      {
        question: 'How is the Sharia Zakat rate and Nisab calculated?',
        answer:
          'Calculations are based on the standard 2.5% Sharia Zakat rate. Gold Zakat becomes due when total pure 24K equivalent gold reaches 85 grams, and Silver Zakat becomes due when silver reaches 595 grams.',
      },
      {
        question: 'How does the multi-karat gold calculator handle 22K, 21K, and 18K gold?',
        answer:
          'You can add multiple gold rows with different karats (24K, 22K, 21K, or 18K). Each weight is priced using its live global karat rate and converted to 24K pure gold grams to check the 85g Nisab accurately.',
      },
      {
        question: 'Are gold and silver prices updated from global markets?',
        answer:
          'Yes. Global spot prices per troy ounce for gold (XAU) and silver (XAG) are converted to grams and your chosen currency and refresh automatically every 10 minutes.',
      },
    ],
    educationalSections: [
      {
        heading: 'Cash, Gold & Silver Zakat at 2.5%',
        body: 'Separating Zakat into dedicated tabs for Cash, multi-karat Gold (24K, 22K, 21K, 18K), and Silver keeps personal Zakat assessment clear while linking live global precious-metal prices to both 85g gold and 595g silver Nisab checks.',
      },
    ],
    relatedSlugs: ['savings-calculator', 'investment-calculator', 'net-worth-calculator'],
  },
];
