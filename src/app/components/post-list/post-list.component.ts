import { Component, Input, OnInit } from '@angular/core';
import { News } from '../../models/news.model';
import {MatIcon} from '@angular/material/icon';  // Ajuste o caminho conforme necessário
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';

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
  @Input() newsList: News[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {}

  toggleExpand(news: News) {
    news.expanded = !news.expanded;
  }

  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  likePost(news: News) {
    news.like++;
    this.newsService.updateLikesDislikes(news).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o like:', err);
      }
    });
  }

  dislikePost(news: News) {
    news.dislike++;
    this.newsService.updateLikesDislikes(news).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o dislike:', err);
      }
    });
  }
}
