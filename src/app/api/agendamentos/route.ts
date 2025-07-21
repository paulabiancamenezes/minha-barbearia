import { PrismaClient } from '@/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      orderBy: {
        dataHora: 'asc',
      },
    })
    return NextResponse.json(agendamentos)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, email, telefone, dataHora, servicoDesejado } = body;

    // Validação: não permitir agendamento duplicado no mesmo dia e horário
    const dataHoraObj = new Date(dataHora);
    const inicio = new Date(dataHoraObj);
    inicio.setMinutes(0, 0, 0);
    const fim = new Date(inicio);
    fim.setMinutes(59, 59, 999);

    const existente = await prisma.agendamento.findFirst({
      where: {
        dataHora: {
          gte: inicio,
          lte: fim,
        },
      },
    });
    if (existente) {
      return NextResponse.json({ error: 'Horário não disponível. Escolha outro horário.' }, { status: 400 });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        nome,
        email,
        telefone,
        dataHora: dataHoraObj,
        servicoDesejado
      },
    });


    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}