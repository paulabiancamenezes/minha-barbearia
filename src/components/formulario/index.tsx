'use client';

import '@/app/globals.css';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { z } from 'zod';

const agendamentoSchema = z.object({
  nome: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(8, 'Telefone obrigatório'),
  servicoDesejado: z.string().min(3, 'Serviço obrigatório'),
  dataHora: z.string().min(1, 'Horário obrigatório'),
});

export default function Agendar() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataHora: '',
    servicoDesejado: ''
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDate(value);
    setFormData({ ...formData, dataHora: '' });
    setLoadingTimes(true);
    try {
      const res = await fetch(`/api/agendamentos?date=${value}`);
      const agendamentos = await res.json();
      const allTimes = Array.from({ length: 11 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);
      const bookedTimes = agendamentos.map((a: any) => new Date(a.dataHora).toISOString().slice(11, 16));
      const available = allTimes.filter(time => !bookedTimes.includes(time));
      setAvailableTimes(available);
    } catch (err) {
      setAvailableTimes([]);
    }
    setLoadingTimes(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = agendamentoSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach(err => {
        if (typeof err.path[0] === 'string') fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Agendamento criado com sucesso!");
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          dataHora: '',
          servicoDesejado: ''
        });
        setSelectedDate('');
      } else {
        const data = await res.json();
        if (data?.error?.includes('disponível')) {
          alert(data.error);
        } else {
          alert('Erro ao criar agendamento.');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-items-center">
      <Card className="w-full max-w-md mx-auto mt-10 bg-zinc-800 text-white border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Formulário de Agendamento</CardTitle>
          <CardDescription>Preencha os campos abaixo para marcar seu horário conosco.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form method='POST' className='space-y-4' onSubmit={handleSubmit}>
            <Input name="nome" placeholder="Nome" className="w-full" value={formData.nome} onChange={handleChange} />
            {errors.nome && <span className="text-red-500 text-sm">{errors.nome}</span>}
            <Input name="email" placeholder="Email" type="email" className="w-full" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            <Input name="telefone" placeholder="Telefone" type="tel" className="w-full" value={formData.telefone} onChange={handleChange} />
            {errors.telefone && <span className="text-red-500 text-sm">{errors.telefone}</span>}
            <Input name="servicoDesejado" placeholder="Serviço desejado" className="w-full" value={formData.servicoDesejado} onChange={handleChange} />
            {errors.servicoDesejado && <span className="text-red-500 text-sm">{errors.servicoDesejado}</span>}
            <CardDescription>Escolha a data desejada e em seguida selecione o horário.</CardDescription>
            <Input name="date" type="date" className="w-full" value={selectedDate} onChange={handleDateChange} />
            <select
              name="dataHora"
              className="w-full bg-zinc-700 text-white p-2 rounded"
              value={formData.dataHora ? formData.dataHora.slice(11, 16) : ''}
              onChange={e => setFormData({ ...formData, dataHora: selectedDate + 'T' + e.target.value + ':00' })}
              disabled={!selectedDate || loadingTimes || availableTimes.length === 0}
            >
              <option value="">Selecione um horário</option>
              {availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.dataHora && <span className="text-red-500 text-sm">{errors.dataHora}</span>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Enviar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}