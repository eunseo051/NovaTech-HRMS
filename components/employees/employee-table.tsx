'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import {
  DEPARTMENTS,
  POSITIONS,
  EMPLOYEES,
  KRW_MAN,
  type DeptName,
  type Position,
} from '@/lib/data'
import { StatusBadge, GradeBadge, WorkTypeBadge } from '@/components/shared/status-badge'

export function EmployeeTable() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<'all' | DeptName>('all')
  const [position, setPosition] = useState<'all' | Position>('all')
  const [status, setStatus] = useState<'all' | '재직중' | '휴직' | '퇴사'>('재직중')

  const deptItems = { all: '전체 부서', ...Object.fromEntries(DEPARTMENTS.map((d) => [d, d])) }
  const positionItems = { all: '전체 직급', ...Object.fromEntries(POSITIONS.map((p) => [p, p])) }
  const statusItems = { all: '전체 상태', 재직중: '재직중', 휴직: '휴직', 퇴사: '퇴사' }

  const filtered = useMemo(() => {
    return EMPLOYEES.filter((e) => {
      if (dept !== 'all' && e.dept !== dept) return false
      if (position !== 'all' && e.position !== position) return false
      if (status !== 'all' && e.status !== status) return false
      if (query) {
        const q = query.toLowerCase()
        if (
          !e.name.toLowerCase().includes(q) &&
          !e.id.toLowerCase().includes(q) &&
          !e.email.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [query, dept, position, status])

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 사번, 이메일 검색"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={dept} onValueChange={(v) => setDept(v as typeof dept)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="부서" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 부서</SelectItem>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={position} onValueChange={(v) => setPosition(v as typeof position)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="직급" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 직급</SelectItem>
              {POSITIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="재직중">재직중</SelectItem>
              <SelectItem value="휴직">휴직</SelectItem>
              <SelectItem value="퇴사">퇴사</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">
            총 <span className="text-primary">{filtered.length}</span>명
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">직원</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead>입사일</TableHead>
                <TableHead className="text-right">연봉</TableHead>
                <TableHead className="text-center">평가</TableHead>
                <TableHead className="text-center">근태</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/employees/${e.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar className="size-9">
                        <AvatarImage src={e.photoUrl || '/placeholder.svg'} alt={e.name} />
                        <AvatarFallback>{e.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{e.name}</span>
                        <span className="text-xs text-muted-foreground">{e.id}</span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.dept}</TableCell>
                  <TableCell>{e.position}</TableCell>
                  <TableCell className="text-muted-foreground">{e.hireDate}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {KRW_MAN(e.salaryAnnual)}
                  </TableCell>
                  <TableCell className="text-center">
                    <GradeBadge grade={e.grade} />
                  </TableCell>
                  <TableCell className="text-center">
                    <WorkTypeBadge type={e.workType} />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={e.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    조건에 맞는 직원이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
