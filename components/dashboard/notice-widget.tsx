import Link from 'next/link'
import { Pin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NOTICES } from '@/lib/data'
import { cn } from '@/lib/utils'

const catTone: Record<string, string> = {
  전사: 'bg-primary/12 text-primary',
  인사: 'bg-success/12 text-success',
  복지: 'bg-warning/15 text-warning',
  시스템: 'bg-muted text-muted-foreground',
}

export function NoticeWidget() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">최근 공지사항</CardTitle>
        <Link href="/notices" className="text-xs font-medium text-primary hover:underline">
          전체보기
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {NOTICES.slice(0, 6).map((n) => (
          <Link
            key={n.id}
            href="/notices"
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
          >
            <span
              className={cn(
                'inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium',
                catTone[n.category],
              )}
            >
              {n.category}
            </span>
            <p className="flex min-w-0 flex-1 items-center gap-1 truncate text-sm">
              {n.pinned && <Pin className="size-3.5 shrink-0 text-destructive" />}
              <span className="truncate">{n.title}</span>
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">{n.date.slice(5)}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
