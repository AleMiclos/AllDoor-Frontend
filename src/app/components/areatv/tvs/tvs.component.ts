import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TvsService } from '../../../services/tvs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TvViewComponent } from '../tv-view/tv-view.component';

@Component({
  selector: 'app-tvs',
  templateUrl: './tvs.component.html',
  styleUrls: ['./tvs.component.css'],
  imports: [CommonModule, FormsModule, TvViewComponent]
})
export class TvsComponent implements OnInit {

  tvs: any[] = [];
  loading = false;
  errorMessage = '';
  showAddTvForm = false;
  newTv: any = { youtubeLink: '', vimeoLink: '', address: '' };
  tvToEdit: any = null;
  selectedTvId: string | null = null;
  @Input() userId: string | undefined;
tvToView: any;
  constructor(private tvsService: TvsService, private router: Router) {}

  ngOnInit() {
    this.fetchTvs();
  }

  fetchTvs() {
    if (this.userId) {
      this.loading = true;
      this.tvsService.getTvsByUserId(this.userId).subscribe({
        next: (data: any[]) => {
          this.tvs = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Erro ao carregar TVs.';
          console.error(err);
          this.loading = false;
        }
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
    if (this.tvToEdit) {
      // Editar TV
      this.tvsService.updateTv(this.tvToEdit._id, this.newTv).subscribe({
        next: () => {
          this.fetchTvs();
          this.resetForm();
        },
        error: (err: any) => {
          this.errorMessage = err.error.message || 'Erro ao atualizar TV.';
          console.error(err);
        }
      });
    } else {
      // Criar nova TV
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
          }
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
        }
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
