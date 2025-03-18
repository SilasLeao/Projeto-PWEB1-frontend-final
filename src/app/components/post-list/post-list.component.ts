import { Component, Input, OnInit } from '@angular/core';
import { News } from '../../models/news.model';
import {MatIcon} from '@angular/material/icon';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

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
export class PostListComponent implements OnInit {
  // Lista de notícias recebida como entrada do componente pai.
  @Input() newsList: News[] = [];

  // Construtor do componente, injeta o serviço de notícias (métodos getNews e updateLikesDislikes) para interagir com o db.json.
  constructor(private newsService: NewsService,  private http: HttpClient) {}

  ngOnInit() {
    this.loadUserLikes();
  }

  loadUserLikes() {
    this.newsService.loadUserLikes();
  }

  isPostLiked(news: News): boolean {
    return this.newsService.isPostLiked(news);
  }

  isPostDisliked(news: News): boolean {
    return this.newsService.isPostDisliked(news);
  }

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
    this.newsService.likePost(news);
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(news: News) {
    this.newsService.dislikePost(news)
  }

  updateUserLikesDislikes() {
    this.newsService.updateUserLikesDislikes();
  }

}
