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
import geradorIcon from "/public/geradorIcon.svg";
import climatizacaoIcon from "/public/climatizacaoIcon.svg";
import Solicitacao from "/public/Solicitacao.svg";
import Material from "../@Types/Material";

interface Props {
  onClose: () => void;
  onSelecionar: (materiais: { nome: string; quantidade: number; categoria: number }[]) => void;
}

export default function ModalAdicionarMaterial({ onClose, onSelecionar }: Props) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<Record<string, { quantidade: number; categoria: number }>>({});
  const [, setNomeAtual] = useState("");

  
  const buscarMateriais = (termo: string) => {
    fetch(`https://denzel-backend.onrender.com/api/materiais/Listar-por-nome-status?status=em estoque&nome=${termo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMateriais(data);
        } else {
          setMateriais([]);
        }
      })
      .catch((err) => console.error("Erro ao buscar materiais:", err));
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
  const material = materiais.find((m) => m.Nome === nome);
  if (!material) return;

  setSelecionados((prev) => ({
    ...prev,
    [nome]: {
      quantidade: 1,
      categoria: material.categoria,
    },
  }));
  setNomeAtual(nome);
  setBusca("");
};

const atualizarQuantidade = (nome: string, quantidade: number) => {
    setSelecionados((prev) => {
      const existente = prev[nome];
      if (!existente) return prev;
  
      return {
        ...prev,
        [nome]: {
          ...existente,
          quantidade,
        },
      };
    });
  };
  

  const getCategoriaIcon = (categoria: number) => {
    switch (categoria) {
      case 1: return IluminacaoIcon;
      case 2: return EstruturaIcon;
      case 3: return geradorIcon;
      case 4: return climatizacaoIcon;
      case 5: return SaneamentoIcon;
      default: return BoxIcon;
    }
  };

  const selecionadosFormatados = Object.entries(selecionados)
  .filter(([, val]) => val.quantidade > 0)
  .map(([nome, val]) => ({
    nome,
    quantidade: val.quantidade,
    categoria: val.categoria,
  }));


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

          {Object.keys(selecionados).map((nome) => {
            const material = materiais.find((m) => m.Nome === nome);
            return (
                <div key={nome} className="grid grid-cols-[1fr_auto] items-center gap-x-4 mb-3 px-2">

                <div className="flex items-center gap-2">
                  <Image src={getCategoriaIcon(material?.categoria || 0)} alt="Icone" width={18} height={18} />
                  <span>{nome}</span>
                </div>
                <input
                  type="number"
                  min={1}
                  className="w-[168px] h-[40px] bg-[#1D1933] p-2 rounded border border-white text-white"
                  value={selecionados[nome]?.quantidade || ""}
                  onChange={(e) => atualizarQuantidade(nome, parseInt(e.target.value))}
                />
              </div>
            );
          })}

          {materiais.filter(m => !(m.Nome in selecionados)).map((material) => (
            <div key={material.Nome} className="flex items-center gap-2 mb-3 px-2">
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
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 transition-colors hover:text-[#100D1E]"
          >
            ◀ Cancelar
          </button>
          <button
  onClick={() => {
    onSelecionar(selecionadosFormatados);
    onClose();}}
    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 transition-colors hover:text-[#100D1E]"
            >
            Adicionar ▶
          </button>
        </div>
      </div>
    </div>
  );
}