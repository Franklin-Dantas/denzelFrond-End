"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Definindo Material
interface Material {
  id: number;
  Nome: string;
  status: string;
  categoria: number;
  quantidade: number;
  selecionado: boolean;
}

// Definindo o que o Context irá prover
interface MateriaisContextType {
  materiais: Material[];
  setMateriais: React.Dispatch<React.SetStateAction<Material[]>>;
}

// Criando Contexto já tipado
const MateriaisContext = createContext<MateriaisContextType | undefined>(undefined);

// Provider
export function MateriaisProvider({ children }: { children: ReactNode }) {
  const [materiais, setMateriais] = useState<Material[]>([]);

  return (
    <MateriaisContext.Provider value={{ materiais, setMateriais }}>
      {children}
    </MateriaisContext.Provider>
  );
}

// Hook de uso
export function useMateriais() {
  const context = useContext(MateriaisContext);
  if (!context) {
    throw new Error("useMateriais deve ser usado dentro do MateriaisProvider");
  }
  return context;
}
