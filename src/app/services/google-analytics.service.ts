import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor() {}

  // Envia o evento de visualização com o ID da TV
  sendViewEvent(tvId: string, isOnline: boolean) {
    gtag('event', 'view_tv', {
      event_category: 'tv_view',
      event_label: tvId,
      is_online: isOnline ? 'online' : 'offline'
    });
  }
}
