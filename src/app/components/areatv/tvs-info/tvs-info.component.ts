import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherWidgetMainComponent } from '../../weather-widget-main/weather-widget-main.component';
import { TradingviewTickerComponent } from '../../tradingview-ticker/tradingview-ticker.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-tvs-info',
  templateUrl: './tvs-info.component.html',
  styleUrls: ['./tvs-info.component.css'],
  imports: [CommonModule, WeatherWidgetMainComponent, TradingviewTickerComponent, FontAwesomeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TvsInfoComponent implements OnInit, OnDestroy {
  currentDateTime: string = 'Carregando...';
  weatherInfo: string = 'Carregando...';
  intervalId: any;
  isFullscreen: boolean = false;
  faExpand = faExpand;
  faCompress = faCompress;

  carouselItems: string[] = [
    'Anuncie sua marca nos nossos totens!',
    'Anuncie sua marca em nossas tvs!',
    'Novidade chegando em breve!',
    'ALL DOOR: Publicidade digital eficiente!'
  ];
  currentIndex: number = 0;

  trackByFn(index: number, item: string) {
    return index;
  }

  ngOnInit() {
    this.updateTime();
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
    });
  }

  toggleFullscreen() {
    const doc: any = window.document;
    const docEl: any = document.documentElement;

    const requestFullscreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || doc.msRequestFullscreen;
    const exitFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullscreen.call(docEl).then(() => {
        this.isFullscreen = true;
      }).catch((err: any) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      exitFullscreen.call(doc).then(() => {
        this.isFullscreen = false;
      }).catch((err: any) => {
        console.error(`Error attempting to disable full-screen mode: ${err.message}`);
      });
    }
  }
}
