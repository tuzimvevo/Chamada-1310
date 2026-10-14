import fs from "fs/promises";

export async function buscarComSeguranca(caminho: string): Promise<string | null> {
    try {
        const conteudo = await fs.readFile(caminho, "utf-8");
        return conteudo;
    } catch (error: unknown) {
            return null;
    }
}

