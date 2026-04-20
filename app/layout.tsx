import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { GHLProvider } from '@/components/GHLProvider'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Support Desk',
  description: 'Sistema de tickets de soporte',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={font.className}>
        <Suspense>
          <GHLProvider>
            {children}
          </GHLProvider>
        </Suspense>
      </body>
    </html>
  )
}
