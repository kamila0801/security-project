import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/authorised/authorised.module').then(m => m.AuthorisedModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
