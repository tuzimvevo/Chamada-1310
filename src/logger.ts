import fs from "fs/promises";

export async function log(mensagem: string): Promise<void> {
  const timestamp = new Date().toISOString();
  await fs.appendFile("app.log", `[${timestamp}] ${mensagem}\n`, "utf8");
}

export async function lerLogs(): Promise<string[]> {
  try {
    const conteudo = await fs.readFile("app.log", "utf-8");
    return conteudo.split('\n').filter(linha => linha.trim().length > 0);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}