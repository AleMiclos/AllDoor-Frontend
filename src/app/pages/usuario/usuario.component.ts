import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importe HttpHeaders
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavBarComponent, FooterComponent]
})
export class UsuarioComponent {
  selectedUserId: string | null = null;
  statusMessage: string = '';
  loading = false;
  totems: any[] = [];
  editingTotem: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.selectedUserId = localStorage.getItem('userId'); // Obtém o userId salvo após login
    console.log('userId recuperado:', this.selectedUserId);

    if (!this.selectedUserId) {
      this.statusMessage = 'Erro: Usuário não autenticado.';
      return;
    }

    this.fetchTotens();
  }

  fetchTotens(): void {
    this.loading = true;

    // Recupera o token do localStorage
    const token = localStorage.getItem('token');

    // Verifica se o token está presente
    if (!token) {
      this.statusMessage = 'Erro: Token de autenticação não encontrado.';
      this.loading = false;
      return;
    }

    // Configura o cabeçalho com o token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Adiciona o token no cabeçalho
    });

    // Faz a requisição com o cabeçalho
    this.http.get<any[]>(`https://outdoor-backend.onrender.com/totems/`, { headers })
      .subscribe({
        next: (data) => {
          this.totems = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao buscar os totens:', error);
          this.statusMessage = 'Erro ao carregar os totens.';
          this.loading = false;
        }
      });
  }

  handleStartEditing(totem: any) {
    this.editingTotem = { ...totem };
  }

  handleSaveChanges() {
    const index = this.totems.findIndex(t => t._id === this.editingTotem._id);
    if (index !== -1) {
      this.totems[index] = this.editingTotem;
      this.editingTotem = null;
      this.statusMessage = 'Totem atualizado com sucesso!';
    } else {
      this.statusMessage = 'Erro ao atualizar o totem.';
    }
  }
}
