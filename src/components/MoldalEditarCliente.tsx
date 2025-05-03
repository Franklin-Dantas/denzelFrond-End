"use client";

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import Fechar from '/Fechar-Modal.svg';
import LinhaModal from '/Linha-Modal.png';
import { ClienteForm } from '../@Types/ClientesForms';
import PessoaJuridica from '/Botao-Pj.svg';
import PessoaJuridicaHover from '/PJ-Hover.svg';
import PessoaJuridicaPressing from '/PJ-Pressing.svg';
import PessoaFisica from '/Botão-PF.svg';
import PessoaFisicaHover from '/PF-Hover.svg';
import PessoaFisicaPressing from '/PF-Pressing.svg';
import EditarCliente from '/Editar-Cliente.svg';
import Avancar from '/Avancar.png';
import Voltar from '/Voltar.png';

interface EditarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  idCliente: number;
  onAtualizarCliente: () => void;
}

export default function EditarClienteModal({ isOpen, onClose, idCliente, onAtualizarCliente }: EditarClienteModalProps) {
  const [tipoCliente, setTipoCliente] = useState<'PF' | 'PJ'>('PF');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [pfImage, setPfImage] = useState(PessoaFisica);
  const [pjImage, setPjImage] = useState(PessoaJuridica);
  const [loadingCliente, setLoadingCliente] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ClienteForm>({
    defaultValues: {
      Nome: '',
      cpf_cnpj: '',
      contato: '',
      email: '',
      cep: '',
      rua: '',
      numero: '',
      estado: 'PE',
      cidade: '',
      bairro: '',
      responsavel: '',
    },
  });

  useEffect(() => {
    async function fetchCliente() {
      setLoadingCliente(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://denzel-backend.onrender.com/api/clientes/buscar/${idCliente}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const cliente = Array.isArray(data) ? data[0] : data;

        console.log("Cliente retornado:", cliente);

        setTipoCliente(cliente.tipo === 'PJ' ? 'PJ' : 'PF');
        reset(cliente); // Preenche o formulário com os dados
      } catch (error) {
        console.error("Erro ao buscar cliente para edição:", error);
      } finally {
        setLoadingCliente(false);
      }
    }

    if (idCliente && isOpen) {
      fetchCliente();
    }
  }, [idCliente, isOpen, reset]);

  const onSubmit: SubmitHandler<ClienteForm> = async (data) => {
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      setGeneralError('Token de autenticação não encontrado.');
      return;
    }

    try {
      const response = await fetch(`https://denzel-backend.onrender.com/api/clientes/editar/${idCliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ ...data, tipo: tipoCliente }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([field, message]) => {
            setError(field as keyof ClienteForm, { type: "server", message: message as string });
          });
        }
        alert('Erro ao atualizar cliente.');
        return;
      }

      alert('Cliente atualizado com sucesso!');
      onAtualizarCliente();
      onClose();
    } catch (error) {
      console.error('Erro na atualização:', error);
      alert('Erro na atualização.');
    }
  };

  if (!isOpen) return null;

  if (loadingCliente) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="relative bg-[#100D1E] p-8 text-white border border-[#292343] shadow-xl flex items-center justify-center" style={{ width: 400, height: 200 }}>
          <p className="text-white text-lg font-bold">Carregando cliente...</p>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-[#100D1E] p-8 text-white border border-[#292343] shadow-xl" style={{ width: 800, height: 680 }}>

        {/* Cabeçalho com linha decorativa */}
        <div className="absolute top-0 left-0 w-full h-1">
          <Image src={LinhaModal} alt="Linha decorativa" layout="responsive" width={800} height={5} priority className="w-full" />
        </div>

        <button onClick={onClose} className="absolute top-3 right-3">
          <Image src={Fechar} alt="Fechar" width={40} height={40} />
        </button>

        <h2 className="text-3xl font-bold text-[#9C60DA] mb-6 flex items-center gap-2 mt-6">
          <Image src={EditarCliente} alt="Editar Cliente" width={235} height={80} />
        </h2>

        {/* Botões de tipo */}
        <div className="flex space-x-4 pt-5 mb-6">
          <div className="w-[185px] h-[40px] flex items-center justify-center">
            <Image
              src={tipoCliente === 'PF' ? PessoaFisicaPressing : pfImage}
              onMouseEnter={() => { if (tipoCliente !== 'PF') setPfImage(PessoaFisicaHover); }}
              onMouseLeave={() => { if (tipoCliente !== 'PF') setPfImage(PessoaFisica); }}
              onMouseDown={() => setPfImage(PessoaFisicaPressing)}
              onClick={() => {
                setTipoCliente('PF');
                setPfImage(PessoaFisicaPressing);
                setPjImage(PessoaJuridica);
              }}
              alt="Pessoa Física"
              width={168}
              height={40}
            />
          </div>

          <div className="w-[185px] h-[40px] flex items-center justify-center">
            <Image
              src={tipoCliente === 'PJ' ? PessoaJuridicaPressing : pjImage}
              onMouseEnter={() => { if (tipoCliente !== 'PJ') setPjImage(PessoaJuridicaHover); }}
              onMouseLeave={() => { if (tipoCliente !== 'PJ') setPjImage(PessoaJuridica); }}
              onMouseDown={() => setPjImage(PessoaJuridicaPressing)}
              onClick={() => {
                setTipoCliente('PJ');
                setPjImage(PessoaJuridicaPressing);
                setPfImage(PessoaFisica);
              }}
              alt="Pessoa Jurídica"
              width={185}
              height={40}
            />
          </div>
        </div>

        {/* Erros gerais */}
        {generalError && <p className="text-red-500 text-sm mb-4">{generalError}</p>}

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
          {/* Primeira linha */}
          <div className="grid grid-cols-3 gap-4 mb-4 pt-5">
            <div>
              <label className="block mb-1 text-sm text-gray-400">Nome</label>
              <input {...register("Nome", { required: true })} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.Nome && <p className="text-red-400 text-xs">{errors.Nome.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">{tipoCliente === 'PF' ? "CPF" : "CNPJ"}</label>
              <input {...register("cpf_cnpj", { required: true })} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.cpf_cnpj && <p className="text-red-400 text-xs">{errors.cpf_cnpj.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">Responsável</label>
              <input {...register("responsavel")} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.responsavel && <p className="text-red-400 text-xs">{errors.responsavel.message}</p>}
            </div>
          </div>

          {/* Segunda linha */}
          <div className="grid grid-cols-4 gap-4 mb-4 pt-10">
            <div>
              <label className="block mb-1 text-sm text-gray-400">Contato</label>
              <input {...register("contato")} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.contato && <p className="text-red-400 text-xs">{errors.contato.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">E-mail</label>
              <input {...register("email")} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">CEP</label>
              <input {...register("cep")} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.cep && <p className="text-red-400 text-xs">{errors.cep.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">Rua</label>
              <input {...register("rua")} className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.rua && <p className="text-red-400 text-xs">{errors.rua.message}</p>}
            </div>
          </div>

          {/* Terceira linha */}
          <div className="flex gap-[30px] pt-10 mb-6">
            <div>
              <label className="block mb-1 text-sm text-gray-400">Número</label>
              <input {...register("numero")} className="w-[100px] px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.numero && <p className="text-red-400 text-xs">{errors.numero.message}</p>}
            </div>
            <div className="w-[67.32px]">
              <label className="block mb-1 text-sm text-gray-400">Estado</label>
              <select {...register("estado")} className="w-[80px] px-4 py-2 rounded bg-[#1D1933] text-white">
                <option value="PE">PE</option>
                <option value="PB">PB</option>
                <option value="RN">RN</option>
                <option value="BA">BA</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">Cidade</label>
              <input {...register("cidade")} className="w-[204px] px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.cidade && <p className="text-red-400 text-xs">{errors.cidade.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">Bairro</label>
              <input {...register("bairro")} className="w-[204px] px-4 py-2 rounded bg-[#1D1933] text-white" />
              {errors.bairro && <p className="text-red-400 text-xs">{errors.bairro.message}</p>}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between mt-6 pt-[20px]">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#292343] text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 transition"
            >
              <Image src={Voltar} alt="Cancelar" width={17.32} height={15} /> Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#292343] text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 transition"
            >
              Continuar <Image src={Avancar} alt="Avançar" width={17.32} height={15} />
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
