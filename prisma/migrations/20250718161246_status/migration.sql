-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agendamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "servicoDesejado" TEXT NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aguardando'
);
INSERT INTO "new_Agendamento" ("dataHora", "email", "id", "nome", "servicoDesejado", "telefone") SELECT "dataHora", "email", "id", "nome", "servicoDesejado", "telefone" FROM "Agendamento";
DROP TABLE "Agendamento";
ALTER TABLE "new_Agendamento" RENAME TO "Agendamento";
CREATE UNIQUE INDEX "Agendamento_email_key" ON "Agendamento"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
