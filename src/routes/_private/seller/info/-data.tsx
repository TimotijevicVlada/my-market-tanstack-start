import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { Seller } from '@/api/sellers/types'

export const statusConfig: Record<
  Seller['status'],
  { label: string; icon: React.ReactNode; className: string }
> = {
  pending: {
    label: 'Na čekanju',
    icon: <Clock className="h-3.5 w-3.5" />,
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  approved: {
    label: 'Verifikovan',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  rejected: {
    label: 'Odbijen',
    icon: <XCircle className="h-3.5 w-3.5" />,
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
}
