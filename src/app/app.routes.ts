import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TotemDetailsComponent } from './components/totem-details/totem.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'totem/:id', component: TotemDetailsComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redireciona rotas não encontradas para a raiz
];
