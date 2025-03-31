import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TvStatusService } from '../../../services/tv-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tvs',
  templateUrl: './tvs.component.html',
  styleUrls: ['./tvs.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TvsComponent implements OnInit, OnDestroy {
  tvs: any[] = [];
  loading = false;
  errorMessage = '';
  showAddTvForm = false;
  newTv: any = { youtubeLink: '', vimeoLink: '', address: '' };
  tvToEdit: any = null;
  selectedTvId: string | null = null;
  @Input() userId: string | undefined;
  tvToView: any;

  // Declaração da propriedade tvStatusSubscription
  private tvStatusSubscription: Subscription | undefined;
  private intervalId: any; // Armazena o ID do intervalo
  cdr: any;

  constructor(
    private tvsService: TvsService,
    private router: Router,
    private tvStatusService: TvStatusService,

  ) {}

  ngOnInit() {
    this.fetchTvs();

    // Inscreve-se para receber atualizações de status em tempo real
    this.tvStatusSubscription = this.tvStatusService.tvStatus$.subscribe(
      ({ tvId, status }) => {
        this.updateTvStatus(tvId, status);

      }
    );

    // Atualiza o status das TVs a cada 5 segundos
    this.intervalId = setInterval(() => {
      if (this.tvs.length > 0) {
        this.tvs.forEach((tv) => {
          this.tvStatusService.getTvStatus(tv._id);

        });
      }
    }, 5000); // Atualiza a cada 5 segundos
  }

  ngOnDestroy() {
    // Cancela a inscrição ao destruir o componente
    if (this.tvStatusSubscription) {
      this.tvStatusSubscription.unsubscribe();
    }
    // Limpa o intervalo ao destruir o componente
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTvStatus(tvId: string, status: string) {
    const tv = this.tvs.find((tv) => tv._id === tvId);
    if (tv) {
      tv.status = status === 'online'; // Converte para booleano
      console.log(`Status atualizado para TV ${tvId}: ${tv.status}`);

      // Garante que a UI seja atualizada corretamente

    }
  }

 // Método para atualizar o status geral da TV
 fetchTvStatus(tvId: string) {
  this.tvStatusService.getTvStatus(tvId);
  this.tvStatusService.tvStatus$.subscribe(({ tvId: updatedTvId, status }) => {
    if (updatedTvId === tvId) {
      const tv = this.tvs.find((tv) => tv._id === tvId);
      if (tv) {
        tv.status = status === 'online';
        console.log(`Status geral atualizado para TV ${tvId}: ${tv.status}`);
      }
    }
  });
}


fetchTvs() {
  if (this.userId) {
    this.loading = true;
    this.tvsService.getTvsByUserId(this.userId).subscribe({
      next: (data: any[]) => {
        this.loading = false;
        this.tvs = data;

        if (this.tvs.length > 0) {
          console.log('Buscando status das TVs...');
          this.tvs.forEach((tv) => {
            this.fetchTvStatus(tv._id);
          });
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Erro ao carregar TVs.';
        console.error(err);
        this.loading = false;
      },
    });
  } else {
    console.error('userId não está definido.');
  }
}


  showAddForm() {
    this.showAddTvForm = true;
    this.newTv = { youtubeLink: '', vimeoLink: '', address: '' };
    this.tvToEdit = null;
  }

  editTv(tv: any) {
    this.tvToEdit = tv;
    this.newTv = { ...tv };
    this.showAddTvForm = true;
  }

  saveTv() {
    if (!this.newTv.address) {
      this.errorMessage = 'O endereço é obrigatório.';
      return;
    }

    const payload = {
      ...this.newTv,
      user: this.userId,
      status: false, // Status inicial agora é booleano (false)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Payload enviado:', payload);

    if (this.tvToEdit) {
      this.tvsService.updateTv(this.tvToEdit._id, payload).subscribe({
        next: () => {
          this.fetchTvs();
          this.resetForm();
        },
        error: (err: any) => {
          this.errorMessage = err.error.message || 'Erro ao atualizar TV.';
          console.error(err);
        },
      });
    } else {
      this.tvsService.createTv(payload).subscribe({
        next: () => {
          this.fetchTvs();
          this.resetForm();
        },
        error: (err: any) => {
          this.errorMessage = err.error.message || 'Erro ao criar TV.';
          console.error(err);
        },
      });
    }
  }

  resetForm() {
    this.showAddTvForm = false;
    this.newTv = { youtubeLink: '', vimeoLink: '', address: '' };
    this.tvToEdit = null;
    this.errorMessage = '';
  }

  deleteTv(tvId: string) {
    if (confirm('Tem certeza que deseja excluir esta TV?')) {
      this.tvsService.deleteTv(tvId).subscribe({
        next: () => {
          this.fetchTvs();
        },
        error: (err: any) => {
          this.errorMessage = 'Erro ao excluir TV.';
          console.error(err);
        },
      });
    }
  }

  navigateTo(route: string, tvId: string): void {
    this.router.navigate([route, tvId]);
  }
}
