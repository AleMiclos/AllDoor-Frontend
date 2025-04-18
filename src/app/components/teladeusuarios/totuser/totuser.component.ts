import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-totuser',
  templateUrl: './totuser.component.html',
  styleUrls: ['./totuser.component.css'],
  imports: [CommonModule, FormsModule],
})
export class TotuserComponent {
  @Input() totems: any[] = [];
  @Input() editingTotem: any = null;

  @Output() startEdit = new EventEmitter<any>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
