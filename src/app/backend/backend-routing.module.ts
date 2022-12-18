import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignedOrdersComponent } from './components/assigned-orders/assigned-orders.component';
import { AvailableOrdersComponent } from './components/available-orders/available-orders.component';
import { BackendComponent } from './components/backend/backend.component';
import { CompletedOrdersComponent } from './components/completed-orders/completed-orders.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { RatesComponent } from './components/rates/rates.component';
import { UsersComponent } from './components/users/users.component';
import { WriterProfileComponent } from './components/writer-profile/writer-profile.component';

const routes: Routes = [
  {
    path: '',
    component: BackendComponent,
    children: [
      {
        path: '', redirectTo: 'summary', pathMatch: 'full'
      },
      {
        path: 'available-orders',
        component: AvailableOrdersComponent
      },
      {
        path: 'assigned-orders',
        component: AssignedOrdersComponent
      },
      {
        path: 'completed-orders',
        component: CompletedOrdersComponent
      },
      {
        path: 'my-orders',
        component: MyOrdersComponent
      },
      {
        path: 'summary',
        component: DashboardComponent
      },
      {
        path: 'writer-profile',
        component: WriterProfileComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'rates',
        component: RatesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }
