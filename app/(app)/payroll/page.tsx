import { PageHeader } from '@/components/shared/page-header'
import { PayrollTable } from '@/components/payroll/payroll-table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export default function PayrollPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="급여 관리"
        description="월별 급여 계산 결과와 지급 내역을 관리합니다."
        actions={
          <Select defaultValue="2026-07">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-07">2026년 7월</SelectItem>
              <SelectItem value="2026-06">2026년 6월</SelectItem>
              <SelectItem value="2026-05">2026년 5월</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <PayrollTable />
    </div>
  )
}
