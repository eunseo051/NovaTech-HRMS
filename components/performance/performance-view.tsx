'use client'

import { useSearchParams } from 'next/navigation'
import { EvaluationList } from './evaluation-list'
import { KpiView } from './kpi-view'
import { ResultView } from './result-view'
import { PromotionView } from './promotion-view'

export function PerformanceView() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') ?? 'evaluation'

  if (view === 'kpi') return <KpiView />
  if (view === 'result') return <ResultView />
  if (view === 'promotion') return <PromotionView />
  return <EvaluationList />
}
