import type { CreateTicketPayload, Ticket, UpdateTicketPayload } from './types'

const WEBHOOK_CREATE = process.env.N8N_WEBHOOK_CREATE!
const WEBHOOK_LIST   = process.env.N8N_WEBHOOK_LIST!
const WEBHOOK_UPDATE = process.env.N8N_WEBHOOK_UPDATE!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTicket(d: any): Ticket {
  return {
    ticket_id:          d.ticket_id         ?? d.id             ?? '',
    account_id:         d.account_id        ?? '',
    account_name:       d.account_name,
    titulo:             d.titulo            ?? '',
    descripcion:        d.descripcion       ?? '',
    fecha_deseada:      d.fecha_deseada     ?? '',
    fecha_comprometida: d.fecha_comprometida,
    prioridad:          d.prioridad         ?? 'Media',
    estado:             d.estado            ?? 'Abierto',
    asignado_a:         d.asignado_a,
    fecha_creacion:     d.fecha_creacion    ?? d.createdTime     ?? '',
    fecha_cierre:       d.fecha_cierre,
    notas_internas:     d.notas_internas,
  }
}

// n8n puede devolver varios formatos según la configuración del workflow.
// El Code node de agregación produce [[r1,r2]] o [r1,r2].
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTickets(raw: any): Ticket[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let items: any[]

  if (Array.isArray(raw)) {
    // [[r1, r2]] → Code node wrapping (unwrap el nivel extra)
    if (raw.length > 0 && Array.isArray(raw[0])) {
      items = raw[0]
    } else {
      items = raw
    }
  } else if (Array.isArray(raw?.records)) {
    items = raw.records
  } else if (Array.isArray(raw?.json)) {
    items = raw.json
  } else if (Array.isArray(raw?.data)) {
    items = raw.data
  } else {
    // objeto único (un solo ticket)
    items = [raw]
  }

  return items.map((item: any) => {
    const d = item?.json ?? item
    return toTicket(d)
  })
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
