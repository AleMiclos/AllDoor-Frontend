import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  showVideo: boolean = false; // <- Flag adicionada
  private visibilitySubscription: any;
  private checkInterval: any;
  private websocketSubscription: Subscription | null = null;

  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

  constructor(
    private route: ActivatedRoute,
    private tvsService: TvsService,
    private sanitizer: DomSanitizer,
    private webSocketService: WebSocketService,
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
    }
  }

  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        this.tv = data;
        console.log('TV carregada:', this.tv);

        if (this.tv.youtubeLink) {
          this.tv.youtubeLink = this.transformYoutubeLink(this.tv.youtubeLink);
          this.videoUrl = this.sanitizeUrl(this.tv.youtubeLink);

          // <- Aqui entra o delay de 30 segundos
          setTimeout(() => {
            this.showVideo = true;
            console.log('Liberado <video> após 30s');
          }, 10000);
        } else {
          // Se não for YouTube, libera imediatamente
          this.showVideo = true;
        }
      },
      error: (err: any) => console.error('Erro ao carregar TV:', err)
    });
  }

  transformYoutubeLink(url: string, loop: boolean = false): string {
    const videoIdMatch = url.match(/[?&]v=([^&#]*)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&controls=0${loop ? '&loop=1&playlist=' + videoId : ''}`
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
