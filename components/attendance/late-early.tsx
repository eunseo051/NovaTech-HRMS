import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ATTENDANCE_RECORDS, lateEarlyStats } from '@/lib/data'
import { cn } from '@/lib/utils'

const statusStyle: Record<string, string> = {
  지각: 'bg-warning/15 text-warning',
  조퇴: 'bg-warning/15 text-warning',
  결근: 'bg-destructive/12 text-destructive',
}

export function LateEarly() {
  const stats = lateEarlyStats()
  const lateRecords = ATTENDANCE_RECORDS.filter((r) => r.status === '지각' || r.status === '조퇴' || r.status === '결근')

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">지각 횟수</p>
          <p className="mt-1 text-2xl font-bold text-warning">{stats.late}회</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">조퇴 횟수</p>
          <p className="mt-1 text-2xl font-bold text-warning">{stats.early}회</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">결근 횟수</p>
          <p className="mt-1 text-2xl font-bold text-destructive">0회</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">지각/조퇴 내역 (2026년 7월)</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead className="min-w-[120px]">이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>출근</TableHead>
                <TableHead>퇴근</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lateRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell className="tabular-nums">{r.checkIn}</TableCell>
                  <TableCell className="tabular-nums">{r.checkOut}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusStyle[r.status])}>
                      {r.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {lateRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    지각/조퇴 내역이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
