import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TvsInfoComponent } from '../tvs-info/tvs-info.component';
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
    private webSocketService: WebSocketService,
  ) {}

  ngOnInit() {
    this.tvId = this.route.snapshot.paramMap.get('id');
    console.log('[TV] tvId carregado:', this.tvId); // 👈

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


  private listenForUpdates(): void {
    this.websocketSubscription = this.webSocketService.getMessages().subscribe((message) => {
      console.log('[TV] Mensagem recebida via WebSocket:', message); // <--

      if (message.type === 'tvReload' && message.tvId === this.tvId) {
        console.log('[TV] ID bateu! Recarregando...');
        window.location.reload();
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
      const url = 'http://localhost:5000/tv/status-tv';
      navigator.sendBeacon(url, blob);
      console.log(`Status atualizado: ${status}`);
    }
  }

  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        this.tv = data;
        console.log('TV carregada:', this.tv);

        if (this.tv.youtubeLink) {
          const transformedUrl = this.transformYoutubeLink(this.tv.youtubeLink);
          const newYoutubeUrl = this.sanitizeUrl(transformedUrl);

          // Só atualiza se realmente mudou (evita reload do iframe)
          if (this.videoUrl !== newYoutubeUrl) {
            this.videoUrl = newYoutubeUrl;
          }
        }
      },
      error: (err: any) => console.error('Erro ao carregar TV:', err)
    });
  }


  transformYoutubeLink(url: string, loop: boolean = false): string {
    const videoIdMatch = url.match(/[?&]v=([^&#]*)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1?loop=1${loop ? '&loop=1&playlist=' + videoId : ''}`
      : url;
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
      this.websocketSubscription.unsubscribe();
    }
  }
}
