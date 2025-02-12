import { Component, OnInit  } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news.model';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {PostListComponent} from '../post-list/post-list.component';

// Componente responsável pelo feed de notícias da aplicação.
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    PostListComponent,
  ]
})
export class FeedComponent implements OnInit {
  // Armazena o nome do usuário logado.
  username: string = '';
  // Lista de notícias carregadas do serviço.
  newsList: News[] = [];

  // Construtor do componente, injeta o serviço de notícias (métodos getNews e updateLikesDislikes) para interagir com o db.json e o router para roteamento entre as páginas.
  constructor(private newsService: NewsService, private router: Router) {}

  // Metodo chamado ao inicializar o componente.
  ngOnInit() {
    // Recupera o nome do usuário armazenado no localStorage
    this.username = localStorage.getItem('username') || 'Visitante';
    this.loadNews();
  }

  // Carrega as notícias chamando o serviço de notícias.
  loadNews() {
    this.newsService.getNews().subscribe((data: News[]) => {
      this.newsList = data;
    });
  }

  // Navega para a página de denúncia.
  navigateToComplaint() {
    this.router.navigate(['/complaint']);
  }

  // Navega para a página do calendário de eventos.
  navigateToSchedule() {
    this.router.navigate(['/schedule']);
  }

  // Realiza o logout do usuário, removendo seu nome do localStorage e redirecionando para a página de login.
  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
