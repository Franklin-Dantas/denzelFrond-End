"use client";

import React, { useState } from "react";
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
  senha: string;
  confirmarSenha: string;
  funcao: string;
}

interface ModalCadastroColaboradorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCadastroColaborador({
  isOpen,
  onClose,
}: ModalCadastroColaboradorProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    getValues,
  } = useForm<ColaboradorForm>({
    mode: "onChange", // Ativa validação em tempo real
  });
  const [generalError, setGeneralError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ColaboradorForm> = async (data) => {
    if (data.senha !== data.confirmarSenha) {
      setGeneralError("As senhas não conferem.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado.");

      const response = await fetch("https://denzel-backend.onrender.com/api/usuarios/Criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();

        console.log("Erro recebido do backend:", errorData);

        // Tratar tanto se vier em `errors` quanto em `detalhes`
        const backendErrors = errorData.errors || errorData.detalhes || {};

        if (typeof backendErrors === "object" && backendErrors !== null) {
          Object.entries(backendErrors).forEach(([field, message]) => {
            if (field in data) {
              // só seta se o campo existe no form
              setError(field as keyof ColaboradorForm, {
                type: "server",
                message: message as string,
              });
            }
          });
          setGeneralError(null); // zera o erro geral
        } else if (errorData.message) {
          setGeneralError(errorData.message);
        }

        return;
      }

      alert("Colaborador criado com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      setGeneralError((error as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-[#100D1E] p-8 text-white border border-[#292343] shadow-xl w-[800px] h-[620px] rounded-lg">
        <div className="absolute top-0 left-0 w-full h-1">
          <Image
            src={LinhaModal}
            alt="Linha Modal"
            layout="responsive"
            width={800}
            height={5}
          />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4">
          <Image src={Fechar} alt="Fechar" width={30} height={30} />
        </button>

        <div className="flex items-center gap-4 mt-6">
          <Image
            src={NovoColaborador}
            alt="Novo Colaborador"
            width={321}
            height={60}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          {/* Função */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-400">Função</label>
            <select
              {...register("funcao", { required: true })}
              className="w-full px-4 py-2 rounded bg-[#1D1933] text-white"
            >
              <option value="">Selecione a função</option>
              <option value="Encarregado Estrutura">
                Encarregado Estrutura
              </option>
              <option value="Encarregado Iluminacao">
                Encarregado Iluminacao
              </option>
              <option value="Coordenador Externo">Coordenador Externo</option>
              <option value="Coordenador de Energia e Conforto">
                Coordenador de Energia e Conforto
              </option>
              <option value="Coordenador de Estrutura">
                Coordenador de Estrutura
              </option>
              <option value="Coordenador de Iluminacao">
                Coordenador de Iluminacao
              </option>
              <option value="Comercial">Comercial</option>
              <option value="Gerente Administrativo">
                Gerente Administrativo
              </option>
              <option value="Diretor Executivo">Diretor Executivo</option>
            </select>
            {errors.funcao && (
              <span className="text-red-500">{errors.funcao.message}</span>
            )}
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <input
                {...register("Nome", { required: true })}
                placeholder="Nome"
                className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400"
              />
              {errors.Nome && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.Nome.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                {...register("cpf", { required: true })}
                placeholder="CPF"
                className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400"
              />
              {errors.cpf && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.cpf.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <input
                {...register("contato", { required: true })}
                placeholder="Contato"
                className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400"
              />
              {errors.contato && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.contato.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                {...register("email", { required: true })}
                placeholder="E-mail"
                className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400"
              />
              {errors.email && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <input
                {...register("senha", {
                  required: "A senha é obrigatória.",
                  minLength: {
                    value: 8,
                    message: "A senha deve ter no mínimo 8 caracteres.",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "A senha deve conter pelo menos uma letra maiúscula.",
                    hasNumber: (value) =>
                      /\d/.test(value) ||
                      "A senha deve conter pelo menos um número.",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      "A senha deve conter pelo menos um caractere especial.",
                  },
                })}
                type="password"
                placeholder="Senha"
                className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400"
              />
              {errors.senha && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.senha.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
            <input
    {...register("confirmarSenha", {
      required: "Confirmação de senha é obrigatória",
      validate: (value) => 
        value === getValues("senha") || "As senhas não conferem", // <- aqui compara
    })}
    type="password"
    placeholder="Confirmar Senha"
    className="px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400"
  />
  {errors.confirmarSenha && (
    <span className="text-red-400 text-xs mt-1">
      {errors.confirmarSenha.message}
    </span>
  )}
            </div>
          </div>

          {generalError && (
            <p className="text-red-400 text-center mt-2">{generalError}</p>
          )}

          {/* Botões */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-full hover:bg-slate-700"
            >
              <Image src={Voltar} alt="Voltar" width={18} height={18} />{" "}
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-full transition ${
                !isValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-slate-700"
              }`}
              disabled={!isValid}
            >
              Concluir{" "}
              <Image src={Avancar} alt="Avançar" width={18} height={18} />
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
