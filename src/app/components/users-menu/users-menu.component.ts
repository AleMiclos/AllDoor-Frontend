import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TotemListComponent } from '../totem-list/totem-list.component';

@Component({
  selector: 'app-users-menu',
  templateUrl: './users-menu.component.html',
  styleUrls: ['./users-menu.component.css'],
  standalone: true,
  imports: [CommonModule, TotemListComponent]
})
export class UsersMenuComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  clienteSelecionadoId: string = '';
  isSidebarOpen = true;

  @Output() selectUser = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any[]>('http://localhost:5000/users').subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Erro ao buscar usuários:', error);
      }
    );
  }

  handleUserClick(user: any): void {
    this.selectedUser = user === this.selectedUser ? null : user;
    if (this.selectedUser) {
      this.clienteSelecionadoId = this.selectedUser._id;
      this.selectUser.emit(this.selectedUser._id);
    } else {
      this.clienteSelecionadoId = '';
      this.selectUser.emit('');
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
