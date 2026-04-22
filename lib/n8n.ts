import type { CreateTicketPayload, Ticket, UpdateTicketPayload } from './types'

const WEBHOOK_CREATE = process.env.N8N_WEBHOOK_CREATE!
const WEBHOOK_LIST   = process.env.N8N_WEBHOOK_LIST!
const WEBHOOK_UPDATE = process.env.N8N_WEBHOOK_UPDATE!

// n8n/Airtable puede devolver un objeto, un array, o items con wrapping.
// También mapea createdTime → fecha_creacion.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTickets(raw: any): Ticket[] {
  const arr: unknown[] = Array.isArray(raw) ? raw : [raw]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return arr.map((item: any) => ({
    ticket_id:        item.ticket_id        ?? item.id             ?? '',
    account_id:       item.account_id       ?? '',
    account_name:     item.account_name,
    titulo:           item.titulo           ?? '',
    descripcion:      item.descripcion      ?? '',
    fecha_deseada:    item.fecha_deseada    ?? '',
    fecha_comprometida: item.fecha_comprometida,
    prioridad:        item.prioridad        ?? 'Media',
    estado:           item.estado           ?? 'Abierto',
    asignado_a:       item.asignado_a,
    fecha_creacion:   item.fecha_creacion   ?? item.createdTime    ?? '',
    fecha_cierre:     item.fecha_cierre,
    notas_internas:   item.notas_internas,
  }))
}

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
  return normalizeTickets(await res.json())
}

export async function listAllTickets(): Promise<Ticket[]> {
  const res = await fetch(WEBHOOK_LIST, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error('Error al obtener tickets')
  return normalizeTickets(await res.json())
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
