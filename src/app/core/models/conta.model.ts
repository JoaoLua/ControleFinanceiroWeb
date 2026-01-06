export interface Conta {
  id: number;
  nome: string;
  saldo: number;
  userId?: string;
}

export interface ContaRequest {
  nome: string;
  saldo: number;
}