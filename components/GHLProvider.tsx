'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { UserRole } from '@/lib/types'

interface GHLContext {
  accountId: string
  accountName: string
  role: UserRole
  navigate: (path: string) => void
}

const GHL = createContext<GHLContext>({
  accountId: '',
  accountName: '',
  role: 'client',
  navigate: () => {},
})

export function GHLProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [accountId, setAccountId] = useState('')
  const [accountName, setAccountName] = useState('')
  const [role, setRole] = useState<UserRole>('client')

  useEffect(() => {
    // GHL puede enviar el ID como account_id o location_id en los query params
    const paramAccount =
      searchParams.get('account_id') ||
      searchParams.get('location_id') ||
      searchParams.get('locationId')
    const paramName = searchParams.get('account_name')
    const paramRole = searchParams.get('role') as UserRole | null

    if (paramAccount) {
      sessionStorage.setItem('ghl_account_id', paramAccount)
      setAccountId(paramAccount)
    } else {
      // Fallback: extraer location ID del referrer de GHL
      // La URL de GHL contiene /location/<id>/ cuando se abre desde un custom menu
      const referrerMatch = document.referrer.match(/\/location\/([A-Za-z0-9]+)/)
      const referrerId = referrerMatch?.[1] ?? ''
      const stored = sessionStorage.getItem('ghl_account_id') ?? ''
      const resolved = referrerId || stored
      if (resolved) {
        sessionStorage.setItem('ghl_account_id', resolved)
        setAccountId(resolved)
      }
    }

    if (paramName) {
      sessionStorage.setItem('ghl_account_name', paramName)
      setAccountName(paramName)
    } else {
      setAccountName(sessionStorage.getItem('ghl_account_name') ?? '')
    }

    if (paramRole === 'internal' || paramRole === 'client') {
      sessionStorage.setItem('ghl_role', paramRole)
      setRole(paramRole)
    } else {
      const stored = sessionStorage.getItem('ghl_role') as UserRole | null
      setRole(stored ?? 'client')
    }
  }, [searchParams])

  // GHL también puede enviar el locationId via postMessage cuando embebe en iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data
      if (!data || typeof data !== 'object') return

      const locationId: string | undefined =
        data.locationId ||
        data.location_id ||
        data.location?.id ||
        data.activeLocation ||
        data.data?.locationId ||
        data.data?.location_id

      if (locationId && !sessionStorage.getItem('ghl_account_id')) {
        sessionStorage.setItem('ghl_account_id', locationId)
        setAccountId(locationId)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  function navigate(path: string) {
    const id = accountId || sessionStorage.getItem('ghl_account_id') || ''
    const r = role || sessionStorage.getItem('ghl_role') || 'client'
    const sep = path.includes('?') ? '&' : '?'
    router.push(`${path}${sep}account_id=${id}&role=${r}`)
  }

  // Redirect dashboard access if not internal
  useEffect(() => {
    if (pathname === '/dashboard' && role === 'client') {
      navigate('/')
    }
  }, [pathname, role])

  return <GHL.Provider value={{ accountId, accountName, role, navigate }}>{children}</GHL.Provider>
}

export function useGHL() {
  return useContext(GHL)
}
