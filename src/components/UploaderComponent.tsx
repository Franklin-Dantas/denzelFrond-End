import React from "react";

interface UploadImagemMinimalProps {
  onChange: (file: File) => void;
  id?: string;
}

export default function UploadImagemMinimal({ onChange, id = "upload" }: UploadImagemMinimalProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="relative">
      {/* INPUT OCULTO */}
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* LABEL ESTILIZADA COMO BOTÃO */}
      <label
        htmlFor={id}
        className="w-44 h-24 px-5 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-center items-center gap-[5px] cursor-pointer transition hover:bg-slate-800"
      >
        <div className="w-6 h-6 relative overflow-hidden">
          <div className="w-6 h-4 left-[14.29px] top-[26px] absolute origin-top-left rotate-[-135deg] bg-slate-200" />
        </div>
        <div className="text-slate-200 text-base font-light font-['Lexend']">Anexar Imagem</div>
      </label>
    </div>
  );
}
