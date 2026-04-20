'use client'

import { useState } from 'react'
import type { Ticket, TicketStatus } from '@/lib/types'
import { StatusBadge, PriorityBadge } from '../StatusBadge'

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface Props {
  ticket: Ticket
  onClose: () => void
  onUpdated: () => void
}

export function TicketDetail({ ticket, onClose, onUpdated }: Props) {
  const [estado, setEstado] = useState<TicketStatus>(ticket.estado)
  const [fechaComprometida, setFechaComprometida] = useState(ticket.fecha_comprometida ?? '')
  const [asignadoA, setAsignadoA] = useState(ticket.asignado_a ?? '')
  const [notas, setNotas] = useState(ticket.notas_internas ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/tickets/${ticket.ticket_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticket.ticket_id,
          estado,
          fecha_comprometida: fechaComprometida || undefined,
          asignado_a: asignadoA || undefined,
          notas_internas: notas || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      onUpdated()
      onClose()
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2,6,23,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5"
        style={{ backgroundColor: '#0F172A', border: '1px solid #334155', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {ticket.account_name && (
              <span className="text-xs font-medium" style={{ color: '#22C55E' }}>{ticket.account_name}</span>
            )}
            <h2 className="font-semibold text-base leading-snug" style={{ color: '#F8FAFC' }}>{ticket.titulo}</h2>
          </div>
          <button onClick={onClose} className="cursor-pointer" style={{ color: '#64748B' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm" style={{ color: '#94A3B8' }}>{ticket.descripcion}</p>

        <div className="flex gap-2 flex-wrap">
          <StatusBadge status={ticket.estado} />
          <PriorityBadge priority={ticket.prioridad} />
          <span className="text-xs" style={{ color: '#64748B' }}>
            Abierto: {formatDate(ticket.fecha_creacion)}
          </span>
          <span className="text-xs" style={{ color: '#64748B' }}>
            Fecha deseada: {formatDate(ticket.fecha_deseada)}
          </span>
        </div>

        <div className="h-px" style={{ backgroundColor: '#1E293B' }} />

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="estado-select">Estado</label>
            <select id="estado-select" value={estado} onChange={e => setEstado(e.target.value as TicketStatus)}>
              <option value="Abierto">Abierto</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div>
            <label htmlFor="fecha-comp">Fecha comprometida</label>
            <input
              id="fecha-comp"
              type="date"
              value={fechaComprometida}
              onChange={e => setFechaComprometida(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="asignado">Asignado a</label>
            <input
              id="asignado"
              type="text"
              placeholder="Nombre del agente"
              value={asignadoA}
              onChange={e => setAsignadoA(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="notas">Notas internas</label>
            <textarea
              id="notas"
              placeholder="Notas visibles solo para el equipo…"
              value={notas}
              onChange={e => setNotas(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {error && <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150"
            style={{ backgroundColor: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 disabled:opacity-60"
            style={{ backgroundColor: '#22C55E', color: '#020617' }}
            onMouseEnter={e => { if (!loading) (e.currentTarget.style.backgroundColor = '#16A34A') }}
            onMouseLeave={e => { if (!loading) (e.currentTarget.style.backgroundColor = '#22C55E') }}
          >
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
