import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users'; // Substitua pela URL correta da API

  constructor(private http: HttpClient) {}

  // Buscar todos os usuários
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  // Atualizar o tipo de usuário
  updateUserType(userId: string, userType: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${userId}/type`, { userType });
  }

  // Atualizar permissões do usuário
  updatePermissions(userId: string, permissions: string[]): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${userId}/permissions`, { permissions });
  }
}
