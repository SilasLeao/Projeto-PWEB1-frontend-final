import { Component, OnInit  } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news.model';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {PostListComponent} from '../post-list/post-list.component';

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
  username: string = '';
  newsList: News[] = [];

  constructor(private newsService: NewsService, private router: Router) {}
  ngOnInit() {
    // Recupera o nome do usuário armazenado no localStorage
    this.username = localStorage.getItem('username') || 'Visitante';
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews().subscribe((data: News[]) => {
      this.newsList = data;
    });
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
