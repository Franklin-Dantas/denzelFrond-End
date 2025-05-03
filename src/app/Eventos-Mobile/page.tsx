"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EventosIcon from "/public/Eventos.svg";
import Editar from "/public/Editar.svg";
import Filters from "/public/Filters.svg";
import Image from "next/image";
import { IEventos } from "../../@Types/Eventos";
import Titulo from "/public/Eventos.png";
import Alert from "/public/Alert.svg";
import Repair from "/public/Repair.svg";
import Location from "/public/Location.svg";
import AlertGray from "/public/Alert-Gray.svg";
import Link from "next/link";
import NavPages from "../../components/NavPages";
import BuscarEventos from "../../components/BuscarEventos";

export default function EventosMobile() {
  const USER_URL = "https://denzel-backend.onrender.com/api/eventos/listar";
  const [eventos, setEventos] = useState<IEventos[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [dropdownLocked, setDropdownLocked] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  type OrdemEvento = "dataRecente" | "dataAntiga" | "nomeAsc" | "nomeDesc";
  const [ordem, setOrdem] = useState<OrdemEvento>("dataRecente");

  const abrirDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setMostrarDropdown(true);
    setDropdownLocked(true);
    setTimeout(() => setDropdownLocked(false), 300);
  };

  const fecharDropdown = () => {
    if (dropdownLocked) return;
    dropdownTimeout.current = setTimeout(() => {
      setMostrarDropdown(false);
    }, 200);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    try {
      setLoading(true);
      const response = await fetch(`${USER_URL}Todos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar eventos.");
      const eventosData = await response.json();
      setEventos(eventosData || []);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar eventos.");
    } finally {
      setLoading(false);
    }
  }

  const termo = searchTerm.toLowerCase();
  const eventosFiltrados = eventos.filter((evento) =>
    evento.Nome?.toLowerCase().includes(termo)
  );

  const eventosFiltradosEOrdenados = [...eventosFiltrados].sort((a, b) => {
    const aData = new Date(a.MontagemInicio).getTime();
    const bData = new Date(b.MontagemInicio).getTime();
    switch (ordem) {
      case "dataRecente":
        return bData - aData;
      case "dataAntiga":
        return aData - bData;
      case "nomeAsc":
        return a.Nome.localeCompare(b.Nome);
      case "nomeDesc":
        return b.Nome.localeCompare(a.Nome);
      default:
        return 0;
    }
  });

  const eventosPaginados = eventosFiltradosEOrdenados.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setTotalPages(Math.ceil(eventosFiltradosEOrdenados.length / limit));
  }, [eventosFiltradosEOrdenados]);

  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />
      <div className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Image src={Titulo} alt="Eventos" width={170} height={40} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <div className="relative flex items-center w-full md:w-1/3">
              <BuscarEventos value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="relative" onMouseEnter={abrirDropdown} onMouseLeave={fecharDropdown}>
      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#292343] hover:bg-[#3A2F55] transition">
        <Image src={Filters} width={16} height={16} alt="Filtros" />
        Ordenar por
      </button>
      {mostrarDropdown && (
        <div className="absolute top-full left-0 mt-2 w-60 bg-[#1D1933] text-white rounded-lg shadow-lg border border-[#292343] z-50">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-[#2C2740] cursor-pointer" onClick={() => { setOrdem("dataRecente"); setPage(1); setMostrarDropdown(false); }}>
              Montagem mais recente
            </li>
            <li className="px-4 py-2 hover:bg-[#2C2740] cursor-pointer" onClick={() => { setOrdem("dataAntiga"); setPage(1); setMostrarDropdown(false); }}>
              Montagem mais antiga
            </li>
            <li className="px-4 py-2 hover:bg-[#2C2740] cursor-pointer" onClick={() => { setOrdem("nomeAsc"); setPage(1); setMostrarDropdown(false); }}>
              Nome (A → Z)
            </li>
            <li className="px-4 py-2 hover:bg-[#2C2740] cursor-pointer" onClick={() => { setOrdem("nomeDesc"); setPage(1); setMostrarDropdown(false); }}>
              Nome (Z → A)
            </li>
          </ul>
        </div>
      )}
    </div>
          </div>

          {loading ? (
            <p className="text-gray-400 mt-6 text-center">
              Carregando eventos...
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse border-spacing-y-2 text-left px-4 py-3">
                <thead>
                  <tr className="text-gray-300 text-left">
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image
                            src={EventosIcon}
                            alt="Eventos"
                            width={12}
                            height={12}
                          />
                          <span className="font-bold text-white">Eventos</span>
                        </div>
                        <div className="w-[250px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image
                            src={Location}
                            alt="Local"
                            width={12}
                            height={12}
                          />
                          <span className="font-bold text-white">Local</span>
                        </div>
                        <div className="w-[150px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image
                            src={Repair}
                            alt="Montagem"
                            width={12}
                            height={12}
                          />
                          <span className="font-bold text-white">Montagem</span>
                        </div>
                        <div className="w-[150px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Image
                            src={Alert}
                            alt="Alerta"
                            width={12}
                            height={12}
                          />
                          <span className="font-bold text-red-600 text-base">
                            Alerta
                          </span>
                        </div>
                        <div className="w-[150px] h-[1px] bg-red-600 mt-1" />
                      </div>
                    </th>
                    <th className="p-3 text-center">
                      <div className="flex flex-col items-start w-full">
                        <div className="font-bold text-white text-center">
                          Excluir | Editar
                        </div>
                        <div className="w-[121px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventosPaginados.length > 0 ? (
                    eventosPaginados.map((evento, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-700 hover:bg-[#1D1933] transition"
                      >
                        <td className="p-3">
                          <Link href={`/Evento/${evento.Id}`}>
                            {evento.Nome}
                          </Link>
                        </td>
                        <td className="p-3">
                          {evento.Local || "Não informado"}
                        </td>
                        <td className="p-3">
                          {evento.MontagemInicio
                            ? new Date(
                                evento.MontagemInicio
                              ).toLocaleDateString()
                            : "Não informado"}
                        </td>
                        <td className="p-3 text-center">
                          {evento.Materiais_Faltando ? (
                            <div className="flex items-center justify-center gap-2 bg-red-600 w-[121px] h-[38px]">
                              <Image
                                src={AlertGray}
                                alt="Alerta"
                                width={20}
                                height={20}
                              />
                              <span className="text-azul-escuro font-bold">
                                -
                                {evento.Materiais_Faltando.split(", ")
                                  .map((item) =>
                                    parseInt(
                                      item.match(/\((\d+)\)/)?.[1] || "0",
                                      10
                                    )
                                  )
                                  .reduce((acc, curr) => acc + curr, 0)}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center">-----</div>
                          )}
                        </td>
                       <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/Checklist-Encarregado/${evento.Id}`}>
                              <Image
                                src={Editar}
                                alt="Editar"
                                width={20}
                                height={20}
                              />
                            </Link>
                            
                          </div>
                          </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-gray-400">
                        Nenhum evento encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end gap-4 mt-[80px] mb-[40px] pt-4 border-t border-[#292343]">
                <NavPages
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
