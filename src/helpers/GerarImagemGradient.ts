import IluminacaoIcon from "../public/iluminacao.svg";
import EstruturaIcon from "../public/estrutura.svg";
import geradorIcon from "../public/geradorIcon.svg";
import climatizacaoIcon from "../public/climatizacaoIcon.svg";
import SaneamentoIcon from "../public/sanitario.svg";
import BoxIcon from "../public/Material.svg";

export const getCategoriaIcon = (categoria: string | number) => {
  switch (categoria) {
    case 1:
      return IluminacaoIcon;
    case 2:
      return EstruturaIcon;
    case 3:
      return geradorIcon;
    case 4:
      return climatizacaoIcon;
    case 5:
      return SaneamentoIcon;
    default:
      return BoxIcon;
  }
};
