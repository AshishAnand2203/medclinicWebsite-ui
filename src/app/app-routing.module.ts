import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { GeneralPractitionersComponent } from './pages/general-practitioners/general-practitioners.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Medclinic Family Practice',
  },

  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    title: 'About Us | Medclinic Family Practice',
  },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: 'services/:slug',
    component: ServiceDetailComponent,
  },
  {
    path: 'pharmacy-medical-centre-warringah-mall-brookvale',
    component: PharmacyComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
},
{
    path: 'thank-you',
    component: ThankYouComponent
},
{
        path: 'policy',
        component: PrivacyPolicyComponent
    },
{
        path: 'general-practitioners',
        component: GeneralPractitionersComponent
    },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],

  exports: [RouterModule],
})
export class AppRoutingModule {}
