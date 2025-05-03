import { Search } from "lucide-react";
import React from "react";

export default function SearchBar() {
  return (
    <div className="relative flex items-center w-full max-w-md">

      <Search className="absolute left-4 text-gray-400 w-5 h-5" />

      <input
        type="text"
        placeholder="Buscar Clientes"
        className="w-full pl-12 pr-4 py-2 rounded-full bg-[#1D1933] text-white placeholder-gray-400 border border-gray-500 focus:border-white focus:outline-none"
      />
    </div>
  );
}
