"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ModalAdicionarMaterialNovoEvento from "../../components/ModalAdicionarMaterialNovoEvento";
import MateriaisIcon from "/public/Material.svg";
import QuantidadeIcon from "/public/quantidade.svg";
import CategoriaIcon from "/public/Categoria.svg";
import RedAlert from "/public/Alert.svg";
import Trash from "/public/Lixeira.svg";
import Image from "next/image";
import { getCategoriaIcon } from "../../helpers/GerarImagemCategoria";
import { useFormularioEvento } from "../../context/FormularioEventoContext";
import { useEnviarEvento } from "../../hooks/MontarPayLoader";

interface MaterialSelecionado {
  nome: string;
  quantidade: number;
  categoria: number; 
}

export default function AdicionarMateriais() {
  const [modalAberto, setModalAberto] = useState(false);
  const { materiais, setMateriais } = useFormularioEvento();
  
  const enviarEvento = useEnviarEvento();
  const alocarMateriais = (novosMateriais: MaterialSelecionado[]) => {
    setMateriais((materiaisAtuais) => {
      const mapa = new Map<string, MaterialSelecionado>();
      materiaisAtuais.forEach((mat) => mapa.set(mat.nome, mat));
      novosMateriais.forEach((mat) => mapa.set(mat.nome, mat));
      return Array.from(mapa.values());
    });
    setModalAberto(false);
  };

  const removerMaterial = (index: number) => {
    setMateriais((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />
      <main className="flex-grow px-4 sm:px-8 md:px-16 lg:px-[320px] py-10 flex flex-col gap-10">
        {/* Título e botão */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light text-hover-gradient">Novo Evento</h2>
          <button
            onClick={() => setModalAberto(true)}
            className="px-5 py-[10px] border border-white rounded-full flex items-center gap-2 hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] transition"
          >
            + Adicionar Material
          </button>
        </div>

        {/* Tabela de Materiais */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292343] text-sm text-white">
                <th className="py-2">
                  <div className="flex items-center gap-2">
                    <Image src={MateriaisIcon} alt="Materiais" width={16} height={16} />
                    <span>Materiais</span>
                  </div>
                </th>
                <th className="py-2">
                  <div className="flex items-center gap-2">
                    <Image src={QuantidadeIcon} alt="Quantidade" width={16} height={16} />
                    <span>Quantidade</span>
                  </div>
                </th>
                <th className="py-2">
                  <div className="flex items-center gap-2">
                    <Image src={CategoriaIcon} alt="Categoria" width={16} height={16} />
                    <span>Categoria</span>
                  </div>
                </th>
                <th className="py-2">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <Image src={RedAlert} alt="Alerta" width={16} height={16} />
                      <span className="text-red-600 font-bold">Alerta</span>
                    </div>
                    <div className="w-[80px] h-[1px] bg-red-600 mt-1" />
                  </div>
                </th>
                <th className="py-2">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((mat, index) => (
                <tr key={index} className="border-b border-[#292343] text-white text-sm">
                  <td className="py-3">{mat.nome}</td>
                  <td>{mat.quantidade}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Image
                        src={getCategoriaIcon(mat.categoria)}
                        alt="Ícone categoria"
                        width={18}
                        height={18}
                      />
                      <span>{mat.categoria}</span>
                    </div>
                  </td>
                  <td className="text-red-400"> {/* alerta pode ser condicional depois */} </td>
                  <td>
                    <button onClick={() => removerMaterial(index)}>
                      <Image src={Trash} alt="Excluir" width={20} height={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalAberto && (
          <ModalAdicionarMaterialNovoEvento
            onClose={() => setModalAberto(false)}
            onSelecionar={alocarMateriais}
          />
        )}

        {/* Navegação */}
        <div className="flex justify-between mt-8">
          <button className="px-6 py-2 rounded-l-[30px] border border-slate-200 text-white" >◀ Voltar</button>
          
          <button className="px-6 py-2 rounded-r-[30px] border border-slate-200 text-white" onClick={() => enviarEvento.enviarEvento()}>Revisar ▶</button>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
