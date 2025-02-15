import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TvsService } from '../../../services/tvs.service';

@Component({
  selector: 'app-tv-view',
  templateUrl: './tv-view.component.html',
  styleUrls: ['./tv-view.component.css']
})
export class TvViewComponent implements OnInit {
  @Input() tvId!: string; // Adicionado @Input para tvId
  userId!: string;
  youtubeLink: string = '';
  vimeoLink: string = '';
  safeYoutubeUrl!: SafeResourceUrl;
  safeVimeoUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private tvsService: TvsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Se o tvId for passado como @Input, carregue os links diretamente
    if (this.tvId) {
      this.loadTvLinks();
    } else {
      // Caso contrário, obtenha o tvId da rota
      this.route.params.subscribe(params => {
        this.userId = params['userId'];
        this.tvId = params['tvId'];

        if (this.tvId) {
          this.loadTvLinks();
        }
      });
    }
  }

  // Carrega as informações da TV
  loadTvLinks(): void {
    this.tvsService.getTvLinks(this.tvId).subscribe((tv) => {
      if (tv) {
        this.youtubeLink = tv.youtubeLink;
        this.vimeoLink = tv.vimeoLink;

        // Fazendo a sanitização dos links
        this.safeYoutubeUrl = this.getSafeVideoUrl(this.youtubeLink);
        this.safeVimeoUrl = this.getSafeVideoUrl(this.vimeoLink);
      }
    });
  }

  // Função para garantir que o link do vídeo seja seguro
  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleFullscreen(): void {
    const elem = document.getElementById('screenContainer');
    if (!document.fullscreenElement) {
      if (elem?.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any)?.mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any)?.webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any)?.msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }
}
