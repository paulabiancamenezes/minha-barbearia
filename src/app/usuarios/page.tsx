"use client"

import Sidebar from "../../components/siderbarAdmin"
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Usuario } from "@/@types/agendamento";

export default function Users() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  useEffect(() => {
    axios.get("/api/usuarios")
      .then(res => setUsuarios(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Sidebar />
      <div className="p-4 mx-20">
        <h2 className="text-2xl font-bold text-white mb-6">Usuários cadastrados</h2>
        {loading ? (
          <p className="text-white">Carregando...</p>
        ) : (
          <section className="flex-1 w-full mx-auto">
            <Table className="text-white">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-right text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <User2 className="w-5 h-5 text-zinc-400" />
                      {user.nome}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                        className="cursor-pointer bg-white text-black hover:none"
                      >
                        Ver mais
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Modal de detalhes do usuário */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-zinc-900 p-8 rounded-lg shadow-lg min-w-[320px] text-white relative">
                  <button
                    className="absolute top-2 right-2 text-zinc-400 hover:text-white"
                    onClick={() => setSelectedUser(null)}
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User2 className="w-6 h-6" /> {selectedUser.nome}
                  </h3>
                  <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-semibold">Telefone:</span> {selectedUser.telefone}</p>
                  <p><span className="font-semibold">CPF:</span> {selectedUser.cpf}</p>
                  
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}