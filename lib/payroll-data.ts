import { EMPLOYEES } from './data'

export type PayrollStatus = '계산 완료' | '검토 필요' | '지급 완료'

export interface PayrollRecordMeta {
  employeeId: string
  period: string
  status: PayrollStatus
}

export const PAYROLL_PERIOD = '2026-07'

function buildPayrollStatuses(): PayrollRecordMeta[] {
  const statuses: PayrollStatus[] = ['지급 완료', '계산 완료', '검토 필요']
  const weights = [0.72, 0.18, 0.10]
  const records: PayrollRecordMeta[] = []

  EMPLOYEES.forEach((emp, i) => {
    if (emp.status === '퇴사') return

    const seed = (i * 31 + 7) % 100
    let acc = 0
    let status: PayrollStatus = '지급 완료'
    for (let k = 0; k < statuses.length; k++) {
      acc += weights[k] * 100
      if (seed < acc) {
        status = statuses[k]
        break
      }
    }

    records.push({
      employeeId: emp.id,
      period: PAYROLL_PERIOD,
      status,
    })
  })

  return records
}

export const PAYROLL_RECORDS: PayrollRecordMeta[] = buildPayrollStatuses()

export function getPayrollStatus(employeeId: string): PayrollStatus {
  const record = PAYROLL_RECORDS.find((r) => r.employeeId === employeeId)
  return record?.status ?? '계산 완료'
}

export const PAYROLL_STATUS_LABELS: Record<PayrollStatus, string> = {
  '지급 완료': '지급 완료',
  '계산 완료': '계산 완료',
  '검토 필요': '검토 필요',
}
