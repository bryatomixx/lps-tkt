'use client'

import { useState } from 'react'
import type { TicketPriority } from '@/lib/types'
import { useGHL } from './GHLProvider'

interface Props {
  accountId: string
}

export function TicketForm({ accountId }: Props) {
  const { navigate } = useGHL()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaDeseada, setFechaDeseada] = useState('')
  const [prioridad, setPrioridad] = useState<TicketPriority>('Media')
  const [loading, setLoading] = useState(false)
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
      navigate('/tickets')
    } catch {
      setError('Hubo un error al enviar el ticket. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
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
