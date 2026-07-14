import type { LucideIcon } from 'lucide-react'
import { Users, LogIn, Home, Plane, UserPlus, UserMinus, CalendarClock, Timer } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ACTIVE_EMPLOYEES, EMPLOYEES } from '@/lib/data'

interface Stat {
  label: string
  value: string
  icon: LucideIcon
  tone: string
  hint?: string
}

function buildStats() {
  const attend = ACTIVE_EMPLOYEES.filter((e) => e.workType === '출근').length
  const remote = ACTIVE_EMPLOYEES.filter((e) => e.workType === '재택').length
  const onLeave = ACTIVE_EMPLOYEES.filter((e) => e.workType === '휴가').length

  const primary: Stat[] = [
    { label: '전체 인원', value: `${EMPLOYEES.filter((e) => e.status !== '퇴사').length}명`, icon: Users, tone: 'text-primary bg-primary/10' },
    { label: '출근', value: `${attend}명`, icon: LogIn, tone: 'text-success bg-success/12' },
    { label: '재택', value: `${remote}명`, icon: Home, tone: 'text-primary bg-primary/10' },
    { label: '휴가중', value: `${onLeave}명`, icon: Plane, tone: 'text-warning bg-warning/15' },
  ]
  return primary
}

const SECONDARY: Stat[] = [
  { label: '이번달 신규입사', value: '2명', icon: UserPlus, tone: 'text-success bg-success/12' },
  { label: '퇴사예정', value: '1명', icon: UserMinus, tone: 'text-destructive bg-destructive/12' },
  { label: '평균 근속', value: '4.3년', icon: CalendarClock, tone: 'text-primary bg-primary/10' },
  { label: '평균 야근', value: '8.2h', icon: Timer, tone: 'text-warning bg-warning/15' },
]

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon
  return (
    <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
      <div className={cn('flex size-12 items-center justify-center rounded-xl', stat.tone)}>
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{stat.label}</p>
        <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
      </div>
    </Card>
  )
}

export function StatCards() {
  const primary = buildStats()
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {primary.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SECONDARY.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>
    </div>
  )
}
