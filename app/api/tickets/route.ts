import type { NextRequest } from 'next/server'
import { createTicket } from '@/lib/n8n'
import type { CreateTicketPayload } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: CreateTicketPayload = await request.json()

    if (!body.account_id || !body.titulo || !body.descripcion || !body.fecha_deseada || !body.prioridad) {
      return Response.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
    }

    await createTicket(body)
    return Response.json({ success: true }, { status: 201 })
  } catch {
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
