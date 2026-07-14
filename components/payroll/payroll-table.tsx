'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import {
  EMPLOYEES, DEPARTMENTS, POSITIONS, KRW, type DeptName, type Position, type Employee,
} from '@/lib/data'
import { calcPayslip, PAY_LABELS, type Payslip } from '@/lib/payroll'
import {
  PAYROLL_RECORDS, getPayrollStatus, type PayrollStatus,
} from '@/lib/payroll-data'
import { cn } from '@/lib/utils'
import { Search, Info } from 'lucide-react'

const statusStyle: Record<PayrollStatus, string> = {
  '지급 완료': 'bg-success/12 text-success',
  '계산 완료': 'bg-primary/12 text-primary',
  '검토 필요': 'bg-warning/15 text-warning',
}

const statusOptions: ('all' | PayrollStatus)[] = ['all', '지급 완료', '계산 완료', '검토 필요']

interface PayrollRow {
  employee: Employee
  payslip: Payslip
  status: PayrollStatus
}

function buildPayrollRows(): PayrollRow[] {
  return EMPLOYEES.filter((e) => e.status !== '퇴사').map((e) => ({
    employee: e,
    payslip: calcPayslip(e),
    status: getPayrollStatus(e.id),
  }))
}

const ALL_ROWS = buildPayrollRows()

