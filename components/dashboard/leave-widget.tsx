import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeaveStatusBadge } from '@/components/shared/status-badge'
import { LEAVE_RECORDS } from '@/lib/data'

export function LeaveWidget() {
  const items = LEAVE_RECORDS.slice(0, 6)
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">이번달 휴가 현황</CardTitle>
        <Link href="/leave?view=history" className="text-xs font-medium text-primary hover:underline">
          전체보기
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {r.employeeName.slice(0, 1)}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium">
                  {r.employeeName}
                  <span className="ml-1.5 text-xs text-muted-foreground">{r.dept}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.type} · {r.startDate.slice(5)} ({r.days}일)
                </p>
              </div>
            </div>
            <LeaveStatusBadge status={r.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
