"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CalendarDays, Clock } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Titulo from "/public/TituloNotificacao.svg";
import Image from "next/image";
import NavPages from "../../components/NavPages";
import UserIcon from "/public/Profile.svg";

interface Log {
  Id: number;
  DataHora: string;
  Descricao: string;
}

export default function Notificacoes() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"data" | "nome">("data");

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://denzel-backend.onrender.com/api/logs/listar?page=${page}&limit=${limit}&sortBy=${sortBy}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        const logsArray = Array.isArray(data.logs)
          ? data.logs
          : Array.isArray(data)
          ? data
          : [];

        setLogs(logsArray);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        console.error("❌ Erro ao buscar logs:", error);
        setLogs([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [page, limit, sortBy]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />

      <div className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          {/* Título */}
          <div className="flex items-center gap-2 text-xl font-bold mb-6">
            <Image src={Titulo} alt="Notificações" width={234} height={40} />
          </div>

          {/* Barra de ações */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <input
              type="text"
              placeholder="🔍 Buscar Logs"
              className="bg-[#16162B] px-4 py-2 rounded-md text-sm w-full md:w-1/2 placeholder:text-gray-400 focus:outline-none"
              disabled
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "data" | "nome")}
              className="bg-[#16162B] px-4 py-2 rounded-md text-sm text-gray-300"
            >
              <option value="data">📅 Ordenar por Data</option>
              <option value="nome">🔤 Ordenar por Nome</option>
            </select>
          </div>

          {/* Tabela */}
          {isLoading ? (
            <p className="text-gray-400 mt-6 text-center">🔄 Carregando logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-400 mt-6 text-center">Nenhum log encontrado.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2 text-xl font-bold">
            <Image src={UserIcon} alt="Colaboradores" width={24} height={24} />
            <h1>Colaboradores</h1>
          </div>
                        <div className="w-[200px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          <span className="font-bold text-white">Data</span>
                        </div>
                        <div className="w-[120px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-bold text-white">Hora</span>
                        </div>
                        <div className="w-[120px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const data = new Date(log.DataHora);
                    const dataFormatada = format(data, "dd/MM/yyyy", { locale: ptBR });
                    const horaFormatada = format(data, "HH:mm", { locale: ptBR });

                    const palavras = log.Descricao?.trim().split(" ") || [];
                    const nomeColaborador = palavras.slice(1, 3).join(" ");
                    const restanteDescricao = palavras.slice(3).join(" ");

                    return (
                      <tr
                        key={log.Id}
                        className="border-b border-gray-700 hover:bg-[#1D1933] transition"
                      >
                        <td className="p-3 flex items-center gap-4">
                          <img
                            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${nomeColaborador}`}
                            alt={nomeColaborador}
                            className="w-10 h-10 rounded-full"
                          />
                          <p>
                            <strong>{nomeColaborador}</strong>{" "}
                            <span className="text-white">{restanteDescricao}</span>
                          </p>
                        </td>
                        <td className="p-3">{dataFormatada}</td>
                        <td className="p-3">{horaFormatada}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-[80px] mb-[40px] pt-4 border-t border-[#292343] px-6">
  <div className="flex items-center gap-2 text-sm text-white">
    <label htmlFor="perPage">Mostrar</label>
    <select
      id="perPage"
      className="bg-[#16162B] text-white rounded-md px-3 py-1"
      value={limit}
      onChange={handleLimitChange}
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
    <span>por página</span>
  </div>

  <NavPages page={page} totalPages={totalPages} setPage={setPage} />
</div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
