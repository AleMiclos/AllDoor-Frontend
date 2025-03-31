import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-menu',
  templateUrl: './users-menu.component.html',
  styleUrls: ['./users-menu.component.css'],
  imports: [CommonModule, FormsModule],
})
export class UsersMenuComponent implements OnInit {
  users: any[] = [];
  selectedUser = { _id: '', name: '', email: '', role: '', permissions: { totens: false, tvs: false } };
  isEditing: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // Pegando o token salvo
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchUsers() {
    this.http.get<any[]>('https://outdoor-backend.onrender.com/users', { headers: this.getAuthHeaders() }).subscribe(
      (data) => {
        this.users = data.filter(user => user.role !== 'admin');
      },
      (error) => {
        console.error("Erro ao buscar usuários:", error);
        alert("Erro ao buscar usuários. Verifique sua autenticação.");
      }
    );
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.isEditing = true;
  }

  closeEdit() {
    this.isEditing = false;
  }

  submitForm() {
    this.http.put(`https://outdoor-backend.onrender.com/users/${this.selectedUser._id}`, this.selectedUser, { headers: this.getAuthHeaders() })
      .subscribe(
        () => {
          alert('Usuário atualizado com sucesso!');
          this.fetchUsers();
          this.isEditing = false;
        },
        (error) => {
          console.error("Erro ao atualizar usuário:", error);
          alert("Erro ao atualizar usuário. Verifique sua autenticação.");
        }
      );
  }

  deleteUser(userId: string) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      this.http.delete(`https://outdoor-backend.onrender.com/users/${userId}`, { headers: this.getAuthHeaders() })
        .subscribe(
          () => this.fetchUsers(),
          (error) => {
            console.error("Erro ao deletar usuário:", error);
            alert("Erro ao deletar usuário. Verifique sua autenticação.");
          }
        );
    }
  }
}
