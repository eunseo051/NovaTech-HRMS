import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { EVALUATION_RECORDS, gradeDistribution } from '@/lib/data'
import { GradeBadge } from '@/components/shared/status-badge'
import { cn } from '@/lib/utils'

export function EvaluationList() {
  const currentPeriod = '2026 상반기'
  const records = EVALUATION_RECORDS.filter((r) => r.period === currentPeriod)
  const grades = gradeDistribution()
  const total = grades.reduce((s, g) => s + g.count, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {grades.map((g) => (
          <Card key={g.grade} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{g.grade}등급</p>
              <GradeBadge grade={g.grade} />
            </div>
            <p className="mt-2 text-2xl font-bold">{g.count}명</p>
            <p className="text-xs text-muted-foreground">{total ? Math.round((g.count / total) * 100) : 0}%</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">인사평가 · {currentPeriod}</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead className="text-center">평가점수</TableHead>
                <TableHead className="text-center">등급</TableHead>
                <TableHead>평가자</TableHead>
                <TableHead>평가의견</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell>{r.position}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.score}점</TableCell>
                  <TableCell className="text-center">
                    <GradeBadge grade={r.grade} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.evaluator}</TableCell>
                  <TableCell className="max-w-[280px] truncate text-muted-foreground">{r.comments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
