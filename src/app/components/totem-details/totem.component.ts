import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TotemService } from '../../services/totem.service'; // Importe o serviço
import { ActivatedRoute } from '@angular/router'; // Importe ActivatedRoute para acessar parâmetros de rota
import { CommonModule } from '@angular/common'; // Importe o CommonModule

@Component({
  selector: 'app-totem-details',
  templateUrl: './totem.component.html', // Certifique-se de que o caminho está correto
  styleUrls: ['./totem.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TotemDetailsComponent implements OnInit {
  totem: any = null;
  loading = true;
  error: string | null = null;
  description: string | null = null;

  constructor(
    private totemService: TotemService, // Injete o serviço
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute // Injete o ActivatedRoute para acessar parâmetros de rota
  ) {}

  ngOnInit(): void {
    this.isDayOrNight()
    this.route.paramMap.subscribe(params => {
      const totemId = params.get('id'); // Substitua pelo ID do totem a ser buscado
      if (totemId) {
        this.fetchTotemById(totemId);
      } else {
        this.error = 'ID do totem não fornecido.';
        this.loading = false;
      }
    });
  }

  isDayOrNight(): string {
    // Verifica se é dia ou noite
    const timeOfDay = new Date().getHours() >= 6 && new Date().getHours() < 18 ? 'day' : 'night';
  
    // Define a descrição com base no horário
    if (timeOfDay === 'day') {
      this.description = 'Bom dia!';
    } else {
      this.description = 'Boa noite!';
    }
  
    // Retorna 'day' ou 'night'
    return timeOfDay;
  }
  

  fetchTotemById(id: string): void {
    this.loading = true;
    this.error = null;

    this.totemService.getTotemById(id).subscribe({
      next: (data) => {
        console.log('Totem retornado:', data);
        this.totem = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar o totem:', error);
        this.error = 'Erro ao carregar o totem.';
        this.loading = false;
      },
    });
  }

  extractVimeoVideoId(url: string): string {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVimeoVideoId(url);
    const safeUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
  }
}
