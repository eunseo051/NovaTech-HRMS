import { cn } from '@/lib/utils'
import type { Grade, Status } from '@/lib/data'

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    재직중: 'bg-success/12 text-success',
    휴직: 'bg-warning/15 text-warning',
    퇴사: 'bg-muted text-muted-foreground',
  }
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', map[status])}>
      {status}
    </span>
  )
}

export function WorkTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    출근: 'bg-success/12 text-success',
    재택: 'bg-primary/12 text-primary',
    휴가: 'bg-warning/15 text-warning',
    출장: 'bg-secondary text-secondary-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        map[type] ?? 'bg-muted text-muted-foreground',
      )}
    >
      {type}
    </span>
  )
}

export function GradeBadge({ grade }: { grade: Grade }) {
  const map: Record<Grade, string> = {
    S: 'bg-primary text-primary-foreground',
    A: 'bg-primary/15 text-primary',
    B: 'bg-secondary text-secondary-foreground',
    C: 'bg-muted text-muted-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex size-6 items-center justify-center rounded-md text-xs font-bold',
        map[grade],
      )}
    >
      {grade}
    </span>
  )
}

export function LeaveStatusBadge({ status }: { status: '신청' | '승인' | '반려' }) {
  const map = {
    신청: 'bg-warning/15 text-warning',
    승인: 'bg-success/12 text-success',
    반려: 'bg-destructive/12 text-destructive',
  }
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', map[status])}>
      {status}
    </span>
  )
}
