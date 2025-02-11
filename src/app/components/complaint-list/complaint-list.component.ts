import { Component, Input, OnInit } from '@angular/core';

import {MatIcon} from '@angular/material/icon';  // Ajuste o caminho conforme necessário
import { ComplaintsService } from '../../services/complaints.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Complaints} from '../../models/complaints.model';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.css'],
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    MatButton
  ]
})
export class ComplaintListComponent implements OnInit {
  @Input() complaintsList: Complaints[] = [];

  constructor(private complaintsService: ComplaintsService) {}

  ngOnInit(): void {}

  toggleExpand(complaints: Complaints) {
    complaints.expanded = !complaints.expanded;
  }

  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  likePost(complaints: Complaints) {
    complaints.like++;
    this.complaintsService.updateLikesDislikes(complaints).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o like:', err);
      }
    });
  }

  dislikePost(complaints: Complaints) {
    complaints.dislike++;
    this.complaintsService.updateLikesDislikes(complaints).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o dislike:', err);
      }
    });
  }
}
