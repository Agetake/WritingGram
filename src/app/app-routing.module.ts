import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./frontend/frontend.module').then(
      (m) => m.FrontendModule,
    ),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./backend/backend.module').then(
      (m) => m.BackendModule,
    ),
  },
  //Wild Card Route for 404 request
  {
    path: '**', pathMatch: 'full', component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
