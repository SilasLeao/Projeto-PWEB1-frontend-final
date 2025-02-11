import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:3000/news'; // URL do db.json

  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  // Método para atualizar os likes ou dislikes de uma notícia
  updateLikesDislikes(news: News): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${news.id}`, news); // Atualiza a notícia específica
  }
}
