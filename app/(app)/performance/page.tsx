import { Suspense } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PerformanceView } from '@/components/performance/performance-view'

export default function PerformancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="성과 관리"
        description="인사평가, 목표관리(KPI), 평가 결과 및 승진 대상자를 관리합니다."
      />
      <Suspense fallback={<div className="text-sm text-muted-foreground">로딩 중...</div>}>
        <PerformanceView />
      </Suspense>
    </div>
  )
}
