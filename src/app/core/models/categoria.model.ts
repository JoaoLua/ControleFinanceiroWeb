export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  corHexadecimal?: string;
}

export interface CategoriaRequest {
  nome: string;
  descricao?: string;
  corHexadecimal?: string;
}