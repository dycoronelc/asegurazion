import { ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'

import { cn } from '../../lib/utils'

const logoCandidates = ['/logo.svg', '/logo.png', '/logo.webp', '/logo.jpg', '/logo.jpeg']

export function Brand({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  const [candidateIndex, setCandidateIndex] = useState(0)
  const currentSource = useMemo(() => logoCandidates[candidateIndex], [candidateIndex])
  const hasImage = candidateIndex < logoCandidates.length

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-brand-500 text-white shadow-glow">
        {hasImage ? (
          <img
            src={currentSource}
            alt="AseguraZion"
            className="h-full w-full object-cover"
            onError={() => setCandidateIndex((value) => value + 1)}
          />
        ) : (
          <ShieldCheck className="h-5 w-5" />
        )}
      </div>

      {!compact ? (
        <div>
          <div className="text-base font-semibold leading-none tracking-tight text-slate-900">
            AseguraZion
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.24em] text-brand-500">
            CRM de Seguros
          </div>
        </div>
      ) : null}
    </div>
  )
}
