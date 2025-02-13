import { Component, OnInit } from '@angular/core';
import { UsersTvService } from '../../../services/users-tv.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-tv',
  templateUrl: './users-tv.component.html',
  styleUrls: ['./users-tv.component.css'],
  imports: [CommonModule]
})
export class UsersTvComponent implements OnInit {
  tvs: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private usersTvService: UsersTvService, private router: Router) {}

  ngOnInit(): void {
    this.fetchTvs();
  }

  fetchTvs(): void {
    this.usersTvService.getTvs().subscribe({
      next: (data: any[]) => { // Adicione o tipo 'any[]' para o parâmetro 'data'
        this.tvs = data;
        this.loading = false;
      },
      error: (error: any) => { // Adicione o tipo 'any' para o parâmetro 'error'
        console.error('Erro ao buscar TVs:', error);
        this.errorMessage = 'Erro ao buscar TVs';
        this.loading = false;
      }
    });
  }

  openTvDetails(tvId: string): void {
    this.router.navigate(['/tv', tvId]);
  }

  updateTv(tvId: string, tvData: any): void {
    this.usersTvService.updateTv(tvId, tvData).subscribe({
      next: (updatedTv: any) => { // Adicione o tipo 'any' para o parâmetro 'updatedTv'
        console.log('TV atualizada com sucesso:', updatedTv);
        this.fetchTvs(); // Atualiza a lista de TVs após a atualização
      },
      error: (error: any) => { // Adicione o tipo 'any' para o parâmetro 'error'
        console.error('Erro ao atualizar TV:', error);
        this.errorMessage = 'Erro ao atualizar TV';
      }
    });
  }

  deleteTv(tvId: string): void {
    this.usersTvService.deleteTv(tvId).subscribe({
      next: () => {
        console.log('TV deletada com sucesso');
        this.fetchTvs(); // Atualiza a lista de TVs após a exclusão
      },
      error: (error: any) => { // Adicione o tipo 'any' para o parâmetro 'error'
        console.error('Erro ao deletar TV:', error);
        this.errorMessage = 'Erro ao deletar TV';
      }
    });
  }
}
