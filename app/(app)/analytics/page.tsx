import { PageHeader } from '@/components/shared/page-header'
import { AnalyticsView } from '@/components/analytics/analytics-view'

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="인사 분석"
        description="조직 인사 지표를 다각적으로 분석합니다."
      />
      <AnalyticsView />
    </div>
  )
}
