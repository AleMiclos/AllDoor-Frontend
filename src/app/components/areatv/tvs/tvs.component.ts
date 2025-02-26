import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TvStatusService } from '../../../services/tv-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tvs',
  templateUrl: './tvs.component.html',
  styleUrls: ['./tvs.component.css'],
  imports: [CommonModule, FormsModule],
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
    setInterval(() => {
      this.tvs.forEach((tv) => {
        this.tvStatusService.getTvStatus(tv._id);
      });
    }, 5000); // Atualiza a cada 5 segundos
  }


  ngOnDestroy() {
    // Cancela a inscrição ao destruir o componente
    if (this.tvStatusSubscription) {
      this.tvStatusSubscription.unsubscribe();
    }
  }

  // Método para buscar o status de uma TV específica
  fetchTvStatus(tvId: string) {
    this.tvsService.getTvStatus(tvId).subscribe({
      next: (status: string) => {
        this.updateTvStatus(tvId, status);
      },
      error: (err: any) => {
        this.errorMessage = `Erro ao buscar status da TV ${tvId}: ${err.message}`;
        console.error(`Erro ao buscar status da TV ${tvId}:`, err);
      },
    });
  }


  // Método para atualizar o status de uma TV na lista
  updateTvStatus(tvId: string, status: boolean | string) {
    const tv = this.tvs.find((tv) => tv._id === tvId);
    if (tv) {
      tv.status = typeof status === 'boolean' ? (status ? 'online' : 'offline') : status;
      console.log(`Status da TV ${tvId} atualizado para:`, tv.status); // Log para depuração
    } else {
      console.log(`TV com ID ${tvId} não encontrada na lista.`);
    }
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
            this.tvs.forEach((tv) => this.fetchTvStatus(tv._id));
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

    // Adiciona os campos obrigatórios ao objeto newTv
    const payload = {
      ...this.newTv, // Copia os campos já existentes (youtubeLink, vimeoLink, address)
      user: this.userId, // Adiciona o ID do usuário
      status: 'offline', // Define o status inicial como 'offline'
      createdAt: new Date().toISOString(), // Adiciona a data de criação
      updatedAt: new Date().toISOString(), // Adiciona a data de atualização
    };

    console.log('Payload enviado:', payload); // Log para depuração

    if (this.tvToEdit) {
      // Atualiza a TV existente
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
      // Cria uma nova TV
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

  viewTv(tvId: string) {
    this.router.navigate(['/view-tv', tvId]);
  }
}
