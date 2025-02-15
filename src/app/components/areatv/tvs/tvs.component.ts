import { Component, Input, OnInit } from '@angular/core';
import { TvsService } from '../../../services/tvs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TvViewComponent } from '../tv-view/tv-view.component';

@Component({
  selector: 'app-tvs',
  templateUrl: './tvs.component.html',
  styleUrls: ['./tvs.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TvViewComponent], // Importe o TvViewComponent aqui
})
export class TvsComponent implements OnInit {
  @Input() userId: string = '';
  tvs: any[] = [];
  newTv = {
    youtubeLink: '',
    vimeoLink: '',
    address: '',
    user: ''
  };
  loading = true;
  errorMessage = '';
  showAddTvForm = false;
  tvToEdit: any = null;
  selectedTvId: string | null = null; // ID da TV selecionada para visualização

  constructor(private router: Router, private tvsService: TvsService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.fetchTvs();
    }
  }

  fetchTvs(): void {
    this.loading = true;
    this.tvsService.getTvsByUserId(this.userId).subscribe({
      next: (data) => {
        this.tvs = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar TVs:', error);
        this.errorMessage = 'Erro ao buscar TVs';
        this.loading = false;
      }
    });
  }

  showAddForm(): void {
    this.showAddTvForm = true;
    this.tvToEdit = null;
    this.newTv = { youtubeLink: '', vimeoLink: '', address: '', user: this.userId };
  }

  editTv(tv: any): void {
    this.tvToEdit = { ...tv };
    this.newTv = { ...tv };
    this.showAddTvForm = true;
  }

  saveTv(): void {
    this.errorMessage = '';

    if (!this.newTv.address.trim()) {
      this.errorMessage = 'O endereço é obrigatório!';
      return;
    }
    if (!this.userId) {
      this.errorMessage = 'Erro: ID do usuário não encontrado.';
      return;
    }

    this.newTv.user = this.userId;

    if (this.tvToEdit) {
      this.tvsService.updateTv(this.tvToEdit.id, this.newTv).subscribe({
        next: (updatedTv) => {
          const index = this.tvs.findIndex(tv => tv.id === updatedTv.id);
          if (index !== -1) {
            this.tvs[index] = updatedTv;
          }
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro ao editar TV:', error.error || error.message);
          this.errorMessage = 'Erro ao editar TV';
        }
      });
    } else {
      this.tvsService.addTv(this.newTv).subscribe({
        next: (tv: any) => {
          this.tvs.push(tv);
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro ao adicionar TV:', error.error || error.message);
          this.errorMessage = 'Erro ao adicionar TV';
        }
      });
    }
  }

  deleteTv(tvId: string): void {
    this.tvsService.deleteTv(tvId).subscribe({
      next: () => {
        this.tvs = this.tvs.filter(tv => tv.id !== tvId);
      },
      error: (error) => {
        console.error('Erro ao excluir TV:', error.error || error.message);
        this.errorMessage = 'Erro ao excluir TV';
      }
    });
  }

  resetForm(): void {
    this.tvToEdit = null;
    this.newTv = { youtubeLink: '', vimeoLink: '', address: '', user: this.userId };
    this.showAddTvForm = false;
  }

  // Método para visualizar a TV
  viewTv(tvId: string): void {
    this.selectedTvId = tvId; // Define o ID da TV selecionada
  }
}
