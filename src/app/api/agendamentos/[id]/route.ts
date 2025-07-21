import { PrismaClient } from '@/generated/prisma'
import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/email';

const prisma = new PrismaClient()

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const body = await req.json();
    const { status } = body;

    if (!status || !['Aguardando', 'Confirmado', 'Recusado'].includes(status)) {
      console.error('Status inválido recebido:', status);
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const agendamento = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: { status },
    });

    if (status === 'Confirmado' || status === 'Recusado') {
      try {
        await sendMail(
          agendamento.email,
          `Seu agendamento foi ${status.toLowerCase()}`,
          `<p>Olá ${agendamento.nome}, seu agendamento foi <b>${status.toLowerCase()}</b>.</p>`
        );
      } catch (mailError) {
        console.error('Erro ao enviar e-mail:', mailError);
        // Não retorna erro para o usuário, apenas loga
      }
    }

    return NextResponse.json(agendamento);

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await prisma.agendamento.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json({ error: 'Erro ao excluir agendamento' }, { status: 500 });
  }
}
