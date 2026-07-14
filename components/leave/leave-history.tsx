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
import { LEAVE_RECORDS } from '@/lib/data'
import { LeaveStatusBadge } from '@/components/shared/status-badge'
import { Search } from 'lucide-react'

export function LeaveHistory() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | '신청' | '승인' | '반려'>('all')

  const filtered = useMemo(() => {
    return LEAVE_RECORDS.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (query) {
        const q = query.toLowerCase()
        if (!r.employeeName.toLowerCase().includes(q) && !r.dept.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [query, status])

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 부서 검색"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="신청">신청</SelectItem>
            <SelectItem value="승인">승인</SelectItem>
            <SelectItem value="반려">반려</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">휴가 신청 내역</p>
          <p className="text-sm text-muted-foreground">총 <span className="font-semibold text-foreground">{filtered.length}</span>건</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">신청자</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>종류</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead className="text-center">일수</TableHead>
                <TableHead>사유</TableHead>
                <TableHead>신청일</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell className="text-muted-foreground">{r.startDate}</TableCell>
                  <TableCell className="text-muted-foreground">{r.endDate}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.days}일</TableCell>
                  <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                  <TableCell className="text-muted-foreground">{r.appliedAt}</TableCell>
                  <TableCell className="text-center">
                    <LeaveStatusBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                    휴가 내역이 없습니다.
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
