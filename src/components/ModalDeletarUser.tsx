"use client";
import { Dialog } from "@headlessui/react";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import AlertaIcon from "/public/Alert-Alerta.svg";
import { useState } from "react";

interface ModalExcluirClienteProps {
  isOpen: boolean;
  onClose: () => void;
  idColaborador: number;
  nomeColaborador: string;
  onSuccess: () => void;
}

export default function ModalExcluirColaborador({
  isOpen,
  onClose,
  idColaborador,
  nomeColaborador,
  onSuccess,
}: ModalExcluirClienteProps) {
  const [loading, setLoading] = useState(false);

  async function excluirColaborador() {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      setLoading(true);
  
      const response = await fetch(`https://denzel-backend.onrender.com/api/usuarios/Deletar/${idColaborador}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        
        alert("Cliente excluído com sucesso!");
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erro ao excluir cliente.");
      }
  
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir cliente.");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-[#1D1933] p-8 text-center shadow-lg">
          <div className="flex justify-center mb-4">
            <Image src={AlertaIcon} alt="Alerta" width={40} height={40} />
          </div>

          <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 text-transparent bg-clip-text">
            Deseja Mesmo Excluir?
          </Dialog.Title>

          <Dialog.Description className="mt-4 text-white">
            O colaborador <span className="font-bold">{nomeColaborador}</span>
          </Dialog.Description>

          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-white text-white hover:bg-[#292343] transition"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              onClick={excluirColaborador}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-white text-white hover:bg-red-600 transition"
            >
              <Trash2 size={18} />
              {loading ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
