import { Component, OnInit } from '@angular/core';
import { UsersTvService } from '../../../services/users-tv.service';
import { TvsService } from '../../../services/tvs.service'; // Serviço para buscar TVs
import { CommonModule } from '@angular/common';
import { TvsComponent } from '../tvs/tvs.component';

@Component({
  selector: 'app-users-tv',
  templateUrl: './users-tv.component.html',
  styleUrls: ['./users-tv.component.css'],
  imports: [CommonModule, TvsComponent]
})
export class UsersTvComponent implements OnInit {
  users: any[] = []; // Lista de usuários
  loading = true; // Estado de carregamento
  errorMessage = ''; // Mensagem de erro
  userTvs: { [key: string]: any[] } = {}; // TVs de cada usuário (armazenadas por userId)
  showUserTvs: { [key: string]: boolean } = {}; // Controle de exibição das TVs por usuário

  constructor(
    private usersTvService: UsersTvService,
    private tvsService: TvsService // Serviço de TVs
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  // Método para carregar os usuários com permissão de TV
  fetchUsers(): void {
    this.usersTvService.getUsersWithTvPermission().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = "Erro ao carregar usuários";
        this.loading = false;
      }
    });
  }

  // Método para abrir/fechar as TVs do usuário selecionado
  openUserTvs(userId: string): void {
    // Alterna a visibilidade das TVs para o usuário selecionado
    this.showUserTvs[userId] = !this.showUserTvs[userId];

    // Se as TVs estão sendo mostradas, carrega as TVs do usuário
    if (this.showUserTvs[userId]) {
      this.tvsService.getTvsByUserId(userId).subscribe({
        next: (data) => {
          this.userTvs[userId] = data; // Armazena as TVs do usuário
        },
        error: () => {
          this.errorMessage = "Erro ao carregar TVs do usuário";
        }
      });
    } else {
      // Se as TVs estão sendo escondidas, limpa a lista de TVs do usuário
      this.userTvs[userId] = [];
    }
  }
}
