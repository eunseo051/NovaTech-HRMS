import { Suspense } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PayrollView } from '@/components/payroll/payroll-view'

export default function PayrollPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="급여 관리"
        description="급여 조회, 급여명세서, 수당 및 공제 내역을 관리합니다."
      />
      <Suspense fallback={<div className="text-sm text-muted-foreground">로딩 중...</div>}>
        <PayrollView />
      </Suspense>
    </div>
  )
}
