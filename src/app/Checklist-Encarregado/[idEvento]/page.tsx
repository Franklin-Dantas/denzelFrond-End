"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Quantidade from "/public/quantidade.svg";
import extraviadoIcon from "/public/Extraviado.svg";
import manutencaoIcon from "/public/EmManutencao.svg";
import emUsoIcon from "/public/Em-Uso.svg";
import emEstoqueIcon from "/public/Em-Estoque.svg";
import avariadoIcon from "/public/Avariado.svg";
import iconExtraviado from "/public/extraviado-icon.svg";
import iconManutencao from "/public/manutencaoIcon.svg";
import iconEmUso from "/public/usoIcon.svg";
import iconEmEstoque from "/public/estoqueicon.svg";
import iconAvariado from "/public/iconAvariado.svg";
import MudarStatus from "/public/mudarStatus.svg";
import IluminacaoIcon from "/public/iluminacao.svg";
import EstruturaIcon from "/public/estrutura.svg";
import geradorIcon from "/public/geradorIcon.svg";
import climatizacaoIcon from "/public/climatizacaoIcon.svg";
import SaneamentoIcon from "/public/sanitario.svg";
import BoxIcon from "/public/Material.svg";
import ModalMudarStatus from "../../../components/ModalStatus";
import { useParams } from "next/navigation";

interface Material {
  id: string;
  Nome: string;
  status: "extraviado" | "em manutencao" | "em estoque" | "em uso" | "transposição" | "avariado";
  categoria: string;
}

