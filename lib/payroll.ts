import { ALLOWANCES, BONUS_RATE, DEDUCTION_RATES, type Employee } from './data'

export const PAY_LABELS: Record<string, string> = {
  baseMonthly: '기본급',
  meal: '식대',
  transport: '교통비',
  overtime: '야근수당',
  positionAllowance: '직책수당',
  nationalPension: '국민연금',
  healthInsurance: '건강보험',
  longTermCare: '장기요양',
  employmentInsurance: '고용보험',
  incomeTax: '소득세',
  localIncomeTax: '지방소득세',
}

export interface Payslip {
  baseMonthly: number
  meal: number
  transport: number
  overtime: number
  positionAllowance: number
  grossTotal: number
  nationalPension: number
  healthInsurance: number
  longTermCare: number
  employmentInsurance: number
  incomeTax: number
  localIncomeTax: number
  deductionTotal: number
  netPay: number
}

export function calcPayslip(emp: Employee): Payslip {
  const baseMonthly = Math.round(emp.salaryAnnual / 12)
  const meal = ALLOWANCES.meal
  const transport = ALLOWANCES.transport
  const overtime = emp.thisMonthOt * ALLOWANCES.overtimeHourly
  const positionAllowance = ALLOWANCES.position[emp.position] ?? 0

  const grossTotal = baseMonthly + meal + transport + overtime + positionAllowance

  // 4대 보험은 비과세(식대 등)를 제외한 보수월액 기준 근사
  const insuranceBase = baseMonthly + positionAllowance
  const nationalPension = Math.round(insuranceBase * DEDUCTION_RATES.nationalPension)
  const healthInsurance = Math.round(insuranceBase * DEDUCTION_RATES.healthInsurance)
  const longTermCare = Math.round(healthInsurance * DEDUCTION_RATES.longTermCare)
  const employmentInsurance = Math.round(insuranceBase * DEDUCTION_RATES.employmentInsurance)
  const incomeTax = Math.round(insuranceBase * DEDUCTION_RATES.incomeTaxRate)
  const localIncomeTax = Math.round(incomeTax * 0.1)

  const deductionTotal =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax

  const netPay = grossTotal - deductionTotal

  return {
    baseMonthly,
    meal,
    transport,
    overtime,
    positionAllowance,
    grossTotal,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    deductionTotal,
    netPay,
  }
}

export interface PayrollView {
  earnings: { key: string; amount: number }[]
  deductions: { key: string; amount: number }[]
  grossPay: number
  totalDeduction: number
  netPay: number
  bonusRatePct: number
}

export function calcPayroll(emp: Employee): PayrollView {
  const p = calcPayslip(emp)
  return {
    earnings: [
      { key: 'baseMonthly', amount: p.baseMonthly },
      { key: 'meal', amount: p.meal },
      { key: 'transport', amount: p.transport },
      { key: 'overtime', amount: p.overtime },
      { key: 'positionAllowance', amount: p.positionAllowance },
    ].filter((e) => e.amount > 0),
    deductions: [
      { key: 'nationalPension', amount: p.nationalPension },
      { key: 'healthInsurance', amount: p.healthInsurance },
      { key: 'longTermCare', amount: p.longTermCare },
      { key: 'employmentInsurance', amount: p.employmentInsurance },
      { key: 'incomeTax', amount: p.incomeTax },
      { key: 'localIncomeTax', amount: p.localIncomeTax },
    ],
    grossPay: p.grossTotal,
    totalDeduction: p.deductionTotal,
    netPay: p.netPay,
    bonusRatePct: Math.round(BONUS_RATE[emp.grade] * 100),
  }
}
