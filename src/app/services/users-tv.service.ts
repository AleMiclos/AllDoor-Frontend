import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersTvService {
  private apiUrl = 'https://outdoor-backend.onrender.com'; // Sem `/api` pois não existe no backend

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  // 🔹 Buscar usuários com permissão para TV
  getUsersWithTvPermission(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/tv`, { headers: this.getHeaders() });
  }

  // 🔹 Buscar TVs atribuídas a um usuário específico
  getTvsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/tvs`, { headers: this.getHeaders() });
  }

  // 🔹 Atualizar permissões do usuário (admin)
  updateUserPermissions(userId: string, permissions: { tvs: boolean, totens: boolean }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/permissions/${userId}`, permissions, { headers: this.getHeaders() });
  }
}
