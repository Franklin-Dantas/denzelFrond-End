import { IEventoUsuario } from "./EventosUsuario";

interface IUsuario {
  id: number;
  Nome: string;
  cpf: string;
  contato: string;
  email: string;
  senha: string;
  IdMontagem: number;
  IdDesmontagem: number;
  funcao:
    | "Diretor Executivo"
    | "Gerente Admnistrativo"
    | "Comercial"
    | "Coordenador de Iluminacao"
    | "Coordenador de Estrutura"
    | "Coordenador de Energia e Conforto"
    | "Coordenador Externo"
    | "encarregado iluminacao"
    | "encarregado estrutura";
  eventosAlocados: IEventoUsuario[];
}

export default IUsuario;
