'use client'

import { useSearchParams } from 'next/navigation'
import { PayrollList } from './payroll-list'
import { PayslipView } from './payslip-view'
import { AllowanceView } from './allowance-view'
import { DeductionView } from './deduction-view'

export function PayrollView() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') ?? 'list'

  if (view === 'payslip') return <PayslipView />
  if (view === 'allowance') return <AllowanceView />
  if (view === 'deduction') return <DeductionView />
  return <PayrollList />
}
