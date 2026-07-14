'use client'

import { useSearchParams } from 'next/navigation'
import { LeaveStatus } from './leave-status'
import { LeaveApply } from './leave-apply'
import { LeaveApprove } from './leave-approve'
import { LeaveHistory } from './leave-history'

export function LeaveView() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') ?? 'status'

  if (view === 'apply') return <LeaveApply />
  if (view === 'approve') return <LeaveApprove />
  if (view === 'history') return <LeaveHistory />
  return <LeaveStatus />
}
