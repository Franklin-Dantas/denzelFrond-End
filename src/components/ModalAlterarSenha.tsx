'use client';

import { useState } from 'react';
import { pegarDadosDoToken } from '../helpers/JwtDecoder';

interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAlterarSenha({ isOpen, onClose }: ModalAlterarSenhaProps) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As novas senhas não coincidem.');
      return;
    }

    const token = localStorage.getItem('token');
    const decoder = pegarDadosDoToken();
    const userId = decoder?.id;

    if (!token || !userId) {
      setErro('Usuário não autenticado.');
      return;
    }

    try {
      const res = await fetch(`https://denzel-backend.onrender.com/api/usuarios/AlterarSenha/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        const text = contentType?.includes('application/json')
          ? (await res.json()).message || 'Erro ao alterar senha.'
          : await res.text();
        throw new Error(text);
      }

      setMensagem('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message || 'Erro desconhecido.');
      } else {
        setErro('Erro desconhecido.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#292343] rounded-xl w-full max-w-md p-6 text-white relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-white text-lg">&times;</button>
        <h1 className="text-xl font-bold mb-4 text-center">Alterar Senha</h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm">Senha Atual</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-[#E6E0F8] text-black mb-4"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm">Nova Senha</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-[#E6E0F8] text-black mb-4"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm">Confirmar Nova Senha</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-[#E6E0F8] text-black mb-4"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />

          {erro && <p className="text-red-500 mb-4">{erro}</p>}
          {mensagem && <p className="text-green-500 mb-4">{mensagem}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-400 py-2 rounded hover:from-purple-600 hover:to-blue-500 transition"
          >
            Alterar Senha
          </button>
        </form>
      </div>
    </div>
  );
}
