import React from "react";
import Image from "next/image";
import IconPessoa from "/public/Pessoa fisica.svg";
import { useFormularioEvento } from "../context/FormularioEventoContext";

interface BotaoEscolherClienteProps {
  idCliente: number;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function BotaoEscolherCliente({
  idCliente,
  onClick,
  children = "Escolher Cliente",
}: BotaoEscolherClienteProps) {
  const { setIdCliente } = useFormularioEvento();

  const handleClick = () => {
    localStorage.setItem("idCliente", idCliente.toString());
    setIdCliente(idCliente);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-between gap-2 px-5 py-[10px] border border-transparent bg-[#100D1E] text-white text-base font-light rounded-r-full transition duration-300 hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5]"
    >
      <span className="whitespace-nowrap">{children}</span>
      <Image src={IconPessoa} alt="Ícone Pessoa" width={20} height={20} />
    </button>
  );
}
