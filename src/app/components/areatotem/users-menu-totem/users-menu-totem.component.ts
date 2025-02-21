import { Component, OnInit } from '@angular/core';
import { TotemListService } from '../../../services/totemList.service';
import { CommonModule } from '@angular/common';
import { TotemListComponent } from "../totem-list/totem-list.component";

@Component({
  selector: 'app-users-totem',
  templateUrl: './users-menu-totem.component.html',
  styleUrls: ['./users-menu-totem.component.css'],
  imports: [CommonModule, TotemListComponent]
})
export class UsersMenuComponent implements OnInit {
  users: any[] = []; // Lista de usuários
  errorMessage: string | null = null; // Mensagem de erro
  isSidebarOpen: boolean = false; // Controla se a sidebar está aberta ou fechada
  selectedUser: any | null = null; // Usuário selecionado para exibir os totens
  clienteSelecionadoId: string | null = null; // ID do cliente selecionado

  constructor(private totemListService: TotemListService) {}

  ngOnInit(): void {
    this.fetchUsersWithTotemPermission();
  }

  // Busca usuários com permissão para totens
  fetchUsersWithTotemPermission(): void {
    this.totemListService.getUsersWithTotemPermission().subscribe(
      (response) => {
        this.users = response; // Atualiza a lista de usuários
        this.errorMessage = null; // Limpa a mensagem de erro
      },
      (error) => {
        this.errorMessage = 'Erro ao buscar usuários com permissão para totens.';
        console.error('Erro:', error);
      }
    );
  }

  // Alterna o estado da sidebar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Lida com o clique no usuário e seleciona o usuário
  handleUserClick(user: any): void {
    if (this.selectedUser === user) {
      // Se o usuário selecionado for clicado novamente, desmarque-o
      this.selectedUser = null;
      this.clienteSelecionadoId = null;
    } else {
      // Caso contrário, selecione o usuário
      this.selectedUser = user;
      this.clienteSelecionadoId = user._id.toString(); // Convertendo ID para string
    }
    console.log("ID do Usuário Selecionado:", this.clienteSelecionadoId); // Verifique se o ID está sendo passado corretamente
  }
}
