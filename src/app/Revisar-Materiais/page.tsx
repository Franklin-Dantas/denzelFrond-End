"use client";

import { useEffect, useState } from "react";
import { useMateriais } from "../../context/CadastrarMaterialContext";
import Image from "next/image";
import { ChevronDown, ChevronUp  } from "lucide-react";
import { getCategoriaIcon } from "../../helpers/GerarImagemCategoria";
import NavbarInferior from "../../components/NavPagesMobile";
import { useRouter } from "next/navigation"; 
import Quantidade from "/public/quantidade.svg"


export default function RevisarMateriais() {
  const { materiais, setMateriais } = useMateriais();
  const router = useRouter(); // Instanciar router
  const [aberto, setAberto] = useState<Record<number, boolean>>({});
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) setUserToken(token);
    }
  }, []);
  
  const categoriasDisponiveis = [
    { nome: "Estrutura", valor: 2 },
    { nome: "Iluminação", valor: 1 },
    { nome: "Climatização", valor: 4 },
    { nome: "Sanitários", valor: 5 },
    { nome: "Geradores", valor: 3 },
  ];

  const materiaisAgrupados = materiais.reduce((acc: Record<number, typeof materiais>, mat) => {
    if (!acc[mat.categoria]) acc[mat.categoria] = [];
    acc[mat.categoria].push(mat);
    return acc;
  }, {});

  const toggleCategoria = (categoria: number) => {
    setAberto(prev => ({ ...prev, [categoria]: !prev[categoria] }));
  };

  const handleVoltar = () => {
    router.push("/Cadastrar-Materiais");
  };
  
  if (typeof window !== "undefined" && !userToken) {
    return <p className="text-center text-white">Carregando...</p>;
  }
  const handleFinalizar = async () => {
    try {
      // 📢 Aqui explode os materiais pela quantidade
      const materiaisParaEnviar = materiais.flatMap((material) =>
        Array.from({ length: material.quantidade || 1 }, () => ({
          Nome: material.Nome,
          status: material.status, // sempre "em estoque"
          categoria: material.categoria,
        }))
      );
  
      console.log("Enviando materiais EXPANDIDOS:", materiaisParaEnviar);
  
      const response = await fetch("https://denzel-backend.onrender.com/api/materiais/Criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(materiaisParaEnviar),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao enviar materiais");
      }
  
      const data = await response.json();
      console.log("Materiais cadastrados com sucesso:", data);
  
      setMateriais([]);
      router.push("/Cadastrar-Materiais");
    } catch (error) {
      console.error("Erro ao finalizar cadastro:", error);
      alert("Erro ao cadastrar materiais. Tente novamente.");
    }
  };
  

  return (
    <div className="min-h-screen bg-[#100D1E] text-white p-6 flex flex-col gap-4 pb-32">
      {categoriasDisponiveis.map((cat) => (
        materiaisAgrupados[cat.valor] ? (
          <div key={cat.valor} className="bg-[#1D1933]  border border-[#292343]">
            <button
              onClick={() => toggleCategoria(cat.valor)}
              className="w-full flex justify-between items-center p-4 hover:bg-[#292343] "
            >
              <div className="flex items-center gap-2">
                <Image src={getCategoriaIcon(cat.valor)} alt="ícone" width={24} height={24} />
                <span className="text-lg font-semibold text-transparent bg-gradient-to-r from-[#9C60DA] to-[#43A3D5] bg-clip-text">
                    {cat.nome}
                    </span>
              </div>
              {aberto[cat.valor] ? <ChevronUp /> : <ChevronDown />}
            </button>

            {aberto[cat.valor] && (
              <div className="flex flex-col gap-2 p-4">
                {materiaisAgrupados[cat.valor].map((material) => (
                  <div
                    key={material.id}
                    className="flex justify-between items-center bg-[#15112B]  p-3 border border-[#292343]"
                  >
                     <div className="flex items-center gap-2">
                     <Image
                      src={getCategoriaIcon(material.categoria)}
                      alt="ícone material"
                      width={20}
                      height={20}
                    />
                    <span>{material.Nome}</span>
                        </div>
                    
                    <div className="flex items-center gap-2">
                      <Image src={Quantidade} alt="ícone" width={16} height={16} />
                      <span>{material.quantidade}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null
      ))}

      <NavbarInferior
  podeVoltar={true}
  onVoltar={handleVoltar}
  onRevisar={handleFinalizar}
  modoRevisao={true} 
/>

    </div>
  );
}
