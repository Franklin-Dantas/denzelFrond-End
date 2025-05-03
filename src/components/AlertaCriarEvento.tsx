"use client";
import React from "react";
import Image from "next/image";
import check32 from "./check-32.svg";
import checkbox from "./checkbox.svg";
import exportIcon from "/public/exportAlert.svg";

interface ElementModalAlertProps {
  onConcluir: () => void;
  onExportar: () => void;
}

export const ElementModalAlert: React.FC<ElementModalAlertProps> = ({
  onConcluir,
  onExportar,
}) => {
  return (
    <div className="bg-[#1d1933] flex justify-center items-center min-h-screen w-full z-50 fixed inset-0">
      <div className="bg-pbbg-contraste w-[800px] h-[368px] relative rounded-lg shadow-xl">
        {/* Gradiente topo */}
        <div className="absolute w-full h-[5px] top-0 left-0 bg-gradient-to-r from-[#43A3D5] to-[#9C60DA]" />

        {/* Ícone e título */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
          <Image src={checkbox} alt="Checkbox" width={48} height={48} />
          <h2 className="text-transparent bg-gradient-to-r from-[#43A3D5] to-[#9C60DA] bg-clip-text text-xl font-bold">
            Evento Criado
          </h2>
        </div>

        {/* Descrição */}
        <p className="absolute w-[700px] top-[187px] left-[50px] text-white text-center text-base leading-relaxed">
          <strong>Exportar Materiais</strong> consiste em você{" "}
          <strong>reutilizar</strong> essa lista de{" "}
          <strong>solicitação de materiais</strong> para um{" "}
          <strong>outro Evento</strong>.
        </p>

        {/* Botões */}
        <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex gap-6">
          {/* Botão Exportar */}
          <button
            onClick={onExportar}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white hover:bg-white hover:text-[#1d1933] transition"
          >
            <Image src={exportIcon} alt="Exportar" width={18} height={18} />
          </button>

          {/* Botão Concluir */}
          <button
            onClick={onConcluir}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white hover:bg-white hover:text-[#1d1933] transition"
          >
            <Image src={check32} alt="Concluir" width={18} height={18} />
            <span>Concluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
