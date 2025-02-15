import { NgModule } from '@angular/core';
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
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [] // Certifique-se de definir o componente principal
})
export class AppModule { }
