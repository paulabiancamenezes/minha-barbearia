'use client'

import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Agendamento } from '@/@types/agendamento'
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

async function buscarAgendamentos() {
  try {
    const response = await axios.get('/api/agendamentos')
    return response.data // Lista de agendamentos
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    throw error
  }
}

export default function ListaAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);

  function showAlert(type: 'success' | 'error', message: string) {
    setAlert({ type, message });
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    alertTimeout.current = setTimeout(() => setAlert(null), 3000);
  }

  useEffect(() => {
    buscarAgendamentos()
      .then(setAgendamentos)
      .catch(() => showAlert('error', 'Erro ao carregar agendamentos'))
      .finally(() => setLoading(false))
    return () => {
      if (alertTimeout.current) clearTimeout(alertTimeout.current);
    }
  }, [])

  if (loading) return <p className="text-white text-center">Carregando...</p>

  return (
    <div className="flex items-center flex-col text-zinc-300 p-16 ">
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          zIndex: 9999,
          minWidth: 280,
          transition: 'transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s cubic-bezier(.4,0,.2,1)',
          transform: alert ? 'translateY(0)' : 'translateY(-40px)',
          opacity: alert ? 1 : 0,
          pointerEvents: alert ? 'auto' : 'none',
        }}
      >
        {alert && (
          <Alert className={alert.type === 'error' ? 'bg-zinc-900 text-red shadow-lg' : 'bg-zinc-900 text-white shadow-lg'}>
            <AlertTitle>{alert.type === 'error' ? 'Erro' : 'Sucesso'}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
      </div>
 
          <Table> 
            <TableCaption>Consulte seus agendamentos</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-zinc-800">
                <TableHead className="w-[100] text-zinc-300">Nome</TableHead>
                <TableHead className="text-zinc-300">Telefone</TableHead>
                <TableHead className="text-zinc-300">Serviço desejado</TableHead>
                <TableHead className="text-zinc-300">Data e Horário</TableHead>
                <TableHead className="text-zinc-300">Visualizar</TableHead>
                <TableHead className="text-right text-zinc-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agendamentos.map((a) => (
              <TableRow key={a.id} className="hover:bg-zinc-800">
                <TableCell className="font-medium">{a.nome}</TableCell>
                <TableCell>{a.telefone}</TableCell>
                <TableCell>{a.servicoDesejado}</TableCell>
                <TableCell>{new Date(a.dataHora).toLocaleString()}</TableCell>
                <TableCell className="flex">
                  <Sheet>
                    <SheetTrigger>
                        <Button className="cursor-pointer bg-zinc-600">
                          Ações
                        </Button>
                      </SheetTrigger>
                    <SheetContent className="w-[500px] sm:w-[600px] p-0 bg-zinc-900 text-white border-none">
                      <SheetHeader>
                        <SheetTitle className="text-white">Detalhes do agendamento</SheetTitle>
                        <SheetDescription className="mb-4">
                          Visualize informações do agendamento, recuse-o ou aceite.
                        </SheetDescription>
                        <p>Nome: {a.nome}</p>
                        <p>Telefone: {a.telefone}</p>
                        <p>Email: {a.email}</p>
                        <p>Serviço Desejado: {a.servicoDesejado}</p>
                        <p>Data e Horário: {new Date(a.dataHora).toLocaleString()}</p>
                        <p className="text-blue">Status atual: {a.status}</p>
                      </SheetHeader>
                      <SheetFooter>
                        <SheetDescription className="">
                          Após mudar o status essa ação não poderá ser desfeita.
                        </SheetDescription>
                        <Button
                          className="bg-green-600 hover:bg-zinc-700 cursor-pointer"
                          onClick={async () => {
                            if (a.status === 'Aguardando') {
                              try {
                                await axios.put(`/api/agendamentos/${a.id}`, { status: 'Confirmado' });
                                setAgendamentos(prev =>
                                  prev.map(item =>
                                    item.id === a.id ? { ...item, status: 'Confirmado' } : item
                                  )
                                );
                                showAlert('success', 'Status alterado para Confirmado');
                              } catch (error) {
                                showAlert('error', 'Erro ao atualizar status');
                              }
                            }
                          }}
                        >
                          Aceitar
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={async () => {
                            if (a.status === 'Aguardando') {
                              try {
                                await axios.put(`/api/agendamentos/${a.id}`, { status: 'Recusado' });
                                setAgendamentos(prev =>
                                  prev.map(item =>
                                    item.id === a.id ? { ...item, status: 'Recusado' } : item
                                  )
                                );
                                showAlert('success', 'Status alterado para Recusado');
                              } catch (error) {
                                showAlert('error', 'Erro ao atualizar status');
                              }
                            }
                          }}
                        >
                          Recusar
                        </Button>
                        {a.status !== 'Aguardando' && (
                          <Button
                            className="bg-zinc-600 hover:bg-zinc-700 cursor-pointer"
                            onClick={async () => {
                              const confirmed = window.confirm('Tem certeza que deseja excluir este agendamento? Esta ação não poderá ser desfeita.');
                              if (!confirmed) return;
                              try {
                                await axios.delete(`/api/agendamentos/${a.id}`);
                                setAgendamentos(prev => prev.filter(item => item.id !== a.id));
                                showAlert('success', 'Agendamento excluído com sucesso');
                              } catch (error) {
                                showAlert('error', 'Erro ao excluir agendamento');
                              }
                            }}
                          >
                            Excluir
                          </Button>
                        )}
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </TableCell>
                <TableCell className="text-right"><p>{a.status}</p></TableCell>
              </TableRow>
              ))}
             </TableBody>
          </Table>

    </div>
  )
}
