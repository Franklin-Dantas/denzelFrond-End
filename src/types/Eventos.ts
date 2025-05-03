import Cliente from "./Cliente";

export interface IEventos {
  Id: number;
  Nome: string;
  Local: string;
  DataInicio: Date;
  DataFim: Date;
  HoraInicio: Date;
  HoraFim: Date;
  MontagemInicio: Date;
  MontagemFim: Date;
  DesmontagemInicio: Date;
  DesmontagemFim: Date;
  idEncarregadoMontagemIluminacao?: number | null;
  idEncarregadoIluminacaoDesmontagem?: number | null;
  idEncarregadoEstruturaMontagem?: number | null;
  idEncarregadoEstruturaDesmontagem?: number | null;
  IdCliente: number;
  IdUsuario: number;
  Materiais: string;
  AnexoImagem?: string;
  cliente?: Cliente;
  Materiais_Faltando?: string;
  PontoDeReferencia?: string;
}
