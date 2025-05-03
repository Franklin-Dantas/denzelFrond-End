"use client";

import React from "react";
import Image from "next/image";
import Previus from "../../public/PreviusIcon.svg";
import Next from "../../public/Next.svg";

interface NavPagesProps {
  page: number;
  setPage: (newPage: number) => void;
  totalPages: number;
}

export default function NavPages({ page, setPage, totalPages }: NavPagesProps) {
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
   console.log(page, totalPages);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-8 mb-8">
      <div className="flex items-center bg-[#1D1933] border border-[#645CAA] rounded-full px-6 py-3 gap-4">
        {/* Texto da Página */}
        <p className="text-white font-light text-sm flex items-center gap-1">
          Página{" "}
          <span className="font-bold">{page}</span> de{" "}
          <span className="font-bold">{totalPages}</span>
        </p>

        {/* Botões */}
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            className="w-[40px] h-[40px] flex items-center justify-center  text-white hover:bg-[#292343] transition"
          >
            <Image src={Previus} width={33} height={30} alt="previus" />
          </button>
          <button
            onClick={handleNextPage}
            className="w-[40px] h-[40px] flex items-center justify-center text-white hover:bg-[#292343] transition"
          >
            <Image src={Next} width={33} height={30} alt="next"/>
          </button>
        </div>
      </div>
    </div>
  );
}
