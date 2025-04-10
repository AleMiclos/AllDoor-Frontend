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
    }
  }

  fetchTvStatus(tvId: string) {
    this.tvStatusService.getTvStatus(tvId);
    this.tvStatusService.tvStatus$.subscribe(({ tvId: updatedTvId, status }) => {
      if (updatedTvId === tvId) {
        const tv = this.tvs.find((tv) => tv._id === tvId);
        if (tv) {
          tv.status = status === 'online';
        }
      }
    });
  }



  canaisPlutoTV = [
    { nome: 'Record News', link: 'https://pluto.tv/br/live-tv/6102e04e9ab1db0007a980a1' },
    { nome: 'Filmes Familia', link: 'https://pluto.tv/br/live-tv/5f171f032cd22e0007f17f3d' },
    { nome: 'Filmes de Ação', link: 'https://pluto.tv/br/live-tv/5f120f41b7d403000783a6d6' },
    { nome: 'Novelas', link: 'https://pluto.tv/br/live-tv/5f512365abe1f50007d3ff56' },
    { nome: 'Master Chef', link: 'https://pluto.tv/br/live-tv/6077045b6031bd00078de127' },
    { nome: 'CSI Miami', link: 'https://pluto.tv/br/live-tv/63eb9c5351f5d000085e8d7e' },
    { nome: 'Kenan e Kel', link: 'https://pluto.tv/br/live-tv/5ffcc5130fd98c0007f2e216' },
    { nome: 'Shark Tank', link: 'https://pluto.tv/br/live-tv/6647c0b91050b60008390de4' },
    { nome: 'Jovem Pan', link: 'https://pluto.tv/br/live-tv/6317ba014d4d040007227f72' },
    { nome: 'Esporte', link: 'https://pluto.tv/br/live-tv/5f32d2db0af67400077f29c4' },
    { nome: 'Manual do Mundo', link: 'https://pluto.tv/br/live-tv/664df5221dc48600087592b1' },
    { nome: 'MTV Hits Anos 90', link: 'https://pluto.tv/br/live-tv/66a01dcb8561260008b0a41d' },
    
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
