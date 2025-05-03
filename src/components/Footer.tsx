import Buttons from "./Buttons";
import Bug from "/public/Bug.svg";
import DenzelFooter from "/public/Logo-Footer.svg";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="w-full bg-gradient-to-l from-[#43A3D5] to-[#9C60DA] p-4 text-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-sm text-center md:text-left gap-4 md:gap-10 font-lexend text-white-700">
        
        <span>
          <strong>Denzel Iluminação</strong> © 2025 Denzel. Todos os direitos reservados.
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-[40px]">
          <Buttons icone={Bug} title="Reportar Bug" path="/ReportarBug" />
          <Image src={DenzelFooter} alt="Logo da Denzel Iluminação" width={93} height={34} />
        </div>
      </div>
    </div>
  );
}
