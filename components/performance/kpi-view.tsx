'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { KPI_RECORDS, DEPARTMENTS, type DeptName } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

const statusStyle: Record<string, string> = {
  진행중: 'bg-primary/12 text-primary',
  완료: 'bg-success/12 text-success',
  지연: 'bg-destructive/12 text-destructive',
}

export function KpiView() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<'all' | DeptName>('all')
  const [status, setStatus] = useState<'all' | '진행중' | '완료' | '지연'>('all')

  const filtered = useMemo(() => {
    return KPI_RECORDS.filter((r) => {
      if (dept !== 'all' && r.dept !== dept) return false
      if (status !== 'all' && r.status !== status) return false
      if (query) {
        const q = query.toLowerCase()
        if (!r.employeeName.toLowerCase().includes(q) && !r.objective.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [query, dept, status])

  const inProgress = KPI_RECORDS.filter((r) => r.status === '진행중').length
  const completed = KPI_RECORDS.filter((r) => r.status === '완료').length
  const delayed = KPI_RECORDS.filter((r) => r.status === '지연').length
  const avgProgress = KPI_RECORDS.length ? Math.round(KPI_RECORDS.reduce((s, r) => s + r.progress, 0) / KPI_RECORDS.length) : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">전체 KPI</p>
          <p className="mt-1 text-2xl font-bold">{KPI_RECORDS.length}개</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">진행중</p>
          <p className="mt-1 text-2xl font-bold text-primary">{inProgress}개</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">완료</p>
          <p className="mt-1 text-2xl font-bold text-success">{completed}개</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">지연</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{delayed}개</p>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="담당자, 목표 검색"
            className="pl-9"
          />
        </div>
        <Select value={dept} onValueChange={(v) => setDept(v as typeof dept)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="부서" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 부서</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="상태" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="진행중">진행중</SelectItem>
            <SelectItem value="완료">완료</SelectItem>
            <SelectItem value="지연">지연</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">KPI 목표 관리 (평균 달성률 {avgProgress}%)</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">담당자</TableHead>
                <TableHead>부서</TableHead>
                <TableHead className="min-w-[200px]">목표</TableHead>
                <TableHead className="text-center">가중치</TableHead>
                <TableHead className="text-center">진척률</TableHead>
                <TableHead>마감일</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell className="max-w-[280px] truncate">{r.objective}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.weight}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={r.progress} className="w-24" />
                      <span className="text-xs tabular-nums text-muted-foreground">{r.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.dueDate}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusStyle[r.status])}>
                      {r.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    조건에 맞는 KPI가 없습니다.
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
