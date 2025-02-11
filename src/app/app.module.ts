import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module'; // Importando corretamente
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FeedComponent } from './components/feed/feed.component';
import {BrowserModule} from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RegisterComponent,
    LoginComponent,
    MatInputModule, // Adicionando o MatInputModule
    MatFormFieldModule, // Adicionando o MatFormFieldModule
    MatButtonModule, // Adicionando o MatButtonModule
    MatIconModule, // Adicionando o MatIconModule
  ],
  providers: [],
  exports: [
    RegisterComponent
  ],
  bootstrap: []
})
export class AppModule { }
