import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tvs-info',
  templateUrl: './tvs-info.component.html',
  styleUrls: ['./tvs-info.component.css'],
  imports: [CommonModule]
})
export class TvsInfoComponent implements OnInit, OnDestroy {
  currentDateTime: string = 'Carregando...';
  weatherInfo: string = 'Carregando...';
  apiKey = 'SUA_CHAVE_OPENWEATHER';
  intervalId: any;

  carouselItems: string[] = [
    'Promoção especial na ALL DOOR!',
    'Anuncie sua marca nos nossos totens!',
    'Novidade chegando em breve!',
    'ALL DOOR: Publicidade digital eficiente!'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.updateTime();
    this.fetchWeather();

    // 🔹 Atualiza o horário do sistema a cada segundo
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  fetchWeather() {
    this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=São%20Paulo&appid=${this.apiKey}&units=metric&lang=pt`)
      .subscribe(data => {
        this.weatherInfo = `Clima: ${data.main.temp}°C - ${data.weather[0].description}`;
      });
  }
}
