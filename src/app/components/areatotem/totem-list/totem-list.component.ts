import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TotemService } from '../../../services/totem.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-totem-list',
  templateUrl: './totem-list.component.html',
  styleUrls: ['./totem-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
      videoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validação de URL
      address: ['', Validators.required],
    });

    this.editTotemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      videoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validação de URL
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('ID do usuário recebido:', this.userId);

    if (!this.userId) {
      this.errorMessage = 'ID do usuário não foi fornecido.';
      console.error(this.errorMessage);
      return;
    }

    if (this.isValidObjectId(this.userId)) {
      this.fetchTotems();
    } else {
      this.errorMessage = `ID do usuário inválido: ${this.userId}`;
      console.error(this.errorMessage);
    }
  }

  // Busca os totens do usuário
  fetchTotems() {
    if (!this.userId || !this.isValidObjectId(this.userId)) {
      this.errorMessage = `ID do usuário inválido: ${this.userId}`;
      console.error(this.errorMessage);
      return;
    }

    this.totemService.getAllTotems(this.userId).subscribe(
      (data) => {
        this.totems = data;
        console.log('Totens carregados:', this.totems);
      },
      (error) => {
        console.error('Erro ao buscar totens:', error);
        this.errorMessage = 'Erro ao buscar totens.';
      }
    );
  }

  // Adiciona um novo totem
  handleAddTotem() {
    if (this.newTotemForm.invalid || !this.isValidObjectId(this.userId)) {
      this.errorMessage = 'Preencha todos os campos corretamente e selecione um usuário válido.';
      console.log(this.errorMessage);
      return;
    }

    const newTotem = {
      ...this.newTotemForm.value,
      user: this.userId, // Corrigido para 'user' conforme o backend
    };

    this.totemService.addTotem(newTotem).subscribe(
      (data) => {
        this.totems.push(data);
        this.newTotemForm.reset();
        this.errorMessage = '';
        console.log('Totem adicionado com sucesso:', data);
      },
      (error) => {
        console.error('Erro ao adicionar totem:', error);
        this.errorMessage = 'Erro ao adicionar totem.';
      }
    );
  }

  // Define o totem em edição
  setEditingTotem(totem: any) {
    this.editingTotem = totem;
    this.editTotemForm.patchValue(totem);
  }

  // Cancela a edição do totem
  cancelEditing() {
    this.editingTotem = null;
    this.editTotemForm.reset();
  }

  // Edita um totem existente
  handleEditTotem() {
    if (this.editTotemForm.invalid || !this.editingTotem) return;

    const updatedTotem = {
      ...this.editTotemForm.value,
      user: this.userId, // Corrigido para 'user' conforme o backend
      status: this.editingTotem.status // Mantendo o status atual
    };

    this.totemService.updateTotem(this.editingTotem._id, updatedTotem).subscribe(
      (data) => {
        const index = this.totems.findIndex(t => t._id === this.editingTotem._id);
        if (index !== -1) {
          this.totems[index] = data;
        }
        this.editingTotem = null;
        this.errorMessage = '';
      },
      (error) => {
        console.error('Erro ao editar totem:', error);
        this.errorMessage = 'Erro ao editar totem.';
      }
    );
  }

  // Deleta um totem
  handleDeleteTotem(id: string) {
    const confirmation = confirm('Você tem certeza que deseja deletar este totem?');
    if (!confirmation) {
      return; // Cancela a exclusão se o usuário não confirmar
    }

    this.totemService.deleteTotem(id).subscribe(
      () => {
        this.totems = this.totems.filter((totem) => totem._id !== id); // Remove o totem da lista
        this.errorMessage = ''; // Limpa a mensagem de erro
      },
      (error) => {
        console.error('Erro ao deletar totem:', error);
        this.errorMessage = 'Erro ao deletar totem.';
      }
    );
  }

  // Valida se o ID é um ObjectId válido (MongoDB)
  isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
  }
}
