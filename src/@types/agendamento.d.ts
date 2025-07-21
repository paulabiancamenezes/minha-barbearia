export type Agendamento = {
  id: number
  nome: string
  email: string
  telefone: string
  servicoDesejado: string
  dataHora: string
  status: Status
}

export type Status = 'Aguardando' | 'Confirmado' | 'Recusado';