"use client";
import { Dialog } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import DataEvento from "/public/DataEvento.svg";
import Image from "next/image";
import { IEventos } from "../@Types/Eventos";
import HoraEvento from "/public/HoraEvento.svg";
import EditarMontagem from "/public/EditarMontagem.svg";
import EditarDesmontagem from "/public/EditarDesmontagem.svg";
import title from "/public/EditarEventoModal.svg";
import ButtonConcluir from "../components/ButtonConcluir";
import ButtonCancelar from "../components/ButtonCancelar";
import FrameCalendar from "../components/FrameCalendar";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import RelogioEditar from "/public/relogioEditar.svg";
import BuscarColaboradorModal from "../components/ModalRecrutarMontagem";
import LinhaModal from '/public/Linha-Modal.png';

interface EditarEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  idEvento: number;
  
}

export default function EditarEventoModal({
  isOpen,
  onClose,
  idEvento,

}: EditarEventoModalProps) {
  const [evento, setEvento] = useState<IEventos | null>(null);
  const id = idEvento;
  const pickerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [abrirModalColaborador, setAbrirModalColaborador] = useState(false);
const [cargoSelecionado, setCargoSelecionado] = useState<"encarregado estrutura" | "encarregado iluminacao">("encarregado estrutura");
const [campoSelecionado, setCampoSelecionado] = useState<"montagem" | "desmontagem">();

  const [showPicker, setShowPicker] = useState({
    inicio: false,
    montagem: false,
    desmontagem: false,
    final: false,
  });

  const [selectedDates, setSelectedDates] = useState({
    inicio: null as Date | null,
    montagem: null as Date | null,
    desmontagem: null as Date | null,
    final: null as Date | null,
  });

  const [formData, setFormData] = useState({
    nome: "",
    local: "",
    referencia: "",
    inicioData: "",
    fimData: "",
    inicioHora: "",
    fimHora: "",
    montagemData: "",
    montagemHora: "",
    desmontagemData: "",
    desmontagemHora: "",
    ResponsavelMontagem: [] as number[], 
    ResponsavelMontagemNome: [] as string[], 
    ResponsavelDesmontagem: [] as number[],
    ResponsavelDesmontagemNome: [] as string[],
  });
  
  const handleEditarEvento = async () => {
    try {
      const idEvento = Number(id);
  
      if (!idEvento) {
        alert("ID do evento não encontrado.");
        return;
      }
  
      const token = localStorage.getItem("token");
  
      const eventoAtualizado = {
        nomeEvento: formData.nome,
        localEvento: formData.local,
        dataInicio: selectedDates.inicio?.toISOString().split("T")[0],
        dataFim: selectedDates.final?.toISOString().split("T")[0],
        horaInicio: formData.inicioHora,
        horaFim: formData.fimHora,
        montagemInicio: selectedDates.montagem?.toISOString().split("T")[0],
        montagemFim: formData.montagemHora && formData.montagemHora.match(/^\d{2}:\d{2}$/)
          ? `${formData.montagemHora}:00`
          : null,
        desmontagemInicio: selectedDates.desmontagem?.toISOString().split("T")[0],
        desmontagemFim: formData.desmontagemHora && formData.desmontagemHora.match(/^\d{2}:\d{2}$/)
          ? `${formData.desmontagemHora}:00`
          : null,
      
        idEncarregadoEstruturaMontagem: formData.ResponsavelMontagem && formData.ResponsavelMontagem.length > 0
          ? formData.ResponsavelMontagem.join(",")
          : null,
          
        idEncarregadoEstruturaDesmontagem: formData.ResponsavelDesmontagem && formData.ResponsavelDesmontagem.length > 0
          ? formData.ResponsavelDesmontagem.join(",")
          : null,
      
        
      };
      
  
      const response = await fetch(`https://denzel-backend.onrender.com/api/eventos/editar/${idEvento}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventoAtualizado),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erro ao editar evento");
  
      alert("Evento atualizado com sucesso!");
      onClose(); 
    } catch (error: unknown) {
      console.error("Erro ao editar evento:", error);
    }
  };
  
  useEffect(() => {
    if (!id) return;
    const fetchEvento = async () => {
      try {
        const response = await fetch(
          `https://denzel-backend.onrender.com/api/eventos/Listar-Evento/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
const eventoData = data || null;

        if (eventoData) {
          setEvento(eventoData);
        }
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      }
    };
    fetchEvento();
  }, [id]);

  useEffect(() => {
    if (evento) {
      const inicio = evento.DataInicio ? new Date(evento.DataInicio) : null;
      const montagem = evento.MontagemInicio
        ? new Date(evento.MontagemInicio)
        : null;
      const desmontagem = evento.DesmontagemInicio
        ? new Date(evento.DesmontagemInicio)
        : null;
      const final = evento.DataFim ? new Date(evento.DataFim) : null;

      setFormData({
        nome: evento.Nome || "",
        local: evento.Local || "",
        referencia: evento.PontoDeReferencia || "",
        inicioData: formatarDataBrasilia(inicio),
        fimData: formatarDataBrasilia(final),
        inicioHora: evento.HoraInicio
          ? formatarHoraParaInput(
              typeof evento.HoraInicio === "string"
                ? evento.HoraInicio
                : new Date(evento.HoraInicio).toLocaleTimeString("pt-BR", {
                    hour12: false,
                    timeZone: "America/Sao_Paulo",
                  })
            )
          : "",
        fimHora: evento.HoraFim
          ? formatarHoraParaInput(
              typeof evento.HoraFim === "string"
                ? evento.HoraFim
                : new Date(evento.HoraFim).toLocaleTimeString("pt-BR", {
                    hour12: false,
                    timeZone: "America/Sao_Paulo",
                  })
            )
          : "",
        montagemData: formatarDataBrasilia(montagem),
        montagemHora: evento.MontagemFim
          ? new Date(evento.MontagemFim).toLocaleTimeString("pt-BR", {
              hour12: false,
              timeZone: "America/Sao_Paulo",
            })
          : "",
        desmontagemData: formatarDataBrasilia(desmontagem),
        desmontagemHora: evento.DesmontagemFim
          ? new Date(evento.DesmontagemFim).toLocaleTimeString("pt-BR", {
              hour12: false,
              timeZone: "America/Sao_Paulo",
            })
          : "",
        ResponsavelMontagem:
          evento.idEncarregadoEstruturaMontagem
            ? String(evento.idEncarregadoEstruturaMontagem)
                .split(",")
                .map(Number)
            : [],
        ResponsavelMontagemNome: [],
        ResponsavelDesmontagemNome: [],
        ResponsavelDesmontagem:
          evento.idEncarregadoEstruturaDesmontagem
            ? String(evento.idEncarregadoEstruturaDesmontagem)
                .split(",")
                .map(Number)
            : [],
      });

      setSelectedDates({ inicio, montagem, desmontagem, final });
    }
  }, [evento]);
  const formatarHoraParaInput = (hora: string): string => {
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const anyOpen = Object.entries(pickerRefs.current).some(([, ref]) => {
        return ref && ref.contains(event.target as Node);
      });
      if (!anyOpen) {
        setShowPicker({
          inicio: false,
          montagem: false,
          desmontagem: false,
          final: false,
        });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openPicker = (field: keyof typeof showPicker) => {
    setShowPicker({
      inicio: false,
      montagem: false,
      desmontagem: false,
      final: false,
      [field]: true,
    });
  };
  const formatarDataBrasilia = (dateString: string | Date | null): string => {
    if (!dateString) return "";
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };

  const handleDateChange = (field: keyof typeof selectedDates, date: Date) => {
    const key =
      field === "inicio"
        ? "inicioData"
        : field === "montagem"
        ? "montagemData"
        : field === "final"
        ? "fimData"
        : "desmontagemData";

    const dataFormatada = formatarDataBrasilia(date);

    setSelectedDates((prev) => ({ ...prev, [field]: date }));
    setFormData((prev) => ({ ...prev, [key]: dataFormatada }));
    setShowPicker((prev) => ({ ...prev, [field]: false }));
  };
  const abrirModalResponsavel = (tipo: "montagem" | "desmontagem") => {
    setCampoSelecionado(tipo);
    setCargoSelecionado(tipo === "montagem" ? "encarregado estrutura" : "encarregado iluminacao");
    setAbrirModalColaborador(true);
  };
  
  const handleSelecionarColaborador = (id: number, nome: string) => {
    if (campoSelecionado === "montagem") {
      setFormData((prev) => ({
        ...prev,
        ResponsavelMontagem: prev.ResponsavelMontagem.includes(id)
          ? prev.ResponsavelMontagem.filter((item) => item !== id)
          : [...prev.ResponsavelMontagem, id],
        ResponsavelMontagemNome: prev.ResponsavelMontagemNome.includes(nome)
          ? prev.ResponsavelMontagemNome.filter((item) => item !== nome)
          : [...prev.ResponsavelMontagemNome, nome],
      }));
    } else if (campoSelecionado === "desmontagem") {
      setFormData((prev) => ({
        ...prev,
        ResponsavelDesmontagem: prev.ResponsavelDesmontagem.includes(id)
          ? prev.ResponsavelDesmontagem.filter((item) => item !== id)
          : [...prev.ResponsavelDesmontagem, id],
        ResponsavelDesmontagemNome: prev.ResponsavelDesmontagemNome.includes(nome)
          ? prev.ResponsavelDesmontagemNome.filter((item) => item !== nome)
          : [...prev.ResponsavelDesmontagemNome, nome],
      }));
    }
  };
  
  
  
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      
      <div className="bg-[#1c1530] text-white p-8 rounded-xl w-[900px] max-h-[100vh] overflow-y-auto shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1">
    <Image 
        src={LinhaModal} 
        alt="Linha decorativa" 
        layout="responsive"
        width={800} 
        height={5} 
        priority 
        className="w-full"
    />
</div>
        <Image
          src={title}
          alt="title"
          width={203}
          height={40}
          className="mb-6"
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-1">Nome do Evento</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-transparent border text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Local do Evento</label>
            <input
              name="local"
              value={formData.local}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-transparent border text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Ponto de Referência</label>
            <input
              name="referencia"
              value={formData.referencia}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-transparent border text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-[50px] mb-6">
          <div className="col-span-2">
            <div className="flex ">
              <Image
                src={DataEvento}
                alt="dataEvento"
                width={226}
                height={32}
              />
            </div>
            <div className="flex gap-[30px] mt-[30px]">
              <div className="mb-6 relative">
                <label className="block mb-1">Data do Início</label>
                <FrameCalendar
                  onClick={() => openPicker("inicio")}
                  value={formData.inicioData}
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
                      onChange={(date) =>
                        date && handleDateChange("inicio", date)
                      }
                      inline
                    />
                  </div>
                )}
              </div>
              <div className="mb-6 relative">
                <label className="block mb-1">Data do Final</label>
                <FrameCalendar
                  onClick={() => openPicker("final")}
                  value={formData.fimData}
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
                      onChange={(date) =>
                        date && handleDateChange("final", date)
                      }
                      inline
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex ">
              <Image
                src={HoraEvento}
                alt="dataEvento"
                width={226}
                height={32}
              />
            </div>
            <div className="flex gap-[30px] mt-[30px]">
              <div>
                <label className="block mb-1 text-white">Hora de Início</label>
                <div className="relative w-[130px] h-[40px] flex items-center border rounded px-2">
                  <Image
                    src={RelogioEditar}
                    alt="Relógio"
                    width={20}
                    height={20}
                    className="absolute left-6"
                  />
                  <input
                    type="time"
                    name="inicioHora"
                    value={formData.inicioHora}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2 py-2 bg-transparent text-white text-lg appearance-none focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-white">Hora de Fim</label>
                <div className="relative w-[130px] h-[40px] flex items-center border rounded px-2">
                  <Image
                    src={RelogioEditar}
                    alt="Relógio"
                    width={20}
                    height={20}
                    className="absolute left-6"
                  />
                  <input
                    type="time"
                    name="fimHora"
                    value={formData.fimHora}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2 py-2 bg-transparent text-white text-lg appearance-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex ">
            <Image
              src={EditarMontagem}
              alt="dataEvento"
              width={226}
              height={32}
            />
          </div>
          <div className="flex gap-[30px] mt-[30px] ">
            <div>
              <label className="block mb-1 text-white">Data da Montagem</label>
              <FrameCalendar
                onClick={() => openPicker("montagem")}
                value={formData.montagemData}
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
                    onChange={(date) =>
                      date && handleDateChange("montagem", date)
                    }
                    inline
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 text-white">Hora da Montagem</label>
              <div className="relative w-[130px] h-[40px] flex items-center border rounded px-2">
                <Image
                  src={RelogioEditar}
                  alt="Relógio"
                  width={20}
                  height={20}
                  className="absolute left-6"
                />
                <input
                  type="time"
                  name="montagemHora"
                  value={formData.montagemHora}
                  onChange={handleChange}
                  className="w-full pl-10 pr-2 py-2 bg-transparent text-white text-lg appearance-none focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-white">
                Responsável pela Montagem
              </label>
              <button
  type="button"
  onClick={() => abrirModalResponsavel("montagem")}
  className="w-[117px] h-[40px] bg-[#1D1933] border rounded-md text-white text-sm flex items-center justify-center hover:bg-[#292343]"
