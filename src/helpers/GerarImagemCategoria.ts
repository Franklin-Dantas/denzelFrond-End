import IluminacaoIcon from "../public/iluminacao.svg";
import EstruturaIcon from "../public/estrutura.svg";
import geradorIcon from "../public/geradorIcon.svg";
import climatizacaoIcon from "../public/climatizacaoIcon.svg";
import SaneamentoIcon from "../public/sanitario.svg";
import BoxIcon from "../public/Material.svg";

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
