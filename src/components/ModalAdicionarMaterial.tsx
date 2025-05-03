"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CloseIcon from "/public/Fechar-Modal.svg";
import SearchIcon from "/public/search.svg";
import FilterIcon from "/public/filtro.svg";
import BoxIcon from "/public/Material.svg";
import QuantIcon from "/public/quantidade.svg";
import EstruturaIcon from "/public/estrutura.svg";
import SaneamentoIcon from "/public/sanitario.svg";
import IluminacaoIcon from "/public/iluminacao.svg";
import GeradorIcon from "/public/geradorIcon.svg";
import ClimatizacaoIcon from "/public/climatizacaoIcon.svg";
import Solicitacao from "/public/Solicitacao.svg";
import Material from "../@Types/Material";

interface Props {
  onClose: () => void;
  onSelecionar: () => Promise<void>;
  idEvento: number;
}

export default function ModalAdicionarMaterial({ onClose, onSelecionar, idEvento }: Props) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<Record<string, number>>({});
  const [, setNomeAtual] = useState("");

  const buscarMateriais = async (termo: string) => {
    try {
      const url = `https://denzel-backend.onrender.com/api/materiais/Listar-por-nome-status?status=${encodeURIComponent("em estoque")}&nome=${encodeURIComponent(termo)}`;
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
  
      if (!response.ok) {
        console.error("Erro ao buscar materiais: Status", response.status);
        setMateriais([]);
        return;
      }
  
      const data = await response.json();
      if (Array.isArray(data)) {
        setMateriais(data);
      } else {
        setMateriais([]);
      }
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
      setMateriais([]);
    }
  };
  

  useEffect(() => {
    if (busca.trim() === "") {
      setMateriais([]);
      return;
    }

    const delay = setTimeout(() => {
      buscarMateriais(busca);
    }, 300);

    return () => clearTimeout(delay);
  }, [busca]);

  const toggleSelecionado = (nome: string) => {
    setSelecionados((prev) => ({
      ...prev,
      [nome]: 1,
    }));
    setNomeAtual(nome);
    setBusca("");
  };

  const atualizarQuantidade = (nome: string, quantidade: number) => {
    setSelecionados((prev) => ({
      ...prev,
      [nome]: quantidade,
    }));
  };

  const getCategoriaIcon = (categoria: number) => {
    switch (categoria) {
      case 1: return IluminacaoIcon;
      case 2: return EstruturaIcon;
      case 3: return GeradorIcon;
      case 4: return ClimatizacaoIcon;
      case 5: return SaneamentoIcon;
      default: return BoxIcon;
    }
  };

  const selecionadosFormatados = Object.entries(selecionados)
    .filter(([, q]) => q > 0)
    .map(([nome, quantidade]) => ({ nome, quantidade }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#100D1E] text-white rounded-lg p-8 w-[800px] h-[620px] shadow-lg relative flex flex-col justify-between">
        <button onClick={onClose} className="absolute top-4 right-4">
          <Image src={CloseIcon} alt="Fechar" width={24} height={24} />
        </button>

        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text mb-4">
          <Image src={Solicitacao} alt="Solicitação" width={307} height={30} className="inline-block" />
        </h2>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center bg-[#1D1933] px-4 py-2 rounded w-full">
            <Image src={SearchIcon} alt="Buscar" width={20} height={20} />
            <input
              type="text"
              placeholder="Buscar Materiais"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-transparent w-full ml-2 text-white outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-[#100D1E] transition">
            <Image src={FilterIcon} alt="Filtrar" width={20} height={20} />
            Filtrar
          </button>
        </div>

        <div className="max-h-[350px] overflow-y-auto pr-2">
          <div className="font-bold mb-2 flex justify-between px-2">
            <div className="flex items-center gap-2">
              <Image src={BoxIcon} alt="Ícone" width={18} height={18} />
              <span>Materiais</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src={QuantIcon} alt="Quant" width={18} height={18} />
              <span>Quantidade</span>
            </div>
          </div>

          {/* Materiais Selecionados */}
          {Object.keys(selecionados).map((nome) => {
            const material = materiais.find((m) => m.Nome === nome);
            return (
              <div key={`selecionado-${nome}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 mb-3 px-2">
                <div className="flex items-center gap-2">
                  <Image src={getCategoriaIcon(material?.categoria || 0)} alt="Icone" width={18} height={18} />
                  <span>{nome}</span>
                </div>
                <input
                  type="number"
                  min={1}
                  className="w-[168px] h-[40px] bg-[#1D1933] p-2 rounded border border-white text-white"
                  value={selecionados[nome] || ""}
                  onChange={(e) => atualizarQuantidade(nome, parseInt(e.target.value))}
                />
              </div>
            );
          })}

          {/* Materiais Disponíveis */}
          {materiais.filter(m => !(m.Nome in selecionados)).map((material) => (
            <div key={`disponivel-${material.Nome}`} className="flex items-center gap-2 mb-3 px-2">
              <input
                type="checkbox"
                checked={material.Nome in selecionados}
                onChange={() => toggleSelecionado(material.Nome)}
              />
              <Image src={getCategoriaIcon(material.categoria)} alt="Categoria" width={18} height={18} />
              <span>{material.Nome}</span>
              <span>({material.quantidade})</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-auto pt-4 border-t border-[#292343]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:text-[#100D1E]"
          >
            ◀ Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                const id = idEvento;
                const response = await fetch(`https://denzel-backend.onrender.com/api/eventos/editarMaterial/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    id,
                    materiaisAdicionados: selecionadosFormatados,
                  }),
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error("Erro HTTP:", response.status, errorText);
                  throw new Error("Erro ao adicionar materiais");
                }

                await onSelecionar();
                onClose();
              } catch (error) {
                console.error("Erro ao adicionar materiais:", error);
              }
            }}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
          >
            Selecionar Material ▶
          </button>
        </div>
      </div>
    </div>
  );
}
