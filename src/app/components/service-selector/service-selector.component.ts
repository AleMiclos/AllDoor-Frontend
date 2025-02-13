import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTotemComponent } from '../areatotem/users-menu-totem/users-menu-totem.component';
import { UsersTvComponent } from '../areatv/users-tv/users-tv.component';

@Component({
  selector: 'app-service-selector',
  templateUrl: './service-selector.component.html',
  styleUrls: ['./service-selector.component.css'],
  standalone: true,
  imports: [CommonModule, UsersTvComponent, UsersTotemComponent]
})
export class ServiceSelectorComponent {
  selectedService: string | null = null;

  selectService(service: string) {
    this.selectedService = service;
  }
}
