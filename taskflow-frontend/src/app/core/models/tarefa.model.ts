export type StatusTarefa = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  dataCriacao: string;
  prazo: string;
  status: StatusTarefa;
  projetoId: number;
  projetoNome: string;
}

export interface TarefaRequest {
  titulo: string;
  descricao: string;
  prazo: string;
  status: StatusTarefa;
  projetoId: number;
}