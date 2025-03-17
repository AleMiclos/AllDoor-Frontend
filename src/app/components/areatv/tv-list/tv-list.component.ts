import { Component, OnInit } from '@angular/core';
import { TvsService } from '../../../services/tvs.service'; // Certifique-se de usar o caminho correto
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tv-list',
  templateUrl: './tv-list.component.html',
  styleUrls: ['./tv-list.component.css'],
  imports: [CommonModule]
})
export class TvListComponent implements OnInit {
  tvs: any[] = []; // Array para armazenar as TVs
  loading: boolean = true; // Flag para indicar carregamento
  error: string | null = null; // Mensagem de erro (se houver)

  constructor(private tvsService: TvsService) {}

  ngOnInit(): void {
    this.loadTvs(); // Chama a função para carregar as TVs ao iniciar
  }

  // Função para buscar os dados das TVs
  loadTvs(): void {
    this.tvsService.getTvsByUserId('679d870e94ce97a5dd780db6') // Substitua 'user-id-exemplo' pelo ID do usuário
      .subscribe(
        (data) => {
          this.tvs = data; // Armazena os dados retornados
          this.loading = false; // Finaliza o estado de carregamento
        },
        (error) => {
          this.error = 'Erro ao carregar as TVs.'; // Define uma mensagem de erro
          this.loading = false;
          console.error(error); // Exibe o erro no console
        }
      );
  }
}
