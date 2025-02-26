import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TvStatusService {

  private apiUrl = 'http://localhost:5000';  // Substitua pela URL real da sua API
  private visibilitySubject = new BehaviorSubject<boolean>(true);
  tvVisibility$ = this.visibilitySubject.asObservable();

  constructor(private http: HttpClient) { }

  updateVisibility(tvId: string, isVisible: boolean): Observable<any> {
    this.visibilitySubject.next(isVisible);
    const payload = { tvId, status: isVisible };
    console.log('Payload enviado:', payload);
    return this.http.post(`${this.apiUrl}/status-tv`, payload);
  }
  
}
