import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { COMPANY, DEPARTMENTS, EMPLOYEES, deptManagers } from '@/lib/data'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const deptColors: Record<string, string> = {
  개발: 'bg-primary/10 text-primary border-primary/20',
  인사: 'bg-success/10 text-success border-success/20',
  영업: 'bg-warning/10 text-warning border-warning/20',
  마케팅: 'bg-primary/8 text-primary border-primary/15',
  재무: 'bg-secondary text-secondary-foreground border-border',
  디자인: 'bg-destructive/8 text-destructive border-destructive/15',
}

export function OrgChart() {
  const managers = deptManagers()
  const ceo = EMPLOYEES.find((e) => e.position === '부장' && e.dept === '개발') ?? EMPLOYEES[0]

  return (
    <div className="flex flex-col gap-6">
      {/* CEO card */}
      <div className="flex justify-center">
        <Card className="w-full max-w-xs">
          <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
            <Avatar className="size-16">
              <AvatarImage src={ceo.photoUrl} alt={ceo.name} />
              <AvatarFallback className="text-xl">{ceo.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold">{ceo.name}</p>
              <p className="text-sm text-muted-foreground">대표이사 CEO</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="h-8 w-px bg-border" />
      </div>

      {/* Department grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEPARTMENTS.map((dept) => {
          const mgr = managers.find((m) => m.dept === dept)!
          const members = EMPLOYEES.filter((e) => e.dept === dept && e.status !== '퇴사')
          const positions = members.reduce<Record<string, number>>((acc, e) => {
            acc[e.position] = (acc[e.position] ?? 0) + 1
            return acc
          }, {})
          const managerEmp = EMPLOYEES.find((e) => e.id === mgr.managerId)

          return (
            <Card key={dept} className="overflow-hidden">
              <div className={cn('flex items-center justify-between border-b px-4 py-3', deptColors[dept])}>
                <span className="text-sm font-bold">{dept}팀</span>
                <span className="text-xs font-medium">{mgr.headcount}명</span>
              </div>
              <CardContent className="flex flex-col gap-3 pt-4">
                {/* Manager */}
                {managerEmp && (
                  <Link href={`/employees/${managerEmp.id}`} className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5 transition-colors hover:bg-muted">
                    <Avatar className="size-10">
                      <AvatarImage src={managerEmp.photoUrl} alt={managerEmp.name} />
                      <AvatarFallback>{managerEmp.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{managerEmp.name}</p>
                      <p className="text-xs text-muted-foreground">{mgr.managerPosition} · 팀장</p>
                    </div>
                  </Link>
                )}

                {/* Position breakdown */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(positions).map(([pos, count]) => (
                    <span key={pos} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {pos} {count}
                    </span>
                  ))}
                </div>

                {/* Member avatars */}
                <div className="flex flex-wrap gap-1.5">
                  {members.slice(0, 8).map((m) => (
                    <Link key={m.id} href={`/employees/${m.id}`}>
                      <Avatar className="size-8">
                        <AvatarImage src={m.photoUrl} alt={m.name} />
                        <AvatarFallback className="text-xs">{m.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                    </Link>
                  ))}
                  {members.length > 8 && (
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                      +{members.length - 8}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Company info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">회사 개요</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="회사명" value={COMPANY.name} />
          <InfoItem label="소재지" value={COMPANY.location} />
          <InfoItem label="산업분야" value={COMPANY.industry} />
          <InfoItem label="설립연도" value={`${COMPANY.founded}년`} />
        </CardContent>
      </Card>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
