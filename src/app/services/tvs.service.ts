import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TvsService {
  private apiUrl = 'http://localhost:5000'; // Altere conforme necessário

  constructor(private http: HttpClient) {}

  getTvsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv/user/${userId}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar TVs:', error);
        return of([]);
      })
    );
  }

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
        return of(null);
      })
    );
  }

  updateTv(tvId: string, tvData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tv/${tvId}`, tvData).pipe(
      catchError(error => {
        console.error('Erro ao atualizar TV:', error);
        return of(null);
      })
    );
  }

  deleteTv(tvId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tv/${tvId}`).pipe(
      catchError(error => {
        console.error('Erro ao deletar TV:', error);
        return of(null);
      })
    );
  }
}
