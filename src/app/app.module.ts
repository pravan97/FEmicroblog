  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClientModule } from '@angular/common/http';
  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { HomeComponent } from './home/home/home.component';
  import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { RegistrationModule } from './registration/registration.module';
import { LoginModule } from './login/login.module';

  @NgModule({
    declarations: [
      AppComponent,
    ],
    imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      HomeModule,
      BrowserAnimationsModule,
      MaterialModule,
      FormsModule,
      RegistrationModule,
      LoginModule
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }