import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conta, ContaRequest } from '../../models/conta.model';

@Injectable({
  providedIn: 'root'
})
export class ContasService {
  private readonly apiUrl = `${environment.apiUrl}/contas`;

  constructor(private http: HttpClient) {}
  
  getContas(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.apiUrl);
  }

  criarConta(request: ContaRequest): Observable<Conta> {
    return this.http.post<Conta>(this.apiUrl, request);
  }
  
  atualizarConta(id: number, request: ContaRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  excluirConta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
