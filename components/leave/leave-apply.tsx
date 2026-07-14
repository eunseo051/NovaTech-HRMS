'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { CURRENT_USER } from '@/lib/nav'

export function LeaveApply() {
  const [type, setType] = useState('연차')
  const [startDate, setStartDate] = useState('2026-07-20')
  const [endDate, setEndDate] = useState('2026-07-20')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">휴가 신청</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>신청자</Label>
              <div className="flex h-8 items-center rounded-lg border border-input bg-muted px-2.5 text-sm">
                  {CURRENT_USER.name} ({CURRENT_USER.role})
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>휴가 종류</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="연차">연차</SelectItem>
                    <SelectItem value="반차">반차</SelectItem>
                    <SelectItem value="병가">병가</SelectItem>
                    <SelectItem value="경조사">경조사</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>시작일</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>종료일</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>사유</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="휴가 사유를 입력하세요..."
                className="min-h-20"
              />
            </div>
            <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              <p>· 연차는 입사 1년차 15일 부여, 매년 1일 추가 (최대 25일)</p>
              <p>· 반차는 0.5일로 차감되며, 오전/오후 중 선택 가능</p>
              <p>· 병가는 3일 이상 시 진단서 제출 필요</p>
              <p>· 팀장 승인 후 확정됩니다</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">취소</Button>
              <Button type="submit">신청하기</Button>
            </div>
            {submitted && (
              <p className="rounded-lg bg-success/12 px-3 py-2 text-sm text-success">
                휴가 신청이 완료되었습니다. 팀장 승인을 기다려주세요.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
