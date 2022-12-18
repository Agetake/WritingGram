import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontendRoutingModule } from './frontend-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './dialogs/login/login.component';
import { RegisterComponent } from './dialogs/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PriceCalculatorComponent } from './components/price-calculator/price-calculator.component';
import { FrontendComponent } from './components/frontend/frontend.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CompleteWriterRegistrationComponent } from './components/complete-writer-registration/complete-writer-registration.component';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    PriceCalculatorComponent,
    FrontendComponent,
    PlaceOrderComponent,
    CheckoutComponent,
    CompleteWriterRegistrationComponent
  ],
  imports: [
    CommonModule,
    FrontendRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatDatepickerModule
  ]
})
export class FrontendModule { }
