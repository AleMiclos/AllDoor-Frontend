import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherWidgetMainComponent } from "../../weather-widget-main/weather-widget-main.component";
import { TradingviewTickerComponent } from "../../tradingview-ticker/tradingview-ticker.component";

@Component({
  selector: 'app-tvs-info',
  templateUrl: './tvs-info.component.html',
  styleUrls: ['./tvs-info.component.css'],
  imports: [CommonModule, WeatherWidgetMainComponent, TradingviewTickerComponent]
})
export class TvsInfoComponent implements OnInit, OnDestroy {
  currentDateTime: string = 'Carregando...';
  weatherInfo: string = 'Carregando...';
  intervalId: any;

  // carouselItems: string[] = [
  //   'Promoção especial na ALL DOOR!',
  //   'Anuncie sua marca nos nossos totens!',
  //   'Novidade chegando em breve!',
  //   'ALL DOOR: Publicidade digital eficiente!'
  // ];

  ngOnInit() {
    this.updateTime();

    // Atualiza o horário do sistema a cada minuto
    // this.intervalId = setInterval(() => {
    //   this.updateTime();
    // }, 60000);
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
      // hour: '2-digit',
      // minute: '2-digit',
    });
  }
}
