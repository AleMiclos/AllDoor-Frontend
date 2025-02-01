import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class NavBarComponent implements OnInit, OnDestroy {
  faSignIn = faSignInAlt; // Ícone de login
  faSignOut = faSignOutAlt;
  userName: string = "";
  isMenuOpen: boolean = false;
  isHeaderHidden: boolean = false;
  isHeaderScrolled: boolean = false;
  lastScrollY: number = 0;

  constructor(private router: Router) {}



  ngOnInit(): void {
    this.updateUserName();
    window.addEventListener("storage", this.updateUserName.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener("storage", this.updateUserName.bind(this));
  }

  // Atualiza o nome do usuário a partir do localStorage
  updateUserName(): void {
    const storedUserName = localStorage.getItem("userName");
    this.userName = storedUserName ? storedUserName : "";
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'userName') {
      this.updateUserName();
    }
  }

  // Lógica de rolagem para ocultar/exibir o menu
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;

    // Ocultar ou mostrar o menu com base na rolagem
    this.isHeaderHidden = currentScrollY > this.lastScrollY;
    this.isHeaderScrolled = currentScrollY > 100;
    this.lastScrollY = currentScrollY;
  }

  // Função de login (redireciona para a tela de login)
  handleLoginRedirect(): void {
    this.router.navigate(['/login']);
  }

  // Função de logout (limpa o localStorage e redireciona para a home)
  handleLogout(): void {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    this.userName = "";
    window.dispatchEvent(new Event("storage")); // Garante a atualização imediata
    this.router.navigate(['/']);
  }

  // Função para alternar o menu hamburguer
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
