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
  users: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private usersTvService: UsersTvService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.usersTvService.getUsersWithTvPermission().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = "Erro ao carregar usuários";
        this.loading = false;
      }
    });
  }

  openUserTvs(userId: string): void {
    this.router.navigate(['/tvs', userId]); // Navega para a tela de TVs do usuário
  }
}
