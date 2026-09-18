// Financial Calculation Utilities for MultiCredit 360

/**
 * Standard Reducing Balance EMI Calculation
 * Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEmi(principal: number, annualInterestRate: number, tenureMonths: number): {
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
} {
  if (principal <= 0 || tenureMonths <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0 };
  }
  const monthlyRate = annualInterestRate / 12 / 100;
  if (monthlyRate === 0) {
    const monthlyEmi = Math.round(principal / tenureMonths);
    return { monthlyEmi, totalInterest: 0, totalPayable: principal };
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  return {
    monthlyEmi: emi,
    totalInterest,
    totalPayable,
  };
}

/**
 * Fixed Deposit (FD) Maturity Calculation
 * Compound quarterly: A = P * (1 + r/4)^(4*t)
 */
export function calculateFdMaturity(principal: number, annualRate: number, tenureYears: number): {
  maturityAmount: number;
  interestEarned: number;
} {
  const r = annualRate / 100;
  const n = 4; // quarterly
  const maturityAmount = Math.round(principal * Math.pow(1 + r / n, n * tenureYears));
  return {
    maturityAmount,
    interestEarned: maturityAmount - principal,
  };
}

/**
 * Recurring Deposit (RD) Maturity Calculation
 * Standard Banking formula with monthly compounding or quarterly compounding
 */
export function calculateRdMaturity(monthlyDeposit: number, annualRate: number, tenureMonths: number): {
  maturityAmount: number;
  totalDeposited: number;
  interestEarned: number;
} {
  const totalDeposited = monthlyDeposit * tenureMonths;
  // Approximation of compound interest for RD:
  const i = annualRate / 1200;
  let maturityAmount = 0;
  for (let m = 1; m <= tenureMonths; m++) {
    maturityAmount += monthlyDeposit * Math.pow(1 + i, m);
  }
  maturityAmount = Math.round(maturityAmount);
  return {
    maturityAmount,
    totalDeposited,
    interestEarned: maturityAmount - totalDeposited,
  };
}
