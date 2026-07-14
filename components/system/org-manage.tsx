import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { DEPARTMENTS, POSITIONS, deptManagers, positionDistribution } from '@/lib/data'

export function OrgManage() {
  const managers = deptManagers()
  const posDist = positionDistribution()

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium">부서 관리</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">부서</TableHead>
                  <TableHead>부서장</TableHead>
                  <TableHead>직급</TableHead>
                  <TableHead className="text-center">인원</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((m) => (
                  <TableRow key={m.dept}>
                    <TableCell className="font-medium">{m.dept}팀</TableCell>
                    <TableCell>{m.managerName}</TableCell>
                    <TableCell className="text-muted-foreground">{m.managerPosition}</TableCell>
                    <TableCell className="text-center tabular-nums">{m.headcount}명</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium">직급 관리</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">직급</TableHead>
                  <TableHead className="text-right">인원</TableHead>
                  <TableHead className="text-right">비율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posDist.map((p) => {
                  const total = posDist.reduce((s, x) => s + x.count, 0)
                  return (
                    <TableRow key={p.position}>
                      <TableCell className="font-medium">{p.position}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.count}명</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{total ? Math.round((p.count / total) * 100) : 0}%</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">부서·직급 체계</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {POSITIONS.map((p) => (
              <span key={p} className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium">
                {p}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <span key={d} className="rounded-lg border border-border bg-primary/8 px-3 py-1.5 text-sm font-medium text-primary">
                {d}팀
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
