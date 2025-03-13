import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import { ComplaintsService } from '../../services/complaints.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Complaints} from '../../models/complaints.model';
import {HttpClient} from '@angular/common/http';
import {FormService} from '../../services/form.service';
import { ComplaintComponent } from '../complaint/complaint.component';

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
export class ComplaintListComponent implements OnInit {
  // Lista de denúncias recebidas como entrada do componente pai.
  @Input() complaintsList: Complaints[] = [];

  teste = ComplaintComponent
  likedPosts = new Set<string>(); // Armazena os IDs dos posts curtidos
  dislikedPosts = new Set<string>();
  userId: string = '';

  // Construtor do componente, injeta o serviço de denúncias (metodos getComplaints, addComplaints e updateLikesDislikes) para interagir com o db.json.
  constructor(private complaintsService: ComplaintsService, private http: HttpClient, private formService: FormService) {}

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
    if (this.isPostLiked(complaints)) {
      this.likedPosts.delete(complaints.id);
      complaints.like--; // Remove like
      this.updateUserLikesDislikes();
    } else {
      this.likedPosts.add(complaints.id);
      complaints.like++; // Adiciona like
      if(this.isPostDisliked(complaints)) {
        this.dislikedPosts.delete(complaints.id); // Remove dislike se existir
        complaints.dislike = Math.max(0, complaints.dislike - 1);
      }
      this.updateUserLikesDislikes();
    }
    this.complaintsService.updateLikesDislikes(complaints).subscribe();
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(complaints: Complaints) {
    if (this.isPostDisliked(complaints)) {
      this.dislikedPosts.delete(complaints.id);
      complaints.dislike--; // Remove dislike
      this.updateUserLikesDislikes();
    } else {
      this.dislikedPosts.add(complaints.id);
      complaints.dislike++; // Adiciona dislike
      if(this.isPostLiked(complaints)) {
        this.likedPosts.delete(complaints.id); // Remove like se existir
        complaints.like = Math.max(0, complaints.like - 1);
      }
      this.updateUserLikesDislikes();
    }
    this.complaintsService.updateLikesDislikes(complaints).subscribe();
  }

  isPostLiked(complaints: Complaints): boolean {
    return this.likedPosts.has(complaints.id);
  }

  isPostDisliked(complaints: Complaints): boolean {
    return this.dislikedPosts.has(complaints.id);
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

  // Abre o formulário
  openForm() {
    this.formService.openUpdateForm();
  }

  // Fecha o formulário
  closeForm() {
    this.formService.closeUpdateForm();
  }
}
