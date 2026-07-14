import { Suspense } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { SystemView } from '@/components/system/system-view'

export default function SystemPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="시스템 관리"
        description="사용자 권한, 사규, 부서/직급 및 로그를 관리합니다."
      />
      <Suspense fallback={<div className="text-sm text-muted-foreground">로딩 중...</div>}>
        <SystemView />
      </Suspense>
    </div>
  )
}
