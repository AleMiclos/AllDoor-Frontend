import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvStatusService {

  private apiUrl = `${environment.apiUrl}/tv`;  // Substitua pela URL real da sua API
  private visibilitySubject = new BehaviorSubject<boolean>(true);
  tvVisibility$ = this.visibilitySubject.asObservable();

  constructor(private http: HttpClient) { }

  updateVisibility(tvId: string, isVisible: boolean): Observable<any> {
    this.visibilitySubject.next(isVisible);
    const payload = { tvId, status: isVisible };
    console.log('Payload enviado:', payload);
    return this.http.post(`${this.apiUrl}/status-tv`, payload);
  }

  private tvStatusSubject = new Subject<{ tvId: string; status: string }>();

  // Observable para que os componentes possam se inscrever
  tvStatus$ = this.tvStatusSubject.asObservable();

  // Método para atualizar o status de uma TV
  updateTvStatus(tvId: string, status: string): Observable<any> {
    const payload = { tvId, status };
    console.log('Enviando atualização de status:', payload);
    return this.http.post(`${this.apiUrl}/status-tv`, payload);
  }
  

  getTvStatus(tvId: string) {
    this.http.get<{ status: string }>(`${this.apiUrl}/status-tv/${tvId}`).subscribe({
      next: (response) => {
        this.tvStatusSubject.next({ tvId, status: response.status });
      },
      error: (err) => {
        console.error(`Erro ao buscar status da TV ${tvId}:`, err);
      }
    });
  }
}
