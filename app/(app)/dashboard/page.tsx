import { StatCards } from '@/components/dashboard/stat-cards'
import { DeptChart } from '@/components/dashboard/dept-chart'
import { LeaveWidget } from '@/components/dashboard/leave-widget'
import { NoticeWidget } from '@/components/dashboard/notice-widget'
import { GradeChart } from '@/components/dashboard/grade-chart'
import { CURRENT_USER } from '@/lib/nav'

function today() {
  const d = new Date('2026-07-13')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-2xl bg-primary p-6 text-primary-foreground md:p-8">
        <p className="text-sm text-primary-foreground/80">{today()}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-balance md:text-3xl">
          안녕하세요, {CURRENT_USER.name} {CURRENT_USER.role}님
        </h2>
        <p className="mt-2 text-sm text-primary-foreground/90 text-pretty">
          오늘도 NovaTech의 성장을 함께 만들어가요. 현재 인사 현황을 확인해보세요.
        </p>
      </div>

      <StatCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DeptChart />
        </div>
        <GradeChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LeaveWidget />
        <NoticeWidget />
      </div>
    </div>
  )
}
