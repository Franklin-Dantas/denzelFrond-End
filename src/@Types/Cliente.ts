import { IEventos } from "./Eventos";

interface Cliente {
  rua: string | undefined;
  id: number;
  Nome: string;
  cpf_cnpj: string;
  email: string;
  contato: string;
  data_cadastro: Date;
  tipo: string;
  idsEventos: number[];
  cep: string;
  numero: string;
  estado: string;
  cidade: string;
  bairro: string;
  eventos?: IEventos[];
  responsavel: string;
}
export default Cliente;
