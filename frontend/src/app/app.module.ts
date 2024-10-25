import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopHeaderComponent } from './top-header/top-header.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MobilefooterComponent } from './mobile/mobilefooter/mobilefooter.component';
import { MobilenavComponent } from './mobile/mobilenav/mobilenav.component';
import { HomeComponent } from './home/home.component';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FantasyComponent } from './fantasy/fantasy.component';
// import { NewsDetailComponent } from './news-detail/news-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TopHeaderComponent,
    HeaderComponent,
    FooterComponent,
    MobilefooterComponent,
    MobilenavComponent,
    HomeComponent,
    FantasyComponent,
    // NewsDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
