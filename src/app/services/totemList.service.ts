import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TotemService {
  private apiUrl = 'http://localhost:5000/totems'; // Altere para a URL da sua API

  constructor(private http: HttpClient) {}

  // Método para obter o token do localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getTotems(userId: string): Observable<any[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );

    console.log('Headers:', headers); // Adicione esta linha para depuração

    return this.http.get<any[]>(`${this.apiUrl}/by-user-id/${userId}`, { headers });
  }

  addTotem(totem: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('Content-Type', 'application/json');

    console.log('Headers:', headers); // Adicione esta linha para depuração

    return this.http.post<any>(`${this.apiUrl}/new-totem`, totem, { headers });
  }

  getToken(): string {
    const token = localStorage.getItem('token') || '';
    return token;
  }

  updateTotem(id: string, totem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, totem, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteTotem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
