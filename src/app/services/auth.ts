import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //costante per non cambiarla in esecuzione
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {}

  login(credenziali: AuthRequest) {
    return this.http.post<AuthResponse>('http://localhost:8080/auth/login', credenziali);
  }

 //È uno spazio di archiviazione che ogni browser mette a disposizione per ogni sito web, dove puoi salvare piccole quantità di
 //dati sotto forma di testo (coppie chiave-valore), che rimangono salvati anche se chiudi il browser o spegni il computer

  // Salva il token
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Recupera il token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Rimuove il token (Logout)
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}