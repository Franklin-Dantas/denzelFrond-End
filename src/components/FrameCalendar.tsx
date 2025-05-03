import { JSX } from "react";
import Image from "next/image";
import Calendario from "/public/Calendario.svg";

interface FrameProps {
    onChange?: () => void;
    onClick?: () => void;
    value?: string;
  }
  
  export default function Frame({onClick, onChange, value }: FrameProps): JSX.Element {
    return (
      <button
        type="button"
        onClick={onClick}
        onChange={onChange}
        className="inline-flex items-center h-[40px] gap-2.5 px-5 py-2 rounded-sm border border-pbcor-padro-branco bg-transparent hover:bg-pbcor-padro-branco/10 transition"
      >
        <Image src={Calendario} alt="Calendário" className="h-6 w-6 text-pbcor-padro-branco" />
        <span
          className="font-PADR-o text-pbcor-padro-branco"
          style={{
            fontSize: "var(--PADR-o-font-size)",
            fontWeight: "var(--PADR-o-font-weight)",
            letterSpacing: "var(--PADR-o-letter-spacing)",
            lineHeight: "var(--PADR-o-line-height)",
            fontStyle: "var(--PADR-o-font-style)",
          }}
        >
          {value || "Data do Evento"}
        </span>
      </button>
    );
  }
  