import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvsService {

  private apiUrl = environment.apiUrl; // Corrigido para a URL correta de TVs

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');  // Obtém o token do localStorage ou onde estiver armazenado
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adiciona o token nos headers
    });
  }

  // 🔹 Buscar TVs atribuídas a um usuário específico
  getTvsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv/user/${userId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao buscar TVs:', error);
        return of([]);
      })
    );
  }

  // 🔹 Buscar uma TV específica
  getTvById(tvId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/${tvId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao buscar TV:', error);
        return of(null);
      })
    );
  }

  // 🔹 Criar uma nova TV
  createTv(newTv: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tv`, newTv, { headers: this.getHeaders() });
  }

  // 🔹 Atualizar informações de uma TV
  updateTv(tvId: string, tvData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tv/${tvId}`, tvData, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar TV:', error);
        return of(null);
      })
    );
  }

  // 🔹 Deletar uma TV
  deleteTv(tvId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tv/${tvId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao deletar TV:', error);
        return of(null);
      })
    );
  }

  atualizarStatusTv(tvId: string, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tv/status-tv`, { tvId, status }, { headers: this.getHeaders() });
  }

  getTvStatus(tvId: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/tv/status-tv/${tvId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao buscar status da TV:', error);
        return of('');
      })
    );
  }
}
