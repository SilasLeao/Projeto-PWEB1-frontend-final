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

  likedPosts = new Set<string>(); // Armazena os IDs dos posts curtidos
  dislikedPosts = new Set<string>();
  userId: string = '';

  // Construtor do componente, injeta o serviço de notícias (métodos getNews e updateLikesDislikes) para interagir com o db.json.
  constructor(private newsService: NewsService,  private http: HttpClient) {}

  ngOnInit() {
    this.loadUserLikes();
  }

  loadUserLikes() {
    const username = localStorage.getItem('username');
    if (!username) return;

    this.http.get<any[]>(`http://localhost:3000/users?username=${username}`).subscribe(users => {
      if (users.length > 0) {
        this.userId = users[0].id;
        this.likedPosts = new Set(users[0].likedPosts || []);
        this.dislikedPosts = new Set(users[0].dislikedPosts || []);
      }
    }, error => console.error('Erro ao buscar usuário:', error));
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
    if (this.isPostLiked(news)) {
      this.likedPosts.delete(news.id);
      news.like--; // Remove like
      this.updateUserLikesDislikes();
    } else {
      this.likedPosts.add(news.id);
      news.like++; // Adiciona like
      if(this.isPostDisliked(news)) {
        this.dislikedPosts.delete(news.id); // Remove dislike se existir
        news.dislike = Math.max(0, news.dislike - 1);
      }
      this.updateUserLikesDislikes();
    }
    this.newsService.updateLikesDislikes(news).subscribe();
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(news: News) {
    if (this.isPostDisliked(news)) {
      this.dislikedPosts.delete(news.id);
      news.dislike--; // Remove dislike
      this.updateUserLikesDislikes();
    } else {
      this.dislikedPosts.add(news.id);
      news.dislike++; // Adiciona dislike
      if(this.isPostLiked(news)) {
        this.likedPosts.delete(news.id); // Remove like se existir
        news.like = Math.max(0, news.like - 1);
      }
      this.updateUserLikesDislikes();
    }
    this.newsService.updateLikesDislikes(news).subscribe();
  }

  isPostLiked(news: News): boolean {
    return this.likedPosts.has(news.id);
  }

  isPostDisliked(news: News): boolean {
    return this.dislikedPosts.has(news.id);
  }

  updateUserLikesDislikes() {
    if (!this.userId) return;

    const updateData = {
      likedPosts: Array.from(this.likedPosts),
      dislikedPosts: Array.from(this.dislikedPosts)
    };

    this.http.patch(`http://localhost:3000/users/${this.userId}`, updateData).subscribe({
      error: err => console.error('Erro ao atualizar usuário:', err)
    });
  }
}
