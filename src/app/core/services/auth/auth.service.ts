import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/auth.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`
  private readonly tokenKey = 'access_token'

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken())

  constructor(private http: HttpClient) { }

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          localStorage.setItem(this.tokenKey, response.accessToken);
          this.isAuthenticatedSubject.next(true)
        })
      );
  }

  register(data: RegisterRequest)  {
    return this.http.post<void>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

}


