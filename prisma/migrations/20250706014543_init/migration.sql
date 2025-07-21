-- CreateTable
CREATE TABLE "Agendamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "servicoDesejado" TEXT NOT NULL,
    "dataHora" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_email_key" ON "Agendamento"("email");
