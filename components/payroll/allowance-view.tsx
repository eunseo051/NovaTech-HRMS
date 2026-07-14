'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from '@/components/ui/chart'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ACTIVE_EMPLOYEES, ALLOWANCES, KRW } from '@/lib/data'
import { calcPayroll, PAY_LABELS } from '@/lib/payroll'

const config = {
  amount: { label: '금액', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function AllowanceView() {
  const allowanceKeys = ['meal', 'transport', 'overtime', 'positionAllowance']
  const totals = allowanceKeys.map((key) => ({
    key,
    label: PAY_LABELS[key],
    amount: ACTIVE_EMPLOYEES.reduce((s, e) => {
      const pay = calcPayroll(e)
      return s + (pay.earnings.find((it) => it.key === key)?.amount ?? 0)
    }, 0),
  }))

  const chartData = totals.map((t) => ({ name: t.label, amount: t.amount }))
  const totalAllowance = totals.reduce((s, t) => s + t.amount, 0)

  const topOvertime = [...ACTIVE_EMPLOYEES]
    .filter((e) => e.thisMonthOt > 0)
    .sort((a, b) => b.thisMonthOt - a.thisMonthOt)
    .slice(0, 15)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">식대 (월)</p>
          <p className="mt-1 text-xl font-bold">{KRW(ALLOWANCES.meal * ACTIVE_EMPLOYEES.length)}원</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">교통비 (월)</p>
          <p className="mt-1 text-xl font-bold">{KRW(ALLOWANCES.transport * ACTIVE_EMPLOYEES.length)}원</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">야근수당 (월)</p>
          <p className="mt-1 text-xl font-bold text-warning">{KRW(ACTIVE_EMPLOYEES.reduce((s, e) => s + e.thisMonthOt * ALLOWANCES.overtimeHourly, 0))}원</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">수당 합계</p>
          <p className="mt-1 text-xl font-bold text-primary">{KRW(totalAllowance)}원</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">수당 항목별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-[260px] w-full">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={[8, 8, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">야근수당 상위 직원</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead className="text-right">야근시간</TableHead>
                <TableHead className="text-right">시급</TableHead>
                <TableHead className="text-right">야근수당</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topOvertime.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="text-muted-foreground">{e.dept}</TableCell>
                  <TableCell>{e.position}</TableCell>
                  <TableCell className="text-right tabular-nums">{e.thisMonthOt}h</TableCell>
                  <TableCell className="text-right tabular-nums">{KRW(ALLOWANCES.overtimeHourly)}원</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{KRW(e.thisMonthOt * ALLOWANCES.overtimeHourly)}원</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
