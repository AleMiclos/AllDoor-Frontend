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
  isOnline: boolean = true; // Status da TV (exemplo: online ou offline)
  private visibilitySubscription: Subscription | undefined;

  constructor(
    private tvsService: TvsService,
    private router: Router,
    private tvStatusService: TvStatusService,
  ) {}

  ngOnInit() {
    this.fetchTvs();
    this.monitorarVisibilidade();



    // Inscreve-se no serviço para receber atualizações de visibilidade
    this.visibilitySubscription = this.tvStatusService.tvVisibility$.subscribe(
      (isVisible) => {
        const status = isVisible ? 'online' : 'offline';
        this.atualizarStatusTvs(status);
      }
    );
  }

  ngOnDestroy() {
    // Cancela a inscrição ao destruir o componente
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }

  atualizarStatusTvs(status: string) {
    if (this.tvs.length === 0) {
      console.warn('Nenhuma TV cadastrada para atualização de status.');
      return;
    }
  
    this.tvs.forEach((tv) => {
      if (tv._id) {
        this.tvsService.atualizarStatusTv(tv._id, status).subscribe({
          next: (res) => {
            console.log(`Status da TV ${tv._id} atualizado:`, res);
            // Atualiza o status no frontend
            tv.status = status;
          },
          error: (err: any) => {
            console.error(`Erro ao atualizar status da TV ${tv._id}:`, err);
          },
        });
      }
    });
  }

  fetchTvs() {
    if (this.userId) {
      this.loading = true;
      this.tvsService.getTvsByUserId(this.userId).subscribe({
        next: (data: any[]) => {
          this.loading = false;
  
          // Atualiza a lista de TVs
          this.tvs = data.map((newTv) => {
            const existingTv = this.tvs.find((tv) => tv._id === newTv._id);
            return existingTv ? { ...existingTv, ...newTv } : newTv;
          });
  
          // Se ainda não houver uma TV selecionada, escolher a primeira
          if (!this.tvToView && this.tvs.length > 0) {
            this.tvToView = this.tvs[0];
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

  monitorarVisibilidade() {
    document.addEventListener('visibilitychange', () => {
      const isVisible = document.visibilityState === 'visible';
      this.tvStatusService.updateVisibility(isVisible);
    });
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
    if (this.tvToEdit) {
      this.tvsService.updateTv(this.tvToEdit._id, this.newTv).subscribe({
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
      if (this.userId) {
        this.newTv.user = this.userId;
        this.tvsService.createTv(this.newTv).subscribe({
          next: () => {
            this.fetchTvs();
            this.resetForm();
          },
          error: (err: any) => {
            this.errorMessage = err.error.message || 'Erro ao criar TV.';
            console.error(err);
          },
        });
      } else {
        console.error('userId não está definido.');
      }
    }
  }

  deleteTv(tvId: string) {
    if (confirm('Tem certeza que deseja excluir esta TV?')) {
      this.tvsService.deleteTv(tvId).subscribe({
        next: () => {
          this.fetchTvs();
        },
        error: (err) => {
          console.error('Erro ao deletar TV:', err);
        },
      });
    }
  }

  viewTv(tvId: string) {
    this.router.navigate(['/view-tv', tvId]);
  }

  resetForm() {
    this.showAddTvForm = false;
    this.newTv = { youtubeLink: '', vimeoLink: '', address: '' };
    this.tvToEdit = null;
  }
}