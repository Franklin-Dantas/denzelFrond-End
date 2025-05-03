"use client";

import Image, { StaticImageData } from "next/image";
import DenzelLogo from "/public/Denzel-Logo.svg";
import HomeIcon from "/public/Home.svg";
import Clientes from "/public/Clientes.svg";
import Eventos from "/public/Eventos.svg";
import BotaoNovoEvento from "/public/botao-novo-evento.svg";
import Linha from "/public/Linha.png";
import LinhaFooter from "/public/Linha-footer.png";
import Buttons from "./Buttons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pegarDadosDoToken } from "../helpers/JwtDecoder";
import Profile from "/public/Profile.svg";
import IUsuario from "../types/Usuarios";
import ModalAlterarSenha from "./ModalAlterarSenha";
import NotificacaoBadge from "./IconeNotificacao";

export default function Header() {
  const [, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [colaborador, setColaborador] = useState<IUsuario | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const decoded = pegarDadosDoToken();
    if (decoded?.nome) setUserName(decoded.nome);
    if (decoded?.id) {
      const id = decoded.id.toString();
      setUserId(id);
      buscarColaborador(id);
    }
  }, []);

  async function buscarColaborador(id: string) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token ausente.");
      return;
    }
    console.log(token);
  
    try {
      const response = await fetch(
        `https://denzel-backend.onrender.com/api/usuarios/buscar/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errText = await response.text();
        console.error(`Erro ${response.status}: ${errText}`);
        throw new Error("Erro ao buscar usuário.");
      }
  
      const data = await response.json();
      setColaborador(data);
    } catch (error) {
      console.error("Erro no fetch de colaborador:", error);
    }
  }
  

  const abrirMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMenuAberto(true);
  };

  const fecharMenu = () => {
    timeoutRef.current = setTimeout(() => setMenuAberto(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!userName) return null;

  return (
    <div className="relative bg-[#1D1933] w-full z-10">
      {/* Linha superior */}
      <div className="absolute top-0 left-0 w-full h-[5px]">
        <Image src={Linha} alt="Linha decorativa" className="w-full" height={5} priority />
      </div>

      <div className="flex flex-wrap justify-between items-center px-4 md:px-20 py-4 gap-4">
        {/* Logo */}
        <Link href="/Home" className="flex items-center">
          <Image src={DenzelLogo} alt="Denzel Logo" width={120} height={40} />
        </Link>

        {/* Navegação */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
          <NavItem href="/Colaboradores" icon={HomeIcon} label="Home" />
          <NavItem href="/Clientes" icon={Clientes} label="Clientes" />
          <NavItem href="/Eventos" icon={Eventos} label="Eventos" />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4">
          <Buttons icone={BotaoNovoEvento} title="Novo Evento" path="/Selecionar-clientes" />

          {/* Dropdown do usuário + Notificações */}
          <div className="flex items-center gap-4 relative z-50">
            {/* Dropdown */}
            <div
              className="relative flex flex-col items-end"
              onMouseEnter={abrirMenu}
              onMouseLeave={fecharMenu}
            >
              <div className="cursor-pointer">
                <Buttons icone={Profile} title={userName} path="#" dropdown="▼" />
              </div>

              {menuAberto && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-[#E6E0F8] rounded-2xl text-[#1D1933] p-4 shadow-md z-50">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl mb-1">
                      <Image src={Profile} alt="profile" />
                    </div>
                    <div className="w-full h-[1px] bg-[#1D1933] mb-2" />
                    <p className="font-bold text-center text-sm">{colaborador?.Nome}</p>
                    <p className="text-xs mt-1">
                      <span className="font-bold">Id:</span> {colaborador?.id} |{" "}
                      <span className="font-bold">{colaborador?.funcao ?? "Função"}</span>
                    </p>
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm w-full">
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 rounded text-left cursor-pointer">
                      🖼️ Anexar Imagem
                    </button>

                    <button
                      onClick={() => setModalAberto(true)}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 rounded text-left cursor-pointer"
                    >
                      🔑 Alterar Senha
                    </button>

                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-200 rounded text-left cursor-pointer"
                    >
                      ↩️ Sair
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notificação ao lado do dropdown */}
            <NotificacaoBadge />
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[1px]">
        <Image src={LinhaFooter} alt="Linha decorativa" className="w-full" height={1} priority />
      </div>

      <ModalAlterarSenha isOpen={modalAberto} onClose={() => setModalAberto(false)} />
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: StaticImageData;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  return (
    <Link href={href}>
      <div className="flex items-center justify-center gap-2 cursor-pointer text-white p-2 hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] rounded transition duration-300 w-[120px] h-[50px] font-lexend text-sm">
        <Image src={icon} alt={label} width={20} height={20} />
        <span>{label}</span>
      </div>
    </Link>
  );
}
