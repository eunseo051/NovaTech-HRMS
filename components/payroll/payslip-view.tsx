'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ACTIVE_EMPLOYEES, KRW } from '@/lib/data'
import { calcPayroll, PAY_LABELS } from '@/lib/payroll'
import { Search } from 'lucide-react'

export function PayslipView() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(ACTIVE_EMPLOYEES[0].id)

  const filtered = useMemo(() => {
    return ACTIVE_EMPLOYEES.filter((e) => {
      if (!query) return true
      const q = query.toLowerCase()
      return e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
    })
  }, [query])

  const selected = ACTIVE_EMPLOYEES.find((e) => e.id === selectedId) ?? ACTIVE_EMPLOYEES[0]
  const pay = calcPayroll(selected)

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Employee list */}
      <Card className="h-fit overflow-hidden p-0">
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 검색"
              className="pl-9"
            />
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {filtered.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              className={`flex w-full items-center gap-3 border-b border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/60 ${e.id === selectedId ? 'bg-primary/8' : ''}`}
            >
              <Avatar className="size-8">
                <AvatarImage src={e.photoUrl} alt={e.name} />
                <AvatarFallback className="text-xs">{e.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{e.name}</span>
                <span className="text-xs text-muted-foreground">{e.dept} · {e.position}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Payslip detail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">급여명세서 · 2026년 7월</CardTitle>
            <span className="text-sm text-muted-foreground">{selected.name} ({selected.id})</span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">지급총액</p>
              <p className="mt-1 text-lg font-bold">{KRW(pay.grossPay)}원</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">공제합계</p>
              <p className="mt-1 text-lg font-bold text-destructive">{KRW(pay.totalDeduction)}원</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground">실지급액</p>
              <p className="mt-1 text-lg font-bold text-primary">{KRW(pay.netPay)}원</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-success">지급 항목</p>
              <Separator />
              {pay.earnings.map((it) => (
                <div key={it.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{PAY_LABELS[it.key] ?? it.key}</span>
                  <span className="tabular-nums">{KRW(it.amount)}원</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>지급 합계</span>
                <span className="tabular-nums">{KRW(pay.grossPay)}원</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-destructive">공제 항목</p>
              <Separator />
              {pay.deductions.map((it) => (
                <div key={it.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{PAY_LABELS[it.key] ?? it.key}</span>
                  <span className="tabular-nums">{KRW(it.amount)}원</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span>공제 합계</span>
                <span className="tabular-nums">{KRW(pay.totalDeduction)}원</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <p>· 성과등급 {selected.grade} · 성과급률 {pay.bonusRatePct}%</p>
            <p>· 본 명세서는 2026년 7월분 급여 명세서입니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