>
{formData.ResponsavelMontagemNome.length > 0 ? formData.ResponsavelMontagemNome.join(", ") : "Selecionar"}
</button>

            </div>
          </div>
        </div>

        <div className="col-span-2 mt-[30px] ">
          <div className="flex ">
            <Image
              src={EditarDesmontagem}
              alt="dataEvento"
              width={226}
              height={32}
            />
          </div>
          <div className="flex gap-[30px]  mt-[30px]">
            <div className="h-[40px]">
              <label className="block mb-1 text-white">
                Data da Desmontagem
              </label>
              <FrameCalendar
                onClick={() => openPicker("desmontagem")}
                value={formData.desmontagemData}
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
                    onChange={(date) =>
                      date && handleDateChange("desmontagem", date)
                    }
                    inline
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 text-white">
                Hora da Desmontagem
              </label>
              <div className="relative w-[130px] h-[40px] flex items-center border rounded px-2">
                <Image
                  src={RelogioEditar}
                  alt="Relógio"
                  width={20}
                  height={20}
                  className="absolute left-6"
                />
                <input
                  type="time"
                  name="desmontagemHora"
                  value={formData.desmontagemHora}
                  onChange={handleChange}
                  className="w-full  pl-10 pr-2 py-2 bg-transparent text-white text-lg appearance-none focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-white ">
                Responsável pela Desmontagem
              </label>
              <button
  type="button"
  onClick={() => abrirModalResponsavel("desmontagem")}
  className="w-[117px] h-[40px] bg-[#1D1933] border rounded-md text-white text-sm flex items-center justify-center hover:bg-[#292343]"
>
{formData.ResponsavelDesmontagemNome.length > 0 ? formData.ResponsavelDesmontagemNome.join(", ") : "Selecionar"}
</button>

            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-start gap-4">
          <ButtonCancelar onClick={onClose} />
          <ButtonConcluir onClick={() => { handleEditarEvento();}} />
        </div>
        <BuscarColaboradorModal
  isOpen={abrirModalColaborador}
  onClose={() => setAbrirModalColaborador(false)}
  onSelecionar={(colaboradoresSelecionados) => {
    colaboradoresSelecionados.forEach(({ id, nome }) => handleSelecionarColaborador(id, nome));
  }}
  cargo={cargoSelecionado}
/>
      </div>
     
    </Dialog>
  );
}
