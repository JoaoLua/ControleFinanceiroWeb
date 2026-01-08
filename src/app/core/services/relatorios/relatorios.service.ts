import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  private readonly apiUrl = `${environment.apiUrl}/relatorios`;

  constructor(private http: HttpClient) { }

  gerarExtratoPdf(): Observable<Blob> { 
    return this.http.get(`${this.apiUrl}/relatorio/pdf`, {
      responseType: 'blob'
    })
  }
  
}
