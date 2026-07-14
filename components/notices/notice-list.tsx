'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { NOTICES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Pin, Search, ChevronDown, ChevronUp } from 'lucide-react'

const catTone: Record<string, string> = {
  전사: 'bg-primary/12 text-primary',
  인사: 'bg-success/12 text-success',
  복지: 'bg-warning/15 text-warning',
  시스템: 'bg-muted text-muted-foreground',
}

export function NoticeList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | string>('all')
  const [expanded, setExpanded] = useState<string | null>(NOTICES[0]?.id ?? null)

  const filtered = NOTICES.filter((n) => {
    if (category !== 'all' && n.category !== category) return false
    if (query) {
      const q = query.toLowerCase()
      if (!n.title.toLowerCase().includes(q) && !n.content.toLowerCase().includes(q)) return false
    }
    return true
  })

  const pinned = filtered.filter((n) => n.pinned)
  const unpinned = filtered.filter((n) => !n.pinned)
  const sorted = [...pinned, ...unpinned]

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 내용 검색"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-32"><SelectValue placeholder="분류" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 분류</SelectItem>
            <SelectItem value="전사">전사</SelectItem>
            <SelectItem value="인사">인사</SelectItem>
            <SelectItem value="복지">복지</SelectItem>
            <SelectItem value="시스템">시스템</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="flex flex-col gap-3">
        {sorted.map((n) => {
          const isOpen = expanded === n.id
          return (
            <Card key={n.id} className={cn('overflow-hidden', n.pinned && 'ring-1 ring-primary/20')}>
              <button
                onClick={() => setExpanded(isOpen ? null : n.id)}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/40"
              >
                {n.pinned && <Pin className="size-4 shrink-0 text-destructive" />}
                <span className={cn('inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium', catTone[n.category])}>
                  {n.category}
                </span>
                <span className={cn('flex-1 truncate text-sm', n.pinned ? 'font-bold' : 'font-medium')}>
                  {n.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{n.date}</span>
                {isOpen ? <ChevronUp className="size-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="size-4 shrink-0 text-muted-foreground" />}
              </button>
              {isOpen && (
                <CardContent className="border-t border-border pt-4 text-sm text-muted-foreground text-pretty">
                  {n.content}
                </CardContent>
              )}
            </Card>
          )
        })}
        {sorted.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              검색 결과가 없습니다.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
