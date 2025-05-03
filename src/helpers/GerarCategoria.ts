export function GerarCategoria(id: string | number): string {
  const catId = Number(id); // transforma para número também
  switch (catId) {
    case 1:
      return "iluminacao";
    case 2:
      return "estrutura";
    case 3:
      return "gerador";
    case 4:
      return "climatizacao";
    case 5:
      return "sanitarios";
    default:
      return "Categoria Desconhecida";
  }
}
