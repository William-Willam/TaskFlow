export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
  usuarioId: number;
}

export interface ProjetoRequest {
  nome: string;
  descricao: string;
}