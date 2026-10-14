import { adicionar, concluir, remover } from "./tarefa";

async function main() {
  const tarefa = await adicionar("Estudar TypeScript");
}

main().catch(console.error);