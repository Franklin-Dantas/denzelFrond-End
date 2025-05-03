import Cliente from "../@Types/Cliente";

const CLIENTE_CREATE_URL =
  "https://denzel-backend.onrender.com/api/clientes/criar";

// Função genérica para fazer requisições POST
export async function createCliente(cliente: Cliente): Promise<number | null> {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) throw new Error("Token não encontrado. Faça login novamente.");

    const response = await fetch(CLIENTE_CREATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cliente),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao criar cliente.");
    }

    const result = await response.json();
    console.log(result.message);
    return result.id; // Retorna o ID do novo cliente criado
  } catch (error) {
    console.error(`Erro ao criar cliente: ${(error as Error).message}`);
    return null; // Retorna null em caso de erro
  }
}
