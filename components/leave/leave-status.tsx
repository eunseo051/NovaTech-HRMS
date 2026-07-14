import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ACTIVE_EMPLOYEES, LEAVE_RECORDS } from '@/lib/data'
import { LeaveStatusBadge } from '@/components/shared/status-badge'

export function LeaveStatus() {
  const totalLeave = ACTIVE_EMPLOYEES.reduce((s, e) => s + e.totalLeave, 0)
  const totalRemaining = ACTIVE_EMPLOYEES.reduce((s, e) => s + e.remainingLeave, 0)
  const totalUsed = totalLeave - totalRemaining
  const usageRate = totalLeave ? Math.round((totalUsed / totalLeave) * 100) : 0
  const pending = LEAVE_RECORDS.filter((r) => r.status === '신청').length
  const approved = LEAVE_RECORDS.filter((r) => r.status === '승인').length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">부여 연차</p>
          <p className="mt-1 text-2xl font-bold">{totalLeave}일</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">사용 연차</p>
          <p className="mt-1 text-2xl font-bold text-warning">{totalUsed}일</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">잔여 연차</p>
          <p className="mt-1 text-2xl font-bold text-primary">{totalRemaining}일</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">승인 대기</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{pending}건</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">전체 연차 사용률</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={usageRate} className="flex-1" />
            <span className="text-sm font-semibold tabular-nums">{usageRate}%</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">승인 {approved}건 · 신청 {pending}건</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">직원별 연차 현황</p>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVE_EMPLOYEES.slice(0, 30).map((e) => {
            const used = e.totalLeave - e.remainingLeave
            const pct = e.totalLeave ? Math.round((used / e.totalLeave) * 100) : 0
            return (
              <div key={e.id} className="flex flex-col gap-2 bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {e.name.slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.dept} · {e.position}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{e.remainingLeave}/{e.totalLeave}일</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={pct} className="flex-1" />
                  <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
