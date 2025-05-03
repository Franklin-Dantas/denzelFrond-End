"use client"

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import LinhaModal from '../../public/Linha-Modal.png';
import Fechar from '../../public/Fechar-Modal.svg';
import Avancar from '../../public/Avancar.png';
import Voltar from '../../public/Voltar.png';
import NovoCliente from '../../public/Novo Cliente.png';
import PessoaJuridica from '../../public/Botao-Pj.svg';
import PessoaJuridicaHover from '../../public/PJ-Hover.svg';
import PessoaJuridicaPressing from '../../public/PJ-Pressing.svg';
import PessoaFisica from '../../public/Botão-PF.svg';
import PessoaFisicaHover from '../../public/PF-Hover.svg';
import PessoaFisicaPressing from '../../public/PF-Pressing.svg';
import { ClienteForm } from '../@Types/ClientesForms';
import Cliente from '../@Types/Cliente';


interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Cliente) => Promise<void>;
}

export default function ClienteModal({ isOpen, onClose }: ClienteModalProps) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<ClienteForm>();
  const [tipoCliente, setTipoCliente] = useState<'PF' | 'PJ'>('PF');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [pfImage, setPfImage] = useState(PessoaFisica);
  const [pjImage, setPjImage] = useState(PessoaJuridica);

  const onSubmit: SubmitHandler<ClienteForm> = async (data) => {
    data.tipo = tipoCliente;

    const userToken = localStorage.getItem('token');  
    if (!userToken) {
      setGeneralError('Token de autenticação não encontrado. Por favor, faça login novamente.');
      return;
    }


    try {
      const response = await fetch('https://denzel-backend.onrender.com/api/clientes/criar', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.errors) { 
          Object.entries(errorData.errors).forEach(([field, message]) => {
            setError(field as keyof ClienteForm, {
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

      alert('Cliente criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro na requisição:', error);
      setGeneralError("Ocorreu um erro inesperado. Tente novamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
     <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-[#100D1E] p-8 text-white border border-[#292343] shadow-xl" style={{ width: 800, height: 680 }}>
        
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

        <button onClick={onClose} className="absolute top-3 right-3">
          <Image src={Fechar} alt="Fechar" width={40} height={40} />
        </button>
        
        <h2 className="text-3xl font-bold text-[#9C60DA] mb-6 flex items-center gap-2 mt-6">
          <Image src={NovoCliente} alt="Novo Cliente" width={235} height={80} /> 
        </h2>

        <div className="flex space-x-4 pt-5 mb-6">
        <div className="w-[185px] h-[40px]  flex items-center justify-center">
    <Image 
      src={tipoCliente === 'PF' ? PessoaFisicaPressing : pfImage}
      onMouseEnter={() => {
        if (tipoCliente !== 'PF') setPfImage(PessoaFisicaHover);
      }}
      onMouseLeave={() => {
        if (tipoCliente !== 'PF') setPfImage(PessoaFisica);
      }}
      onMouseDown={() => setPfImage(PessoaFisicaPressing)}
      onClick={() => {
        setTipoCliente('PF');
        setPfImage(PessoaFisicaPressing);
        setPjImage(PessoaJuridica); 
      }}
      alt='Pessoa Física'
      width={168}
      height={40}
    />
  </div>

  <div className="w-[185px] h-[40px] flex items-center justify-center">
    <Image
      src={tipoCliente === 'PJ' ? PessoaJuridicaPressing : pjImage}
      onMouseEnter={() => {
        if (tipoCliente !== 'PJ') setPjImage(PessoaJuridicaHover);
      }}
      onMouseLeave={() => {
        if (tipoCliente !== 'PJ') setPjImage(PessoaJuridica);
      }}
      onMouseDown={() => setPjImage(PessoaJuridicaPressing)}
      onClick={() => {
        setTipoCliente('PJ');
        setPjImage(PessoaJuridicaPressing);
        setPfImage(PessoaFisica); 
      }}
      alt='Pessoa Jurídica'
      width={185}
      height={40}
    />
  </div>
        </div>

        {generalError && <p className="text-red-500 text-sm mb-4">{generalError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {generalError && <p className="text-red-500 text-sm mb-4">{generalError}</p>}

          <div className="grid grid-cols-3 gap-4 mb-4 pt-5">
            <div className="col-span-1">
              <label className="block mb-1 text-sm text-gray-400">Nome</label>
              <input {...register("Nome", { required: true })} placeholder="Antônio Santos da Costa" className="w-full px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
              {errors.Nome && <p className="text-red-400 text-xs">{errors.Nome.message}</p>}
            </div>

            <div>
              <label className='text-gray-400'>{tipoCliente === 'PF' ? "CPF" : "CNPJ"}</label>
              <input {...register("cpf_cnpj")}
                     className="w-full px-4 py-2 rounded bg-[#1D1933] text-white" placeholder={tipoCliente ==='PF' ? "000.000.000-00" : "00.000.000/0000-00"} />
               {errors.cpf_cnpj && <p className="text-red-400 text-xs">{errors.cpf_cnpj.message}</p>}
            </div>
            <div className="col-span-1">
              <label className="block mb-1 text-sm text-gray-400">Responsável</label>
              <input {...register("responsavel")} placeholder="Luiz Da Silva" className="w-full px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
              {errors.responsavel && <p className="text-red-400 text-xs">{errors.responsavel.message}</p>}
            </div>
           
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4 pt-10">
          <div className="col-span-1">
              <label className="block mb-1 text-sm text-gray-400">Contato</label>
              <input {...register("contato")} placeholder="(00) 0 0000.0000" className="w-full px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
              {errors.contato && <p className="text-red-400 text-xs">{errors.contato.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">E-mail</label>
              <input {...register("email")} placeholder="email@exemplo.com" className="w-full px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
              {errors.email?.message && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">CEP</label>
              <input {...register("cep")} placeholder="00000-000" className="w-full px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
              {errors.cep && <p className="text-red-400 text-xs">{errors.cep.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-400">Rua</label>
              <input {...register("rua")} placeholder="Rua das Flores" className="w-full px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
              {errors.rua && <p className="text-red-400 text-xs">{errors.rua.message}</p>}
            </div>
   
          </div>

          <div className="flex gap-[30px] pt-10 mb-6">
          <div>
              <label className="block mb-1 text-sm text-gray-400">Número</label>
              <input {...register("numero")} placeholder="000" className="w-[100px] px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
              {errors.numero && <p className="text-red-400 text-xs">{errors.numero.message}</p>}
          </div>
  <div className='w-[67.32px]'>
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
    <input {...register("cidade")} placeholder="Cidade" className="w-[204px] px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
    {errors.cidade && <p className="text-red-400 text-xs">{errors.cidade.message}</p>}
  </div>
  
  <div>
    <label className="block mb-1 text-sm text-gray-400">Bairro</label>
    <input {...register("bairro")} placeholder="Bairro" className="w-[204px] px-4 py-2 rounded bg-[#1D1933] text-white placeholder-gray-400" />
    {generalError && <p className="text-red-400 text-xs">{generalError}</p>}
  </div>
</div>




          <div className="flex justify-between mt-6 pt-[20px] ">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#292343] text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 transition"
            >
              <Image src={Voltar} alt='Cancelar' width={17.32} height={15}/> Cancelar
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
