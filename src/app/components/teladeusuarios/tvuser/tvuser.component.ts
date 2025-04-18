import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // 👈 IMPORTANTE

@Component({
  selector: 'app-tvuser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 👈 Adicione aqui
  templateUrl: './tvuser.component.html',
  styleUrls: ['./tvuser.component.css'],
})
export class TvuserComponent {
  @Input() tvs: any[] = [];
  @Input() editingTv: any;
  @Output() startEdit = new EventEmitter<any>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
