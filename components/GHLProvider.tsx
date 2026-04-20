'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { UserRole } from '@/lib/types'

interface GHLContext {
  accountId: string
  role: UserRole
  navigate: (path: string) => void
}

const GHL = createContext<GHLContext>({
  accountId: '',
  role: 'client',
  navigate: () => {},
})

export function GHLProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [accountId, setAccountId] = useState('')
  const [role, setRole] = useState<UserRole>('client')

  useEffect(() => {
    const paramAccount = searchParams.get('account_id')
    const paramRole = searchParams.get('role') as UserRole | null

    if (paramAccount) {
      sessionStorage.setItem('ghl_account_id', paramAccount)
      setAccountId(paramAccount)
    } else {
      setAccountId(sessionStorage.getItem('ghl_account_id') ?? '')
    }

    if (paramRole === 'internal' || paramRole === 'client') {
      sessionStorage.setItem('ghl_role', paramRole)
      setRole(paramRole)
    } else {
      const stored = sessionStorage.getItem('ghl_role') as UserRole | null
      setRole(stored ?? 'client')
    }
  }, [searchParams])

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

  return <GHL.Provider value={{ accountId, role, navigate }}>{children}</GHL.Provider>
}

export function useGHL() {
  return useContext(GHL)
}
