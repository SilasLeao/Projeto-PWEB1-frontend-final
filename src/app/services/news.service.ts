import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';


// Serviço responsável por gerenciar a obtenção e atualização de notícias.
@Injectable({
  providedIn: 'root' // Disponibiliza o serviço em toda a aplicação.
})
export class NewsService {
  private apiUrl = 'http://localhost:8080/posts'; // URL do db.json

  likedPosts = new Set<string>();
  dislikedPosts = new Set<string>();
  userId: string = '';

  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP.
  constructor(private http: HttpClient) {}

  loadUserLikes() {
    const username = localStorage.getItem('username');
    if (!username) return;

    this.http.get<any[]>(`http://localhost:8080/users?username=${username}`).subscribe(users => {
      if (users.length > 0) {
        this.userId = users[0].id;
        // Filtra e extrai apenas os IDs dos likedPosts e dislikedPosts
        this.likedPosts = new Set(users[0].likedPosts.map((post: { id: string; }) => post.id));
        this.dislikedPosts = new Set(users[0].dislikedPosts.map((post: { id: string; }) => post.id));
      }
    }, error => console.error('Erro ao buscar usuário:', error));
  }

  // Incrementa o número de "likes" de uma postagem e atualiza no JSON-Server.
  likePost(news: News) {
    if (this.isPostLiked(news)) {
      this.likedPosts.delete(news.id);
      news.likes--; // Remove like
    } else {
      this.likedPosts.add(news.id);
      news.likes++; // Adiciona like
      if(this.isPostDisliked(news)) {
        this.dislikedPosts.delete(news.id); // Remove dislike se existir
        news.dislikes = Math.max(0, news.dislikes - 1);
      }
    }
    this.updateUserLikesDislikes();
    this.updateLikesDislikes(news).subscribe();
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(news: News) {
    if (this.isPostDisliked(news)) {
      this.dislikedPosts.delete(news.id);
      news.dislikes--; // Remove dislike
    } else {
      this.dislikedPosts.add(news.id);
      news.dislikes++; // Adiciona dislike
      if(this.isPostLiked(news)) {
        this.likedPosts.delete(news.id); // Remove like se existir
        news.likes = Math.max(0, news.likes - 1);
      }
    }
    this.updateUserLikesDislikes();
    this.updateLikesDislikes(news).subscribe();
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
      dislikedPosts: Array.from(this.dislikedPosts),
    };



    this.http.patch(`http://localhost:8080/users/${this.userId}/news`, updateData).subscribe({
      error: err => console.error('Erro ao atualizar usuário:', err)
    });
  }

  // Obtém todas as notícias cadastradas no JSON-Server.
  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  // Atualiza a quantidade de curtidas e descurtidas de uma notícia.
  updateLikesDislikes(news: News): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${news.id}`, news); // Atualiza a notícia específica
  }
}
