"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Layers3 } from "lucide-react";
import NavbarInferior from "../../components/NavPagesMobile";
import Image from "next/image";
import { useMateriais } from "../../context/CadastrarMaterialContext";
import cubo from "/public/cuboSuperio.svg";
import lixeira from "/public/lixieraCard.svg";
import IluminacaoIcon from "/public/iluminacao.svg";
import EstruturaIcon from "/public/estrutura.svg";
import geradorIcon from "/public/geradorIcon.svg";
import climatizacaoIcon from "/public/climatizacaoIcon.svg";
import SaneamentoIcon from "/public/sanitario.svg";
import BoxIcon from "/public/Material.svg";
import SidebarMobile from "@/components/sideBarMobile";

// Função para pegar o ícone da categoria
const getCategoriaIcon = (categoria: string | number) => {
  switch (categoria) {
    case 2: return EstruturaIcon;
    case 1: return IluminacaoIcon;
    case 3: return geradorIcon;
    case 4: return climatizacaoIcon;
    case 5: return SaneamentoIcon;
    default: return BoxIcon;
  }
};

// Tipagem do Material para o Context
interface Material {
  id: number;
  Nome: string;
  status: string;
  categoria: number;
  quantidade: number;
  selecionado: boolean;
}

const categoriasDisponiveis = [
    { nome: "Iluminação", valor: 1 },
    { nome: "Estrutura", valor: 2 },
  { nome: "Gerador", valor: 3 },
  { nome: "Climatizacao", valor: 4 },
  { nome: "Sanitários", valor: 5 },
];

