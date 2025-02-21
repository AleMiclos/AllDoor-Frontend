import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersMenuComponent } from '../areatotem/users-menu-totem/users-menu-totem.component';
import { UsersTvComponent } from '../areatv/users-tv/users-tv.component';

@Component({
  selector: 'app-service-selector',
  templateUrl: './service-selector.component.html',
  styleUrls: ['./service-selector.component.css'],
  standalone: true,
  imports: [CommonModule, UsersTvComponent, UsersMenuComponent]
})
export class ServiceSelectorComponent {
  selectedService: string | null = null;

  selectService(service: string) {
    this.selectedService = service;
  }
}
