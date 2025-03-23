import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TvsInfoComponent } from '../tvs-info/tvs-info.component';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';
import Player from '@vimeo/player';

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
  private websocketSubscription: Subscription | null = null;
  private youtubePlayer: any;
  private vimeoPlayer: Player | null = null;

  private isYoutubePlaying: boolean = false;
  private isVimeoPlaying: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tvsService: TvsService,
    private sanitizer: DomSanitizer,
    private webSocketService: WebSocketService,
  ) {}

  ngOnInit() {
    this.tvId = this.route.snapshot.paramMap.get('id');
    if (this.tvId) {
      this.atualizarStatus(true); // Enviar status online imediatamente
      this.fetchTv(this.tvId);
      this.listenForUpdates();
    } else {
      console.error('tvId não está definido.');
    }

    this.enterFullscreen();
    this.handleVisibilityChange();
  }

  private listenForUpdates(): void {
    this.websocketSubscription = this.webSocketService.getMessages().subscribe((message) => {
      if (message.type === 'tvUpdate' && message.tv._id === this.tvId) {
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

  private updateVideoUrl(): void {
    let newUrl: SafeResourceUrl | null = null;

    if (this.tv.youtubeLink) {
      const transformedUrl = this.transformYoutubeLink(this.tv.youtubeLink);
      if (this.videoUrl !== transformedUrl) {
        this.videoUrl = this.sanitizeUrl(transformedUrl);
      }
    } else if (this.tv.vimeoLink) {
      const transformedUrl = this.transformVimeoLink(this.tv.vimeoLink);
      if (this.videoUrl !== transformedUrl) {
        this.videoUrl = this.sanitizeUrl(transformedUrl);
      }
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

  atualizarStatus(isOnline: boolean): void {
    if (this.tvId) {
      const status = isOnline ? 'online' : 'offline';
      const data = { tvId: this.tvId, status };

      // Envia o status via Beacon para o backend
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = 'https://outdoor-backend.onrender.com/tv/status-tv';
      navigator.sendBeacon(url, blob);

      // Envia a atualização via WebSocket para o painel de administração
      this.webSocketService.sendMessage({
        type: 'tvStatusUpdate',
        tvId: this.tvId,
        status
      });

      console.log(`Status atualizado: ${status}`);
    }
  }

  private updateYoutubeStatus(isPlaying: boolean): void {
    const status = isPlaying ? 'online' : 'offline'; // Status de reprodução

    const data = {
      tvId: this.tvId,
      status: status, // Enviar status de "playing" ou "paused"
    };

    // Envia o status via Beacon para o backend (endpoint do YouTube)
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = 'http://localhost:5000/tv/status-youtube'; // Endpoint para o YouTube
    navigator.sendBeacon(url, blob);

    console.log(`Status do YouTube enviado: ${status}`);
  }

  // Método auxiliar para atualizar o status do Vimeo
  private updateVimeoStatus(isPlaying: boolean): void {
    const status = isPlaying ? 'online' : 'offline'; // Status de reprodução

    const data = {
      tvId: this.tvId,
      status: status, // Enviar status de "playing" ou "paused"
    };

    // Envia o status via Beacon para o backend (endpoint do Vimeo)
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = 'http://localhost:5000/tv/status-vimeo'; // Endpoint para o Vimeo
    navigator.sendBeacon(url, blob);
    //localhost:5000/tv/status-vimeo
    console.log(`Status do Vimeo enviado: ${status}`);
  }

  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        this.tv = data;
        console.log('TV carregada:', this.tv);

        if (this.tv.youtubeLink) {
          this.tv.youtubeLink = this.transformYoutubeLink(this.tv.youtubeLink);
          this.videoUrl = this.sanitizeUrl(this.tv.youtubeLink);
          setTimeout(() => {
            console.log('Inicializando YouTube Player...');
            this.initializeYoutubePlayer();
          }, 5000);
        }

        if (this.tv.vimeoLink) {
          this.tv.vimeoLink = this.transformVimeoLink(this.tv.vimeoLink);
          this.videoUrl = this.sanitizeUrl(this.tv.vimeoLink);
          setTimeout(() => {
            console.log('Inicializando Vimeo Player...');
            this.initializeVimeoPlayer();
          }, 5000);
        }
      },
      error: (err: any) => console.error('Erro ao carregar TV:', err)
    });
  }

  transformYoutubeLink(url: string): string {
    const videoIdMatch = url.match(/[?&]v=([^&#]*)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?&playlist=${videoId}&enablejsapi=1&controls=0`
      : url;
  }

  transformVimeoLink(url: string): string {
    const videoId = url.split('/').pop();
    if (!videoId) {
      console.error('ID do vídeo do Vimeo não encontrado.');
      return '';
    }
    return `https://player.vimeo.com/video/${videoId}`;
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private initializeYoutubePlayer(): void {
    if (this.youtubePlayer) {
      console.log("YouTube Player já inicializado!");
      return;
    }

    const iframe = document.querySelector('#youtube-player iframe') as HTMLIFrameElement;
    if (!iframe) {
      console.error("Iframe do YouTube não encontrado!");
      return;
    }

    this.youtubePlayer = new (window as any).YT.Player(iframe, {
      events: {
        'onStateChange': (event: any) => this.handleYoutubeStateChange(event),
      },
    });

    console.log("YouTube Player inicializado!");
  }

  private handleYoutubeStateChange(event: any): void {
    console.log('Evento do YouTube:', event.data);

    if (event.data === (window as any).YT.PlayerState.PAUSED) {
      console.log('O vídeo do YouTube foi pausado.');
      this.isYoutubePlaying = false;
      this.updateYoutubeStatus(false); // Envia status "paused"
    } else if (event.data === (window as any).YT.PlayerState.ENDED) {
      console.log('O vídeo do YouTube terminou.');
      this.isYoutubePlaying = false;
      this.updateYoutubeStatus(false); // Envia status "paused"
    } else if (event.data === (window as any).YT.PlayerState.PLAYING) {
      console.log('O vídeo do YouTube está tocando.');
      this.isYoutubePlaying = true;
      this.updateYoutubeStatus(true); // Envia status "playing"
    }

    this.checkPlayersStatus(); // Atualiza o status geral da TV
  }

  private initializeVimeoPlayer(): void {
    if (this.vimeoPlayer) {
      console.log("Vimeo Player já inicializado!");
      return;
    }

    const iframe = document.querySelector('#ad') as HTMLIFrameElement;
    if (!iframe) {
      console.error("Iframe do Vimeo não encontrado!");
      return;
    }

    this.vimeoPlayer = new Player(iframe);

    this.vimeoPlayer.on('play', () => {
      console.log('O vídeo do Vimeo começou a tocar.');
      this.isVimeoPlaying = true;
      this.updateVimeoStatus(true); // Envia status "playing"
      this.checkPlayersStatus();
    });

    this.vimeoPlayer.on('pause', () => {
      console.log('O vídeo do Vimeo foi pausado.');
      this.isVimeoPlaying = false;
      this.updateVimeoStatus(false); // Envia status "paused"
      this.checkPlayersStatus();
    });

    this.vimeoPlayer.on('ended', () => {
      console.log('O vídeo do Vimeo terminou.');
      this.isVimeoPlaying = false;
      this.updateVimeoStatus(false); // Envia status "paused"
      this.checkPlayersStatus();
    });

    this.vimeoPlayer.on('error', (error: any) => {
      console.error('Erro no Vimeo:', error);
    });

    console.log("Vimeo Player inicializado!");
  }

  private checkPlayersStatus(): void {
    if (this.isYoutubePlaying || this.isVimeoPlaying) {
      this.atualizarStatus(true); // Pelo menos um player está tocando, TV online
    } else {
      this.atualizarStatus(false); // Nenhum player está tocando, TV offline
    }
  }

  ngOnDestroy() {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }

    if (this.youtubePlayer) {
      this.youtubePlayer.destroy();
      this.youtubePlayer = null;
    }

    if (this.vimeoPlayer) {
      this.vimeoPlayer.destroy();
      this.vimeoPlayer = null;
    }
  }
}
