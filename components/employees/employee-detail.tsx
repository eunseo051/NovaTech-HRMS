'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Mail, Phone, Calendar, Building2, CircleUser } from 'lucide-react'
import { type Employee, KRW, KRW_MAN, LEAVE_RECORDS } from '@/lib/data'
import { calcPayroll, PAY_LABELS } from '@/lib/payroll'
import { StatusBadge, GradeBadge, WorkTypeBadge, LeaveStatusBadge } from '@/components/shared/status-badge'

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}

export function EmployeeDetail({ employee }: { employee: Employee }) {
  const pay = calcPayroll(employee)
  const leaveUsedPct = Math.round(
    ((employee.totalLeave - employee.remainingLeave) / employee.totalLeave) * 100,
  )
  const myLeaves = LEAVE_RECORDS.filter((l) => l.employeeId === employee.id)
  const years = 2026 - Number(employee.hireDate.slice(0, 4))

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/employees"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        직원 목록으로
      </Link>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Profile card */}
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            <Avatar className="size-24">
              <AvatarImage src={employee.photoUrl || '/placeholder.svg'} alt={employee.name} />
              <AvatarFallback className="text-2xl">{employee.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-xl font-semibold">{employee.name}</h2>
              <p className="text-sm text-muted-foreground">
                {employee.dept} · {employee.position}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={employee.status} />
                <WorkTypeBadge type={employee.workType} />
              </div>
            </div>
            <Separator />
            <div className="flex w-full flex-col gap-3 text-left">
              <InfoRow icon={CircleUser} label="사번" value={employee.id} />
              <InfoRow icon={Mail} label="이메일" value={employee.email} />
              <InfoRow icon={Phone} label="연락처" value={employee.phone} />
              <InfoRow icon={Building2} label="부서" value={employee.dept} />
              <InfoRow icon={Calendar} label="입사일" value={`${employee.hireDate} (${years}년차)`} />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info" className="flex flex-col gap-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="info">기본 정보</TabsTrigger>
            <TabsTrigger value="salary">급여 정보</TabsTrigger>
            <TabsTrigger value="leave">휴가 내역</TabsTrigger>
            <TabsTrigger value="performance">평가 이력</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">인사 기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <Field label="성명" value={employee.name} />
                <Field label="사번" value={employee.id} />
                <Field label="생년월일" value={employee.birth} />
                <Field label="성별" value={employee.gender} />
                <Field label="부서" value={employee.dept} />
                <Field label="직급" value={employee.position} />
                <Field label="입사일" value={employee.hireDate} />
                <Field label="근속연수" value={`${years}년`} />
                <Field label="근무형태" value={employee.workType} />
                <Field label="재직상태" value={employee.status} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">급여 명세 (월 지급 기준)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <SummaryStat label="연봉" value={KRW_MAN(employee.salaryAnnual)} />
                  <SummaryStat label="월 실지급액" value={`${KRW(pay.netPay)}원`} accent />
                  <SummaryStat label="평가 등급" value={employee.grade} />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-success">지급 항목</p>
                    <PayList items={pay.earnings} />
                    <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
                      <span>지급 합계</span>
                      <span className="tabular-nums">{KRW(pay.grossPay)}원</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-destructive">공제 항목</p>
                    <PayList items={pay.deductions} />
                    <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
                      <span>공제 합계</span>
                      <span className="tabular-nums">{KRW(pay.totalDeduction)}원</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">연차 현황</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      사용 {employee.totalLeave - employee.remainingLeave}일 / 총 {employee.totalLeave}일
                    </span>
                    <span className="font-medium">잔여 {employee.remainingLeave}일</span>
                  </div>
                  <Progress value={leaveUsedPct} />
                </div>
                <Separator />
                {myLeaves.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {myLeaves.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {l.type} · {l.days}일
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {l.startDate} ~ {l.endDate} · {l.reason}
                          </span>
                        </div>
                        <LeaveStatusBadge status={l.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    최근 휴가 신청 내역이 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">평가 이력</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {['2026 상반기', '2025 하반기', '2025 상반기'].map((period, i) => {
                  const grades = [employee.grade, i === 1 ? 'B' : 'A', 'B'] as const
                  return (
                    <div
                      key={period}
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{period} 인사평가</span>
                        <span className="text-xs text-muted-foreground">
                          평가자: {employee.dept}팀 팀장
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          성과급 {(pay.bonusRatePct * (i === 0 ? 1 : 0.9)).toFixed(0)}%
                        </span>
                        <GradeBadge grade={grades[i]} />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function SummaryStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-lg font-semibold ${accent ? 'text-primary' : ''}`}>{value}</span>
    </div>
  )
}

function PayList({ items }: { items: { key: string; amount: number }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((it) => (
        <div key={it.key} className="flex justify-between text-sm">
          <span className="text-muted-foreground">{PAY_LABELS[it.key] ?? it.key}</span>
          <span className="tabular-nums">{KRW(it.amount)}원</span>
        </div>
      ))}
    </div>
  )
}
