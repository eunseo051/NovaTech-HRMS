import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EVALUATION_RECORDS, EMPLOYEES, POSITIONS } from '@/lib/data'
import { GradeBadge } from '@/components/shared/status-badge'

export function PromotionView() {
  const candidates = EVALUATION_RECORDS.filter((r) => r.promotionEligible)
  const candidateEmps = candidates.map((c) => EMPLOYEES.find((e) => e.id === c.employeeId)!).filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">승진 대상자</p>
          <p className="mt-1 text-2xl font-bold text-primary">{candidateEmps.length}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">S등급 인원</p>
          <p className="mt-1 text-2xl font-bold">{candidates.filter((c) => c.grade === 'S').length}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">A등급 인원</p>
          <p className="mt-1 text-2xl font-bold">{candidates.filter((c) => c.grade === 'A').length}명</p>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {candidateEmps.map((emp) => {
          const evalRecord = candidates.find((c) => c.employeeId === emp.id)!
          const currentIdx = POSITIONS.indexOf(emp.position)
          const nextPosition = currentIdx >= 0 && currentIdx < POSITIONS.length - 1 ? POSITIONS[currentIdx + 1] : emp.position
          return (
            <Card key={emp.id}>
              <CardContent className="flex flex-col gap-3 pt-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage src={emp.photoUrl} alt={emp.name} />
                    <AvatarFallback>{emp.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.dept}팀 · {emp.position}</p>
                  </div>
                  <GradeBadge grade={evalRecord.grade} />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                  <span className="text-sm text-muted-foreground">현 직급</span>
                  <span className="text-sm font-medium">{emp.position}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-primary/8 px-3 py-2">
                  <span className="text-sm text-primary">승진 예정</span>
                  <span className="text-sm font-bold text-primary">{nextPosition}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">평가점수</span>
                  <span className="font-semibold tabular-nums">{evalRecord.score}점</span>
                </div>
                <p className="text-xs text-muted-foreground">{evalRecord.comments}</p>
                <Link href={`/employees/${emp.id}`}>
                  <Button variant="outline" size="sm" className="w-full">상세 보기</Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
        {candidateEmps.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-muted-foreground">
              승진 대상자가 없습니다.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
