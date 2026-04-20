'use client'

import { usePathname } from 'next/navigation'
import { useGHL } from './GHLProvider'

export function Navbar() {
  const { role, navigate } = useGHL()
  const pathname = usePathname()

  const links = [
    { label: 'Nuevo Ticket', path: '/' },
    { label: 'Mis Tickets', path: '/tickets' },
    ...(role === 'internal' ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
  ]

  return (
    <nav style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #334155' }}
      className="px-4 py-3 flex items-center gap-6"
    >
      <span className="font-semibold text-sm tracking-wide" style={{ color: '#22C55E' }}>
        Support Desk
      </span>
      <div className="flex gap-1 ml-2">
        {links.map(link => {
          const active = pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer"
              style={{
                backgroundColor: active ? '#1E293B' : 'transparent',
                color: active ? '#F8FAFC' : '#94A3B8',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#F8FAFC' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
            >
              {link.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
