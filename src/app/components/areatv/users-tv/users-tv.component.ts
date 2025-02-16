import { Component, OnInit, Input } from '@angular/core';
import { UsersTvService } from '../../../services/users-tv.service';
import { TvsService } from '../../../services/tvs.service';
import { CommonModule } from '@angular/common';
import { TvsComponent } from "../tvs/tvs.component";

@Component({
  selector: 'app-users-tv',
  templateUrl: './users-tv.component.html',
  styleUrls: ['./users-tv.component.css'],
  imports: [CommonModule, TvsComponent]
})
export class UsersTvComponent implements OnInit {
  @Input() userId: string | undefined;
  loading = true;
  errorMessage = '';
  users: any[] = []; // Propriedade users adicionada
  userTvs: { [key: string]: any[] } = {};
  showUserTvs: { [key: string]: boolean } = {};

  constructor(
    private usersTvService: UsersTvService,
    private tvsService: TvsService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

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

  openUserTvs(userId: string): void {
    this.showUserTvs[userId] = !this.showUserTvs[userId];

    if (this.showUserTvs[userId]) {
      this.tvsService.getTvsByUserId(userId).subscribe({
        next: (data) => {
          this.userTvs[userId] = data;
        },
        error: () => {
          this.errorMessage = "Erro ao carregar TVs do usuário";
        }
      });
    } else {
      this.userTvs[userId] = [];
    }
  }
}
