import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  loading = true;
  totems: any[] = [];
  editingTotem: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchTotens();
  }

  fetchTotens(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:5000/totems') // Altere para o URL correto da API
      .subscribe(
        (data) => {
          this.totems = data;
          this.loading = false;
        },
        (error) => {
          console.error('Erro ao buscar os totens:', error);
          this.statusMessage = 'Erro ao carregar os totens.';
          this.loading = false;
        }
      );
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
