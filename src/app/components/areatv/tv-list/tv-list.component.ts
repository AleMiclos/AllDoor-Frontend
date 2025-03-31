import { Component, OnInit, OnDestroy } from '@angular/core';
import { TvsService } from '../../../services/tvs.service';
import { UsersTvService } from '../../../services/users-tv.service'; // Serviço para buscar usuários
import { TvStatusService } from '../../../services/tv-status.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tv-list',
  templateUrl: './tv-list.component.html',
  styleUrls: ['./tv-list.component.css'],
  imports: [CommonModule],
})
export class TvListComponent implements OnInit, OnDestroy {
  users: any[] = [];
  loading = false;
  errorMessage = '';
  private tvStatusSubscription: Subscription | undefined;
  private intervalId: any;

  constructor(
    private UsersTvService: UsersTvService, // Serviço de usuários
    private tvsService: TvsService,
    private tvStatusService: TvStatusService
  ) {}

  ngOnInit() {
    this.fetchUsersAndTvs();

    // Atualiza status das TVs periodicamente
    this.intervalId = setInterval(() => {
      this.users.forEach((user) => {
        user.tvs.forEach((tv: any) => {
          this.tvStatusService.getTvStatus(tv._id);
        });
      });
    }, 5000);

    // Inscrição para atualização de status em tempo real
    this.tvStatusSubscription = this.tvStatusService.tvStatus$.subscribe(
      ({ tvId, status }) => {
        this.updateTvStatus(tvId, status);
      }
    );
  }

  ngOnDestroy() {
    if (this.tvStatusSubscription) this.tvStatusSubscription.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  fetchUsersAndTvs() {
    this.loading = true;
    this.UsersTvService.getUsersWithTvPermission().subscribe({
      next: (users: any[]) => {
        this.users = users;
        this.loading = false;

        // Para cada usuário, busca as TVs associadas
        this.users.forEach((user) => {
          this.tvsService.getTvsByUserId(user._id).subscribe({
            next: (tvs: any[]) => {
              user.tvs = tvs;
              tvs.forEach((tv) => this.fetchTvStatus(tv._id));
            },
            error: () => {
              user.tvs = [];
            },
          });
        });
      },
      error: (err) => {
        this.errorMessage = "Erro ao carregar usuários.";
        console.error(err);
        this.loading = false;
      },
    });
  }

  fetchTvStatus(tvId: string) {
    this.tvsService.getTvStatus(tvId).subscribe({
      next: (status: boolean) => { // Agora espera um booleano
        this.updateTvStatus(tvId, status);
      },
      error: (err: any) => {
        this.errorMessage = `Erro ao buscar status da TV ${tvId}: ${err.message}`;
        console.error(`Erro ao buscar status da TV ${tvId}:`, err);
      },
    });
  }

  updateTvStatus(tvId: string, status: boolean | string) {
    this.users.forEach((user) => {
      const tv = user.tvs.find((t: any) => t._id === tvId);
      if (tv) {
        tv.status = typeof status === 'string' ? status === 'online' : status;
      }
    });
  }
}
