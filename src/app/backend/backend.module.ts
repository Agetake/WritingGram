import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendRoutingModule } from './backend-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AvailableOrdersComponent } from './components/available-orders/available-orders.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BackendComponent } from './components/backend/backend.component';
import { SharedModule } from '../shared/shared.module';
import { ViewPaperComponent } from './components/view-paper/view-paper.component';
import { WriterProfileComponent } from './components/writer-profile/writer-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AssignedOrdersComponent } from './components/assigned-orders/assigned-orders.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { MatRadioModule } from '@angular/material/radio';
import { UsersComponent } from './components/users/users.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { RatesComponent } from './components/rates/rates.component';
import { ViewRateComponent } from './components/view-rate/view-rate.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterApprovedFilesPipe } from './pipes/filter-approved-files.pipe';
import { CompletedOrdersComponent } from './components/completed-orders/completed-orders.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AvailableOrdersComponent,
    BackendComponent,
    ViewPaperComponent,
    WriterProfileComponent,
    AssignedOrdersComponent,
    MyOrdersComponent,
    UsersComponent,
    ViewUserComponent,
    RatesComponent,
    ViewRateComponent,
    FilterApprovedFilesPipe,
    CompletedOrdersComponent
  ],
  imports: [
    CommonModule,
    BackendRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule
  ]
})
export class BackendModule { }
