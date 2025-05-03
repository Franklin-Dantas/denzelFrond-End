"use client";
import { useEffect, useState } from "react";
import {  Plus } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NavPages from "../../components/NavPages";
import IUsuario from "../../@Types/Usuarios";
import { IEvento } from "../../@Types/Evento";
import UserIcon from "/public/Profile.svg";
import Filters from "/public/Filters.svg";
import Lixeira from "/public/Lixeira.svg";
import Editar from "/public/Editar.svg";
import Image from "next/image";
import ModalCadastroColaborador from "../../components/ModalCadastroUsuario";
import ModalEditarColaborador from "../../components/ModalEditarColaborador";
import ModalExcluirColaborador from "../../components/ModalDeletarUser";
import BuscarColaborador from "../../components/BuscarColaborador";

export default function Colaborador() {
  const USER_URL = "https://denzel-backend.onrender.com/api/usuarios/listar";
  const EVENTO_BY_ID = "https://denzel-backend.onrender.com/api/eventos/listar";

  const [colaboradores, setColaboradores] = useState<IUsuario[]>([]);
  const [eventos, setEventos] = useState<Record<number, IEvento>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false); 
  const [idColaborador, setIdColaborador] = useState<number | null>(null);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<IUsuario | null>(null);
  const [modalExcluirOpen, setModalExcluirOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [todosColaboradores, setTodosColaboradores] = useState<IUsuario[]>([]);

  const limit = 10;
  const atualizarListas = async () => {
    await fetchColaboradores();
    await fetchTodosColaboradores();
  };
  
  useEffect(() => {
    fetchTodosColaboradores()
    fetchColaboradores();
  }, [page]);
  async function fetchTodosColaboradores() {
    setLoading(true);
    try {
      const response = await fetch(`${USER_URL}Todos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar colaboradores.");

      const data = await response.json();
      setTodosColaboradores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar colaboradores.");
    } finally {
      setLoading(false);
    }
  }
  async function fetchColaboradores() {
    setLoading(true);
    try {
      const response = await fetch(`${USER_URL}?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar colaboradores.");

      const data = await response.json();
      setColaboradores(Array.isArray(data.data) ? data.data : []);
      setTotalPages(Math.ceil(data.totalPages / 10) || 1); 
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar colaboradores.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    async function fetchEventos() {
      if (colaboradores.length === 0) return;

      try {
        const eventosTemp: Record<number, IEvento> = {};

        for (const user of colaboradores) {
          if (user.IdMontagem) {
            const token = localStorage.getItem("token");
            const res = await fetch(`${EVENTO_BY_ID}/${user.IdMontagem}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) {
              const data = await res.json();
              eventosTemp[user.IdMontagem] = data;
            }
          }
          if (user.IdDesmontagem) {
            const token = localStorage.getItem("token");
            const res = await fetch(`${EVENTO_BY_ID}/${user.IdDesmontagem}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.ok) {
              const data = await res.json();
              eventosTemp[user.IdDesmontagem] = data;
            }
          }
        }

        setEventos(eventosTemp);
      } catch (error) {
        console.error(error);
        setError("Erro ao carregar eventos.");
      }
    }

    fetchEventos();
  }, [colaboradores]);

  const getEventoNome = (eventoId: number | undefined) => {
    if (!eventoId) return "N/A";
    const eventoEncontrado = eventos[eventoId];
    return eventoEncontrado ? eventoEncontrado.Nome || "Não encontrado" : "Não encontrado";
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "Não informado";
    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length === 11) {
      return cleanedPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };
  const termo = searchTerm.toLowerCase();

  const colaboradoresFiltrados = todosColaboradores.filter((user) => {
    const nomeColaborador = user.Nome?.toLowerCase() || "";
    const telefoneColaborador = user.contato?.replace(/\D/g, "") || "";
  
    if (isNaN(Number(termo))) {

      return nomeColaborador.includes(termo);
    } else {
      const termoNumerico = termo.replace(/\D/g, "");
      return telefoneColaborador.includes(termoNumerico);
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />
      <div className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Image src={UserIcon} alt="Colaboradores" width={24} height={24} />
            <h1>Colaboradores</h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <div className="relative flex items-center w-full md:w-1/3">
            <BuscarColaborador value={searchTerm} onChange={setSearchTerm} />

            </div>
            <div className="flex gap-4 flex-wrap">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#292343] hover:bg-[#3A2F55] transition">
                <Image src={Filters} width={16} height={16} alt="Filtros" />
                Filtrar
              </button>
              <button onClick={()=>setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 transition">
                <Plus size={16} />
                Novo colaborador
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

          {loading ? (
            <p className="text-gray-400 mt-6 text-center">Carregando colaboradores...</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image src={UserIcon} alt="Colaborador" width={12} height={12} />
                          <span className="font-bold text-white">Colaborador</span>
                        </div>
                        <div className="w-[180px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white">Telefone</span>
                        </div>
                        <div className="w-[140px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white">Função</span>
                        </div>
                        <div className="w-[120px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white">Montagem</span>
                        </div>
                        <div className="w-[150px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white">Desmontagem</span>
                        </div>
                        <div className="w-[150px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3 text-center">
                      <div className="flex flex-col items-start w-full">
                        <div className="font-bold text-white text-center">Excluir | Editar</div>
                        <div className="w-[121px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
  {colaboradoresFiltrados.length > 0 ? (
    colaboradoresFiltrados.map((user) => (
      <tr key={user.id} className="border-b border-gray-700 hover:bg-[#1D1933] transition">
        <td className="p-3 flex items-center gap-4">
          <Image src={UserIcon} alt="Colaborador" width={24} height={24} />
          {user.Nome}
        </td>
        <td className="p-3">{formatPhone(user.contato)}</td>
        <td className="p-3">{user.funcao || "Não informado"}</td>
        <td className="p-3">{getEventoNome(user.IdMontagem)}</td>
        <td className="p-3">{getEventoNome(user.IdDesmontagem)}</td>
        <td className="p-3 flex justify-center gap-2">
            <button
              onClick={() => {
                setIdColaborador(user.id);
                setColaboradorSelecionado(user);
                setModalExcluirOpen(true);
              }}
              className="text-blue-400 bg-gradient-to-l from-[#100D1E] to-[#100D1E] hover:from-[#9C60DA] hover:to-[#43A3D5] transition duration-300 rounded-full"
            >
              <Image src={Lixeira} width={28} height={28} alt="Excluir" />
            </button>
            <button
              onClick={() => {
                setIdColaborador(user.id);
                setModalEditarOpen(true);
                setColaboradorSelecionado(user);
              }}
              className="text-blue-400 bg-gradient-to-l from-[#100D1E] to-[#100D1E] hover:from-[#9C60DA] hover:to-[#43A3D5] transition duration-300 rounded-full"
            >
              <Image src={Editar} width={28} height={28} alt="Editar" />
            </button>
          </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="p-3 text-center text-gray-400">
        Nenhum colaborador encontrado.
      </td>
    </tr>
  )}
</tbody>


              </table>
            </div>
          )}
        <div className="flex justify-end gap-4 mt-[80px] mb-[40px] pt-4 border-t border-[#292343]">
                 <NavPages page={page} totalPages={totalPages} setPage={setPage} />
              </div>
        </div>
        
      </div>
      {colaboradorSelecionado && (
  <ModalEditarColaborador
    isOpen={modalEditarOpen}
    onClose={() => {
      setModalEditarOpen(false);
      atualizarListas();
    }}
    idColaborador={idColaborador ?? 0}
    colaborador={colaboradorSelecionado} 
  />
)}
{colaboradorSelecionado && (
  <ModalExcluirColaborador
    isOpen={modalExcluirOpen}
    onClose={() => {
      setModalExcluirOpen(false);
      atualizarListas();
    }}
    idColaborador={idColaborador ?? 0}
    nomeColaborador={colaboradorSelecionado.Nome}
    onSuccess={() => {
      setModalExcluirOpen(false);
      atualizarListas();
    }}
    
  />
)}

      <ModalCadastroColaborador isOpen={modalOpen} onClose={() => { setModalOpen(false); atualizarListas(); }} />
      
      <Footer />
    </div>
  );
}
