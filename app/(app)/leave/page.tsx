import { Suspense } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { LeaveView } from '@/components/leave/leave-view'

export default function LeavePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="휴가 관리"
        description="연차 현황, 휴가 신청, 승인 및 내역을 관리합니다."
      />
      <Suspense fallback={<div className="text-sm text-muted-foreground">로딩 중...</div>}>
        <LeaveView />
      </Suspense>
    </div>
  )
}
