import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TvsService {
  private apiUrl = 'http://localhost:5000'; // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) {}

  // Buscar todas as TVs
  getTvs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv`); // Rota para buscar todas as TVs
  }

  // Buscar TVs por usuário
  getTvsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv/${userId}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar TVs:', error);
        return of([]); // Retorna uma lista vazia em caso de erro
      })
    );
  }

  // Função para buscar TV específica pelo ID
  getTvLinks(tvId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/${tvId}`); // Rota para buscar uma TV específica
  }

  // Adicionar uma nova TV
  addTv(tv: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tv`, tv); // Rota para adicionar uma nova TV
  }

  // Atualizar TV
  updateTv(tvId: string, tv: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tv/${tvId}`, tv); // Rota para atualizar uma TV
  }

  // Excluir TV
  deleteTv(tvId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tv/${tvId}`); // Rota para excluir uma TV
  }
}
