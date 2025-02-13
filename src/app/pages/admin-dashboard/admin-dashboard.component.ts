import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { UsersMenuComponent } from '../../components/users-menu/users-menu.component'; // Import correto
import { ServiceSelectorComponent } from '../../components/service-selector/service-selector.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    NavBarComponent,
    UsersMenuComponent,
    ServiceSelectorComponent // Adicionando o componente no array de imports
  ],
})
export class AdminDashboardComponent implements OnInit {
  selectedView: string | null = null;
  users: any[] = [];

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }




  setView(view: string) {
    console.log(`View alterada para: ${view}`);

    this.selectedView = view;
  }

  closeView() {
    this.selectedView = null;
  }
}
