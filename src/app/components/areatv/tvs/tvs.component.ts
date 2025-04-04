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
  newTv: any = {
    plutoLink: '',
    vimeoLink: '',
    address: ''
  };
  
  tvToEdit: any = null;
  selectedTvId: string | null = null;
  @Input() userId: string | undefined;
  tvToView: any;

  private tvStatusSubscription: Subscription | undefined;
  private intervalId: any;

  constructor(
    private tvsService: TvsService,
    private router: Router,
    private tvStatusService: TvStatusService
  ) {}

  ngOnInit() {
    this.fetchTvs();

    this.tvStatusSubscription = this.tvStatusService.tvStatus$.subscribe(
      ({ tvId, status }) => {
        this.updateTvStatus(tvId, status);
      }
    );

    this.intervalId = setInterval(() => {
      if (this.tvs.length > 0) {
        this.tvs.forEach((tv) => {
          this.tvStatusService.getTvStatus(tv._id);
          this.tvStatusService.getVimeoStatus(tv._id);
          this.tvStatusService.getYouTubeStatus(tv._id);
        });
      }
    }, 50000);
  }

  ngOnDestroy() {
    if (this.tvStatusSubscription) this.tvStatusSubscription.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  updateTvStatus(tvId: string, status: string) {
    const tv = this.tvs.find((tv) => tv._id === tvId);
    if (tv) {
      tv.status = status === 'online';
      console.log(`Status atualizado para TV ${tvId}: ${tv.status}`);
    }
  }

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

  fetchVimeoStatus(tvId: string) {
    this.tvStatusService.getVimeoStatus(tvId);
    this.tvStatusService.vimeoStatus$.subscribe(({ tvId: updatedTvId, status }) => {
      const tv = this.tvs.find((tv) => tv._id === updatedTvId);
      if (tv) {
        tv.vimeoStatus = status === 'online' ? 'online' : 'offline';
        console.log(`Status do Vimeo atualizado para TV ${tvId}`);
      }
    });
  }

  fetchYoutubeStatus(tvId: string) {
    this.tvStatusService.getYouTubeStatus(tvId);
    this.tvStatusService.youtubeStatus$.subscribe(({ tvId: updatedTvId, status }) => {
      const tv = this.tvs.find((tv) => tv._id === updatedTvId);
      if (tv) {
        tv.youtubeStatus = status === 'online' ? 'online' : 'offline';
        console.log(`Status do YouTube atualizado para TV ${tvId}: ${tv.youtubeStatus}`);
      }
    });
  }

  canaisPlutoTV = [
    { nome: 'PlutoTV Notícias', link: 'https://pluto.tv/live-tv/pluto-tv-noticias' },
    { nome: 'PlutoTV Filmes', link: 'https://pluto.tv/live-tv/pluto-tv-filmes' },
    { nome: 'PlutoTV Cine Sucessos', link: 'https://pluto.tv/live-tv/pluto-tv-cine-sucessos' },
    { nome: 'PlutoTV Novelas', link: 'https://pluto.tv/live-tv/pluto-tv-novelas' },
    { nome: 'PlutoTV Comédia', link: 'https://pluto.tv/live-tv/pluto-tv-comedia' },
  ];

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
              this.fetchVimeoStatus(tv._id);
              this.fetchYoutubeStatus(tv._id);
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
    this.newTv = { youtubeLink: '', vimeoLink: '', address: '', plutoLink: '' };
    this.tvToEdit = null;
  }

  editTv(tv: any) {
    this.tvToEdit = tv;
    this.newTv = { ...tv, plutoLink: '' }; // adiciona plutoLink vazio
    this.showAddTvForm = true;
  }

  saveTv() {
    if (!this.newTv.address) {
      this.errorMessage = 'O endereço é obrigatório.';
      return;
    }

    const payload = {
      ...this.newTv,
      youtubeLink: this.newTv.plutoLink || this.newTv.youtubeLink,
      user: this.userId,
      status: false,
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
    this.newTv = { youtubeLink: '', vimeoLink: '', address: '', plutoLink: '' };
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

  onPlutoChannelSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    
    this.newTv.plutoLink = selectedValue;
  }
  
}
