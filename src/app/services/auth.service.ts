import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserRole = new BehaviorSubject<string>(''); // Armazena a role do usuário
  currentUserRole$ = this.currentUserRole.asObservable(); // Expõe a role como um Observable

  constructor(private http: HttpClient, private router: Router) {}

  // Método de login
  login(email: string, password: string) {
    return this.http.post<{
      message: string;
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
        totemId: string | null;
        userId: string; // userId está presente aqui
      }
    }>(
      'https://outdoor-backend.onrender.com/auth/login',
      // 'https://outdoor-backend.onrender.com/auth/login',
      { email, password }
    ).pipe(
      tap((response) => {
        console.log('Resposta da API:', response); // Verifique a estrutura da resposta

        // Armazena o token, role, nome e userId no localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('userId', response.user.userId); // Salva o userId corretamente

        // Atualiza a role no BehaviorSubject
        this.setUserRole(response.user.role);

        // Redireciona com base na role
        this.redirectBasedOnRole(response.user.role);
      })
    );
  }

  // Método de registro
  register(name: string, email: string, password: string, role: string) {
    return this.http.post('https://outdoor-backend.onrender.com/auth/register', { name, email, password, role });
  }

  // Atualiza a role do usuário
  setUserRole(role: string) {
    this.currentUserRole.next(role);
  }

  // Redireciona com base na role
  redirectBasedOnRole(role: string) {
    console.log('Redirecionando com base na role:', role); // Log para depuração
    if (role === 'admin') {
      this.router.navigate(['/admin']); // Redireciona para a página de admin
    } else if (role === 'cliente') {
      this.router.navigate(['/usuario']); // Redireciona para a página de usuário
    } else {
      this.router.navigate(['/']); // Redireciona para a home se a role for desconhecida
    }
  }
}
