import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../enviroments/environment'


@Injectable({
  providedIn: 'root',
})
export class TotemService {
  private apiUrl = `${environment.apiUrl}/totem/totem`; // URL base da API ajustada para corresponder ao backend

  constructor(private http: HttpClient) {}

  // Método para obter os headers de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtém o token armazenado
    if (!token) {
      console.error('Token não encontrado no localStorage.');
      throw new Error('Token de autenticação não fornecido.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Buscar todos os totens de um usuário
  getAllTotems(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar todos os totens:', error);
          return throwError(() => new Error('Erro ao buscar todos os totens'));
        })
      );
  }

  // Buscar um totem por ID
  getTotemById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar totem por ID:', error);
          return throwError(() => new Error('Erro ao buscar totem por ID'));
        })
      );
  }

  // Adicionar um novo totem
  addTotem(totem: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, totem, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao adicionar totem:', error);
          return throwError(() => new Error('Erro ao adicionar totem'));
        })
      );
  }

  // Atualizar um totem existente
  updateTotem(id: string, totem: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, totem, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar totem:', error);
          return throwError(() => new Error('Erro ao atualizar totem'));
        })
      );
  }

  // Deletar um totem
  deleteTotem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao deletar totem:', error);
          return throwError(() => new Error('Erro ao deletar totem'));
        })
      );
  }

  // Atualizar o status do totem (se necessário)
  updateTotemStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar status do totem:', error);
          return throwError(() => new Error('Erro ao atualizar status do totem'));
        })
      );
  }
}
