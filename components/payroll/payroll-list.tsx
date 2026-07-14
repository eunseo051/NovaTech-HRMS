'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ACTIVE_EMPLOYEES, DEPARTMENTS, KRW, KRW_MAN, type DeptName } from '@/lib/data'
import { calcPayroll } from '@/lib/payroll'
import { Search } from 'lucide-react'

export function PayrollList() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<'all' | DeptName>('all')

  const filtered = useMemo(() => {
    return ACTIVE_EMPLOYEES.filter((e) => {
      if (dept !== 'all' && e.dept !== dept) return false
      if (query) {
        const q = query.toLowerCase()
        if (!e.name.toLowerCase().includes(q) && !e.id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [query, dept])

  const totalGross = filtered.reduce((s, e) => s + calcPayroll(e).grossPay, 0)
  const totalNet = filtered.reduce((s, e) => s + calcPayroll(e).netPay, 0)
  const totalDeduction = filtered.reduce((s, e) => s + calcPayroll(e).totalDeduction, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">총 지급액 (월)</p>
          <p className="mt-1 text-2xl font-bold">{KRW_MAN(totalGross)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">총 공제액 (월)</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{KRW_MAN(totalDeduction)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">총 실지급액 (월)</p>
          <p className="mt-1 text-2xl font-bold text-primary">{KRW_MAN(totalNet)}</p>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 사번 검색"
            className="pl-9"
          />
        </div>
        <Select value={dept} onValueChange={(v) => setDept(v as typeof dept)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="부서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 부서</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">급여 조회 (2026년 7월)</p>
          <p className="text-sm text-muted-foreground">총 <span className="font-semibold text-foreground">{filtered.length}</span>명</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">직원</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead className="text-right">기본급</TableHead>
                <TableHead className="text-right">지급총액</TableHead>
                <TableHead className="text-right">공제액</TableHead>
                <TableHead className="text-right">실지급액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => {
                const pay = calcPayroll(e)
                return (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={e.photoUrl} alt={e.name} />
                          <AvatarFallback className="text-xs">{e.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{e.name}</span>
                          <span className="text-xs text-muted-foreground">{e.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{e.dept}</TableCell>
                    <TableCell>{e.position}</TableCell>
                    <TableCell className="text-right tabular-nums">{KRW(pay.earnings[0].amount)}원</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{KRW(pay.grossPay)}원</TableCell>
                    <TableCell className="text-right tabular-nums text-destructive">{KRW(pay.totalDeduction)}원</TableCell>
                    <TableCell className="text-right tabular-nums font-bold text-primary">{KRW(pay.netPay)}원</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
