'use client'

import { Cell, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { gradeDistribution } from '@/lib/data'

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)']

const config = {
  count: { label: '인원' },
} satisfies ChartConfig

export function GradeChart() {
  const data = gradeDistribution()
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">성과등급 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto h-[200px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="grade" />} />
            <Pie data={data} dataKey="count" nameKey="grade" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {data.map((d, i) => (
            <div key={d.grade} className="text-center">
              <div className="mx-auto mb-1 size-2.5 rounded-full" style={{ background: COLORS[i] }} />
              <p className="text-xs font-semibold">{d.grade}등급</p>
              <p className="text-xs text-muted-foreground">
                {d.count}명 · {Math.round((d.count / total) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
