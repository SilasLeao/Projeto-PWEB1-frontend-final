import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {AppModule} from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    AppModule
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JPOnline';
}
