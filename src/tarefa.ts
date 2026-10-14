import fs from "fs/promises";
import { randomUUID } from "crypto";

interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
}

const ARQUIVO_PADRAO = "tarefas.json";

async function lerTarefas(caminho: string): Promise<Tarefa[]> {
  let dados: string;

  try {
    dados = await fs.readFile(caminho, "utf-8");
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }
    throw error;
  }

  if (dados.trim() === "") {
    return [];
  }

  const tarefas: unknown = JSON.parse(dados);
  if (
    !Array.isArray(tarefas) ||
    !tarefas.every(
      (tarefa): tarefa is Tarefa =>
        typeof tarefa === "object" &&
        tarefa !== null &&
        "id" in tarefa &&
        Number.isSafeInteger(tarefa.id) &&
        "titulo" in tarefa &&
        typeof tarefa.titulo === "string" &&
        "concluida" in tarefa &&
        typeof tarefa.concluida === "boolean",
    )
  ) {
    throw new Error(`Formato inválido no arquivo de tarefas: ${caminho}`);
  }

  return tarefas;
}

async function salvarTarefas(caminho: string, tarefas: Tarefa[]): Promise<void> {
  const arquivoTemporario = `${caminho}.${randomUUID()}.tmp`;
  await fs.writeFile(arquivoTemporario, JSON.stringify(tarefas, null, 2), "utf-8");
  await fs.rename(arquivoTemporario, caminho);
}

export async function adicionar(titulo: string, caminho: string = ARQUIVO_PADRAO): Promise<Tarefa> {
  const tarefas = await lerTarefas(caminho);
  const maiorId = tarefas.reduce((maior, tarefa) => Math.max(maior, tarefa.id), 0);
  if (maiorId === Number.MAX_SAFE_INTEGER) {
    throw new Error("Não é possível gerar um novo ID de tarefa.");
  }

  const nova: Tarefa = {
    id: maiorId + 1,
    titulo,
    concluida: false,
  };
  tarefas.push(nova);
  await salvarTarefas(caminho, tarefas);
  return nova;
}

export async function concluir(id: number, caminho: string = ARQUIVO_PADRAO): Promise<boolean> {
  const tarefas = await lerTarefas(caminho);
  const tarefa = tarefas.find((item) => item.id === id);
  if (!tarefa) {
    return false;
  }

  tarefa.concluida = true;
  await salvarTarefas(caminho, tarefas);
  return true;
}

export async function remover(id: number, caminho: string = ARQUIVO_PADRAO): Promise<boolean> {
  const tarefas = await lerTarefas(caminho);
  const tarefasAtualizadas = tarefas.filter((tarefa) => tarefa.id !== id);
  if (tarefasAtualizadas.length === tarefas.length) {
    return false;
  }

  await salvarTarefas(caminho, tarefasAtualizadas);
  return true;
}
