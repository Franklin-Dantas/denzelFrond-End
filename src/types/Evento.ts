import Cliente from "./Cliente";

export interface IEvento {
  Id: number;
  Nome: string;
  localEvento: string;
  dataInicio: Date;
  dataFim: Date;
  horaInicio: Date;
  horaFim: Date;
  montagemInicio: Date;
  montagemFim: Date;
  desmontagemInicio: Date;
  desmontagemFim: Date;
  idEncarregadoMontagemIluminacao?: number | null;
  idEncarregadoIluminacaoDesmontagem?: number | null;
  idEncarregadoEstruturaMontagem?: number | null;
  idEncarregadoEstruturaDesmontagem?: number | null;
  idCliente: number;
  idUsuario: number;
  materiais: string;
  AnexoImagem?: string;
  cliente?: Cliente;
  Materiais_Faltando?: string;
  PontoDeReferencia?: string;
}
