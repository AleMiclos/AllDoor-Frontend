import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from '../app.routes'; // Importa as rotas configuradas

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export {
  appRoutes // Importa as rotas configuradas
};

