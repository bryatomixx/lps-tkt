import type { TicketStatus, TicketPriority } from '@/lib/types'

const statusColors: Record<TicketStatus, { bg: string; text: string }> = {
  'Abierto':     { bg: '#052e16', text: '#22C55E' },
  'En Progreso': { bg: '#451a03', text: '#F59E0B' },
  'Completado':  { bg: '#1e293b', text: '#94A3B8' },
}

const priorityColors: Record<TicketPriority, { bg: string; text: string }> = {
  'Alta':  { bg: '#450a0a', text: '#EF4444' },
  'Media': { bg: '#451a03', text: '#F59E0B' },
  'Baja':  { bg: '#0f2027', text: '#60A5FA' },
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  const c = statusColors[status]
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const c = priorityColors[priority]
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {priority}
    </span>
  )
}
