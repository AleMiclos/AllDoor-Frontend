import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TvsInfoComponent } from '../tvs-info/tvs-info.component';
import { TvStatusService } from '../../../services/tv-status.service';

@Component({
  selector: 'app-tv-view',
  templateUrl: './tv-view.component.html',
  styleUrls: ['./tv-view.component.css'],
  imports: [CommonModule, TvsInfoComponent]
})
export class TvViewComponent implements OnInit, OnDestroy {
  @Input() tv: any;
  tvId: string | null = null;
  private visibilitySubscription: any;
  private lastUpdate: string | null = null;
  private checkInterval: any; // Armazena o intervalo para limpar depois
  private handleVisibilityChangeBound = this.handleVisibilityChange.bind(this);
  private handleBeforeUnloadBound = this.handleBeforeUnload.bind(this);
  private handleOfflineBound = this.handleOffline.bind(this);
  private handleOnlineBound = this.handleOnline.bind(this);

  constructor(
    private route: ActivatedRoute,
    private tvsService: TvsService,
    private sanitizer: DomSanitizer,
    private tvStatusService: TvStatusService
  ) {}

  ngOnInit() {
    this.tvId = this.route.snapshot.paramMap.get('id');
    if (this.tvId) {
      this.fetchTv(this.tvId);
      this.atualizarStatus(true); // Define o status inicial como "online"
      this.startCheckingForChanges();
    } else {
      console.error('tvId não está definido.');
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChangeBound);
    window.addEventListener('beforeunload', this.handleBeforeUnloadBound);
    window.addEventListener('offline', this.handleOfflineBound);
    window.addEventListener('online', this.handleOnlineBound);

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

    this.enterFullscreen();
  }

  // Inicia a verificação periódica de mudanças no backend
 // Inicia a verificação periódica de mudanças no backend
startCheckingForChanges() {
  this.checkInterval = setInterval(() => this.checkForChanges(), 10000); // Verifica a cada 10s
}

// Faz a requisição ao backend para verificar mudanças sem recarregar a página
async checkForChanges() {
  try {
    const response = await fetch(`https://outdoor-backend.onrender.com/tv/status-tv/${this.tvId}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();

    if (this.lastUpdate && this.lastUpdate !== data.lastUpdate) {
      console.log('⚡ Mudança detectada! Atualizando dados da TV...');

      // Atualiza apenas os dados necessários sem recarregar a página inteira
      this.tv = { ...this.tv, ...data };

      // Atualiza o status de exibição no componente
      this.tv.status = data.status ? 'online' : 'offline';
    }

    this.lastUpdate = data.lastUpdate;
  } catch (error) {
    console.error('❌ Erro ao verificar mudanças no backend:', error);
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

  handleVisibilityChange() {
    const isVisible = document.visibilityState === 'visible';
    console.log('Visibilidade do documento:', document.visibilityState, 'isVisible:', isVisible);
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
    } else {
      console.error('❌ tvId não está definido.');
    }
  }

  handleBeforeUnload(event: Event) {
    this.atualizarStatus(false);
  }

  handleOffline() {
    console.log('Internet caiu!');
    this.atualizarStatus(false);
  }

  handleOnline() {
    console.log('Internet voltou!');
    this.atualizarStatus(true);
  }

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

  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        if (data.youtubeLink) {
          data.youtubeLink = this.transformYoutubeLink(data.youtubeLink);
        }
        if (data.vimeoLink) {
          data.vimeoLink = this.transformVimeoLink(data.vimeoLink);
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

  transformYoutubeLink(url: string): string {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }

  transformVimeoLink(url: string): string {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChangeBound);
    window.removeEventListener('beforeunload', this.handleBeforeUnloadBound);
    window.removeEventListener('offline', this.handleOfflineBound);
    window.removeEventListener('online', this.handleOnlineBound);

    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}
