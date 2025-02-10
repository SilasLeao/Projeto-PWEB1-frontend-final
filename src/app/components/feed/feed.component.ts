import { Component } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
  standalone: true
})
export class FeedComponent {
  username: string = '';

  ngOnInit() {
    // Recupera o nome do usuário armazenado no localStorage
    this.username = localStorage.getItem('username') || 'Visitante';
  }
}
