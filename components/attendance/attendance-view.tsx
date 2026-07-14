'use client'

import { useSearchParams } from 'next/navigation'
import { AttendanceStatus } from './attendance-status'
import { WorkHours } from './work-hours'
import { Overtime } from './overtime'
import { LateEarly } from './late-early'

export function AttendanceView() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') ?? 'status'

  if (view === 'hours') return <WorkHours />
  if (view === 'overtime') return <Overtime />
  if (view === 'late') return <LateEarly />
  return <AttendanceStatus />
}
