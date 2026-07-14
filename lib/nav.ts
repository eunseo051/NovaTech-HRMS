import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Network,
  Clock,
  CalendarDays,
  Wallet,
  TrendingUp,
  GraduationCap,
  Megaphone,
  BarChart3,
  Settings,
} from 'lucide-react'

export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
  children?: NavChild[]
}

export const NAV: NavItem[] = [
  { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  {
    label: '직원 관리',
    href: '/employees',
    icon: Users,
    children: [
      { label: '직원 조회', href: '/employees' },
      { label: '직원 등록', href: '/employees?view=register' },
      { label: '인사발령 이력', href: '/employees?view=history' },
    ],
  },
  { label: '조직도', href: '/org', icon: Network },
  {
    label: '근태 관리',
    href: '/attendance',
    icon: Clock,
    children: [
      { label: '출퇴근 현황', href: '/attendance' },
      { label: '근무시간', href: '/attendance?view=hours' },
      { label: '초과근무', href: '/attendance?view=overtime' },
      { label: '지각/조퇴', href: '/attendance?view=late' },
    ],
  },
  {
    label: '휴가 관리',
    href: '/leave',
    icon: CalendarDays,
    children: [
      { label: '연차 현황', href: '/leave' },
      { label: '휴가 신청', href: '/leave?view=apply' },
      { label: '휴가 승인', href: '/leave?view=approve' },
      { label: '휴가 내역', href: '/leave?view=history' },
    ],
  },
  {
    label: '급여 관리',
    href: '/payroll',
    icon: Wallet,
    children: [
      { label: '급여 조회', href: '/payroll' },
      { label: '급여명세서', href: '/payroll?view=payslip' },
      { label: '수당 관리', href: '/payroll?view=allowance' },
      { label: '공제 내역', href: '/payroll?view=deduction' },
    ],
  },
  {
    label: '성과 관리',
    href: '/performance',
    icon: TrendingUp,
    children: [
      { label: '인사평가', href: '/performance' },
      { label: '목표관리(KPI)', href: '/performance?view=kpi' },
      { label: '평가 결과', href: '/performance?view=result' },
      { label: '승진 대상', href: '/performance?view=promotion' },
    ],
  },
  { label: '교육 관리', href: '/education', icon: GraduationCap },
  { label: '공지사항', href: '/notices', icon: Megaphone },
  { label: '인사 분석', href: '/analytics', icon: BarChart3, adminOnly: true },
  {
    label: '시스템 관리',
    href: '/system',
    icon: Settings,
    children: [
      { label: '사용자 권한', href: '/system' },
      { label: '사규 업로드', href: '/system?view=policy' },
      { label: '부서/직급 관리', href: '/system?view=org' },
      { label: '로그 관리', href: '/system?view=log' },
    ],
  },
]

export const CURRENT_USER = {
  name: '박서연',
  role: '인사팀장',
  email: 'park1042@novatech.io',
  isAdmin: true,
}
