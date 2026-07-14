'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { COURSES, ENROLLMENTS, educationStats } from '@/lib/data'
import { cn } from '@/lib/utils'
import { GraduationCap, BookOpen, Award, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const catStyle: Record<string, string> = {
  의무: 'bg-destructive/12 text-destructive',
  직무: 'bg-primary/12 text-primary',
  리더십: 'bg-warning/15 text-warning',
  외부: 'bg-secondary text-secondary-foreground',
}

const courseStatusStyle: Record<string, string> = {
  신청가능: 'bg-success/12 text-success',
  마감: 'bg-destructive/12 text-destructive',
  진행중: 'bg-primary/12 text-primary',
  완료: 'bg-muted text-muted-foreground',
}

export function EducationView() {
  const [tab, setTab] = useState<'courses' | 'enrollments'>('courses')
  const stats = educationStats()

  const statCards: { label: string; value: string; icon: LucideIcon; tone: string }[] = [
    { label: '전체 교육과정', value: `${stats.totalCourses}개`, icon: BookOpen, tone: 'text-primary bg-primary/10' },
    { label: '신청가능 과정', value: `${stats.openCourses}개`, icon: GraduationCap, tone: 'text-success bg-success/12' },
    { label: '의무교육 이수율', value: `${stats.mandatoryCompletion}%`, icon: Award, tone: 'text-warning bg-warning/15' },
    { label: '수강 신청 건수', value: `${stats.totalEnrolled}건`, icon: Users, tone: 'text-primary bg-primary/10' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="flex items-center gap-3 p-4">
              <div className={cn('flex size-10 items-center justify-center rounded-lg', s.tone)}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-2">
        <Button
          variant={tab === 'courses' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('courses')}
        >
          교육 과정
        </Button>
        <Button
          variant={tab === 'enrollments' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('enrollments')}
        >
          수강 현황
        </Button>
      </div>

      {tab === 'courses' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex flex-col gap-3 pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className={cn('inline-flex w-fit rounded-md px-1.5 py-0.5 text-[11px] font-medium', catStyle[c.category])}>
                      {c.category}
                    </span>
                    <p className="text-sm font-bold">{c.title}</p>
                  </div>
                  <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', courseStatusStyle[c.status])}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">강사</span>
                    <span className="font-medium">{c.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">일정</span>
                    <span className="font-medium">{c.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">시간</span>
                    <span className="font-medium">{c.duration}시간</span>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">신청 {c.enrolled}/{c.capacity}</span>
                    <span className="font-medium">{Math.round((c.enrolled / c.capacity) * 100)}%</span>
                  </div>
                  <Progress value={(c.enrolled / c.capacity) * 100} />
                </div>
                {c.status === '신청가능' && (
                  <Button size="sm" className="w-full">수강 신청</Button>
                )}
                {c.status === '마감' && (
                  <Button size="sm" variant="outline" className="w-full" disabled>대기자 등록</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-medium">수강 신청 현황 (수료율 {stats.completionRate}%)</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">교육과정</TableHead>
                  <TableHead className="min-w-[100px]">수강자</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead className="text-center">진척률</TableHead>
                  <TableHead>신청일</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ENROLLMENTS.map((en) => (
                  <TableRow key={en.id}>
                    <TableCell className="font-medium">{en.courseTitle}</TableCell>
                    <TableCell className="font-medium">{en.employeeName}</TableCell>
                    <TableCell className="text-muted-foreground">{en.dept}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={en.progress} className="w-20" />
                        <span className="text-xs tabular-nums text-muted-foreground">{en.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{en.enrolledAt}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        en.status === '수료' ? 'bg-success/12 text-success' :
                        en.status === '수강중' ? 'bg-primary/12 text-primary' :
                        en.status === '미수료' ? 'bg-destructive/12 text-destructive' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {en.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}
