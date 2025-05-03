export interface IEventoUsuario {
  eventoId: number;
  nomeEvento: string;
  tipoAlocacao: "Montagem" | "Desmontagem" | null;
  status: "Passado" | "Futuro" | null;
}
