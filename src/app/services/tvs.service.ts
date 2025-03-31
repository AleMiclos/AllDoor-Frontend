import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Importe o operador map
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvsService {

  private apiUrl = environment.apiUrl; // URL da API

  constructor(private http: HttpClient) {}

  // Método para obter os headers com o token de autenticação
  private getHeaders() {
    const token = localStorage.getItem('token');  // Obtém o token do localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adiciona o token nos headers
    });
  }

  // 🔹 Buscar TVs atribuídas a um usuário específico
  getTvsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv/user/${userId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao buscar TVs:', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  // 🔹 Buscar uma TV específica
  getTvById(tvId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/${tvId}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao buscar TV:', error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  // 🔹 Criar uma nova TV
  createTv(newTv: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tv`, newTv, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erro ao criar TV:', error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  // 🔹 Atualizar informações de uma TV
  updateTv(tvId: string, tvData: any): Observable<any> {
    console.log('Atualizando TV:', tvId, tvData); // Verifique qual TV está sendo enviada

    return this.http.put<any>(`${this.apiUrl}/tv/${tvId}`, tvData, { headers: this.getHeaders() }).pipe(

      catchError(error => {
        console.error('Erro ao atualizar TV:', error);
        return of(null); // Retorna null em caso de erro
      })
    );
  }

  // 🔹 Deletar uma TV
  deleteTv(tvId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tv/${tvId}`, { headers: this.getHeaders() }).pipe(
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
