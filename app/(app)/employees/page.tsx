import { PageHeader } from '@/components/shared/page-header'
import { EmployeeTable } from '@/components/employees/employee-table'

export default function EmployeesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="직원 관리"
        description="전체 임직원 정보를 조회하고 관리합니다."
      />
      <EmployeeTable />
    </div>
  )
}
