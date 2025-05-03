import IluminacaoIcon from "/iluminacao.svg";
import EstruturaIcon from "/estrutura.svg";
import geradorIcon from "/geradorIcon.svg";
import climatizacaoIcon from "/climatizacaoIcon.svg";
import SaneamentoIcon from "/sanitario.svg";
import BoxIcon from "/Material.svg";

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
