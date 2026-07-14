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
import { EVALUATION_RECORDS, DEPARTMENTS, type DeptName } from '@/lib/data'
import { GradeBadge } from '@/components/shared/status-badge'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

const periods = ['2026 상반기', '2025 하반기', '2025 상반기']

export function ResultView() {
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('2026 상반기')
  const [dept, setDept] = useState<'all' | DeptName>('all')

  const filtered = useMemo(() => {
    return EVALUATION_RECORDS.filter((r) => {
      if (r.period !== period) return false
      if (dept !== 'all' && r.dept !== dept) return false
      if (query) {
        const q = query.toLowerCase()
        if (!r.employeeName.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [query, period, dept])

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 검색"
            className="pl-9"
          />
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dept} onValueChange={(v) => setDept(v as typeof dept)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="부서" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 부서</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">평가 결과 · {period}</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead className="text-center">점수</TableHead>
                <TableHead className="text-center">등급</TableHead>
                <TableHead>평가자</TableHead>
                <TableHead className="min-w-[240px]">평가의견</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell>{r.position}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.score}점</TableCell>
                  <TableCell className="text-center"><GradeBadge grade={r.grade} /></TableCell>
                  <TableCell className="text-muted-foreground">{r.evaluator}</TableCell>
                  <TableCell className="text-muted-foreground">{r.comments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
