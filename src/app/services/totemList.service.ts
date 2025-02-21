import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TotemListService {
  private apiUrl = 'http://localhost:5000/users'; // URL base da API

  constructor(private http: HttpClient) {}

  // Método para obter os headers de autenticação
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticação não encontrado.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // 🔹 Buscar todos os usuários
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
    });
  }

  // 🔹 Buscar usuários com permissão para totens
  getUsersWithTotemPermission(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/permissions/totens`, {
      headers: this.getHeaders(),
    });
  }
}
