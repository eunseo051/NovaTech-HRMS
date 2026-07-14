'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { LEAVE_RECORDS } from '@/lib/data'
import { LeaveStatusBadge } from '@/components/shared/status-badge'
import { Check, X } from 'lucide-react'

export function LeaveApprove() {
  const [records, setRecords] = useState(LEAVE_RECORDS)
  const pending = records.filter((r) => r.status === '신청')

  const handleAction = (id: string, action: '승인' | '반려') => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">승인 대기</p>
          <p className="mt-1 text-2xl font-bold text-warning">{pending.length}건</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">승인 완료</p>
          <p className="mt-1 text-2xl font-bold text-success">{records.filter((r) => r.status === '승인').length}건</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">반려</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{records.filter((r) => r.status === '반려').length}건</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">휴가 승인 대기 목록</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">신청자</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>종류</TableHead>
                <TableHead>기간</TableHead>
                <TableHead className="text-center">일수</TableHead>
                <TableHead>사유</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-center">승인/반려</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.employeeName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell className="text-muted-foreground">{r.startDate} ~ {r.endDate}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.days}일</TableCell>
                  <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                  <TableCell className="text-center">
                    <LeaveStatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button size="icon-sm" variant="outline" onClick={() => handleAction(r.id, '승인')} className="text-success hover:bg-success/10">
                        <Check className="size-3.5" />
                      </Button>
                      <Button size="icon-sm" variant="outline" onClick={() => handleAction(r.id, '반려')} className="text-destructive hover:bg-destructive/10">
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    승인 대기 중인 휴가 신청이 없습니다.
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
