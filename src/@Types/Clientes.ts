import { IEventos } from "./Eventos";

interface ICliente {
  id: number;
  Nome: string;
  cpf_cnpj: string;
  email: string;
  contato: string;
  data_cadastro: Date;
  tipo: string;
  idsEventos: string | number[];
  cep: string;
  numero: string;
  estado: string;
  cidade: string;
  bairro: string;
  eventos?: IEventos[];
}
export default ICliente;
