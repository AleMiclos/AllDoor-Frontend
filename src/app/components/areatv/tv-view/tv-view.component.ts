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
  private checkInterval: any;
  private websocketSubscription: Subscription | null = null;
  private youtubePlayer: any;
  private vimeoPlayer: Player | null = null;


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
      // this.verificarStatusPlayers();
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
 
   if (this.tv.vimeoLink) {
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
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = 'https://outdoor-backend.onrender.com/tv/status-tv';
      navigator.sendBeacon(url, blob);
      console.log(`Status atualizado: ${status}`);

      // Se a TV estiver offline, garantir que YouTube e Vimeo também fiquem offline
      if (!isOnline) {
        this.updateYoutubeStatus(false);
        this.updateVimeoStatus(false);
      }
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
    const url = 'https://outdoor-backend.onrender.com/tv/status-youtube'; // Endpoint para o YouTube
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
    const url = 'https://outdoor-backend.onrender.com/tv/status-vimeo'; // Endpoint para o Vimeo
    navigator.sendBeacon(url, blob);
    //localhost:5000/tv/status-vimeo
    console.log(`Status do Vimeo enviado: ${status}`);
  }

  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        this.tv = data;
        console.log('TV carregada:', this.tv);

        if (this.tv.vimeoLink) {
          this.tv.vimeoLink = this.transformVimeoLink(this.tv.vimeoLink);
          this.videoUrl = this.sanitizeUrl(this.tv.vimeoLink);
          setTimeout(() => {
            console.log('Inicializando Vimeo Player...');
            this.initializeVimeoPlayer();
          }, 25000);
        }
      },
      error: (err: any) => console.error('Erro ao carregar TV:', err)
    });
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

    if (event.data === (window as any).YT.PlayerState.PAUSED || event.data === (window as any).YT.PlayerState.ENDED) {
      console.log('O vídeo do YouTube foi pausado ou terminou.');
      this.updateYoutubeStatus(false);  // Marca como offline
    } else if (event.data === (window as any).YT.PlayerState.PLAYING) {
      console.log('O vídeo do YouTube está tocando.');
      this.updateYoutubeStatus(true);  // Marca como online
    } else if (event.data === (window as any).YT.PlayerState.BUFFERING) {
      console.log('O vídeo do YouTube está carregando.');
    }
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
      this.updateVimeoStatus(true);  // Marca como online
    });

    this.vimeoPlayer.on('pause', () => {
      console.log('O vídeo do Vimeo foi pausado.');
      this.updateVimeoStatus(false);  // Marca como offline
    });

    this.vimeoPlayer.on('ended', () => {
      console.log('O vídeo do Vimeo terminou.');
      this.updateVimeoStatus(false);  // Marca como offline
    });

    this.vimeoPlayer.on('error', (error: any) => {
      console.error('Erro no Vimeo:', error);
    });

    console.log("Vimeo Player inicializado!");
  }

  // private verificarStatusPlayers(): void {
  //   setTimeout(() => {
  //     if (this.youtubePlayer) {
  //       const playerState = this.youtubePlayer.getPlayerState();
  //       const isPlaying = playerState === (window as any).YT.PlayerState.PLAYING;
  //       this.updateYoutubeStatus(isPlaying);
  //       console.log(`Status inicial do YouTube: ${isPlaying ? 'online' : 'offline'}`);
  //     } else {
  //       console.log('YouTube Player ainda não foi inicializado.');
  //     }

  //     if (this.vimeoPlayer) {
  //       this.vimeoPlayer.getPaused().then((paused: boolean) => {
  //         this.updateVimeoStatus(!paused);
  //         console.log(`Status inicial do Vimeo: ${paused ? 'offline' : 'online'}`);
  //       }).catch((error: any) => {
  //         console.error('Erro ao obter status do Vimeo:', error);
  //       });
  //     } else {
  //       console.log('Vimeo Player ainda não foi inicializado.');
  //     }
  //   }, 30000); // Tempo para garantir que os players foram carregados
  // }



  ngOnDestroy() {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }


  }
}
