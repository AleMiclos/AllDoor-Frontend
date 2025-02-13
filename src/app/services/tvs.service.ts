import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TvsService {
  private apiUrl = 'http://localhost:5000/tvs'; // URL base da API

  constructor(private http: HttpClient) {}

  // Método para obter os headers de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage.');
      throw new Error('Token de autenticação não fornecido.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Buscar todas as TVs
  getTvs(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar TVs:', error);
          return throwError(() => new Error('Erro ao buscar TVs'));
        })
      );
  }

  // Buscar TV por ID
  getTvById(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar TV por ID:', error);
          return throwError(() => new Error('Erro ao buscar TV por ID'));
        })
      );
  }

  // Adicionar uma nova TV
  addTv(tv: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/new-tv`, tv, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao adicionar TV:', error);
          return throwError(() => new Error('Erro ao adicionar TV'));
        })
      );
  }

  // Atualizar TV
  updateTv(id: string, tv: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${id}`, tv, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar TV:', error);
          return throwError(() => new Error('Erro ao atualizar TV'));
        })
      );
  }

  // Deletar TV
  deleteTv(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao deletar TV:', error);
          return throwError(() => new Error('Erro ao deletar TV'));
        })
      );
  }
}
