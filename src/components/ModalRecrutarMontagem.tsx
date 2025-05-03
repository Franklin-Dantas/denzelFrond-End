"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import FecharModal from "/public/Fechar-Modal.svg";
import BuscarColaborador from "./BuscarColaborador";
import LinhaModal from '/public/Linha-Modal.png';

interface Colaborador {
  id: number;
  Nome: string;
}

interface BuscarColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelecionar: (colaboradoresSelecionados: { id: number; nome: string }[]) => void;
  cargo: "encarregado estrutura" | "encarregado iluminacao";
}

export default function BuscarColaboradorModal({
  isOpen,
  onClose,
  onSelecionar,
  cargo,
}: BuscarColaboradorModalProps) {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [selecionados, setSelecionados] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      buscarColaboradores();
      setSelecionados([]); // Limpar seleção ao abrir
    }
  }, [isOpen, cargo]);

  const buscarColaboradores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://denzel-backend.onrender.com/api/usuarios/ListarPorCargo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro na busca de colaboradores");
      }

      const data = await response.json();
      setColaboradores(data);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarCheckbox = (id: number) => {
    setSelecionados((prevSelecionados) =>
      prevSelecionados.includes(id)
        ? prevSelecionados.filter((selecionado) => selecionado !== id)
        : [...prevSelecionados, id]
    );
  };

  const handleConcluirSelecao = () => {
    const colaboradoresSelecionados = colaboradores
      .filter((colaborador) => selecionados.includes(colaborador.id))
      .map((colaborador) => ({
        id: colaborador.id,
        nome: colaborador.Nome,
      }));

    onSelecionar(colaboradoresSelecionados);
    onClose();
  };

  const colaboradoresFiltrados = colaboradores.filter((colaborador) => {
    if (!colaborador.Nome) return false;
    return colaborador.Nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes(
        termoBusca
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      );
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative bg-[#1c1530] text-white p-8 rounded-xl w-[600px] min-h-[500px] max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Linha Decorativa */}
        <div className="absolute top-0 left-0 w-full h-1">
          <Image
            src={LinhaModal}
            alt="Linha decorativa"
            layout="responsive"
            width={800}
            height={5}
            priority
            className="w-full"
          />
        </div>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 hover:scale-110 transition-transform"
        >
          <Image src={FecharModal} alt="Fechar" width={24} height={24} />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-[#9C60DA] to-[#43A3D5] bg-clip-text text-transparent">
          Recrutar Colaboradores
        </h2>

        {/* Campo de Busca */}
        <div className="mb-8">
          <BuscarColaborador
            value={termoBusca}
            onChange={setTermoBusca}
          />
        </div>

        {/* Lista de Colaboradores */}
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : (
          <>
            {colaboradoresFiltrados.length === 0 ? (
              <p className="text-center text-gray-400">Nenhum colaborador encontrado.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {colaboradoresFiltrados.map((colaborador) => (
                  <label
                    key={colaborador.id}
                    className="flex items-center gap-3 cursor-pointer bg-[#2a2346] hover:bg-[#3a2e5d] transition rounded-md py-2 px-4"
                  >
                    <input
                      type="checkbox"
                      checked={selecionados.includes(colaborador.id)}
                      onChange={() => handleSelecionarCheckbox(colaborador.id)}
                      className="accent-purple-500 w-5 h-5"
                    />
                    <span className="text-white">{colaborador.Nome}</span>
                  </label>
                ))}
              </div>
            )}
          </>
        )}

        {/* Botão Concluir */}
        {colaboradoresFiltrados.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleConcluirSelecao}
              className="bg-gradient-to-r from-[#9C60DA] to-[#43A3D5] px-6 py-2 rounded-md font-bold hover:brightness-110 transition"
            >
              Concluir Seleção
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
