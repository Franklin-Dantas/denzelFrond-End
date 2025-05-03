"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { X } from "lucide-react";

interface ModalDeletarMateriaisProps {
  aberto: boolean;
  onFechar: () => void;
  onSucesso: () => Promise<void>; // Apenas sinaliza sucesso, não recebe os IDs
  idsSelecionados: string[];
}

export default function ModalDeletarMateriais({
  aberto,
  onFechar,
  onSucesso,
  idsSelecionados,
}: ModalDeletarMateriaisProps) {
  const [carregando, setCarregando] = useState(false);

  const confirmarExclusao = async () => {
      console.log("Cliquei em confirmar exclusão");
      console.log(idsSelecionados);
    if (!idsSelecionados.length) return;
    setCarregando(true);
    try {
      const response = await fetch("https://denzel-backend.onrender.com/api/materiais/DeletarMaterial", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ids: idsSelecionados }),
      });

      if (!response.ok) throw new Error("Erro ao deletar materiais");

      await onSucesso(); // Chama o callback para recarregar ou atualizar a lista
      onFechar();        // Fecha o modal
    } catch (err) {
      console.error("Erro ao deletar materiais:", err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog
      open={aberto}
      onClose={onFechar}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/60" />

      <div className="relative z-10 w-[90%] max-w-md p-6 bg-[#1D1933] rounded-xl border border-[#292343] text-white">
        <button onClick={onFechar} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <Dialog.Title className="text-lg font-bold mb-4">Confirmar Exclusão</Dialog.Title>
        <p className="mb-4">
          Tem certeza que deseja excluir {idsSelecionados.length} material(is) selecionado(s)?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onFechar}
            disabled={carregando}
            className="px-4 py-2 rounded-full border border-gray-400 hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
  onClick={() => {
    console.log("Clique detectado");
    confirmarExclusao();
  }}
>
  {carregando ? "Excluindo..." : "Excluir"}
</button>
        </div>
      </div>
    </Dialog>
  );
}
