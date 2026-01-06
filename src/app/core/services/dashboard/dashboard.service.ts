import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResumoFinanceiro, Transacao } from '../../models/transacao.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getResumo(): Observable<ResumoFinanceiro> {
    return this.http.get<ResumoFinanceiro>(`${this.apiUrl}/resumo`);
  }
  getUltimasTransacoes(qtd: number = 5): Observable<Transacao[]> {
    return this.http.get<Transacao[]>(
      `${this.apiUrl}/ultimas?quantidade=${qtd}`
    );
  }
}

