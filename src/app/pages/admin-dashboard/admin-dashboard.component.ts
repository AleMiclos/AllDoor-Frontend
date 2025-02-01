import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersMenuComponent } from '../../components/users-menu/users-menu.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, UsersMenuComponent, FooterComponent, NavBarComponent]
})
export class AdminDashboardComponent {
  selectedUserId: string | null = '';

  handleSelectUser(userId: string) {
    this.selectedUserId = userId;
  }

  handleDeselectUser() {
    this.selectedUserId = null;
  }
}
