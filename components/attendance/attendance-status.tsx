import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ATTENDANCE_RECORDS, attendanceSummary, ACTIVE_EMPLOYEES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { LogIn, Home, Clock, AlertCircle, UserX } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const statusStyle: Record<string, string> = {
  정상: 'bg-success/12 text-success',
  지각: 'bg-warning/15 text-warning',
  조퇴: 'bg-warning/15 text-warning',
  결근: 'bg-destructive/12 text-destructive',
  재택: 'bg-primary/12 text-primary',
}

export function AttendanceStatus() {
  const summary = attendanceSummary()
  const todayRecords = ATTENDANCE_RECORDS.filter((r) => r.date === '2026-07-13')

  const stats: { label: string; value: number; icon: LucideIcon; tone: string }[] = [
    { label: '출근', value: summary.present, icon: LogIn, tone: 'text-success bg-success/12' },
    { label: '재택', value: summary.remote, icon: Home, tone: 'text-primary bg-primary/10' },
    { label: '지각', value: summary.late, icon: Clock, tone: 'text-warning bg-warning/15' },
    { label: '조퇴', value: summary.early, icon: AlertCircle, tone: 'text-warning bg-warning/15' },
    { label: '결근', value: summary.absent, icon: UserX, tone: 'text-destructive bg-destructive/12' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="flex items-center gap-3 p-4">
              <div className={cn('flex size-10 items-center justify-center rounded-lg', s.tone)}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}명</p>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">오늘 출퇴근 현황 (2026-07-13)</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사번</TableHead>
                <TableHead className="min-w-[140px]">이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>출근시간</TableHead>
                <TableHead>퇴근시간</TableHead>
                <TableHead className="text-right">근무시간</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-muted-foreground">{r.employeeId}</TableCell>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell className="tabular-nums">{r.checkIn}</TableCell>
                  <TableCell className="tabular-nums">{r.checkOut}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.workHours}h</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusStyle[r.status])}>
                      {r.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {todayRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    오늘 출퇴근 기록이 없습니다.
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
