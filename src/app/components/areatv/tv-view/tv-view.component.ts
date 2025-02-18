import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {TvsInfoComponent } from '../tvs-info/tvs-info.component'

@Component({
  selector: 'app-tv-view',
  templateUrl: './tv-view.component.html',
  styleUrls: ['./tv-view.component.css'],
  imports: [CommonModule, TvsInfoComponent]
})
export class TvViewComponent implements OnInit {
  @Input() tv: any;
  tvId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tvsService: TvsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.tvId = this.route.snapshot.paramMap.get('id');
    if (this.tvId) {
      this.fetchTv(this.tvId);
    } else {
      console.error('tvId não está definido.');
    }
  }

  fetchTv(tvId: string) {
    this.tvsService.getTvById(tvId).subscribe({
      next: (data: any) => {
        // Transforma o link do YouTube, se existir
        if (data.youtubeLink) {
          data.youtubeLink = this.transformYoutubeLink(data.youtubeLink);
        }
        // Transforma o link do Vimeo, se existir
        if (data.vimeoLink) {
          data.vimeoLink = this.transformVimeoLink(data.vimeoLink);
        }
        this.tv = data;
        console.log(this.tv); // Verificar os dados no console
      },
      error: (err: any) => {
        console.error('Erro ao carregar TV:', err);
      }
    });
  }

  transformYoutubeLink(url: string): string {
    // Extrai o ID do vídeo do link do YouTube
    const videoId = url.split('v=')[1];
    // Remove possíveis parâmetros adicionais (como &list=...)
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }

  transformVimeoLink(url: string): string {
    const videoId = url.split('/').pop(); // Extrai o ID do vídeo
    return `https://player.vimeo.com/video/${videoId}`;
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
