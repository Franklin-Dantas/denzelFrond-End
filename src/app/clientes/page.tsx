"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {  Plus } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ClienteIcon from "/public/Cliente.png";
import Lixeira from "/public/Lixeira.svg";
import Editar from "/public/Editar.svg";
import Filters from "/public/Filters.svg";
import Image from "next/image";
import Cliente from "../../types/Cliente";
import ClienteModal from "../../components/ModalCadastroCliente"; 
import { createCliente } from "../../helpers/ApiHelper";
import NavPages from "../../components/NavPages";
import ClientesTitulo from "/public/Titulo-Clientes.svg"
import EventosIcon from "/public/Eventos.svg";
import IdIcon from "/public/Id.svg";
import TelefoneIcon from "/public/Telefone.svg";
import EditarClienteModal from "../../components/MoldalEditarCliente";
import ModalExcluirCliente from "../../components/ModalDeletarClientes";
import BuscarCliente from "../../components/BuscarCliente";

export default function Clientes() {
  const USER_URL = "https://denzel-backend.onrender.com/api/clientes/Listar";
  const EVENT_URL = "https://denzel-backend.onrender.com/api/eventos/Listar-Evento";

  const [isModalExcluirOpen, setIsModalExcluirOpen] = useState(false);
const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page,setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [eventosNomes, setEventosNomes] = useState<{ [key: number]: string }>({});
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState<string | null>(null);
  const limit = 10;
  const [clienteParaEditarId, setClienteParaEditarId] = useState<number | null>(null);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
const [ordenacaoAscendente, setOrdenacaoAscendente] = useState(true);
const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
const [mostrarDropdown, setMostrarDropdown] = useState(false);
const [dropdownLocked, setDropdownLocked] = useState(false);
  useEffect(() => {
    const tokenLocal = localStorage.getItem("token");
    setToken(tokenLocal);
  }, []);

  const fetchClientes = useCallback(async () => {
    if (!token) return;
  
    try {
      const response = await fetch(`${USER_URL}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Erro ao buscar os clientes.");
      }
  
      const clientesData = await response.json();
      setClientes(Array.isArray(clientesData.data) ? clientesData.data : []);
      setTotalPages(Math.ceil(clientesData.totalItems / 10) || 1);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }, [token, page]); // Aqui usamos o useCallback para memorizar a função
  
  const fetchTodosClientes = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`https://denzel-backend.onrender.com/api/clientes/ListarTodos`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar todos os clientes.");
      }
      const clientesData = await response.json();
      setTodosClientes(Array.isArray(clientesData) ? clientesData : []);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchClientes();
    fetchTodosClientes();
  }, [token, page, fetchClientes, fetchTodosClientes]);
  
  
  
  
  
  useEffect(() => {
    async function fetchEventosNomes() {
      if (!token) return;
  
      const eventosCache: { [key: number]: string } = {};
  
      const clientesParaBuscar = [...clientes, ...todosClientes];
  
      const requests = clientesParaBuscar.map(async (cliente) => {
        if (cliente.idsEventos) {
          const idsArray = cliente.idsEventos.toString().split(",").filter(id => id.trim() !== "");
          const ultimoEventoId = idsArray[idsArray.length - 1];
  
          try {
            const response = await fetch(`${EVENT_URL}/${ultimoEventoId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (!response.ok) {
              eventosCache[Number(ultimoEventoId)] = "Erro ao buscar evento";
              return;
            }
  
            const eventoDataRaw = await response.json();
            const eventoData = Array.isArray(eventoDataRaw) ? eventoDataRaw[0] : eventoDataRaw;
  
            eventosCache[Number(ultimoEventoId)] = eventoData?.Nome || "Nome não encontrado";
  
          } catch {
            eventosCache[Number(ultimoEventoId)] = "Evento não encontrado";
          }
        }
       
      });
  
      await Promise.all(requests);
  
      setEventosNomes(eventosCache);
    }
  
    if (clientes.length > 0 || todosClientes.length > 0) {
      fetchEventosNomes();
    }
  }, [clientes, todosClientes, token]);
  

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300); 
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  const termo = debouncedSearchTerm.toLowerCase();

  const clientesParaFiltrar = termo ? todosClientes : clientes;
  
  const clientesFiltrados = clientesParaFiltrar
  .filter((cliente) => {
    const nomeCliente = cliente.Nome?.toLowerCase() || "";
    const contatoCliente = cliente.contato?.replace(/\D/g, "") || "";
    const cpfCnpjCliente = cliente.cpf_cnpj?.replace(/\D/g, "") || "";

    if (isNaN(Number(termo))) {
      return nomeCliente.includes(termo);
    } else {
      const termoNumerico = termo.replace(/\D/g, "");
      return contatoCliente.includes(termoNumerico) || cpfCnpjCliente.includes(termoNumerico);
    }
  })
  .sort((a, b) => {
    if (ordenacaoAscendente) {
      return a.Nome.localeCompare(b.Nome);
    } else {
      return b.Nome.localeCompare(a.Nome);
    }
  });

  

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const abrirDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setMostrarDropdown(true);
    setDropdownLocked(true);
  
    // mantém aberto por no mínimo 300ms
    setTimeout(() => setDropdownLocked(false), 300);
  };
  
  const fecharDropdown = () => {
    if (dropdownLocked) return; // se ainda está no tempo mínimo, não fecha
    dropdownTimeout.current = setTimeout(() => {
      setMostrarDropdown(false);
    }, 100); // pequeno atraso para mouse sair suavemente
  };

  const handleFormSubmit = async (data: Cliente) => {
    console.log("Dados do formulário:", data);
    const clienteId = await createCliente(data); 
    if (clienteId) {
      alert("Cliente criado com sucesso!");
      handleCloseModal(); 
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />
      <div className="flex-grow"> 
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Image src={ClientesTitulo} alt="Clientes" width={170} height={40} />
          </div>
  
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <div className="relative flex items-center w-full md:w-1/3">
              <BuscarCliente value={searchTerm} onChange={setSearchTerm} />
            </div>
  
            <div className="flex gap-4 flex-wrap">
            <div
  className="relative"
  onMouseEnter={abrirDropdown}
  onMouseLeave={fecharDropdown}
>
  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#292343] hover:bg-[#3A2F55] transition">
    <Image src={Filters} width={16} height={16} alt="Filtros" />
    Filtrar
  </button>

  {mostrarDropdown && (
    <div className="absolute top-full left-0 mt-2 w-48 bg-[#1D1933] text-white rounded-lg shadow-lg border border-[#292343] z-50">
      <ul className="py-2">
        <li
          className="px-4 py-2 hover:bg-[#2C2740] cursor-pointer"
          onClick={() => {
            setOrdenacaoAscendente(true);
            setMostrarDropdown(false);
          }}
        >
          Nome (A → Z)
        </li>
        <li
          className="px-4 py-2 hover:bg-[#2C2740] cursor-pointer"
          onClick={() => {
            setOrdenacaoAscendente(false);
            setMostrarDropdown(false);
          }}
        >
          Nome (Z → A)
        </li>
      </ul>
    </div>
  )}
</div>


  
              <button
                onClick={handleOpenModal} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 transition"
              >
                <Plus size={16} />
                Novo Cliente
              </button>
            </div>
          </div>
  
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
  
          {loading ? (
            <p className="text-gray-400 mt-6 text-center">Carregando clientes...</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse border-spacing-y-2 text-left px-4 py-3">
                <thead>
                  <tr className=" text-gray-300 text-left">
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image src={ClienteIcon} alt="Clientes" width={12} height={12} />
                          <span className="font-bold text-white">Clientes</span>
                        </div>
                        <div className="w-[250px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
  
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image src={EventosIcon} alt="Eventos" width={12} height={12} />
                          <span className="font-bold text-white">Últimos eventos</span>
                        </div>
                        <div className="w-[300px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
  
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image src={TelefoneIcon} alt="Telefone" width={12} height={12} />
                          <span className="font-bold text-white">Telefone</span>
                        </div>
                        <div className="w-[115px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
  
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image src={IdIcon} alt="Id" width={12} height={12} />
                          <span className="font-bold text-white">Cpf/Cnpj</span>
                        </div>
                        <div className="w-[115px] h-[1px] bg-gray-500 mt-1" />
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
                  {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((cliente, index) => {
                      const nomeUltimoEvento = (() => {
                        if (cliente.idsEventos) {
                          const idsArray = cliente.idsEventos.toString().split(",").filter(id => id.trim() !== "");
                          const ultimoEventoId = idsArray[idsArray.length - 1];
                          return eventosNomes[Number(ultimoEventoId)] || "Nenhum evento encontrado";
                        }
                        return "Nenhum evento registrado";
                      })();
  
                      return (
                        <tr key={index} className="border-b border-gray-700 hover:bg-[#1D1933] transition">
                          <td className="p-3 flex items-center gap-4">
                            <Image src={ClienteIcon} alt="Cliente" width={24} height={24} />
                            {cliente.Nome}
                          </td>
                          <td className="p-3">{nomeUltimoEvento}</td>
                          <td className="p-3">{cliente.contato || "Não informado"}</td>
                          <td className="p-3">{cliente.cpf_cnpj || "Não informado"}</td>
                          <td className="p-3 flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setClienteParaExcluir(cliente);
                                setIsModalExcluirOpen(true);
                              }}
                              className="text-red-400 hover:text-red-500 transition"
                            >
                              <Image src={Lixeira} width={28} height={28} alt="Excluir" />
                            </button>
                            <button
                              onClick={() => {
                                setClienteParaEditarId(cliente.id);
                                setIsModalEditarOpen(true);
                              }}
                              className="text-blue-400 bg-gradient-to-l from-[#100D1E] to-[#100D1E] hover:from-[#9C60DA] hover:to-[#43A3D5] transition duration-300 rounded-full"
                            >
                              <Image src={Editar} width={28} height={28} alt="Editar" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-gray-400">
                        Nenhum cliente encontrado.
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
      <Footer />
  
      {clienteParaExcluir && (
        <ModalExcluirCliente
          isOpen={isModalExcluirOpen}
          onClose={() => {
            setIsModalExcluirOpen(false);
            setClienteParaExcluir(null);
          }}
          idCliente={clienteParaExcluir.id}
          nomeCliente={clienteParaExcluir.Nome}
          onSuccess={() => fetchClientes()}
        />
      )}
  
      {clienteParaEditarId !== null && (
        <EditarClienteModal
          isOpen={isModalEditarOpen}
          onClose={() => {
            setIsModalEditarOpen(false);
            setClienteParaEditarId(null);
            fetchClientes(); 
          }}
          idCliente={clienteParaEditarId}
          onAtualizarCliente={() => fetchClientes()}
        />
      )}
  
      <ClienteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}