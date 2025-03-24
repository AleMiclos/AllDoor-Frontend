import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TvsInfoComponent } from '../tvs-info/tvs-info.component';
import { TvStatusService } from '../../../services/tv-status.service';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tv-view',
  templateUrl: './tv-view.component.html',
  styleUrls: ['./tv-view.component.css'],
  imports: [CommonModule, TvsInfoComponent]
})
export class TvViewComponent implements OnInit, OnDestroy {
  @Input() tv: any;
  tvId: string | null = null;
  videoUrl: SafeResourceUrl | null = null;
  private visibilitySubscription: any;
  private checkInterval: any;
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
    this.atualizarStatus(true); 
    this.fetchTv(this.tvId);
    this.listenForUpdates();
  } else {
    console.error('tvId não está definido.');
  }

  this.enterFullscreen();
  this.handleVisibilityChange();
}


  // Método para escutar atualizações via WebSocket
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


  private handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.atualizarStatus(true);
        this.fetchTv(this.tvId!);
      } else {
        this.atualizarStatus(false);
      }
    });
  }


  // Método para atualizar o URL do vídeo
  private updateVideoUrl(): void {
    if (this.tv.youtubeLink) {
      this.tv.youtubeLink = this.transformYoutubeLink(this.tv.youtubeLink);
      this.videoUrl = this.sanitizeUrl(this.tv.youtubeLink);
    } else if (this.tv.vimeoLink) {
      this.tv.vimeoLink = this.transformVimeoLink(this.tv.vimeoLink);
      this.videoUrl = this.sanitizeUrl(this.tv.vimeoLink);
    }
  }

  enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }

  atualizarStatus(isOnline: boolean) {
    if (this.tvId) {
      const status = isOnline ? 'online' : 'offline';
      const data = { tvId: this.tvId, status };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = 'https://outdoor-backend.onrender.com/tv/status-tv';
      navigator.sendBeacon(url, blob);
    }
  }

  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        if (data.youtubeLink) {
          data.youtubeLink = this.transformYoutubeLink(data.youtubeLink);
          this.videoUrl = this.sanitizeUrl(data.youtubeLink);

        }
        if (data.vimeoLink) {
          data.vimeoLink = this.transformVimeoLink(data.vimeoLink);
        }
        this.tv = data;
      },
      error: (err: any) => console.error('Erro ao carregar TV:', err)
    });
  }

  transformYoutubeLink(url: string): string {
    const videoIdMatch = url.match(/[?&]v=([^&#]*)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=0`
      : url;
  }

  transformVimeoLink(url: string): string {
    // Extrai o ID do vídeo do URL do Vimeo
    const videoId = url.split('/').pop();
    if (!videoId) {
      console.error('ID do vídeo do Vimeo não encontrado.');
      return ''; // Retorna uma string vazia em caso de erro
    }

    // Gera o URL do player do Vimeo
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1`; // Adiciona autoplay e muted
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy() {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe(); // Cancela a inscrição do WebSocket
    }
  }
}
