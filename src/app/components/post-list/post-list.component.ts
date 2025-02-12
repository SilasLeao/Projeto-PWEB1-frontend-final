import { Component, Input, OnInit } from '@angular/core';
import { News } from '../../models/news.model';
import {MatIcon} from '@angular/material/icon';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';


// Componente para listagem de notícias.
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    MatButton
  ]
})
export class PostListComponent {

  // Lista de notícias recebida como entrada do componente pai.
  @Input() newsList: News[] = [];

  // Construtor do componente, injeta o serviço de notícias (métodos getNews e updateLikesDislikes) para interagir com o db.json.
  constructor(private newsService: NewsService) {}

  // Alterna o estado de expansão da notícia para mostrar/ocultar o texto completo.
  toggleExpand(news: News) {
    news.expanded = !news.expanded;
  }

  // Converte quebras de linha em '<br>' para exibição correta no HTML.
  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  // Incrementa o número de "likes" de uma postagem e atualiza no JSON-Server.
  likePost(news: News) {
    news.like++;
    this.newsService.updateLikesDislikes(news).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o like:', err);
      }
    });
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(news: News) {
    news.dislike++;
    this.newsService.updateLikesDislikes(news).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o dislike:', err);
      }
    });
  }
}
