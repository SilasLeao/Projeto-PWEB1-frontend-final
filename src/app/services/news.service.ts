import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';


// Serviço responsável por gerenciar a obtenção e atualização de notícias.
@Injectable({
  providedIn: 'root' // Disponibiliza o serviço em toda a aplicação.
})
export class NewsService {
  private apiUrl = 'http://localhost:3000/news'; // URL do db.json

  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP.
  constructor(private http: HttpClient) {}

  // Obtém todas as notícias cadastradas no JSON-Server.
  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  // Atualiza a quantidade de curtidas e descurtidas de uma notícia.
  updateLikesDislikes(news: News): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${news.id}`, news); // Atualiza a notícia específica
  }
}
