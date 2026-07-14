import { Suspense } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { AttendanceView } from '@/components/attendance/attendance-view'

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="근태 관리"
        description="출퇴근 현황, 근무시간, 초과근무, 지각/조퇴 현황을 관리합니다."
      />
      <Suspense fallback={<div className="text-sm text-muted-foreground">로딩 중...</div>}>
        <AttendanceView />
      </Suspense>
    </div>
  )
}
