'use client'

import { useMemo, useState } from 'react'
import type { Ticket } from '@/lib/types'

function today() {
  return new Date().toISOString().split('T')[0]
}

interface Props {
  tickets: Ticket[]
  onAccountClick: (accountId: string) => void
}

export function AccountsTable({ tickets, onAccountClick }: Props) {
  const [sort, setSort] = useState<'abiertos' | 'total' | 'vencidos'>('abiertos')

  const accounts = useMemo(() => {
    const map = new Map<string, { name: string; total: number; abiertos: number; en_progreso: number; completados: number; vencidos: number }>()
    for (const t of tickets) {
      const key = t.account_id
      if (!map.has(key)) {
        map.set(key, { name: t.account_name ?? t.account_id, total: 0, abiertos: 0, en_progreso: 0, completados: 0, vencidos: 0 })
      }
      const a = map.get(key)!
      a.total++
      if (t.estado === 'Abierto') a.abiertos++
      if (t.estado === 'En Progreso') a.en_progreso++
      if (t.estado === 'Completado') a.completados++
      if (t.estado !== 'Completado' && t.fecha_comprometida && t.fecha_comprometida < today()) a.vencidos++
    }
    return [...map.entries()]
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b[sort] - a[sort])
  }, [tickets, sort])

  const cols: { key: typeof sort; label: string }[] = [
    { key: 'abiertos', label: 'Abiertos' },
    { key: 'total',    label: 'Total' },
    { key: 'vencidos', label: 'Vencidos' },
  ]

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E293B' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #1E293B' }}>
            <th className="text-left px-4 py-3 font-semibold" style={{ color: '#94A3B8' }}>Cuenta</th>
            {cols.map(c => (
              <th key={c.key}
                className="text-right px-4 py-3 font-semibold cursor-pointer select-none"
                style={{ color: sort === c.key ? '#22C55E' : '#94A3B8' }}
                onClick={() => setSort(c.key)}
              >
                {c.label} {sort === c.key ? '↓' : ''}
              </th>
            ))}
            <th className="text-right px-4 py-3 font-semibold" style={{ color: '#94A3B8' }}>En Progreso</th>
            <th className="text-right px-4 py-3 font-semibold" style={{ color: '#94A3B8' }}>Completados</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a, i) => (
            <tr key={a.id}
              onClick={() => onAccountClick(a.id)}
              className="cursor-pointer transition-colors duration-100"
              style={{ backgroundColor: i % 2 === 0 ? '#020617' : '#030c1a', borderBottom: '1px solid #0F172A' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0F172A')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#020617' : '#030c1a')}
            >
              <td className="px-4 py-3 font-medium" style={{ color: '#F8FAFC' }}>{a.name}</td>
              <td className="px-4 py-3 text-right" style={{ color: '#22C55E' }}>{a.abiertos}</td>
              <td className="px-4 py-3 text-right" style={{ color: '#94A3B8' }}>{a.total}</td>
              <td className="px-4 py-3 text-right" style={{ color: a.vencidos > 0 ? '#EF4444' : '#64748B' }}>{a.vencidos}</td>
              <td className="px-4 py-3 text-right" style={{ color: '#F59E0B' }}>{a.en_progreso}</td>
              <td className="px-4 py-3 text-right" style={{ color: '#64748B' }}>{a.completados}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
