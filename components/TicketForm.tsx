'use client'

import { useState } from 'react'
import type { TicketPriority } from '@/lib/types'

interface Props {
  accountId: string
}

export function TicketForm({ accountId }: Props) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaDeseada, setFechaDeseada] = useState('')
  const [prioridad, setPrioridad] = useState<TicketPriority>('Media')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accountId) {
      setError('No se pudo identificar la cuenta. Recarga la página.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, titulo, descripcion, fecha_deseada: fechaDeseada, prioridad }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setTitulo('')
      setDescripcion('')
      setFechaDeseada('')
      setPrioridad('Media')
    } catch {
      setError('Hubo un error al enviar el ticket. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#052e16' }}>
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold" style={{ color: '#F8FAFC' }}>Ticket enviado</h2>
        <p style={{ color: '#94A3B8' }}>Lo revisaremos y nos pondremos en contacto contigo pronto.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150"
          style={{ backgroundColor: '#22C55E', color: '#020617' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#16A34A')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#22C55E')}
        >
          Abrir otro ticket
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="titulo">¿Qué necesitas?</label>
        <input
          id="titulo"
          type="text"
          placeholder="Título corto del ticket"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
          maxLength={120}
        />
      </div>

      <div>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          placeholder="Explica con detalle qué necesitas o cuál es el problema…"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          required
          rows={4}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha">Fecha deseada</label>
          <input
            id="fecha"
            type="date"
            value={fechaDeseada}
            onChange={e => setFechaDeseada(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={e => setPrioridad(e.target.value as TicketPriority)}
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full py-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#22C55E', color: '#020617' }}
        onMouseEnter={e => { if (!loading) (e.currentTarget.style.backgroundColor = '#16A34A') }}
        onMouseLeave={e => { if (!loading) (e.currentTarget.style.backgroundColor = '#22C55E') }}
      >
        {loading ? 'Enviando…' : 'Enviar ticket'}
      </button>
    </form>
  )
}
