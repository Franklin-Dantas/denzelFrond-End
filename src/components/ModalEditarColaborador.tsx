"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import LinhaModal from "/public/Linha-Modal.png";
import Fechar from "/public/Fechar-Modal.svg";
import Voltar from "/public/Voltar.png";
import Avancar from "/public/Avancar.png";
import NovoColaborador from "/public/NovoColaborador.svg";

interface ColaboradorForm {
  Nome: string;
  cpf: string;
  contato: string;
  email: string;
  senha?: string;
  confirmarSenha?: string;
  funcao: string;
}

interface ModalEditarColaboradorProps {
  isOpen: boolean;
  onClose: () => void;
  colaborador: ColaboradorForm ;
  idColaborador: number;
}

export default function ModalEditarColaborador({ isOpen, onClose, colaborador, idColaborador }: ModalEditarColaboradorProps) {
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<ColaboradorForm>();
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (colaborador) {
      setValue("Nome", colaborador.Nome);
      setValue("cpf", colaborador.cpf);
      setValue("contato", colaborador.contato);
      setValue("email", colaborador.email);
      setValue("funcao", colaborador.funcao);
    }
  }, [colaborador, setValue]);

  const onSubmit: SubmitHandler<ColaboradorForm> = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado.");
     
      const { senha, confirmarSenha, ...payload } = data;
      void senha;
      void confirmarSenha;
      console.log("Enviando dados para edição:", payload);

      const response = await fetch(`https://denzel-backend.onrender.com/api/usuarios/Editar/${idColaborador}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
  
        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([field, message]) => {
            setError(field as keyof ColaboradorForm, {
              type: "server",
              message: message as string,
            });
          });
        }
  
        if (errorData.message) {
          setGeneralError(errorData.message);
        }
  
        return;
      }
  
      alert("Colaborador atualizado com sucesso!");
      onClose();
    } catch (error) {
      console.error("❌ Erro ao editar usuário:", error);
      setGeneralError((error as Error).message);
    }
  };
  

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-[#100D1E] p-8 text-white border border-[#292343] shadow-xl w-[800px] h-[620px] rounded-lg">
        <div className="absolute top-0 left-0 w-full h-1">
          <Image src={LinhaModal} alt="Linha Modal" layout="responsive" width={800} height={5} />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4">
          <Image src={Fechar} alt="Fechar" width={30} height={30} />
        </button>

        <div className="flex items-center gap-4 mt-6">
          <Image src={NovoColaborador} alt="Editar Colaborador" width={321} height={60} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-400">Função</label>
            <select {...register("funcao", { required: true })} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white">
              <option value="">Selecione a função</option>
              <option value="Encarregado Estrutura">Encarregado Estrutura</option>
              <option value="Encarregado Iluminacao">Encarregado Iluminacao</option>
              <option value="Coordenador Externo">Coordenador Externo</option>
              <option value="Coordenador de Energia e Conforto">Coordenador de Energia e Conforto</option>
              <option value="Coordenador de Estrutura">Coordenador de Estrutura</option>
              <option value="Coordenador de Iluminacao">Coordenador de Iluminacao</option>
              <option value="Comercial">Comercial</option>
              <option value="Gerente Administrativo">Gerente Administrativo</option>
              <option value="Diretor Executivo">Diretor Executivo</option>
            </select>
            {errors.funcao && <span className="text-red-500">{errors.funcao.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input {...register("Nome", { required: true })} placeholder="Nome" className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
            <input {...register("cpf", { required: true })} placeholder="CPF" className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input {...register("contato", { required: true })} placeholder="Contato" className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
            <input {...register("email", { required: true })} placeholder="E-mail" className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
          </div>

          {generalError && <p className="text-red-400 text-center mt-2">{generalError}</p>}

          <div className="flex justify-between mt-8">
            <button type="button" onClick={onClose} className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-full hover:bg-slate-700">
              <Image src={Voltar} alt="Voltar" width={18} height={18} /> Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-full hover:bg-slate-700">
              Concluir <Image src={Avancar} alt="Avançar" width={18} height={18} />
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
