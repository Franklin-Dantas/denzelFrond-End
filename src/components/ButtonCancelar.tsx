import { ChevronLeft } from "lucide-react";
import { JSX } from "react";


interface ButtonCancelarProps {
    onClick: () => void;
  }

export default function ButtonCancelar({ onClick }: ButtonCancelarProps): JSX.Element {
  return (
    <button
    onClick={onClick}
      className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-[30px_0px_0px_30px] border border-solid border-pbcor-padro-branco bg-transparent text-pbcor-padro-branco hover:bg-pbcor-padro-branco/10"
      >
      <ChevronLeft className="h-3.5 w-3.5" />
      <span>Cancelar</span>
    </button>
  );
}
