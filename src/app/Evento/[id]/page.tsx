"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IEventos } from "../../../@Types/Eventos";
import Material from "../../../@Types/Material";
import ICliente from "../../../@Types/Clientes";
import { GerarCategoria } from "../../../helpers/GerarCategoria";
import { getCategoriaIcon } from "../../../helpers/GerarImagemCategoria";
import Card from "../../../components/Card";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ModalAdicionarMaterial from "../../../components/ModalAdicionarMaterial";
import EditarEventoModal from "../../../components/ModalEditarEvento";
import Image from "next/image";
import ModalVisualizarImagem from "../../../components/ModalImagem";
import AlertGray from "/public/Alert-Gray.svg";
import Local from "/public/Location.svg";
import perfilEvento from "/public/PerfilEvento.svg";
import Telefone from "/public/Telefone.svg";
import IdSvg from "/public/Id.svg";
import Email from "/public/Email.svg";
import User from "/public/ClientePurple.svg";
import Solicita from "/public/Solicitacao.svg";
import Materiais from "/public/Material.svg";
import Editar from "/public/Edit.svg";
import Excluir from "/public/Lixeira.svg";
import image from "/public/Image.svg";
import eventoColorido from "/public/EventoColorido.svg";

const EventoDetalhes = () => {
  const [evento, setEvento] = useState<IEventos | null>(null);
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeResponsavelMontagem, setNomeResponsavelMontagem] = useState<string | null>(null);
  const [nomeResponsavelDesmontagem, setNomeResponsavelDesmontagem] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id;
  const [modalImagemAberto, setModalImagemAberto] = useState(false);
  const abrirModal = () => setIsModalOpen(true);
  const fecharModal = async () => {
    setIsModalOpen(false);
    await fetchEvento();
  };
 
  const fetchResponsavel = async (idResponsavel: number) => {
    try {
      const response = await fetch(`denzelbackend-f5faejb8a3akg9fu.brazilsouth-01.azurewebsites.net/api/usuarios/buscar/${idResponsavel}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      return data.Nome;
    } catch (error) {
      console.error("Erro ao buscar responsável:", error);
      return null;
    }
  };

  const fetchEvento = async () => {
    try {
      setLoading(true);
      const response = await fetch(`denzelbackend-f5faejb8a3akg9fu.brazilsouth-01.azurewebsites.net/api/eventos/Listar-Evento/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data) {
        console.log("📅 Evento recebido:", data);
        console.log("🖼️ Imagem recebida:", data.AnexoImagem);
        setEvento(data);
        fetchCliente(data.IdCliente);

        if (data.IdEncarregadoEstruturaMontagem) {
          const nomesMontagem = await Promise.all(
            data.IdEncarregadoEstruturaMontagem.split(",").map((id: string) => fetchResponsavel(Number(id.trim())))
          );
          setNomeResponsavelMontagem(nomesMontagem.filter(Boolean).join(", "));
        }

        if (data.IdEncarregadoEstruturaDesmontagem) {
          const nomesDesmontagem = await Promise.all(
            data.IdEncarregadoEstruturaDesmontagem.split(",").map((id: string) => fetchResponsavel(Number(id.trim())))
          );
          setNomeResponsavelDesmontagem(nomesDesmontagem.filter(Boolean).join(", "));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCliente = async (idCliente: number) => {
    try {
      const response = await fetch(`denzelbackend-f5faejb8a3akg9fu.brazilsouth-01.azurewebsites.net/api/eventos/cliente/${idCliente}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setCliente(Array.isArray(data) && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
    }
  };

  const excluirMaterial = async (idMaterial: number) => {
    try {
      const response = await fetch(
        `denzelbackend-f5faejb8a3akg9fu.brazilsouth-01.azurewebsites.net/api/eventos/removerMaterial/${idMaterial}?eventoId=${evento?.Id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        await fetchEvento();
      } else {
        console.error("Erro ao excluir material.");
      }
    } catch (error) {
      console.error("Erro ao excluir material:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvento();
    }
  }, [id]);

  if (loading) return <div className="text-center text-white">Carregando evento...</div>;
  if (!evento) return <div className="text-center text-white">Evento não encontrado.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E]  text-white">
      <Header />
  
      {/* CABEÇALHO RESPONSIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-6 lg:px-[100px] xl:px-[200px] mt-8 mb-[30px]">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Image src={perfilEvento} alt="Evento" width={24} height={24} />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-500">Perfil do Evento</h1>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400 whitespace-nowrap">| {evento.Nome}</h1>
        </div>
  
        <div className="flex flex-wrap justify-end items-center gap-2 md:gap-3 w-full md:w-auto">
        <button
  onClick={() => setModalImagemAberto(true)}
  className="flex items-center gap-2 border px-4 py-1 rounded-[30px] w-full md:w-auto justify-center"
>
  <Image src={image} alt="Imagens" className="w-5 h-5" />
  <span className="text-sm">Imagens</span>
</button>
          <div className="relative w-full md:w-auto">
            <button className="flex items-center gap-2 border px-4 py-1 rounded-[30px] w-full md:w-auto justify-center">
              <Image src={image} alt="Notificações" className="w-[20px] h-[20px]" />
              <span className="text-sm">Notificações</span>
            </button>
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">99+</span>
          </div>
          <button className="flex items-center gap-2 border px-4 py-1 rounded-[30px] w-full md:w-auto justify-center">
            <Image src={image} alt="Imprimir" className="w-5 h-5" />
            <span className="text-sm">Imprimir</span>
          </button>
        </div>
      </div>
  
      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-col lg:flex-row items-start gap-8 mt-8 px-4 md:px-6 lg:px-[100px] xl:px-[200px]">
        <Card className="p-6 w-full lg:w-[511px]">
          <div className="flex flex-col gap-6 items-start">
            <div className="flex flex-col gap-1 items-start">
              <div className="flex flex-wrap items-center gap-2">
                <Image src={eventoColorido} alt="Evento" width={24} height={24} />
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-hover-gradient">{evento.Nome}</h1>
                <button onClick={abrirModal}>
                  <Image src={Editar} alt="Editar" width={28} height={28} />
                </button>
              </div>
              <h4 className="text-sm md:text-base text-purple-font font-bold mt-1">Id {evento.Id}</h4>
            </div>
  
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Image src={Local} alt="Local" width={16} height={16} />
              <p>{evento.Local}</p>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
              <div className="flex flex-col items-start gap-2">
                <h4 className="text-purple-font text-sm md:text-base font-bold">Início do Evento:</h4>
                <p>{`${new Date(evento.DataInicio).toLocaleDateString()} ${evento.HoraInicio}`}</p>
                <h4 className="text-purple-font text-sm md:text-base font-bold">Montagem:</h4>
                <p>{new Date(evento.MontagemInicio).toLocaleDateString()}</p>
                <h4 className="text-purple-font text-sm md:text-base font-bold">Responsável pela Montagem:</h4>
                <p>{nomeResponsavelMontagem || "Não alocado"}</p>
              </div>
  
              <div className="flex flex-col items-start gap-2">
                <h4 className="text-blue-font text-sm md:text-base font-bold">Fim do Evento:</h4>
                <p>{`${new Date(evento.DataFim).toLocaleDateString()} ${evento.HoraFim}`}</p>
                <h4 className="text-blue-font text-sm md:text-base font-bold">Desmontagem:</h4>
                <p>{new Date(evento.DesmontagemInicio).toLocaleDateString()}</p>
                <h4 className="text-blue-font text-sm md:text-base font-bold">Responsável pela Desmontagem:</h4>
                <p>{nomeResponsavelDesmontagem || "Não alocado"}</p>
              </div>
            </div>
          </div>
        </Card>
  
        <Card className="p-6 w-full lg:w-[437px] mt-8 lg:mt-[105px] mb-[30px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image src={User} alt="Cliente" width={24} height={24} />
              <h4 className="text-lg sm:text-xl font-bold text-hover-gradient">{cliente?.Nome}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Image src={Telefone} alt="Telefone" width={16} height={16} />
              <p>{cliente?.contato || "Não informado"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src={Email} alt="Email" width={16} height={16} />
              <p>{cliente?.email || "Não informado"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src={IdSvg} alt="ID" width={16} height={16} />
              <p>{cliente?.cpf_cnpj || "Não informado"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src={Local} alt="Endereço" width={16} height={16} />
              <p>{cliente?.cep || "Não informado"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* TABELA DE MATERIAIS */}
      <Card className="p-4 mt-8 mx-8 xl:px-[200px]">
        <div className="flex gap-2 mb-4 xl:px-[200px]">
          <Image src={Solicita} alt="Solicitação" width={273} height={30} />
        </div>
        <table className="w-full text-left border-collapse ">
          <thead>
            <tr className="border-b text-white text-sm">
              <th className="p-2">Materiais</th>
              <th className="p-2">Quantidade</th>
              <th className="p-2">Categoria</th>
              <th className="p-2">Alerta</th>
              <th className="p-2">Excluir</th>
            </tr>
          </thead>
          <tbody>
  {(() => {
    const materiaisAlocados = (evento.Materiais as unknown as Material[])?.reduce((acc, material) => {
      const nome = material.Nome.toLowerCase().trim();
      if (!acc[nome]) {
        acc[nome] = { material, total: 0 };
      }
      acc[nome].total += 1;
      return acc;
    }, {} as Record<string, { material: Material; total: number }>);

    const faltantes = (evento.Materiais_Faltando || "")
      .split(",")
      .map((f) => {
        const match = f.match(/^(.+?) \((\d+)\)$/);
        if (match) {
          return { nome: match[1].trim(), quantidade: parseInt(match[2]) };
        }
        return null;
      })
      .filter(Boolean) as { nome: string; quantidade: number }[];

    const todosMateriaisMap = new Map<string, { material: Material | null; total: number; quantidadeFaltante: number }>();

    Object.entries(materiaisAlocados).forEach(([nome, { material, total }]) => {
      const faltante = faltantes.find(f => f.nome.toLowerCase() === material.Nome.toLowerCase());
      todosMateriaisMap.set(nome, {
        material,
        total,
        quantidadeFaltante: faltante?.quantidade || 0,
      });
    });

    faltantes.forEach(faltante => {
      const nome = faltante.nome.toLowerCase();
      if (!todosMateriaisMap.has(nome)) {
        todosMateriaisMap.set(nome, {
          material: null,
          total: 0,
          quantidadeFaltante: faltante.quantidade,
        });
      }
    });

    return Array.from(todosMateriaisMap.entries()).map(([nome, { material, total, quantidadeFaltante }], index) => (
      <tr key={`${nome}-${index}`} className="border-b">
        <td className="p-2">{material?.Nome || nome}</td>
        <td className="p-2">{total}</td>
        <td className="p-2 flex items-center gap-2">
          {material ? (
            <>
              <Image src={getCategoriaIcon(Number(material.categoria))} alt="Categoria" width={16} height={16} />
              {GerarCategoria(Number(material.categoria))}
            </>
          ) : (
            <div className="text-center">-----</div>
          )}
        </td>
        <td className="p-2">
          {quantidadeFaltante > 0 ? (
            <div className="flex items-center justify-center gap-2 bg-red-600 w-[121px] h-[38px]">
              <Image src={AlertGray} alt="Alerta" width={20} height={20} />
              <span className="text-white font-bold">-{quantidadeFaltante}</span>
            </div>
          ) : (
            <div className="text-center">-----</div>
          )}
        </td>
        <td className="p-2">
          <button
            onClick={() => {
              if (material) {
                excluirMaterial(material.id ?? 0);
              } else {
                alert("⚠️ Este material ainda não foi alocado e não pode ser excluído.");
              }
            }}
          >
            <Image src={Excluir} alt="Excluir" width={20} height={20} />
          </button>
        </td>
      </tr>
    ));
  })()}
</tbody>






        </table>

        <div className="mt-4">
          <button
            className="flex items-center gap-2 text-white px-4 py-2 rounded bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500"
            onClick={() => setModalAberto(true)}
          >
            <Image src={Materiais} alt="Material" width={20} height={20} />
            <span>Adicionar Material</span>
          </button>
        </div>

        <EditarEventoModal idEvento={evento.Id} isOpen={isModalOpen} onClose={fecharModal} />
        {modalAberto && (
          <ModalAdicionarMaterial
            onClose={() => setModalAberto(false)}
            onSelecionar={async () => {
              await fetchEvento();
            }}
            idEvento={evento.Id}
          />
        )}
      </Card>
      <ModalVisualizarImagem
  imagemUrl={evento.AnexoImagem || ""}
  isOpen={modalImagemAberto}
  onClose={() => setModalImagemAberto(false)}
/>
      <Footer />
    </div>
  );
};

export default EventoDetalhes;