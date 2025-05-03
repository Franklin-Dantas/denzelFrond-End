"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotificacaoBadge() {
  const [novosLogs, setNovosLogs] = useState(0);

  useEffect(() => {
    const verificarNovosLogs = async () => {
      try {
        const res = await fetch("https://denzel-backend.onrender.com/api/logs/ultimo-id", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        const ultimoIdLido = parseInt(localStorage.getItem("ultimoLogLido") ?? "0", 10);
        const novoCount = data.ultimoId - ultimoIdLido;

        setNovosLogs(novoCount > 0 ? novoCount : 0);
      } catch (error) {
        console.error("❌ Erro ao buscar último log:", error);
        setNovosLogs(0);
      }
    };

    verificarNovosLogs();

    const interval = setInterval(verificarNovosLogs, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  const handleAbrirNotificacoes = () => {
    // Atualiza o último ID lido com o ID atual
    fetch("https://denzel-backend.onrender.com/api/logs/ultimo-id", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("ultimoLogLido", data.ultimoId.toString());
        setNovosLogs(0);
      });
  };

  return (
    <Link href="/Notificacao" onClick={handleAbrirNotificacoes}>
      <div className="relative cursor-pointer">
        <Bell className="w-6 h-6 text-white" />
        {novosLogs > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            {novosLogs}
          </span>
        )}
      </div>
    </Link>
  );
}
