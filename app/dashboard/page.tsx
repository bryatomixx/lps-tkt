'use client'

import { useEffect, useState, useCallback } from 'react'
import { useGHL } from '@/components/GHLProvider'
import { Navbar } from '@/components/Navbar'
import { TicketList } from '@/components/TicketList'
import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { AccountsTable } from '@/components/dashboard/AccountsTable'
import { TicketDetail } from '@/components/dashboard/TicketDetail'
import type { Ticket } from '@/lib/types'

type View = 'overview' | 'account'

export default function DashboardPage() {
  const { role } = useGHL()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState<View>('overview')
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tickets/list')
      if (!res.ok) throw new Error()
      setTickets(await res.json())
    } catch {
      setError('No se pudieron cargar los tickets.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (role === 'client') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#020617' }}>
        <p style={{ color: '#64748B' }}>Acceso no autorizado.</p>
      </div>
    )
  }

  const accountTickets = selectedAccount ? tickets.filter(t => t.account_id === selectedAccount) : []
  const accountName = accountTickets[0]?.account_name ?? selectedAccount

  function openAccount(accountId: string) {
    setSelectedAccount(accountId)
    setView('account')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020617' }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {view === 'account' && selectedAccount ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setView('overview')}
                className="flex items-center gap-1.5 text-sm cursor-pointer transition-colors duration-150"
                style={{ color: '#94A3B8' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Dashboard
              </button>
              <span style={{ color: '#334155' }}>/</span>
              <span className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{accountName}</span>
            </div>
            <TicketList
              tickets={accountTickets}
              onTicketClick={setSelectedTicket}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold" style={{ color: '#F8FAFC' }}>Dashboard</h1>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>Todos los tickets de todas las cuentas.</p>
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
                <div className="w-6 h-6 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#22C55E', borderTopColor: 'transparent' }} />
              </div>
            )}
            {!loading && error && (
              <p className="text-sm text-center py-8" style={{ color: '#EF4444' }}>{error}</p>
            )}
            {!loading && !error && (
              <div className="flex flex-col gap-6">
                <MetricsCards tickets={tickets} />

                <div>
                  <h2 className="text-sm font-semibold mb-3" style={{ color: '#94A3B8' }}>
                    CUENTAS — click para ver sus tickets
                  </h2>
                  <AccountsTable tickets={tickets} onAccountClick={openAccount} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold mb-3" style={{ color: '#94A3B8' }}>TODOS LOS TICKETS</h2>
                  <TicketList
                    tickets={tickets}
                    showAccountName
                    onTicketClick={setSelectedTicket}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdated={load}
        />
      )}
    </div>
  )
}
