import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ATTENDANCE_RECORDS, ACTIVE_EMPLOYEES } from '@/lib/data'

export function WorkHours() {
  // Aggregate per employee for the month
  const empMap = new Map<string, { name: string; dept: string; totalHours: number; totalOt: number; days: number }>()
  for (const r of ATTENDANCE_RECORDS) {
    const existing = empMap.get(r.employeeId) ?? { name: r.employeeName, dept: r.dept, totalHours: 0, totalOt: 0, days: 0 }
    existing.totalHours += r.workHours
    existing.totalOt += r.overtime
    existing.days += 1
    empMap.set(r.employeeId, existing)
  }
  const rows = Array.from(empMap.entries()).map(([id, v]) => ({ id, ...v }))
  const totalHours = rows.reduce((s, r) => s + r.totalHours, 0)
  const avgHours = rows.length ? Math.round((totalHours / rows.length) * 10) / 10 : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">월 총 근무시간</p>
          <p className="mt-1 text-2xl font-bold">{Math.round(totalHours).toLocaleString()}h</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">평균 근무시간</p>
          <p className="mt-1 text-2xl font-bold">{avgHours}h</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">근무 인원</p>
          <p className="mt-1 text-2xl font-bold">{rows.length}명</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">직원별 근무시간 (2026년 7월)</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사번</TableHead>
                <TableHead className="min-w-[120px]">이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead className="text-center">근무일수</TableHead>
                <TableHead className="text-right">총 근무시간</TableHead>
                <TableHead className="text-right">초과근무</TableHead>
                <TableHead className="text-right">일평균</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-muted-foreground">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell className="text-center">{r.days}일</TableCell>
                  <TableCell className="text-right tabular-nums">{Math.round(r.totalHours)}h</TableCell>
                  <TableCell className="text-right tabular-nums">{Math.round(r.totalOt)}h</TableCell>
                  <TableCell className="text-right tabular-nums">{r.days ? (Math.round(r.totalHours / r.days * 10) / 10) : 0}h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
