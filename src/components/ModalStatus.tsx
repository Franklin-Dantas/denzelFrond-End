"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import FecharIcon from "/public/Fechar-Modal.svg";
import LinhaModal from "/public/Linha-Modal.png";

interface ModalMudarStatusProps {
  aberto: boolean;
  onFechar: () => void;
  idsSelecionados: string[];
  onSucesso: () => void;
}

const statusOpcoes = [
  "em estoque",
  "em uso",
  "em manutencao",
  "extraviado",
  "avariado",
  "transposicao",
];

export default function ModalMudarStatus({
  aberto,
  onFechar,
  idsSelecionados,
  onSucesso,
}: ModalMudarStatusProps) {
  const [novoStatus, setNovoStatus] = useState<string>("");
  const [carregando, setCarregando] = useState(false);

  const alterarStatus = async () => {
    if (!novoStatus) return alert("Selecione um status.");
    setCarregando(true);
    try {
      const response = await fetch("https://denzel-backend.onrender.com/api/materiais/AtualizarStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ids: idsSelecionados, novoStatus }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar status");
      onSucesso();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Falha ao atualizar o status.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={aberto} onClose={onFechar} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-[#15112B] border border-[#292343] p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mudar Status</h2>
            <button onClick={onFechar}>
              <Image src={FecharIcon} alt="Fechar" width={24} height={24} />
            </button>
          </div>

          <Image src={LinhaModal} alt="Linha" className="mb-4" />

          <div className="space-y-2">
            {statusOpcoes.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer hover:text-cyan-400"
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={novoStatus === status}
                  onChange={() => setNovoStatus(status)}
                  className="accent-cyan-500"
                />
                {status}
              </label>
            ))}
          </div>

          <button
            onClick={alterarStatus}
            disabled={carregando}
            className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded disabled:opacity-50"
          >
            {carregando ? "Atualizando..." : "Confirmar"}
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
