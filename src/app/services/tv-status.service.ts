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
  tvStatus$ = this.tvStatusSubject.asObservable();

  private vimeoStatusSubject = new Subject<{ tvId: string; status: string }>();
  vimeoStatus$ = this.vimeoStatusSubject.asObservable();

  private youtubeStatusSubject = new Subject<{ tvId: string; status: string }>();
  youtubeStatus$ = this.youtubeStatusSubject.asObservable();

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

  // 🔹 Pega o status do Vimeo
  getVimeoStatus(tvId: string) {
    this.http.get<{ status: string }>(`${this.apiUrl}/status-vimeo/${tvId}`).subscribe({
      next: (response) => {
        this.vimeoStatusSubject.next({ tvId, status: response.status });
      },
      error: (err) => {
        console.error(`Erro ao buscar status do Vimeo na TV ${tvId}:`, err);
      }
    });
  }

  // 🔹 Pega o status do YouTube
  getYouTubeStatus(tvId: string) {
    this.http.get<{ status: string }>(`${this.apiUrl}/status-youtube/${tvId}`).subscribe({
      next: (response) => {
        this.youtubeStatusSubject.next({ tvId, status: response.status });
      },
      error: (err) => {
        console.error(`Erro ao buscar status do YouTube na TV ${tvId}:`, err);
      }
    });
  }
}
