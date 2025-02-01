import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TotemService } from '../../services/totemList.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-totem-list',
  templateUrl: './totem-list.component.html',
  styleUrls: ['./totem-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class TotemListComponent implements OnInit {
  @Input() userId: string = ''; // ID do usuário recebido como entrada
  totems: any[] = [];
  newTotemForm: FormGroup;
  editTotemForm: FormGroup;
  editingTotem: any = null;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private totemService: TotemService) {
    this.newTotemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      videoUrl: ['', [Validators.required]],
      address: ['', Validators.required],
      isOnline: [false],
    });

    this.editTotemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      videoUrl: ['', [Validators.required]],
      address: ['', Validators.required],
      isOnline: [false],
    });
  }

  ngOnInit(): void {
    console.log("ID do usuário recebido:", this.userId);

    if (this.isValidObjectId(this.userId)) {
      this.fetchTotems();
    } else {
      this.errorMessage = 'ID do usuário inválido.';
      console.error(this.errorMessage);
    }
  }

  fetchTotems() {
    if (!this.isValidObjectId(this.userId)) {
      this.errorMessage = 'ID do usuário inválido.';
      console.error(this.errorMessage);
      return;
    }

    this.totemService.getTotems(this.userId).subscribe(
      (data) => {
        this.totems = data;
        console.log("Totens carregados:", this.totems);
      },
      (error) => {
        console.error("Erro ao buscar totens:", error);
        this.errorMessage = 'Erro ao buscar totens.';
      }
    );
  }

  handleAddTotem() {
    if (this.newTotemForm.invalid || !this.isValidObjectId(this.userId)) {
      this.errorMessage = 'Preencha todos os campos corretamente e selecione um usuário válido.';
      return;
    }

    const newTotem = { ...this.newTotemForm.value, userId: this.userId };

    this.totemService.addTotem(newTotem).subscribe(
      (data) => {
        this.totems.push(data);
        this.newTotemForm.reset();
        this.errorMessage = '';
      },
      (error) => {
        console.error("Erro ao adicionar totem:", error);
        this.errorMessage = 'Erro ao adicionar totem.';
      }
    );
  }

  setEditingTotem(totem: any) {
    this.editingTotem = totem;
    this.editTotemForm.patchValue(totem);
  }

  handleEditTotem() {
    if (this.editTotemForm.invalid || !this.editingTotem) return;

    this.totemService.updateTotem(this.editingTotem._id, this.editTotemForm.value).subscribe(
      (data) => {
        this.totems = this.totems.map((totem) =>
          totem._id === this.editingTotem._id ? data : totem
        );
        this.editingTotem = null;
        this.errorMessage = '';
      },
      (error) => {
        console.error("Erro ao editar totem:", error);
        this.errorMessage = 'Erro ao editar totem.';
      }
    );
  }

  handleDeleteTotem(id: string) {
    this.totemService.deleteTotem(id).subscribe(
      () => {
        this.totems = this.totems.filter((totem) => totem._id !== id);
        this.errorMessage = '';
      },
      (error) => {
        console.error("Erro ao deletar totem:", error);
        this.errorMessage = 'Erro ao deletar totem.';
      }
    );
  }

  isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }
}
