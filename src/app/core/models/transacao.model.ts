export type TipoTransacao = 'Receita' | 'Despesa';

export interface ResumoFinanceiro {
  receitaMensal: number;
  despesaMensal: number;
  saldoMensal: number;
  saldoTotal: number;
}

export interface Transacao {
  id: number;
  tipo: string;
  valor: number;
  descricao: string;
  data: string;
  contaId: number;
  categoriaId?: number;
  categoriaNome: string;
}

export interface CreateTransacaoRequest {
  tipo: TipoTransacao;
  valor: number;
  descricao?: string;
  contaId: number;
  categoriaId: number;
}