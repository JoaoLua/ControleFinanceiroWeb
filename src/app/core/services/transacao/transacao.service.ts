import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateTransacaoRequest, TipoTransacao, Transacao } from '../../models/transacao.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private readonly apiUrl = `${environment.apiUrl}/transacoes`;

  constructor(private http: HttpClient) {}

    getTransacoes(filters?: {
    tipo?: TipoTransacao;
    data?: Date;
    contaId?: number;
    categoriaId?: number;
  }): Observable<Transacao[]> {

    let params = new HttpParams();

    if (filters?.tipo) {
      params = params.set('tipo', filters.tipo);
    }

    if (filters?.data) {
      params = params.set(
        'data',
        filters.data.toISOString()
      );
    }

    if (filters?.contaId) {
      params = params.set('contaId', filters.contaId);
    }

    if (filters?.categoriaId) {
      params = params.set('categoriaId', filters.categoriaId);
    }

    return this.http.get<Transacao[]>(this.apiUrl, { params });
  }

  addTransacao(
    request: CreateTransacaoRequest
  ): Observable<Transacao> {
    return this.http.post<Transacao>(this.apiUrl, request);
  }

}
