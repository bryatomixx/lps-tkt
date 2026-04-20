import type { Ticket } from '@/lib/types'

function today() {
  return new Date().toISOString().split('T')[0]
}

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

interface Props {
  tickets: Ticket[]
}

export function MetricsCards({ tickets }: Props) {
  const abiertos    = tickets.filter(t => t.estado === 'Abierto').length
  const en_progreso = tickets.filter(t => t.estado === 'En Progreso').length
  const completados = tickets.filter(t => t.estado === 'Completado').length
  const vencidos    = tickets.filter(t =>
    t.estado !== 'Completado' && t.fecha_comprometida && t.fecha_comprometida < today()
  ).length
  const sin_asignar = tickets.filter(t => t.estado !== 'Completado' && !t.asignado_a).length

  const closed = tickets.filter(t => t.estado === 'Completado' && t.fecha_cierre && t.fecha_creacion)
  const avg_cierre = closed.length
    ? Math.round(closed.reduce((acc, t) => acc + daysBetween(t.fecha_creacion, t.fecha_cierre!), 0) / closed.length)
    : null

  const metrics = [
    { label: 'Abiertos',      value: abiertos,    color: '#22C55E' },
    { label: 'En Progreso',   value: en_progreso,  color: '#F59E0B' },
    { label: 'Completados',   value: completados,  color: '#94A3B8' },
    { label: 'Vencidos',      value: vencidos,     color: '#EF4444' },
    { label: 'Sin asignar',   value: sin_asignar,  color: '#F59E0B' },
    { label: 'Cierre prom.',  value: avg_cierre != null ? `${avg_cierre}d` : '—', color: '#60A5FA' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map(m => (
        <div key={m.label}
          className="rounded-xl p-4 flex flex-col gap-1"
          style={{ backgroundColor: '#0F172A', border: '1px solid #1E293B' }}
        >
          <span className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</span>
          <span className="text-xs" style={{ color: '#64748B' }}>{m.label}</span>
        </div>
      ))}
    </div>
  )
}
