import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { TotemDetailsComponent } from './components/areatotem/totem-details/totem.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component'; // Standalone component

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AdminDashboardComponent,
    AppComponent,
    LoginComponent,
    TotemDetailsComponent,
    FontAwesomeModule,
  ],
  providers: [],
})
export class AppModule { }
