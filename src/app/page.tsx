"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://denzel-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao fazer login:", errorData);
        setError(errorData.message || "Erro ao realizar o login.");
        return;
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log(data.token);
      router.push('/clientes');
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#100D1E]">
      <form onSubmit={handleLogin} className="bg-[#1D1933] p-8 rounded shadow-md w-96 space-y-4">
      <h2 
  className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text hover:from-blue-400 hover:to-purple-500 transition-all duration-300"
>
  Login
</h2>
        
        {error && <p className="text-red-500">{error}</p>}
        
        <div>
          <label className='mb-4 text-transparent bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text hover:from-blue-400 hover:to-purple-500 transition-all duration-300'>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1 bg-[#1D1933] mb-4 text-transparent bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text hover:from-blue-400 hover:to-purple-500 transition-all duration-300"
            required
          />
        </div>
        
        <div>
          <label className='mb-4 text-transparent bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text hover:from-blue-400 hover:to-purple-500 transition-all duration-300'>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border rounded mt-1 bg-[#1D1933] mb-4 text-transparent bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text hover:from-blue-400 hover:to-purple-500 transition-all duration-300"
            required
          />
        </div>
        
        <button type="submit"  className="w-full h-10 bg-[#292343] text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 transition">Entrar</button>
      </form>
    </div>
  );
}