export default function CadastrarMateriais() {
  const router = useRouter();
  const { materiais, setMateriais } = useMateriais();

  const [nomeMaterial, setNomeMaterial] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number>(categoriasDisponiveis[0].valor);
  const [marcarTodos, setMarcarTodos] = useState(false);

  const adicionarMaterial = () => {
    if (!nomeMaterial.trim() || quantidade <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const novoMaterial: Material = {
      id: Date.now(),
      Nome: nomeMaterial.trim(),
      status: "em estoque",
      categoria: categoriaSelecionada,
      quantidade,
      selecionado: false,
    };

    setMateriais((prev: Material[]) => [...prev, novoMaterial]);
    setNomeMaterial("");
    setQuantidade(1);
    setCategoriaSelecionada(categoriasDisponiveis[0].valor);
  };

  const deletarMaterial = (id: number) => {
    setMateriais((prev: Material[]) => prev.filter((mat) => mat.id !== id));
  };

  const handleSelecionarMaterial = (id: number) => {
    setMateriais((prev: Material[]) =>
      prev.map((mat) =>
        mat.id === id ? { ...mat, selecionado: !mat.selecionado } : mat
      )
    );
  };

  const handleSelecionarTodos = () => {
    const novoValor = !marcarTodos;
    setMarcarTodos(novoValor);
    setMateriais((prev: Material[]) =>
      prev.map((mat) => ({ ...mat, selecionado: novoValor }))
    );
  };

  const deletarSelecionados = () => {
    setMateriais((prev: Material[]) => prev.filter((mat) => !mat.selecionado));
    setMarcarTodos(false);
  };

  const handleRevisar = () => {
    router.push("/Revisar-Materiais");
  };

  return (
    <div className="min-h-screen bg-[#100D1E] text-white p-4 flex flex-col gap-6 pb-32">
      <SidebarMobile />
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#292343] pb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={marcarTodos}
            onChange={handleSelecionarTodos}
            className="w-5 h-5"
          />
          <span>Todos</span>
        </div>
        <button onClick={deletarSelecionados}>
          <Image src={lixeira} alt="lixeira" width={32} className="cursor-pointer" />
        </button>
      </div>

      {/* Lista de Materiais */}
      <div className="flex flex-col gap-4">
        {materiais.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">Nenhum material adicionado ainda.</p>
        ) : (
          materiais.map((material) => (
            <div
              key={material.id}
              onClick={() => handleSelecionarMaterial(material.id)}
              className={`relative bg-[#1D1933] p-4 rounded-md cursor-pointer transition-all duration-300 border ${
                material.selecionado ? "border-[#43A3D5]" : "border-[#292343]"
              }`}
            >
              {/* Top icons */}
              <div className="absolute -top-4 left-0 right-0 flex justify-between items-center px-4">
                <input
                  type="checkbox"
                  checked={material.selecionado}
                  readOnly
                  className="w-5 h-5 pointer-events-none"
                />
                <div className="flex justify-center pointer-events-none">
                  <Image src={cubo} alt="cubo" width={32} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletarMaterial(material.id);
                  }}
                >
                  <Image src={lixeira} alt="lixeira" width={32} className="cursor-pointer hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Nome */}
              <div className="text-center mt-6">
                <div className="text-xs text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-1">
                  Nome do Material
                </div>
                <div className="p-[2px] rounded-md bg-gradient-to-r from-[#9C60DA] to-[#43A3D5] mb-4">
                  <div className="font-bold text-white text-base bg-[#1D1933] rounded-md px-4 py-2 text-center">
                    {material.Nome}
                  </div>
                </div>
              </div>

              {/* Categoria e Quantidade */}
              <div className="flex gap-4 justify-center">
                <div className="p-[2px] rounded-sm bg-gradient-to-r from-[#9C60DA] to-[#43A3D5]">
                  <div className="flex items-center gap-2 bg-[#1D1933] rounded-md px-3 py-1">
                    <Image
                      src={getCategoriaIcon(material.categoria)}
                      alt="ícone categoria"
                      width={20}
                      height={20}
                    />
                    <span className="text-sm">
                      {categoriasDisponiveis.find((cat) => cat.valor === material.categoria)?.nome}
                    </span>
                  </div>
                </div>
                <div className="p-[1px] rounded-md bg-gradient-to-r from-[#9C60DA] to-[#43A3D5]">
                  <div className="flex items-center gap-2 bg-[#1D1933] rounded-md px-3 py-1">
                    <Layers3 className="w-4 h-4" />
                    <span className="text-sm">{material.quantidade}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulário de Adicionar Material */}
      <div className="bg-[#1D1933] p-6 rounded-md border border-[#292343] flex flex-col gap-6">
        
        {/* Nome */}
        <div className="flex flex-col gap-2">
          <div className="p-[2px] rounded-md bg-[#463C61]">
            <input
              type="text"
              placeholder="Nome do material"
              value={nomeMaterial}
              onChange={(e) => setNomeMaterial(e.target.value)}
              className="w-full bg-[#1D1933] rounded-md outline-none text-white placeholder-gray-400 py-2 px-4"
            />
          </div>
        </div>

        {/* Categoria e Quantidade */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="p-[2px] rounded-md bg-[#463C61]">
              <div className="flex items-center gap-2 bg-[#1D1933] rounded-md px-4 py-2">
                <Image
                  src={getCategoriaIcon(categoriaSelecionada)}
                  alt="ícone categoria"
                  width={24}
                  height={24}
                />
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(Number(e.target.value))}
                  className="bg-transparent flex-1 outline-none text-white appearance-none"
                >
                  {categoriasDisponiveis.map((cat) => (
                    <option key={cat.valor} value={cat.valor} className="text-black">
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quantidade */}
          <div className="w-24 flex flex-col gap-2">
            <div className="p-[2px] rounded-md bg-[#463C61]">
              <input
                type="number"
                min={1}
                placeholder="Qtd"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full bg-[#1D1933] rounded-md outline-none text-white placeholder-gray-400 py-2 px-4"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Botão isolado fora da caixa */}
      <button
        onClick={adicionarMaterial}
        className="w-full mt-4 py-2 rounded-md border border-[#292343] text-white hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] transition-all flex items-center justify-center gap-2 bg-[#1D1933]"
      >
        <Package className="w-5 h-5" />
        Adicionar Material
      </button>

      {/* Navbar Inferior */}
      <NavbarInferior
        podeVoltar={false}
        onVoltar={() => {}}
        onRevisar={handleRevisar}
      />
    </div>
  );
}
