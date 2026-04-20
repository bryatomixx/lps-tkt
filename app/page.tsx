'use client'

import { useGHL } from '@/components/GHLProvider'
import { Navbar } from '@/components/Navbar'
import { TicketForm } from '@/components/TicketForm'

export default function NewTicketPage() {
  const { accountId } = useGHL()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020617' }}>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: '#F8FAFC' }}>Nuevo ticket</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Cuéntanos qué necesitas y nos pondremos en contacto contigo.
          </p>
        </div>
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B' }}>
          <TicketForm accountId={accountId} />
        </div>
      </main>
    </div>
  )
}
