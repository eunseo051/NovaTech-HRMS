'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EMPLOYEES, KRW } from '@/lib/data'
import { calcPayslip } from '@/lib/payroll'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  '급여 계산',
  '연차 규정',
  '직원 검색',
  '인사 규정',
  '사규 검색',
  '휴가 추천',
]

function answer(q: string): string {
  const text = q.trim()
  if (/급여|월급|연봉|실수령/.test(text)) {
    const emp = EMPLOYEES[0]
    const p = calcPayslip(emp)
    return `급여 계산 안내입니다. 예시로 ${emp.name}님(${emp.position})의 이번 달 급여는 지급총액 ${KRW(
      p.grossTotal,
    )}원, 공제 ${KRW(p.deductionTotal)}원, 실수령액 약 ${KRW(
      p.netPay,
    )}원입니다. 급여 관리 메뉴에서 직원별 명세서를 확인하실 수 있어요.`
  }
  if (/연차|휴가/.test(text)) {
    return '연차 규정: 입사 1년차 15일이 부여되며, 이후 매년 1일씩 추가되어 최대 25일까지 사용할 수 있습니다. 반차는 0.5일로 차감되며, 병가·경조사 휴가는 별도 규정을 따릅니다. 휴가 관리 > 휴가 신청에서 신청 가능합니다.'
  }
  if (/직원|검색|인원/.test(text)) {
    return `현재 재직 인원은 총 ${
      EMPLOYEES.filter((e) => e.status === '재직중').length
    }명입니다. 직원 관리 메뉴에서 부서·직급·재직상태로 필터링하여 검색할 수 있습니다. 특정 직원 이름을 알려주시면 상세 정보를 안내해 드릴게요.`
  }
  if (/인사|규정|사규|정책/.test(text)) {
    return '사규 안내: 근무시간은 09:00~18:00이며 08~10시 사이 유연출근이 가능합니다. 개발·디자인 직군은 주 2회 재택근무가 가능합니다. 성과등급은 S/A/B/C로 구분되며 성과급은 S 10%, A 7%, B 5%가 지급됩니다.'
  }
  const found = EMPLOYEES.find((e) => text.includes(e.name))
  if (found) {
    return `${found.name}님은 ${found.dept}팀 ${found.position}이며, 입사일은 ${found.hireDate}, 성과등급 ${found.grade}, 잔여 연차는 ${found.remainingLeave}일입니다.`
  }
  return '무엇을 도와드릴까요? 급여 계산, 연차 규정, 직원 검색, 인사 규정 등에 대해 물어보실 수 있어요. 아래 추천 질문을 눌러보셔도 됩니다.'
}

export function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요! NovaTech AI 인사 도우미입니다. 급여, 연차, 사규, 직원 정보 등 궁금한 점을 물어보세요.',
    },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const send = (q: string) => {
    const text = q.trim()
    if (!text) return
    setMessages((m) => [...m, { role: 'user', content: text }, { role: 'assistant', content: answer(text) }])
    setInput('')
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI 인사 도우미 열기"
        className={cn(
          'fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95',
        )}
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3.5 text-primary-foreground">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15">
              <Sparkles className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold">AI 인사 도우미</p>
              <p className="text-[11px] text-primary-foreground/80">NovaTech HR Assistant</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-bl-md bg-muted text-foreground',
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    send(input)
                  }
                }}
                placeholder="메시지를 입력하세요..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button type="submit" size="icon" className="size-8 shrink-0 rounded-lg">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
