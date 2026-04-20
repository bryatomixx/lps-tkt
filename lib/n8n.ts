import type { CreateTicketPayload, Ticket, UpdateTicketPayload } from './types'

const WEBHOOK_CREATE = process.env.N8N_WEBHOOK_CREATE!
const WEBHOOK_LIST   = process.env.N8N_WEBHOOK_LIST!
const WEBHOOK_UPDATE = process.env.N8N_WEBHOOK_UPDATE!

export async function createTicket(payload: CreateTicketPayload): Promise<{ success: boolean }> {
  const res = await fetch(WEBHOOK_CREATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al crear el ticket')
  return { success: true }
}

export async function listTickets(accountId: string): Promise<Ticket[]> {
  const url = new URL(WEBHOOK_LIST)
  url.searchParams.set('account_id', accountId)
  const res = await fetch(url.toString(), { next: { revalidate: 0 } })
  if (!res.ok) throw new Error('Error al obtener tickets')
  return res.json()
}

export async function listAllTickets(): Promise<Ticket[]> {
  const res = await fetch(WEBHOOK_LIST, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error('Error al obtener tickets')
  return res.json()
}

export async function updateTicket(payload: UpdateTicketPayload): Promise<{ success: boolean }> {
  const res = await fetch(WEBHOOK_UPDATE, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al actualizar el ticket')
  return { success: true }
}
