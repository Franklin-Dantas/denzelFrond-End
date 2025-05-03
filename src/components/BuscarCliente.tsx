import { Search } from "lucide-react";

interface BuscarClienteProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BuscarCliente({ value, onChange }: BuscarClienteProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Buscar Cliente"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-2 rounded-full bg-[#1D1933] text-white placeholder-gray-400 border border-gray-500 focus:border-white focus:outline-none"
      />
    </div>
  );
}
