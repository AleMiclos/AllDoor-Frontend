import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TotemService } from '../../services/totem.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-totem-details',
  templateUrl: './totem.component.html',
  styleUrls: ['./totem.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class TotemDetailsComponent implements OnInit, OnDestroy {
  totem: any = null;
  loading = true;
  error: string = '';
  private subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private totemService: TotemService
  ) {}

  ngOnInit(): void {
    const totemId = this.route.snapshot.paramMap.get('totemId')!;
    this.fetchTotemDetails(totemId);

    // Atualiza os dados a cada 30 segundos
    this.subscription = interval(30000)
      .pipe(switchMap(async () => this.totemService.getTotemById(totemId)))
      .subscribe({
        next: (data) => (this.totem = data),
        error: () => (this.error = 'Erro ao carregar os detalhes do totem.'),
      });
  }

  fetchTotemDetails(totemId: string): void {
    this.loading = true;
    this.totemService.getTotemById(totemId).subscribe({
      next: (data: any) => {
        this.totem = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar os detalhes do totem.';
        this.loading = false;
      },
    });
  }

  extractVimeoVideoId(url: string): string | null {
    const match = url.match(/(?:vimeo\.com\/)(\d+)/);
    return match ? match[1] : null;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
