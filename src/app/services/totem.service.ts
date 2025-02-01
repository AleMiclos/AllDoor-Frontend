import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TotemService {
  private apiUrl = 'https://outdoor-backend.onrender.com/totems'; // URL base da API

  constructor(private http: HttpClient) {}

  // Método para obter os headers de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Chave corrigida
    if (!token) {
      console.error('Token não encontrado no localStorage.');
      throw new Error('Token de autenticação não fornecido.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getTotemById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers); // Depuração

    return this.http
      .get<any>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar totem por ID:', error);
          return throwError(() => new Error('Erro ao buscar totem por ID'));
        })
      );
  }

  // Método para obter totens por userId
  getTotems(userId: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers); // Depuração
    // by-user-id/${userId}
    return this.http
      .get<any[]>(`${this.apiUrl}/`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar totens:', error);
          return throwError(() => new Error('Erro ao buscar totens'));
        })
      );
  }

  // Método para adicionar um novo totem
  addTotem(totem: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers); // Depuração

    return this.http
      .post<any>(`${this.apiUrl}/new-totem`, totem, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao adicionar totem:', error);
          return throwError(() => new Error('Erro ao adicionar totem'));
        })
      );
  }

  // Método para atualizar um totem existente
  updateTotem(id: string, totem: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers); // Depuração

    return this.http
      .put(`${this.apiUrl}/${id}`, totem, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar totem:', error);
          return throwError(() => new Error('Erro ao atualizar totem'));
        })
      );
  }

  // Método para deletar um totem
  deleteTotem(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers); // Depuração

    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erro ao deletar totem:', error);
          return throwError(() => new Error('Erro ao deletar totem'));
        })
      );
  }
}
