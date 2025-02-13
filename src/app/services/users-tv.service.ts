import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersTvService {
  private apiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  getTvs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tv`);
  }

  getTvsByUser(tvId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tv/${tvId}`);
  }

  addTv(tvData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tv`, tvData);
  }

  updateTv(tvId: string, tvData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tv/${tvId}`, tvData);
  }

  deleteTv(tvId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tv/${tvId}`);
  }
}
