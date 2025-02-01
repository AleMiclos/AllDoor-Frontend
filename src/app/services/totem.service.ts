import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TotemService {
  private apiUrl = 'http://localhost:5000/totems';

  constructor(private http: HttpClient) {}



  getTotems(userId: string): Observable<any[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.get<any[]>(`${this.apiUrl}/by-user-id/${userId}`, { headers });
  }

  addTotem(totem: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.getToken()}`) // Envia o token no cabeçalho
      .set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.apiUrl}/new-totem`, totem, { headers });
  }


  updateTotem(id: string, totem: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, totem, { headers });
  }

  deleteTotem(id: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers });
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getTotemById(id: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.get<any>(`${this.apiUrl}/totem/${id}`, { headers });
  }

}


