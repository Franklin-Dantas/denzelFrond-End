"use client";
import React, { createContext, useContext, useState } from "react";

interface FormData {
  [key: string]: string | number | boolean;
}

interface MaterialSelecionado {
  categoria: number;
  nome: string;
  quantidade: number;
}

type SelectedDates = Record<string, Date | undefined>;

interface FormularioEventoContextType {
  idCliente: number | null;
  setIdCliente: React.Dispatch<React.SetStateAction<number | null>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  selectedDates: SelectedDates;
  setSelectedDates: React.Dispatch<React.SetStateAction<SelectedDates>>;
  imagens: File[];
  setImagens: React.Dispatch<React.SetStateAction<File[]>>;
  materiais: MaterialSelecionado[];
  setMateriais: React.Dispatch<React.SetStateAction<MaterialSelecionado[]>>;
  limparFormulario: () => void;
  salvarFormulario: (dados: {
    formData: FormData;
    selectedDates: SelectedDates;
    imagens?: File[];
    materiais?: MaterialSelecionado[];
  }) => void;
}

const FormularioEventoContext = createContext<FormularioEventoContextType | undefined>(undefined);

export const FormularioEventoProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({});
  const [imagens, setImagens] = useState<File[]>([]);
  const [materiais, setMateriais] = useState<MaterialSelecionado[]>([]);
  const [idCliente, setIdCliente] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("idCliente");
      return stored ? Number(stored) : null;
    }
    return null; // No servidor, assume null
  });
  

  const limparFormulario = () => {
    setFormData({});
    setSelectedDates({});
    setImagens([]);
    setMateriais([]);
    setIdCliente(null);
  };

  const salvarFormulario = ({
    formData,
    selectedDates,
    imagens = [],
    materiais = [],
  }: {
    formData: FormData;
    selectedDates: SelectedDates;
    imagens?: File[];
    materiais?: MaterialSelecionado[];
  }) => {
    setFormData(formData);
    setSelectedDates(selectedDates);
    setImagens(imagens);
    setMateriais(materiais);

    // Se `idCliente` estiver no formData, atualiza ele também
    const idFromForm = formData.idCliente;
    if (typeof idFromForm === "number") {
      setIdCliente(idFromForm);
      localStorage.setItem("idCliente", String(idFromForm));
    }
  };

  return (
    <FormularioEventoContext.Provider
      value={{
        idCliente,
        setIdCliente,
        formData,
        setFormData,
        selectedDates,
        setSelectedDates,
        imagens,
        setImagens,
        materiais,
        setMateriais,
        limparFormulario,
        salvarFormulario,
      }}
    >
      {children}
    </FormularioEventoContext.Provider>
  );
};

export const useFormularioEvento = () => {
  const context = useContext(FormularioEventoContext);
  if (!context) {
    throw new Error("useFormularioEvento precisa estar dentro do FormularioEventoProvider");
  }
  return context;
};
