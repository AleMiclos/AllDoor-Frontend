import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class TvStatusService {
  private apiUrl = `${environment.apiUrl}/tv`;

  // Visibilidade de uma TV (ex: online/offline)
  private visibilitySubject = new BehaviorSubject<boolean>(true);
  tvVisibility$ = this.visibilitySubject.asObservable();

  // Status (usado para comunicação reativa)
  private tvStatusSubject = new Subject<{ tvId: string; status: string }>();
  tvStatus$ = this.tvStatusSubject.asObservable();

  // WebSocket
  private websocket!: WebSocket;

  constructor(private http: HttpClient) {
    this.initWebSocket();
  }

  private initWebSocket(): void {
    this.websocket = new WebSocket(environment.websocketUrl); // por exemplo: ws://localhost:3000/ws

    this.websocket.onopen = () => {
      console.log('✅ WebSocket conectado.');
    };

    this.websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Exemplo de tratamento de mensagens recebidas
      if (message.type === 'tvStatusUpdate') {
        this.tvStatusSubject.next({ tvId: message.tvId, status: message.status });
        console.log(`📡 Atualização recebida via WebSocket: TV ${message.tvId} => ${message.status}`);
      }
    };

    this.websocket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    this.websocket.onclose = () => {
      console.warn('🔌 WebSocket desconectado. Tentando reconectar em 3s...');
      setTimeout(() => this.initWebSocket(), 3000); // Tenta reconectar
    };
  }

  // Envia um comando para a TV recarregar
  sendReloadCommand(tvId: string): void {
    const message = {
      type: 'tvReload',
      tvId: tvId,
    };
    this.sendMessage(message);
  }

  // Envia mensagens via WebSocket
  sendMessage(message: any): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    } else {
      console.warn('❌ WebSocket não está aberto. Mensagem não enviada:', message);
    }
  }

  // Atualiza visibilidade manualmente
  updateVisibility(tvId: string, isVisible: boolean): Observable<any> {
    this.visibilitySubject.next(isVisible);
    const payload = { tvId, status: isVisible };
    return this.http.post(`${this.apiUrl}/status-tv`, payload);
  }

  // Atualiza status manual via API
  updateTvStatus(tvId: string, status: string): Observable<any> {
    const payload = { tvId, status };
    return this.http.post(`${this.apiUrl}/status-tv`, payload);
  }

  // Puxa o status atual via API e emite via Subject
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
