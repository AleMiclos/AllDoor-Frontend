import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../enviroments/environment'


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // Substitua pela URL correta da API

  constructor(private http: HttpClient) {}

  // 🔹 Buscar todos os usuários
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // 🔹 Atualizar o tipo de usuário
  updateUserType(userId: string, userType: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/users/${userId}/type`, { userType });
  }

  // 🔹 Atualizar permissões do usuário
  updatePermissions(userId: string, permissions: { tvs: boolean, totens: boolean }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/permissions/${userId}`, permissions);
  }
}
