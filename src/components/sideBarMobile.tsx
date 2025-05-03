"use client";

import { useState } from "react";
import { X, Menu, Home, Box, Repeat, Bug, PartyPopper, Layers3 } from "lucide-react";
import Image from "next/image";
import Logo from "/public/Denzel-Logo.svg";

export default function SidebarMobile() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      {/* Ícone do sanduíche */}
      <div className="p-4">
        <button onClick={() => setAberto(true)} className="text-purple-400">
          <Menu size={28} />
        </button>
      </div>

      {/* Menu lateral */}
      <div
       className={`fixed top-0 left-0 h-full w-[80%] max-w-xs bg-[#3C2D66] text-white z-[100] transition-transform duration-300 ease-in-out ${
        aberto ? "translate-x-0" : "-translate-x-full"
      }`}
    >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500">
          <Image src={Logo} alt="Logo" className="w-[80px]" />
          <button onClick={() => setAberto(false)} className="text-purple-300">
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-6 p-6">
          <a href="/home" className="flex items-center gap-2 text-lg">
            <Home /> Home
          </a>
          <a href="/Eventos-Mobile" className="flex items-center gap-2 text-lg">
            <PartyPopper /> Eventos
          </a>
          <a href="/estoque" className="flex items-center gap-2 text-lg">
            <Box /> Estoque
          </a>
          <a href="/realocar" className="flex items-center gap-2 text-lg">
            <Repeat /> Realocar
          </a>
          <a href="/cadastrar-materiais" className="flex items-center gap-2 text-lg">
            <Layers3 /> Cadastrar Materiais
          </a>
        </nav>

        {/* Rodapé */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center">
          <button className="flex items-center gap-2 px-4 py-2 border border-white rounded-full">
            <Bug size={16} />
            Reportar Bug
          </button>
        </div>
      </div>

      {/* Fundo escuro ao abrir o menu */}
      {aberto && (
        <div
          onClick={() => setAberto(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}
    </>
  );
}
