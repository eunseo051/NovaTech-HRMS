'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Boxes } from 'lucide-react'
import { NAV, CURRENT_USER } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const initialOpen = () => {
    const active = NAV.find((n) => n.children && pathname.startsWith(n.href))
    return active ? { [active.label]: true } : {}
  }
  const [open, setOpen] = useState<Record<string, boolean>>(initialOpen)

  const toggle = (label: string) =>
    setOpen((o) => ({ ...o, [label]: !o[label] }))

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Boxes className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">NovaTech</p>
          <p className="text-[11px] text-muted-foreground">인사관리 시스템</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const hasChildren = !!item.children?.length
            const isOpen = open[item.label]

            return (
              <li key={item.label}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.adminOnly && (
                      <span className="ml-auto rounded-md bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                        관리자
                      </span>
                    )}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggle(item.label)}
                      aria-label={`${item.label} 하위 메뉴`}
                      className="mr-1 flex size-7 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent/60"
                    >
                      <ChevronRight
                        className={cn(
                          'size-4 transition-transform',
                          isOpen && 'rotate-90',
                        )}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && isOpen && (
                  <ul className="mb-1 ml-[26px] mt-0.5 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                    {item.children!.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onNavigate}
                          className="block rounded-md px-3 py-1.5 text-[13px] text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {CURRENT_USER.name.slice(0, 1)}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">{CURRENT_USER.name}</p>
            <p className="truncate text-xs text-muted-foreground">{CURRENT_USER.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
      <div className="sticky top-0 h-svh">
        <SidebarContent />
      </div>
    </aside>
  )
}
