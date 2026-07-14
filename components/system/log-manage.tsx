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
import { SYSTEM_LOGS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

const levelStyle: Record<string, string> = {
  '정보': 'bg-primary/12 text-primary',
  '경고': 'bg-warning/15 text-warning',
  '오류': 'bg-destructive/12 text-destructive',
}

export function LogManage() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<'all' | '정보' | '경고' | '오류'>('all')

  const filtered = useMemo(() => {
    return SYSTEM_LOGS.filter((l) => {
      if (level !== 'all' && l.level !== level) return false
      if (query) {
        const q = query.toLowerCase()
        if (!l.user.toLowerCase().includes(q) && !l.action.toLowerCase().includes(q) && !l.target.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [query, level])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">정보</p>
          <p className="mt-1 text-2xl font-bold text-primary">{SYSTEM_LOGS.filter((l) => l.level === '정보').length}건</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">경고</p>
          <p className="mt-1 text-2xl font-bold text-warning">{SYSTEM_LOGS.filter((l) => l.level === '경고').length}건</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">오류</p>
          <p className="mt-1 text-2xl font-bold text-destructive">{SYSTEM_LOGS.filter((l) => l.level === '오류').length}건</p>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="사용자, 작업, 대상 검색"
            className="pl-9"
          />
        </div>
        <Select value={level} onValueChange={(v) => setLevel(v as typeof level)}>
          <SelectTrigger className="w-32"><SelectValue placeholder="로그 레벨" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 레벨</SelectItem>
            <SelectItem value="정보">정보</SelectItem>
            <SelectItem value="경고">경고</SelectItem>
            <SelectItem value="오류">오류</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium">시스템 로그</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>로그 ID</TableHead>
                <TableHead>사용자</TableHead>
                <TableHead className="min-w-[140px]">작업</TableHead>
                <TableHead>대상</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>시간</TableHead>
                <TableHead className="text-center">레벨</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-muted-foreground">{l.id}</TableCell>
                  <TableCell className="font-medium">{l.user}</TableCell>
                  <TableCell>{l.action}</TableCell>
                  <TableCell className="text-muted-foreground">{l.target}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{l.ip}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{l.timestamp}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', levelStyle[l.level])}>
                      {l.level}
                    </span>
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
