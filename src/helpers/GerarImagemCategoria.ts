import IluminacaoIcon from "/iluminacao.svg";
import EstruturaIcon from "/estrutura.svg";
import geradorIcon from "/geradorIcon.svg";
import climatizacaoIcon from "/climatizacaoIcon.svg";
import SaneamentoIcon from "/sanitario.svg";
import BoxIcon from "/Material.svg";

export const getCategoriaIcon = (categoria: string | number) => {
  const cat = Number(categoria); // transforma para número
  if (isNaN(cat)) {
    console.warn("Categoria inválida para ícone:", categoria);
    return BoxIcon; // fallback ícone genérico
  }
  switch (cat) {
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
