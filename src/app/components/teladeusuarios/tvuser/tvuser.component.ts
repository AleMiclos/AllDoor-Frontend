import { Component, OnInit } from '@angular/core';
import { TvsService } from '../../../services/tvs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tvuser',
  templateUrl: './tvuser.component.html',
  styleUrls: ['./tvuser.component.css'],
  imports: [CommonModule, FormsModule],
})
export class TvuserComponent implements OnInit {
  tvs: any[] = [];
  editingTv: any = null;
  originalTvData: any = null;
  userId: string = ''; // Defina conforme sua lógica (authService ou localStorage)

  constructor(private tvsService: TvsService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || ''; // Ajuste conforme seu auth
    this.loadTvs();
  }

  loadTvs() {
    this.tvsService.getTvsByUserId(this.userId).subscribe((data) => {
      this.tvs = data;
    });
  }

  startEdit(tv: any) {
    this.editingTv = { ...tv }; // Cópia para edição
    this.originalTvData = tv;
  }

  save() {
    if (!this.editingTv?._id) return;

    this.tvsService.updateTv(this.editingTv._id, {
      youtubeLink: this.editingTv.youtubeLink
    }).subscribe((res) => {
      if (res) {
        Object.assign(this.originalTvData, this.editingTv); // Atualiza no array
      }
      this.editingTv = null;
      this.originalTvData = null;
    });
  }

  cancel() {
    this.editingTv = null;
    this.originalTvData = null;
  }
}
