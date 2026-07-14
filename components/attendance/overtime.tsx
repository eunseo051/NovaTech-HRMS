'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from '@/components/ui/chart'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ACTIVE_EMPLOYEES, monthlyOvertimeByDept } from '@/lib/data'

const config = {
  hours: { label: '초과근무(h)', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function Overtime() {
  const data = monthlyOvertimeByDept()
  const totalOt = ACTIVE_EMPLOYEES.reduce((s, e) => s + e.thisMonthOt, 0)
  const avgOt = ACTIVE_EMPLOYEES.length ? Math.round((totalOt / ACTIVE_EMPLOYEES.length) * 10) / 10 : 0
  const topOt = [...ACTIVE_EMPLOYEES].sort((a, b) => b.thisMonthOt - a.thisMonthOt).slice(0, 15)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">월 총 초과근무</p>
          <p className="mt-1 text-2xl font-bold">{totalOt}h</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">평균 초과근무</p>
          <p className="mt-1 text-2xl font-bold">{avgOt}h</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">초과근무 인원</p>
          <p className="mt-1 text-2xl font-bold">{ACTIVE_EMPLOYEES.filter((e) => e.thisMonthOt > 0).length}명</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">부서별 초과근무 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-[260px] w-full">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="dept" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hours" fill="var(--color-hours)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">초과근무 상위 직원</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>순위</TableHead>
                <TableHead className="min-w-[120px]">이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead className="text-right">초과근무</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topOt.map((e, i) => (
                <TableRow key={e.id}>
                  <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="text-muted-foreground">{e.dept}</TableCell>
                  <TableCell>{e.position}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-warning">{e.thisMonthOt}h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
