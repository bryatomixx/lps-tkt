import type { Ticket } from '@/lib/types'
import { StatusBadge, PriorityBadge } from './StatusBadge'

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface Props {
  ticket: Ticket
  showAccountName?: boolean
  onClick?: () => void
}

export function TicketCard({ ticket, showAccountName = false, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 flex flex-col gap-3 transition-colors duration-150"
      style={{
        backgroundColor: '#0F172A',
        border: '1px solid #1E293B',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.borderColor = '#334155' }}
      onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLElement).style.borderColor = '#1E293B' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          {showAccountName && ticket.account_name && (
            <span className="text-xs font-medium" style={{ color: '#22C55E' }}>{ticket.account_name}</span>
          )}
          <h3 className="font-semibold text-sm leading-snug truncate" style={{ color: '#F8FAFC' }}>
            {ticket.titulo}
          </h3>
          <p className="text-xs line-clamp-2" style={{ color: '#94A3B8' }}>{ticket.descripcion}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={ticket.estado} />
          <PriorityBadge priority={ticket.prioridad} />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: '#64748B' }}>
        <span>Abierto: <span style={{ color: '#94A3B8' }}>{formatDate(ticket.fecha_creacion)}</span></span>
        <span>Fecha deseada: <span style={{ color: '#94A3B8' }}>{formatDate(ticket.fecha_deseada)}</span></span>
        {ticket.fecha_comprometida && (
          <span>Comprometida: <span style={{ color: '#22C55E' }}>{formatDate(ticket.fecha_comprometida)}</span></span>
        )}
        {ticket.asignado_a && (
          <span>Asignado: <span style={{ color: '#94A3B8' }}>{ticket.asignado_a}</span></span>
        )}
      </div>
    </div>
  )
}
