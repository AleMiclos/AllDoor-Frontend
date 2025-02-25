import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../enviroments/environment'

@Injectable({
  providedIn: 'root'
})
export class TvsService {
  
  private apiUrl = environment.apiUrl; // Corrigido para a URL correta de TVs

  constructor(private http: HttpClient) {}

  // 🔹 Buscar TVs atribuídas a um usuário específico
  getTvsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv/user/${userId}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar TVs:', error);
        return of([]);
      })
    );
  }

  // 🔹 Buscar uma TV específica
  getTvById(tvId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/${tvId}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar TV:', error);
        return of(null);
      })
    );
  }

  // 🔹 Criar uma nova TV
  createTv(tvData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tv`, tvData).pipe(
      catchError(error => {
        console.error('Erro ao criar TV:', error);
        return of(null);
      })
    );
  }

  // 🔹 Atualizar informações de uma TV
  updateTv(tvId: string, tvData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tv/${tvId}`, tvData).pipe(
      catchError(error => {
        console.error('Erro ao atualizar TV:', error);
        return of(null);
      })
    );
  }

  // 🔹 Deletar uma TV
  deleteTv(tvId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tv/${tvId}`).pipe(
      catchError(error => {
        console.error('Erro ao deletar TV:', error);
        return of(null);
      })
    );
  }

  atualizarStatusTv(tvId: string, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tv/status-tv`, { tvId, status });
  }
  

 
}
