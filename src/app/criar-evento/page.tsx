"use client";
import React, { useRef, useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FrameCalendar from "../../components/FrameCalendar";
import EventoColorido from "/public/EventoColorido.svg";
import Image from "next/image";
import UploadImagemMinimal from "../../components/UploaderComponent";
import Calendario from "/public/CalendarioLinear.svg";
import Montagem from "/public/Montagem.svg";
import Desmontagem from "/public/Desmontagem.svg";
import Relogio from "/public/Relogio.svg";
import { useFormularioEvento } from "../../context/FormularioEventoContext";
import Link from "next/link";


const CriarEvento = () => {
  const pickerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [inputKey, setInputKey] = useState(0);

  const {
    formData,
    setFormData,
    selectedDates,
    setSelectedDates,
    imagens,
    setImagens,
    salvarFormulario
  } = useFormularioEvento();
  
  
  const adicionarImagem = (file: File) => {
    setImagens((prev) => [...prev, file]);
    setInputKey((prev) => prev + 1);
  };

  const removerImagem = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const [showPicker, setShowPicker] = useState({
    inicio: false,
    final: false,
    montagem: false,
    desmontagem: false,
  });

  const openPicker = (field: keyof typeof showPicker) => {
    setShowPicker({
      inicio: false,
      final: false,
      montagem: false,
      desmontagem: false,
      [field]: true,
    });
  };

  const formatarDataBrasilia = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };

  const handleDateChange = (field: keyof typeof selectedDates, date: Date) => {
    const key =
      field === "inicio"
        ? "inicioData"
        : field === "final"
        ? "fimData"
        : field === "montagem"
        ? "dataMontagem"
        : "dataDesmontagem";

    setSelectedDates((prev: Record<string, Date | undefined>) => ({ ...prev, [field]: date }));
    setFormData((prev) => ({ ...prev, [key]: formatarDataBrasilia(date) }));
    setShowPicker((prev) => ({ ...prev, [field]: false }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = !Object.values(pickerRefs.current).some((ref) =>
        ref?.contains(event.target as Node)
      );
      if (clickedOutside) {
        setShowPicker({ inicio: false, final: false, montagem: false, desmontagem: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />
      <main className="flex-1 px-4 sm:px-8 md:px-16 lg:px-[320px] flex flex-col">
      <div className="flex items-center gap-2 mt-8 mb-4">
      <Image src={EventoColorido} alt="Evento" />
      <h2 className="text-3xl font-light text-hover-gradient ">  Novo Evento</h2>
      </div>

      {/* Navegação por etapas */}
      <div className="flex flex-wrap gap-2 items-center text-base font-light">
        <span className="text-gray-700">Cliente</span>
        <span className="text-sky-400">&gt;</span>
        <span className="text-sky-400">Evento</span>
        <span className="text-gray-700">&gt;</span>
        <span className="text-gray-700">Solicitação de Materiais</span>
        <span className="text-gray-700">&gt;</span>
        <span className="text-gray-700">Revisão</span>
      </div>

      {/* Formulário principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-[40px]">
        <div>
          <label className="text-slate-200">Nome do Evento</label>
          <input className="w-full bg-transparent text-white px-5 py-2.5 rounded-sm border border-slate-200"
          name='nome'
          onChange={handleInputChange}
          value={typeof formData.nome === "string" || typeof formData.nome === "number" ? formData.nome : ""} />
        </div>
        <div>
          <label className="text-slate-200">Local do Evento</label>
          <input className="w-full bg-transparent text-white px-5 py-2.5 rounded-sm border border-slate-200" 
          name='local'
          onChange={handleInputChange}
          value={typeof formData.local === "string" || typeof formData.local === "number" ? formData.local : ""}/>

        </div>
        <div>
          <label className="text-slate-200">Ponto de Referência</label>
          <input className="w-full bg-transparent text-white px-5 py-2.5 rounded-sm border border-slate-200"
          name='referencia'
          onChange={handleInputChange}
          value={typeof formData.referencia === "string" || typeof formData.referencia === "number" ? formData.referencia : ""} />
        </div>
      </div>
{/* Anexar Imagem */}
<div className="flex flex-col gap-6 mt-8">
      <div className="flex flex-wrap gap-4 items-start">
        {/* Botão de upload com key dinâmica */}
        <UploadImagemMinimal key={inputKey} onChange={adicionarImagem} />

        {/* Cards com previews */}
        {imagens.map((imagem, index) => (
          <div
            key={index}
            className="relative w-44 h-24 border border-slate-200 rounded-md overflow-hidden"
          >
            {/* Botão X */}
            <button
              onClick={() => removerImagem(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-80"
            >
              ×
            </button>

            <Image
              src={URL.createObjectURL(imagem)}
              alt={`Preview ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
{/* Datas e Horários */}

<div className="flex flex-col md:flex-row gap-6 w-full mt-[80px]">
  {/* Data do Evento */}
  <div className="flex-1 flex flex-col gap-2">
    <div className="flex items-center gap-3 mb-4">
    <Image src={Calendario} alt="Calendário" className="w-6 h-6 mb-2" />
    <h4 className="text-xl text-hover-gradient">Data do Evento</h4>
    </div>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-col gap-2 w-[168px]">
        <label className="text-slate-200">Início do Evento</label>
        <div className="relative w-full">
          <FrameCalendar
            onClick={() => openPicker("inicio")}
            value={typeof formData.inicioData === "string" ? formData.inicioData : "00/00/0000"}
          />
          {showPicker.inicio && (
            <div
              ref={(el) => {
                pickerRefs.current.inicio = el;
              }}
              className="absolute z-50 mt-2"
            >
              <DatePicker
                selected={selectedDates.inicio}
                onChange={(date) => date && handleDateChange("inicio", date)}
                inline
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label className="text-slate-200">Fim do Evento</label>
        <div className="relative w-[168px]">
          <FrameCalendar
            onClick={() => openPicker("final")}
            value={typeof formData.fimData === "string" ? formData.fimData : "00/00/0000"}
          />
          {showPicker.final && (
            <div
              ref={(el) => {
                pickerRefs.current.final = el;
              }}
              className="absolute z-50 mt-2"
            >
              <DatePicker
                selected={selectedDates.final}
                onChange={(date) => date && handleDateChange("final", date)}
                inline
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Hora do Evento */}
  <div className="flex-1 flex flex-col gap-2 ">
    <div className="flex items-center gap-3 mb-4">
    <Image src={Relogio} alt="Relogio" className="w-6 h-6 mb-2" />
    <h4 className="text-xl text-hover-gradient">Hora do Evento</h4>
    </div>
  
    <div className="flex gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-slate-200">Hora de Início</label>
        <input
          type="time"
          name="inicioHora"
          value={typeof formData.inicioHora === "string" ? formData.inicioHora : ""}
          onChange={handleInputChange}
          className="bg-transparent text-white px-4 py-2 border border-slate-200 rounded-sm w-[117px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-slate-200">Hora de Fim</label>
        <input
          type="time"
          name="fimHora"
          value={typeof formData.fimHora === "string" ? formData.fimHora : ""}
          onChange={handleInputChange}
          className="bg-transparent text-white px-4 py-2 border border-slate-200 rounded-sm w-[117px]"
        />
      </div>
    </div>
  </div>
</div>

    <div className="flex flex-col md:flex-row gap-6 w-full mt-[80px]">
  {/* Bloco Montagem */}
  <div className="flex-1 flex flex-col gap-2">
    {/* Título com ícone */}
    <div className="flex items-center gap-3 mb-4">
    <Image src={Montagem} alt="Montagem" className="w-6 h-6 mb-2" />
    <h4 className="text-xl text-hover-gradient">Montagem</h4>
    </div>

    {/* Data + Hora + Responsável */}
    <div className="flex flex-col md:flex-row gap-4">
      {/* Data da Montagem */}
      <div className="flex flex-col gap-2 w-[168px]">
        <label className="text-slate-200">Data da Montagem</label>
        <div className="relative w-full">
          <FrameCalendar
            onClick={() => openPicker("montagem")}
            value={typeof formData.dataMontagem === "string" ? formData.dataMontagem : formData.dataMontagem?.toString() || "00/00/0000"}
          />
          {showPicker.montagem && (
            <div
              ref={(el) => {
                pickerRefs.current.montagem = el;
              }}
              className="absolute z-50 mt-2"
            >
              <DatePicker
                selected={selectedDates.montagem}
                onChange={(date) => date && handleDateChange("montagem", date)}
                inline
              />
            </div>
          )}
        </div>
      </div>

      {/* Hora da Montagem */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-200">Hora da Montagem</label>
        <input
          type="time"
          name="horaMontagem"
          value={typeof formData.horaMontagem === "string" ? formData.horaMontagem : ""}
          onChange={handleInputChange}
          className="w-[117px] bg-transparent text-white px-4 py-2 border border-slate-200 rounded-sm"
        />
      </div>

      {/* Responsável */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-200">Responsável pela Montagem</label>
        <input
          type="text"
          name="responsavelMontagem"
          value={typeof formData.responsavelMontagem === "string" || typeof formData.responsavelMontagem === "number" ? formData.responsavelMontagem : ""}
          onChange={handleInputChange}
          placeholder="ID ou nome"
          className="w-[200px] bg-transparent text-white px-4 py-2 border border-slate-200 rounded-sm"
        />
      </div>
    </div>
  </div>
</div>

{/* Título com ícone */}
<div className="flex flex-col md:flex-row gap-6 w-full mt-[80px]">
  {/* Bloco Desmontagem */}
  <div className="flex-1 flex flex-col gap-2">
    {/* Título com ícone */}
    <div className="flex items-center gap-3 mb-4">
      <Image src={Desmontagem} alt="Desmontagem" className="w-6 h-6 mb-2" />
      <h4 className="text-xl text-hover-gradient">Desmontagem</h4>
    </div>

    {/* Data + Hora + Responsável */}
    <div className="flex flex-col md:flex-row gap-4">
      {/* Data da Desmontagem */}
      <div className="flex flex-col gap-2 w-[188px]">
        <label className="text-slate-200">Data da Desmontagem</label>
        <div className="relative w-full">
          <FrameCalendar
            onClick={() => openPicker("desmontagem")}
            value={typeof formData.dataDesmontagem === "string" ? formData.dataDesmontagem : formData.dataDesmontagem?.toString() || "00/00/0000"}
          />
          {showPicker.desmontagem && (
            <div
              ref={(el) => {
                pickerRefs.current.desmontagem = el;
              }}
              className="absolute z-50 mt-2"
            >
              <DatePicker
                selected={selectedDates.desmontagem}
                onChange={(date) => date && handleDateChange("desmontagem", date)}
                inline
              />
            </div>
          )}
        </div>
      </div>

      {/* Hora da Desmontagem */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-200">Hora da Desmontagem</label>
        <input
          type="time"
          name="horaDesmontagem"
          value={typeof formData.horaDesmontagem === "string" || typeof formData.horaDesmontagem === "number" ? formData.horaDesmontagem : ""}
          onChange={handleInputChange}
          className="w-[117px] bg-transparent text-white px-4 py-2 border border-slate-200 rounded-sm"
        />
      </div>

      {/* Responsável */}
      <div className="flex flex-col gap-2">
        <label className="text-slate-200">Responsável pela Desmontagem</label>
        <input
          type="text"
          name="responsavelDesmontagem"
          value={typeof formData.responsavelDesmontagem === "string" || typeof formData.responsavelDesmontagem === "number" ? formData.responsavelDesmontagem : ""}
          onChange={handleInputChange}
          placeholder="ID ou nome"
          className="w-[200px] bg-transparent text-white px-4 py-2 border border-slate-200 rounded-sm"
        />
      </div>
    </div>
  </div>
</div>

      {/* Botões de navegação */}
      <div className="flex justify-start gap-4 mt-[80px] mb-[40px] pt-4 border-t border-[#292343]">
        <button className="px-6 py-2 rounded-l-[30px] border border-slate-200 text-white">Voltar</button>
        <Link href="/AdicionarMateriais">
  <button
    className="px-6 py-2 rounded-r-[30px] border border-slate-200 text-white"
    onClick={() =>
      salvarFormulario({ formData, selectedDates, imagens })
    }
  >
    Continuar
  </button>
</Link>

      </div>
      </main>
      {/* Rodapé */}
      
 <Footer/>
    </div>
  );
};

export default CriarEvento;
