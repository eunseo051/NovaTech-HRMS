'use client'

import { useSearchParams } from 'next/navigation'
import { UserPermissions } from './user-permissions'
import { PolicyUpload } from './policy-upload'
import { OrgManage } from './org-manage'
import { LogManage } from './log-manage'

export function SystemView() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') ?? 'users'

  if (view === 'policy') return <PolicyUpload />
  if (view === 'org') return <OrgManage />
  if (view === 'log') return <LogManage />
  return <UserPermissions />
}
