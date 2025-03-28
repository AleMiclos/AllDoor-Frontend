import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { appRoutes, AppRoutingModule } from './app-routing/app-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { TotemDetailsComponent } from './components/areatotem/totem-details/totem.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { TvsComponent } from './components/areatv/tvs/tvs.component';
import { RouterModule } from '@angular/router';
import { UsersTvComponent } from './components/areatv/users-tv/users-tv.component';
import { CommonModule } from '@angular/common';
import { WeatherWidgetMainComponent } from './components/weather-widget-main/weather-widget-main.component';
import { TradingviewTickerComponent } from './components/tradingview-ticker/tradingview-ticker.component';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { AdFullComponent } from './components/areatv/ad-full/ad-full.component';



@NgModule({
  declarations: [

  ],
  imports: [
    AppComponent, // Deve estar aqui
    LoginComponent,
    TotemDetailsComponent,
    AdminDashboardComponent,
    TvsComponent,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule, // Já contém o RouterModule com as rotas
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes),
    UsersTvComponent,
    WeatherWidgetMainComponent,
    TradingviewTickerComponent,
    AdFullComponent
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [], // Certifique-se de definir o componente principal
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
