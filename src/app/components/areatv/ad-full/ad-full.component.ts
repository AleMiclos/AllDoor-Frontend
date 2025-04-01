import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TvStatusService } from '../../../services/tv-status.service';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ad-full',
  templateUrl: './ad-full.component.html',
  styleUrls: ['./ad-full.component.css'],
  imports: [CommonModule],
})
export class AdFullComponent implements OnInit, OnDestroy {
  tv: any;
  tvId: string | null = null;
  vimeoUrl: SafeResourceUrl | null = null;

  private visibilitySubscription: any;
  private handleVisibilityChangeBound = this.handleVisibilityChange.bind(this);
  private handleBeforeUnloadBound = this.handleBeforeUnload.bind(this);
  private handleOfflineBound = this.handleOffline.bind(this);
  private handleOnlineBound = this.handleOnline.bind(this);
  private websocketSubscription: Subscription | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private tvsService: TvsService,
    private sanitizer: DomSanitizer,
    private tvStatusService: TvStatusService,
    private webSocketService: WebSocketService
    
  ) {}

  ngOnInit() {
    this.tvId = this.route.snapshot.paramMap.get('id');
    if (this.tvId) {
      this.fetchTv(this.tvId); // Carregar as informações da TV
      this.atualizarStatus(true); // Define o status inicial como "online"
      this.listenForUpdates();

    } else {
      console.error('tvId não está definido.');
    }

    // Adicionando event listeners
    document.addEventListener('visibilitychange', this.handleVisibilityChangeBound);
    window.addEventListener('beforeunload', this.handleBeforeUnloadBound);
    window.addEventListener('offline', this.handleOfflineBound);
    window.addEventListener('online', this.handleOnlineBound);

    // Subscrever para atualizações de visibilidade
    this.visibilitySubscription = this.tvStatusService.tvVisibility$.subscribe(
      (isVisible: boolean) => {
        console.log('Visibilidade:', isVisible);
        if (this.tv) {
          this.tv.status = isVisible ? 'online' : 'offline';
          if (this.tvId) {
            this.atualizarStatus(this.tv.status === 'online');
          }
        } else {
          console.warn('Tentativa de definir status antes da TV ser carregada.');
        }
      }
    );

    // Ativar tela cheia automaticamente
    this.enterFullscreen();
  }

  private listenForUpdates(): void {
    this.websocketSubscription = this.webSocketService.getMessages().subscribe((message) => {
      if (message.type === 'tvUpdate' && message.tv._id === this.tvId) {
        // Atualiza apenas a TV correspondente sem recarregar a página
        this.tv = { ...this.tv, ...message.tv, _id: this.tv._id };
        this.updateVideoUrl();
        window.location.reload();
      } else if (message.type === 'tvStatusUpdate' && message.tvId === this.tvId) {
        this.tv.status = message.status;
      }
    });
  }

  private updateVideoUrl(): void {
    if (this.tv.vimeoLink) {
      this.tv.vimeoLink = this.transformVimeoLink(this.tv.vimeoLink);
      this.vimeoUrl = this.sanitizeUrl(this.tv.vimeoLink);
    }
}

sanitizeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}


  // Função para ativar tela cheia
  enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen(); // Firefox
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen(); // Chrome, Safari, Opera
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen(); // IE/Edge
    }
  }

  // Função para buscar os dados da TV
  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        if (data.vimeoLink) {
          this.vimeoUrl = this.transformVimeoLink(data.vimeoLink);
        }
        data.status = data.status ? 'online' : 'offline';
        this.tv = data;
        console.log('TV carregada:', this.tv);
      },
      error: (err: any) => {
        console.error('Erro ao carregar TV:', err);
      }
    });
  }

  // Atualiza o status da TV no backend
  atualizarStatus(isOnline: boolean) {
    if (this.tvId) {
      const status = isOnline ? 'online' : 'offline';
      const data = { tvId: this.tvId, status };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = 'https://outdoor-backend.onrender.com/tv/status-tv';
      const success = navigator.sendBeacon(url, blob);
      if (success) {
        console.log(`✅ Status da TV atualizado para ${status}`);
      } else {
        console.error('❌ Falha ao enviar status da TV.');
      }
    }
  }

  // Transforma o link do Vimeo em um link embed
  transformVimeoLink(url: string): SafeResourceUrl {
    const videoId = url.split('/').pop();
    const embedUrl = `https://player.vimeo.com/video/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // Monitoramento de visibilidade
  handleVisibilityChange() {
    const isVisible = document.visibilityState === 'visible';
    console.log('Visibilidade do documento:', isVisible);
    if (this.tvId) {
      this.tvStatusService.updateVisibility(this.tvId, isVisible).subscribe({
        next: () => {
          console.log('✅ Visibilidade alterada:', isVisible);
          this.tv.status = isVisible ? 'online' : 'offline';
          this.atualizarStatus(isVisible);
        },
        error: (err: any) => {
          console.error('❌ Erro ao atualizar visibilidade:', err);
        }
      });
    }
  }

  // Quando o usuário fecha a aba/navegador
  handleBeforeUnload(event: Event) {
    this.atualizarStatus(false);
  }

  // Internet caiu
  handleOffline() {
    console.log('Internet caiu!');
    this.atualizarStatus(false);
  }

  // Internet voltou
  handleOnline() {
    console.log('Internet voltou!');
    this.atualizarStatus(true);
  }

  // Limpar event listeners e inscrições
  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChangeBound);
    window.removeEventListener('beforeunload', this.handleBeforeUnloadBound);
    window.removeEventListener('offline', this.handleOfflineBound);
    window.removeEventListener('online', this.handleOnlineBound);

    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }
}
