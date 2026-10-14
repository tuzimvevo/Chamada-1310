import { adicionar, concluir, remover } from "./tarefa";
import {buscarComSeguranca} from "./busca";

async function main() {
  const tarefa = await adicionar("Estudar TypeScript");
}

main().catch(console.error);
