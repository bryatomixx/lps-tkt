'use client'

import { useEffect, useState } from 'react'
import { useGHL } from '@/components/GHLProvider'
import { Navbar } from '@/components/Navbar'
import { TicketList } from '@/components/TicketList'
import type { Ticket } from '@/lib/types'

export default function TicketsPage() {
  const { accountId } = useGHL()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    if (!accountId) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/tickets/list?account_id=${accountId}`)
      if (!res.ok) throw new Error()
      setTickets(await res.json())
    } catch {
      setError('No se pudieron cargar los tickets. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [accountId])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020617' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#F8FAFC' }}>Mis tickets</h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>Historial de tus solicitudes de soporte.</p>
          </div>
          <button
            onClick={load}
            className="p-2 rounded-lg cursor-pointer transition-colors duration-150"
            style={{ backgroundColor: '#1E293B', color: '#94A3B8' }}
            aria-label="Refrescar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#22C55E', borderTopColor: 'transparent' }} />
          </div>
        )}
        {!loading && error && (
          <p className="text-sm text-center py-8" style={{ color: '#EF4444' }}>{error}</p>
        )}
        {!loading && !error && <TicketList tickets={tickets} />}
      </main>
    </div>
  )
}
