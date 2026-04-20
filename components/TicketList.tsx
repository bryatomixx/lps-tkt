'use client'

import { useState } from 'react'
import type { Ticket, TicketStatus } from '@/lib/types'
import { TicketCard } from './TicketCard'

const STATUSES: TicketStatus[] = ['Abierto', 'En Progreso', 'Completado']

interface Props {
  tickets: Ticket[]
  showAccountName?: boolean
  onTicketClick?: (ticket: Ticket) => void
}

export function TicketList({ tickets, showAccountName = false, onTicketClick }: Props) {
  const [filter, setFilter] = useState<TicketStatus | 'Todos'>('Todos')

  const filtered = filter === 'Todos' ? tickets : tickets.filter(t => t.estado === filter)

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <svg className="w-10 h-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="#334155" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p style={{ color: '#94A3B8' }}>No hay tickets aún.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {(['Todos', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors duration-150"
            style={{
              backgroundColor: filter === s ? '#22C55E' : '#1E293B',
              color: filter === s ? '#020617' : '#94A3B8',
              border: '1px solid',
              borderColor: filter === s ? '#22C55E' : '#334155',
            }}
          >
            {s} {s === 'Todos' ? `(${tickets.length})` : `(${tickets.filter(t => t.estado === s).length})`}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(ticket => (
          <TicketCard
            key={ticket.ticket_id}
            ticket={ticket}
            showAccountName={showAccountName}
            onClick={onTicketClick ? () => onTicketClick(ticket) : undefined}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: '#64748B' }}>
            No hay tickets con estado "{filter}".
          </p>
        )}
      </div>
    </div>
  )
}
