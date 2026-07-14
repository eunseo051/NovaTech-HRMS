'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from '@/components/ui/chart'
import { ACTIVE_EMPLOYEES, KRW } from '@/lib/data'
import { calcPayroll, PAY_LABELS } from '@/lib/payroll'

const config = {
  amount: { label: '공제액', color: 'var(--chart-4)' },
} satisfies ChartConfig

export function DeductionView() {
  const deductionKeys = ['nationalPension', 'healthInsurance', 'longTermCare', 'employmentInsurance', 'incomeTax', 'localIncomeTax']
  const totals = deductionKeys.map((key) => ({
    key,
    label: PAY_LABELS[key],
    amount: ACTIVE_EMPLOYEES.reduce((s, e) => {
      const pay = calcPayroll(e)
      return s + (pay.deductions.find((it) => it.key === key)?.amount ?? 0)
    }, 0),
  }))

  const chartData = totals.map((t) => ({ name: t.label, amount: t.amount }))
  const totalDeduction = totals.reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">4대보험 합계 (월)</p>
          <p className="mt-1 text-2xl font-bold">{KRW(totals.slice(0, 4).reduce((s, t) => s + t.amount, 0))}원</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">소득세 합계 (월)</p>
          <p className="mt-1 text-2xl font-bold">{KRW(totals[4].amount + totals[5].amount)}원</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">공제 총합계 (월)</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{KRW(totalDeduction)}원</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">공제 항목별 현황</CardTitle>
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
          <p className="text-sm font-medium">공제 항목별 상세</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">공제 항목</th>
                <th className="px-4 py-3 text-right font-medium">월 총액</th>
                <th className="px-4 py-3 text-right font-medium">1인 평균</th>
                <th className="px-4 py-3 text-right font-medium">비율</th>
              </tr>
            </thead>
            <tbody>
              {totals.map((t) => (
                <tr key={t.key} className="border-b">
                  <td className="px-4 py-3 font-medium">{t.label}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{KRW(t.amount)}원</td>
                  <td className="px-4 py-3 text-right tabular-nums">{KRW(Math.round(t.amount / ACTIVE_EMPLOYEES.length))}원</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{totalDeduction ? Math.round((t.amount / totalDeduction) * 100) : 0}%</td>
                </tr>
              ))}
              <tr className="bg-muted/50 font-semibold">
                <td className="px-4 py-3">합계</td>
                <td className="px-4 py-3 text-right tabular-nums">{KRW(totalDeduction)}원</td>
                <td className="px-4 py-3 text-right tabular-nums">{KRW(Math.round(totalDeduction / ACTIVE_EMPLOYEES.length))}원</td>
                <td className="px-4 py-3 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
