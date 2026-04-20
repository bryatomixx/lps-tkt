export type TicketStatus = 'Abierto' | 'En Progreso' | 'Completado'
export type TicketPriority = 'Alta' | 'Media' | 'Baja'
export type UserRole = 'client' | 'internal'

export interface Ticket {
  ticket_id: string
  account_id: string
  account_name?: string
  titulo: string
  descripcion: string
  fecha_deseada: string
  fecha_comprometida?: string
  prioridad: TicketPriority
  estado: TicketStatus
  asignado_a?: string
  fecha_creacion: string
  fecha_cierre?: string
  notas_internas?: string
}

export interface AccountSummary {
  account_id: string
  account_name: string
  total: number
  abiertos: number
  en_progreso: number
  completados: number
  vencidos: number
  tiempo_promedio_cierre_dias?: number
}

export interface CreateTicketPayload {
  account_id: string
  titulo: string
  descripcion: string
  fecha_deseada: string
  prioridad: TicketPriority
}

export interface UpdateTicketPayload {
  ticket_id: string
  estado?: TicketStatus
  fecha_comprometida?: string
  asignado_a?: string
  notas_internas?: string
}
