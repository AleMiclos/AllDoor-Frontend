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

  constructor(
    private route: ActivatedRoute,
    private tvsService: TvsService,
    private sanitizer: DomSanitizer,
    private tvStatusService: TvStatusService,
  ) {}

  ngOnInit() {
    document.addEventListener('visibilitychange', this.monitorarVisibilidade);

    this.tvId = this.route.snapshot.paramMap.get('id');
    console.log('tvId:', this.tvId, 'Tipo:', typeof this.tvId); // Log para depuração
    if (this.tvId) {
      this.fetchTv(this.tvId);
    } else {
      console.error('tvId não está definido.');
    }

    if (this.tvId) {
      this.tvStatusService.updateVisibility(this.tvId, true).subscribe({
        next: () => {
          console.log('Página aberta, visibilidade atualizada: true');
        },
        error: (err: any) => {
          console.error('Erro ao atualizar visibilidade ao abrir a página:', err);
        }
      });
    }

    this.visibilitySubscription = this.tvStatusService.tvVisibility$.subscribe(
      (isVisible: boolean) => {
        console.log('Visibilidade:', isVisible);
        // Atualiza o status da TV com base na visibilidade
        this.tv.status = isVisible ? 'online' : 'offline';
        if (this.tvId) {
          // Notifica o TvsComponent sobre a mudança de status
          this.tvStatusService.updateTvStatus(this.tvId, status);
        }
      }
    );
  }

  handleVisibilityChange() {
    const isVisible = document.visibilityState === 'visible';
    console.log('Visibilidade do documento:', document.visibilityState, 'isVisible:', isVisible); // Log para depuração
    if (this.tvId) {
      this.tvStatusService.updateVisibility(this.tvId, isVisible).subscribe({
        next: () => {
          console.log('Visibilidade alterada:', isVisible);
          // Atualiza o status da TV com base na visibilidade
          this.tv.status = isVisible ? 'online' : 'offline';
        },
        error: (err: any) => {
          console.error('Erro ao atualizar visibilidade:', err);
        }
      });
    } else {
      console.error('tvId não está definido.');
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
        // Inicializa o status da TV
        data.status = data.status ? 'online' : 'offline';
        this.tv = data;
        console.log('TV carregada:', this.tv); // Log para depuração
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

  monitorarVisibilidade = this.handleVisibilityChange.bind(this);

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.monitorarVisibilidade);
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }
}
