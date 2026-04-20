import type { NextRequest } from 'next/server'
import { updateTicket } from '@/lib/n8n'
import type { UpdateTicketPayload } from '@/lib/types'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateTicketPayload = await request.json()

    if (!id) {
      return Response.json({ error: 'ID de ticket requerido' }, { status: 400 })
    }

    await updateTicket({ ...body, ticket_id: id })
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Error al actualizar el ticket' }, { status: 500 })
  }
}
