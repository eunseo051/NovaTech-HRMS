import { notFound } from 'next/navigation'
import { EmployeeDetail } from '@/components/employees/employee-detail'
import { getEmployee, EMPLOYEES } from '@/lib/data'

export function generateStaticParams() {
  return EMPLOYEES.map((e) => ({ id: e.id }))
}

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const employee = getEmployee(id)
  if (!employee) notFound()
  return <EmployeeDetail employee={employee} />
}
