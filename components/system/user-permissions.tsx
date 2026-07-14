'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { SYSTEM_USERS } from '@/lib/data'
import { cn } from '@/lib/utils'

const roleStyle: Record<string, string> = {
  '시스템 관리자': 'bg-destructive/12 text-destructive',
  '인사 관리자': 'bg-primary/12 text-primary',
  '팀장': 'bg-warning/15 text-warning',
  '일반 사용자': 'bg-muted text-muted-foreground',
}

const statusStyle: Record<string, string> = {
  '활성': 'bg-success/12 text-success',
  '비활성': 'bg-muted text-muted-foreground',
  '잠금': 'bg-destructive/12 text-destructive',
}

export function UserPermissions() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">전체 사용자</p>
          <p className="mt-1 text-2xl font-bold">{SYSTEM_USERS.length}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">활성</p>
          <p className="mt-1 text-2xl font-bold text-success">{SYSTEM_USERS.filter((u) => u.status === '활성').length}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">비활성</p>
          <p className="mt-1 text-2xl font-bold text-muted-foreground">{SYSTEM_USERS.filter((u) => u.status === '비활성').length}명</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">잠금</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{SYSTEM_USERS.filter((u) => u.status === '잠금').length}명</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium">사용자 권한 관리</p>
          <Button size="sm">사용자 추가</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>아이디</TableHead>
                <TableHead className="min-w-[100px]">이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>부서</TableHead>
                <TableHead className="text-center">권한</TableHead>
                <TableHead>최근 로그인</TableHead>
                <TableHead className="text-center">상태</TableHead>
                <TableHead className="text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SYSTEM_USERS.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="text-muted-foreground">{u.id}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{u.dept}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', roleStyle[u.role])}>
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{u.lastLogin}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', statusStyle[u.status])}>
                      {u.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button size="xs" variant="outline">수정</Button>
                      <Button size="xs" variant="ghost" className="text-destructive">삭제</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
