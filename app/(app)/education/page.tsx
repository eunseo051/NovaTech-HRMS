import { PageHeader } from '@/components/shared/page-header'
import { EducationView } from '@/components/education/education-view'

export default function EducationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="교육 관리"
        description="교육 과정, 수강 신청 및 수료 현황을 관리합니다."
      />
      <EducationView />
    </div>
  )
}
