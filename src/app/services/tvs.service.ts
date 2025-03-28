import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Importe o operador map
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvsService {
  private apiUrl = 'https://outdoor-backend.onrender.com'; // Altere conforme necessário

  constructor(private http: HttpClient) {}

  getTvsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv/user/${userId}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar TVs:', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  // 🔹 Buscar uma TV específica
  getTvById(tvId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tv/${tvId}`);
  }
  getTvLinks(tvId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/${tvId}/links`).pipe(
      catchError(error => {
        console.error('Erro ao buscar links da TV:', error);
        return of(null);
      })
    );
  }


  createTv(tvData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tv`, tvData).pipe(
      catchError(error => {
        console.error('Erro ao criar TV:', error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  // 🔹 Atualizar informações de uma TV
  updateTv(tvId: string, tvData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tv/${tvId}`, tvData).pipe(
      catchError(error => {
        console.error('Erro ao atualizar TV:', error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  // 🔹 Deletar uma TV
  deleteTv(tvId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tv/${tvId}`).pipe(
      catchError(error => {
        console.error('Erro ao deletar TV:', error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  // 🔹 Atualizar o status de uma TV
  atualizarStatusTv(tvId: string, status: boolean): Observable<any> {
    // Converte o status booleano para 'online' ou 'offline' antes de enviar ao backend
    const statusString = status ? 'online' : 'offline';
    return this.http.post(`${this.apiUrl}/tv/status-tv`, { tvId, status: statusString }, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao atualizar status da TV:', error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  // 🔹 Buscar o status de uma TV
  getTvStatus(tvId: string): Observable<boolean> {
    return this.http.get<string>(`${this.apiUrl}/tv/status-tv/${tvId}`, { headers: this.getHeaders() }).pipe(
      map((status: string) => status === 'online'), // Converte 'online' para true e 'offline' para false
      catchError(error => {
        console.error('Erro ao buscar status da TV:', error);
        return of(false); // Retorna false em caso de erro
      })
    );
  }
}
