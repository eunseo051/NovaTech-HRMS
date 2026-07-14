import { PageHeader } from '@/components/shared/page-header'
import { OrgChart } from '@/components/org/org-chart'

export default function OrgPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="조직도"
        description="NovaTech Solutions 부서별 조직 구조를 확인합니다."
      />
      <OrgChart />
    </div>
  )
}
