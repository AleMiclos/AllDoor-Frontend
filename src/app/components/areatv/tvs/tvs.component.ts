import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersTvService } from '../../../services/users-tv.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tv',
  templateUrl: './tvs.component.html',
  styleUrls: ['./tvs.component.css'],
  imports: [CommonModule, FormsModule]
})
export class TvsComponent implements OnInit {
  userId: string = '';
  tvs: any[] = [];
  newTv = {
    youtubeLink: '',
    vimeoLink: '',
    address: '',
    user: ''
  };
  loading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private usersTvService: UsersTvService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchTvs();
  }

  fetchTvs(): void {
    this.usersTvService.getTvsByUser(this.userId).subscribe({
      next: (data) => {
        this.tvs = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao buscar TVs';
        this.loading = false;
      }
    });
  }

  addTv(): void {
    this.newTv.user = this.userId;
    this.usersTvService.addTv(this.newTv).subscribe({
      next: (tv) => {
        this.tvs.push(tv);
        this.newTv = { youtubeLink: '', vimeoLink: '', address: '', user: '' };
      },
      error: () => {
        this.errorMessage = 'Erro ao adicionar TV';
      }
    });
  }
}
