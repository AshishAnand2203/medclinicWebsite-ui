import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AppointmentCtaComponent } from './components/appointment-cta/appointment-cta.component';
import { ServicesComponent } from './pages/services/services.component';
import { InnerPageHeaderComponent } from './components/inner-page-header/inner-page-header.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { PharmacyComponent } from './pages/pharmacy/pharmacy.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { GeneralPractitionersComponent } from './pages/general-practitioners/general-practitioners.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutUsComponent,
    AppointmentCtaComponent,
    ServicesComponent,
    InnerPageHeaderComponent,
    ServiceDetailComponent,
    PharmacyComponent,
    ContactUsComponent,
    ThankYouComponent,
    PrivacyPolicyComponent,
    GeneralPractitionersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
