import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TvuserComponent } from "../../components/teladeusuarios/tvuser/tvuser.component";
import { TotuserComponent } from "../../components/teladeusuarios/totuser/totuser.component";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavBarComponent,
    FooterComponent,
    TvuserComponent,
    TotuserComponent
  ],
})
export class UsuarioComponent {
  selectedUserId: string | null = null;
  statusMessage: string = '';
  loading = false;
  totems: any[] = [];
  tvs: any[] = [];
  editingItem: any = null; // Agora usado para ambos

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.selectedUserId = localStorage.getItem('userId');
    console.log('userId recuperado:', this.selectedUserId);

    if (!this.selectedUserId) {
      this.statusMessage = 'Erro: Usuário não autenticado.';
      return;
    }

    this.fetchData('totens');
    this.fetchData('tv');
  }

  fetchData(type: 'totens' | 'tv'): void {
    this.loading = true;
    const token = localStorage.getItem('token');

    if (!token || !this.selectedUserId) {
      this.statusMessage = 'Erro: Token ou ID de usuário não encontrado.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    let apiUrl = '';
    if (type === 'totens') {
      apiUrl = `https://outdoor-backend.onrender.com/totem/totem/user/${this.selectedUserId}`;
    } else {
      apiUrl = `https://outdoor-backend.onrender.com/tv/user/${this.selectedUserId}`;
    }

    this.http.get<any[]>(apiUrl, { headers }).subscribe({
      next: (data) => {
        if (type === 'totens') {
          this.totems = data;
        } else {
          this.tvs = data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error(`Erro ao buscar ${type}:`, error);
        this.statusMessage = `Erro ao carregar ${type}.`;
        this.loading = false;
      },
    });
  }



  handleStartEditing(item: any) {
    this.editingItem = { ...item }; // Cria cópia editável
  }

  handleSaveChanges() {
    if (!this.editingItem) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.statusMessage = 'Erro: Token de autenticação não encontrado.';
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const apiUrl = `https://outdoor-backend.onrender.com/${this.editingItem.type}/${this.editingItem._id}`;

    this.http.put(apiUrl, this.editingItem, { headers }).subscribe({
      next: () => {
        const list =
          this.editingItem.type === 'totens' ? this.totems : this.tvs;
        const index = list.findIndex((t) => t._id === this.editingItem._id);
        if (index !== -1) {
          list[index] = { ...this.editingItem };
        }
        this.editingItem = null;
        this.statusMessage = 'Atualização realizada com sucesso!';
      },
      error: (error) => {
        console.error('Erro ao atualizar:', error);
        this.statusMessage = 'Erro ao atualizar.';
      },
    });
  }
}
