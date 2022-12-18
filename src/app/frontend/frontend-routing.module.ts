import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CompleteWriterRegistrationComponent } from './components/complete-writer-registration/complete-writer-registration.component';
import { FrontendComponent } from './components/frontend/frontend.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';

const routes: Routes = [
  {
    path: '',
    component: FrontendComponent,
    children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'home',
        component: LandingPageComponent,
      },
      {
        path: 'order',
        component: PlaceOrderComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'complete-registration',
        component: CompleteWriterRegistrationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