export default function ChecklistEncarregado() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [categoriasAbertas, setCategoriasAbertas] = useState<Record<string, boolean>>({});
  const [materiaisAbertos, setMateriaisAbertos] = useState<Record<string, boolean>>({});
  const [selecionados, setSelecionados] = useState<Record<string, boolean>>({});
  const [modalAberto, setModalAberto] = useState(false);
  const params = useParams();
  const idEvento = params?.idEvento;

  const mapCategoria = (valor: number): string => {
    const categorias: Record<number, string> = {
      1: "iluminacao",
      2: "estrutura",
      3: "gerador",
      4: "climatizacao",
      5: "sanitarios",
    };
    return categorias[valor] || "outros";
  };

  const getCategoriaIcon = (categoria: string | number) => {
    const cat = String(categoria);
    switch (cat.toLowerCase()) {
      case "iluminacao":
        return IluminacaoIcon;
      case "estrutura":
        return EstruturaIcon;
      case "gerador":
        return geradorIcon;
      case "climatizacao":
        return climatizacaoIcon;
      case "sanitarios":
        return SaneamentoIcon;
      default:
        return BoxIcon;
    }
  };

  const getStatusIcon = (status: Material["status"]) => {
    switch (status) {
      case "extraviado":
        return extraviadoIcon;
      case "em manutencao":
        return manutencaoIcon;
      case "em uso":
        return emUsoIcon;
      case "em estoque":
        return emEstoqueIcon;
      case "avariado":
        return avariadoIcon;
      default:
        return null;
    }
  };

  const getStatusResumoIcon = (status: Material["status"]) => {
    switch (status) {
      case "extraviado":
        return iconExtraviado;
      case "em manutencao":
        return iconManutencao;
      case "em uso":
        return iconEmUso;
      case "em estoque":
        return iconEmEstoque;
      case "avariado":
        return iconAvariado;
      default:
        return null;
    }
  };

  const categoriasDisponiveis = [
    { nome: "Estrutura", valor: "estrutura" },
    { nome: "Iluminação", valor: "iluminacao" },
    { nome: "Climatização", valor: "climatizacao" },
    { nome: "Sanitários", valor: "sanitarios" },
    { nome: "Geradores", valor: "gerador" },
  ];


  const fetchMateriais = useCallback(async (id: string | string[]) => {
    try {
      const response = await fetch(`https://denzel-backend.onrender.com/api/materiais/Listar-por-evento/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) throw new Error("Erro ao buscar materiais");
      const data = await response.json();
      console.log("Materiais recebidos:", data);
  
      const materiaisComId: Material[] = data
        .filter((item: { id?: string; Nome: string; status: string; categoria: number }) => item.id !== undefined)
        .map((item: { id: string; Nome: string; status: string; categoria: number }) => ({
          id: item.id.toString(),
          Nome: item.Nome,
          status: item.status.toLowerCase() as Material["status"],
          categoria: mapCategoria(item.categoria),
        }));
  
      setMateriais(materiaisComId);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
    }
  }, []); // Agora, a função é criada com o useCallback para não depender do useEffect
  
  useEffect(() => {
    if (idEvento) {
      fetchMateriais(idEvento);
    }
  }, [idEvento, fetchMateriais]); // Usando o fetchMateriais otimizado com useCallback
  

  const agrupado = materiais.reduce(
    (acc: Record<string, Record<string, Material[]>>, mat) => {
      if (!acc[mat.categoria]) acc[mat.categoria] = {};
      if (!acc[mat.categoria][mat.Nome]) acc[mat.categoria][mat.Nome] = [];
      acc[mat.categoria][mat.Nome].push(mat);
      return acc;
    },
    {}
  );

  const toggleSelecionarTodos = (nome: string, itens: Material[]) => {
    const todosSelecionados = itens.every((mat) => selecionados[mat.id]);
    const novos = { ...selecionados };
    itens.forEach((mat) => {
      novos[mat.id] = !todosSelecionados;
    });
    setSelecionados(novos);
  };

  const idsSelecionados = Object.keys(selecionados).filter((id) => selecionados[id]);

  return (
    <div className="min-h-screen bg-[#0D0D1D] text-white p-6 pb-32 relative">
      <div className="flex items-center gap-2 mb-6">
        <Search className="text-cyan-400" />
        <input
          placeholder="Buscar Materiais"
          className="bg-transparent border-b border-cyan-400 outline-none px-2 flex-1"
        />
        <button className="ml-auto text-sm flex items-center gap-1 text-white">
          <SlidersHorizontal size={16} />
          Filtrar
        </button>
      </div>

      {categoriasDisponiveis.map((cat) => (
        <div key={cat.valor} className="mb-6">
          <button
            onClick={() =>
              setCategoriasAbertas((prev) => ({
                ...prev,
                [cat.valor]: !prev[cat.valor],
              }))
            }
            className="w-full flex justify-between items-center p-4 bg-[#1D1933] border border-[#292343] rounded"
          >
            <div className="flex items-center gap-2">
              <Image src={getCategoriaIcon(cat.valor)} alt="icone" width={24} height={24} />
              <span className="text-lg font-semibold">{cat.nome}</span>
            </div>
            {categoriasAbertas[cat.valor] ? <ChevronUp /> : <ChevronDown />}
          </button>

          {categoriasAbertas[cat.valor] && agrupado[cat.valor] && (
            <div className="mt-2 space-y-3">
              {Object.entries(agrupado[cat.valor]).map(([nome, itens]) => {
                const contagemStatus = itens.reduce(
                  (acc, m) => {
                    acc[m.status] = (acc[m.status] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                );

                return (
                  <div key={nome} className="bg-[#15112B] p-4 rounded border border-[#292343]">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Image src={getCategoriaIcon(itens[0].categoria)} alt="icone" width={18} height={18} />
                        <input
                          type="checkbox"
                          checked={itens.every((mat) => selecionados[mat.id])}
                          onChange={() => toggleSelecionarTodos(nome, itens)}
                        />
                        <button
                          onClick={() =>
                            setMateriaisAbertos((prev) => ({
                              ...prev,
                              [nome]: !prev[nome],
                            }))
                          }
                          className="text-left"
                        >
                          <span className="font-semibold text-base">{nome}</span>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Image src={Quantidade} alt="quantidade" width={16} height={16} />
                            <span>{itens.length}</span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            {Object.entries(contagemStatus).map(([status, count]) => (
                              <div key={status} className="flex items-center gap-1 text-xs">
                                {getStatusResumoIcon(status as Material["status"]) && (
                                  <Image
                                    src={getStatusResumoIcon(status as Material["status"])!}
                                    alt={status}
                                    width={14}
                                    height={14}
                                  />
                                )}
                                <span>({count})</span>
                              </div>
                            ))}
                          </div>
                        </button>
                      </div>
                      {materiaisAbertos[nome] ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {materiaisAbertos[nome] && (
                      <div className="mt-3 space-y-1">
                        {itens.map((mat) => (
                          <div
                            key={mat.id}
                            className="flex justify-between items-center px-2 py-1 text-sm border-t border-[#292343]"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!selecionados[mat.id]}
                                onChange={() =>
                                  setSelecionados((prev) => ({
                                    ...prev,
                                    [mat.id]: !prev[mat.id],
                                  }))
                                }
                              />
                              <span>ID {mat.id}</span>
                            </div>
                            <div className="flex items-center gap-2">
  {getStatusIcon(mat.status) && (
    <Image
      src={getStatusIcon(mat.status)!}
      alt={mat.status}
      width={74}
      height={16}
    />
  )}
</div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center gap-4 z-50">
        <button onClick={() => setModalAberto(true)} className="bg-gradient-to-l from-[#100D1E] to-[#100D1E] hover:from-[#9C60DA] hover:to-[#43A3D5] transition duration-300 rounded-full">
          <Image src={MudarStatus} alt="Mudar Status" width={163} height={40} />
        </button>
      </div>

      <ModalMudarStatus
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          setModalAberto(false);
          setSelecionados({});
          fetchMateriais(idEvento || "");
        }}
        idsSelecionados={idsSelecionados}
      />
    </div>
  );
}