export function PayrollTable() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<'all' | DeptName>('all')
  const [position, setPosition] = useState<'all' | Position>('all')
  const [status, setStatus] = useState<'all' | PayrollStatus>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return ALL_ROWS.filter((row) => {
      if (dept !== 'all' && row.employee.dept !== dept) return false
      if (position !== 'all' && row.employee.position !== position) return false
      if (status !== 'all' && row.status !== status) return false
      if (query) {
        const q = query.toLowerCase()
        if (!row.employee.name.toLowerCase().includes(q) && !row.employee.id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [query, dept, position, status])

  const summary = useMemo(() => {
    const count = filtered.length
    const totalGross = filtered.reduce((s, r) => s + r.payslip.grossTotal, 0)
    const totalDeduction = filtered.reduce((s, r) => s + r.payslip.deductionTotal, 0)
    const totalNet = filtered.reduce((s, r) => s + r.payslip.netPay, 0)
    return { count, totalGross, totalDeduction, totalNet }
  }, [filtered])

  const selectedRow = ALL_ROWS.find((r) => r.employee.id === selectedId) ?? null

  const earningItems: { key: keyof Payslip; label: string }[] = [
    { key: 'baseMonthly', label: PAY_LABELS.baseMonthly },
    { key: 'meal', label: PAY_LABELS.meal },
    { key: 'transport', label: PAY_LABELS.transport },
    { key: 'overtime', label: PAY_LABELS.overtime },
    { key: 'positionAllowance', label: PAY_LABELS.positionAllowance },
  ]

  const deductionItems: { key: keyof Payslip; label: string }[] = [
    { key: 'nationalPension', label: PAY_LABELS.nationalPension },
    { key: 'healthInsurance', label: PAY_LABELS.healthInsurance },
    { key: 'longTermCare', label: PAY_LABELS.longTermCare },
    { key: 'employmentInsurance', label: PAY_LABELS.employmentInsurance },
    { key: 'incomeTax', label: PAY_LABELS.incomeTax },
    { key: 'localIncomeTax', label: PAY_LABELS.localIncomeTax },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">지급 대상 인원</p>
          <p className="mt-1 text-2xl font-bold">{summary.count}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">총 지급액</p>
          <p className="mt-1 text-2xl font-bold">{KRW(summary.totalGross)}원</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">총 공제액</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{KRW(summary.totalDeduction)}원</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">실수령액 합계</p>
          <p className="mt-1 text-2xl font-bold text-primary">{KRW(summary.totalNet)}원</p>
        </Card>
      </div>

      {/* Search and filters */}
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="직원명 또는 사번 검색"
            className="pl-9"
          />
        </div>
        <Select value={dept} onValueChange={(v) => setDept(v as typeof dept)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="부서" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 부서</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={position} onValueChange={(v) => setPosition(v as typeof position)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="직급" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 직급</SelectItem>
            {POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="지급 상태" /></SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s === 'all' ? '전체 상태' : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Payroll table */}
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">급여 대장 (2026년 7월)</p>
          <p className="text-sm text-muted-foreground">총 <span className="font-semibold text-foreground">{filtered.length}</span>명</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사번</TableHead>
                <TableHead className="min-w-[180px]">직원</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead className="text-right">기본급</TableHead>
                <TableHead className="text-right">총 지급액</TableHead>
                <TableHead className="text-right">총 공제액</TableHead>
                <TableHead className="text-right">실수령액</TableHead>
                <TableHead className="text-center">지급 상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow
                  key={row.employee.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedId(row.employee.id)}
                >
                  <TableCell className="text-muted-foreground">{row.employee.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={row.employee.photoUrl} alt={row.employee.name} />
                        <AvatarFallback className="text-xs">{row.employee.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{row.employee.name}</span>
                        <span className="text-xs text-muted-foreground">{row.employee.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.employee.dept}</TableCell>
                  <TableCell>{row.employee.position}</TableCell>
                  <TableCell className="text-right tabular-nums">{KRW(row.payslip.baseMonthly)}원</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{KRW(row.payslip.grossTotal)}원</TableCell>
                  <TableCell className="text-right tabular-nums text-destructive">{KRW(row.payslip.deductionTotal)}원</TableCell>
                  <TableCell className="text-right tabular-nums font-bold text-primary">{KRW(row.payslip.netPay)}원</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusStyle[row.status])}>
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                    조건에 맞는 급여 기록이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Prototype notice */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-xs text-muted-foreground text-pretty">
          현재 표시된 보험료 및 세액은 프로토타입용 가상 계산값이며 실제 법정 급여 계산 결과와 다를 수 있습니다.
        </p>
      </div>

      {/* Payroll detail sheet */}
      <Sheet open={selectedId !== null} onOpenChange={(open) => { if (!open) setSelectedId(null) }}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          {selectedRow && (
            <>
              <SheetHeader>
                <SheetTitle className="text-base font-bold">급여명세서 상세</SheetTitle>
                <SheetDescription>
                  {selectedRow.employee.name} ({selectedRow.employee.id}) · 2026년 7월
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 p-4">
                {/* Employee info */}
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Avatar className="size-10">
                    <AvatarImage src={selectedRow.employee.photoUrl} alt={selectedRow.employee.name} />
                    <AvatarFallback>{selectedRow.employee.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{selectedRow.employee.name}</span>
                    <span className="text-xs text-muted-foreground">{selectedRow.employee.dept} · {selectedRow.employee.position}</span>
                  </div>
                  <span className={cn('ml-auto inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusStyle[selectedRow.status])}>
                    {selectedRow.status}
                  </span>
                </div>

                {/* Earnings */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-success">지급 항목</p>
                  <Separator />
                  {earningItems.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="tabular-nums">{KRW(selectedRow.payslip[item.key] as number)}원</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>지급 합계</span>
                    <span className="tabular-nums">{KRW(selectedRow.payslip.grossTotal)}원</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-destructive">공제 항목</p>
                  <Separator />
                  {deductionItems.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="tabular-nums">{KRW(selectedRow.payslip[item.key] as number)}원</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>공제 합계</span>
                    <span className="tabular-nums text-destructive">{KRW(selectedRow.payslip.deductionTotal)}원</span>
                  </div>
                </div>

                {/* Net pay */}
                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <span className="text-sm font-semibold text-primary">실수령액</span>
                  <span className="text-xl font-bold tabular-nums text-primary">{KRW(selectedRow.payslip.netPay)}원</span>
                </div>

                <p className="text-xs text-muted-foreground text-pretty">
                  현재 표시된 보험료 및 세액은 프로토타입용 가상 계산값이며 실제 법정 급여 계산 결과와 다를 수 있습니다.
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
