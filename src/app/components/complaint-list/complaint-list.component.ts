import { Component, Input, OnInit } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import { ComplaintsService } from '../../services/complaints.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Complaints} from '../../models/complaints.model';

// Componente responsável pela listagem de denúncias feitas pelos usuários.
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
export class ComplaintListComponent {

  // Lista de denúncias recebidas como entrada do componente pai.
  @Input() complaintsList: Complaints[] = [];

  // Construtor do componente, injeta o serviço de denúncias (metodos getComplaints, addComplaints e updateLikesDislikes) para interagir com o db.json.
  constructor(private complaintsService: ComplaintsService) {}

  // Alterna o estado de expansão da denúncia para mostrar/ocultar o texto completo.
  toggleExpand(complaints: Complaints) {
    complaints.expanded = !complaints.expanded;
  }

  // Converte quebras de linha em '<br>' para exibição correta no HTML.
  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  // Incrementa o número de "likes" de uma postagem e atualiza no JSON-Server.
  likePost(complaints: Complaints) {
    complaints.like++;
    this.complaintsService.updateLikesDislikes(complaints).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o like:', err);
      }
    });
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(complaints: Complaints) {
    complaints.dislike++;
    this.complaintsService.updateLikesDislikes(complaints).subscribe({
      error: (err) => {
        console.error('Erro ao atualizar o dislike:', err);
      }
    });
  }
}
