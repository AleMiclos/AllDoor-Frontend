import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Importar o serviço de autenticação
import { Router } from '@angular/router'; // Importar o Router para redirecionamento
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule ,HttpClientModule],
})
export class LoginComponent {
  faArrowLeft = faArrowLeft
  isRegistering = false; // 🔄 Alternar entre login e registro
  email = '';
  password = '';
  name = '';
  role = 'cliente'; // Definir valor padrão
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']); // Redireciona para a página inicial (home)
  }
  // 🔹 Chamada real para login
  handleLogin() {
    if (!this.email || !this.password) {
      this.error = 'Preencha todos os campos!';
      return;
    }
    this.error = '';
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        console.log('Login bem-sucedido:', response);
        const role = response.user.role; // A role está dentro do objeto `user`
        console.log('Role recebida:', role); // Log para depuração
        this.authService.setUserRole(role); // Armazena a role no AuthService
        this.authService.redirectBasedOnRole(role); // Redireciona com base na role
      },
      (error) => {
        console.error('Erro no login:', error);
        this.error = 'Erro no login. Por favor, tente novamente.';
      }
    );
  }

  // 🔹 Chamada real para registro
  handleRegister() {
    if (!this.email || !this.password || !this.name) {
      this.error = 'Preencha todos os campos!';
      return;
    }
    this.error = '';
    this.authService.register(this.name, this.email, this.password, this.role).subscribe(
      (response) => {
        console.log('Registro bem-sucedido:', response);
        this.toggleAuthMode(); // Volta para o modo de login após o registro
      },
      (error) => {
        console.error('Erro no registro:', error);
        this.error = 'Erro no registro. Por favor, tente novamente.';
      }
    );
  }

  // 🔄 Alternar entre login e registro
  toggleAuthMode() {
    this.isRegistering = !this.isRegistering;
    this.error = ''; // Limpa erro ao trocar
  }
}
