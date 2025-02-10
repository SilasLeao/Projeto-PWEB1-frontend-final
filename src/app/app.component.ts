import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet, RegisterComponent
  ]
})
export class AppComponent {
  title = 'JPOnline';
}
