"use client";
import { useFormularioEvento } from "../context/FormularioEventoContext";

function formatarParaISO(data: string): string {
  const [dia, mes, ano] = data.split("/");
  return `${ano}-${mes}-${dia}`;
}

export function useEnviarEvento() {
  const { formData, idCliente, materiais, imagens } = useFormularioEvento();

  const enviarEvento = async () => {
    try {
      if (!idCliente) throw new Error("ID do cliente não definido.");

      const payload = {
        idCliente,
        idEncarregadoEstruturaMontagem:
          Number(formData.responsavelMontagem) || null,
        idEncarregadoEstruturaDesmontagem:
          Number(formData.responsavelDesmontagem) || null,
        idEncarregadoMontagemIluminacao: null,
        idEncarregadoIluminacaoDesmontagem: null,
        nomeEvento: String(formData.nome),
        localEvento: String(formData.local),
        dataInicio: formatarParaISO(String(formData.inicioData)),
        dataFim: formatarParaISO(String(formData.fimData)),
        horaInicio: formData.inicioHora,
        horaFim: formData.fimHora,
        montagemInicio: formatarParaISO(String(formData.dataMontagem)),
        montagemFim: formatarParaISO(String(formData.dataMontagem)),
        desmontagemInicio: formatarParaISO(String(formData.dataDesmontagem)),
        desmontagemFim: formatarParaISO(String(formData.dataDesmontagem)),
        materiais: materiais.map(({ nome, quantidade }) => ({
          nome,
          quantidade,
        })),
      };

      const formDataToSend = new FormData();
      formDataToSend.append("evento", JSON.stringify(payload));
      if (imagens[0]) {
        formDataToSend.append("file", imagens[0]); // campo "file" para o multer
      }

      const response = await fetch("https://denzel-backend.onrender.com/api/eventos/criar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const textoErro = await response.text(); // ou response.json() se backend retornar JSON
        console.error("🔴 Erro detalhado do backend:", textoErro);
        throw new Error("Erro ao criar evento");
      }

      const resultado = await response.json();
      console.log("✅ Evento criado com sucesso:", resultado);

      return resultado;
    } catch (error) {
      console.error("❌ Erro ao criar evento:", error);
      throw error;
    }
  };

  return { enviarEvento };
}
