import type { NextRequest } from 'next/server'
import { listTickets, listAllTickets } from '@/lib/n8n'

export async function GET(request: NextRequest) {
  try {
    const accountId = request.nextUrl.searchParams.get('account_id')
    const tickets = accountId ? await listTickets(accountId) : await listAllTickets()
    return Response.json(tickets)
  } catch {
    return Response.json({ error: 'Error al obtener tickets' }, { status: 500 })
  }
}
