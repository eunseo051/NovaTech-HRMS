'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell, ComposedChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from '@/components/ui/chart'
import {
  deptHeadcount, deptAvgSalary, gradeDistribution, positionDistribution,
  genderRatio, tenureDistribution, salaryByDept, monthlyHireTrend,
  ACTIVE_EMPLOYEES, EMPLOYEES, COMPANY,
} from '@/lib/data'
import { KRW_MAN } from '@/lib/data'

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const config = {
  count: { label: '인원', color: 'var(--chart-1)' },
  avg: { label: '평균연봉', color: 'var(--chart-2)' },
  hired: { label: '입사', color: 'var(--chart-1)' },
  left: { label: '퇴사', color: 'var(--chart-4)' },
} satisfies ChartConfig

export function AnalyticsView() {
  const headcount = deptHeadcount()
  const salary = salaryByDept()
  const grades = gradeDistribution()
  const positions = positionDistribution()
  const genders = genderRatio()
  const tenures = tenureDistribution()
  const hireTrend = monthlyHireTrend()

  const totalActive = ACTIVE_EMPLOYEES.length
  const totalEmp = EMPLOYEES.filter((e) => e.status !== '퇴사').length
  const avgSalary = Math.round(ACTIVE_EMPLOYEES.reduce((s, e) => s + e.salaryAnnual, 0) / ACTIVE_EMPLOYEES.length)

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">전체 인원</p>
          <p className="mt-1 text-2xl font-bold">{totalEmp}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">재직 인원</p>
          <p className="mt-1 text-2xl font-bold text-primary">{totalActive}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">평균 연봉</p>
          <p className="mt-1 text-2xl font-bold">{KRW_MAN(avgSalary)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">평균 근속</p>
          <p className="mt-1 text-2xl font-bold">4.3년</p>
        </Card>
      </div>

      {/* Dept headcount + Salary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">부서별 인원 분포</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={config} className="h-[260px] w-full">
              <BarChart data={headcount} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="dept" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">부서별 평균 연봉</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={config} className="h-[260px] w-full">
              <BarChart data={salary} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="dept" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avg" fill="var(--color-avg)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Grade + Gender */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">성과등급 분포</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={config} className="mx-auto h-[200px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="grade" />} />
                <Pie data={grades} dataKey="count" nameKey="grade" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {grades.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {grades.map((g, i) => (
                <div key={g.grade} className="text-center">
                  <div className="mx-auto mb-1 size-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <p className="text-xs font-semibold">{g.grade}등급</p>
                  <p className="text-xs text-muted-foreground">{g.count}명</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">성비 분포</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={config} className="mx-auto h-[200px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="gender" />} />
                <Pie data={genders} dataKey="count" nameKey="gender" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {genders.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {genders.map((g, i) => (
                <div key={g.gender} className="text-center">
                  <div className="mx-auto mb-1 size-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <p className="text-xs font-semibold">{g.gender}성</p>
                  <p className="text-xs text-muted-foreground">{g.count}명 · {Math.round((g.count / totalActive) * 100)}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Position distribution + Tenure */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">직급별 인원 분포</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={config} className="h-[260px] w-full">
              <BarChart data={positions} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="position" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">근속연수 분포</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={config} className="h-[260px] w-full">
              <BarChart data={tenures} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-avg)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hire trend */}
      <Card>
        <CardHeader><CardTitle className="text-base">월별 입퇴사 추이 (2026년)</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-[260px] w-full">
            <ComposedChart data={hireTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hired" fill="var(--color-hired)" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Line dataKey="left" stroke="var(--color-left)" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
