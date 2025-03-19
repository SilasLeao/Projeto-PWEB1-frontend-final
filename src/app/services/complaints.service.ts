import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaints } from '../models/complaints.model';
import {UsersService} from './users.service';
import {FormService} from './form.service';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root' // Disponibiliza o serviço em toda a aplicação.
})
export class ComplaintsService {
  private apiUrl = 'http://localhost:8080/complaints'; // URL do db.json

  likedComplaints = new Set<string>();
  dislikedComplaints = new Set<string>();
  userId: string = '';
  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP.
  constructor(private http: HttpClient, private usersService: UsersService, private formService: FormService, private messageService: MessageService) {}

  loadUserLikes() {
    const username = localStorage.getItem('username');
    if (!username) return;

    this.http.get<any[]>(`http://localhost:8080/users?username=${username}`).subscribe(users => {
      if (users.length > 0) {
        this.userId = users[0].id;
        // Filtra e extrai apenas os IDs dos likedPosts e dislikedPosts
        this.likedComplaints = new Set(users[0].likedComplaints.map((post: { id: string; }) => post.id));
        this.dislikedComplaints = new Set(users[0].dislikedComplaints.map((post: { id: string; }) => post.id));
      }
    });
  }

  // Incrementa o número de "likes" de uma postagem e atualiza no JSON-Server.
  likePost(complaints: Complaints) {
    if (this.isPostLiked(complaints)) {
      this.likedComplaints.delete(complaints.id);
      complaints.likes--; // Remove like

    } else {
      this.likedComplaints.add(complaints.id);
      complaints.likes++; // Adiciona like
      if(this.isPostDisliked(complaints)) {
        this.dislikedComplaints.delete(complaints.id); // Remove dislike se existir
        complaints.dislikes = Math.max(0, complaints.dislikes - 1);
      }
    }
    this.updateUserLikesDislikes();
    this.updateLikesDislikes(complaints).subscribe();
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(complaints: Complaints) {
    if (this.isPostDisliked(complaints)) {
      this.dislikedComplaints.delete(complaints.id);
      complaints.dislikes--; // Remove dislike
    } else {
      this.dislikedComplaints.add(complaints.id);
      complaints.dislikes++; // Adiciona dislike
      if(this.isPostLiked(complaints)) {
        this.likedComplaints.delete(complaints.id); // Remove like se existir
        complaints.likes = Math.max(0, complaints.likes - 1);
      }
    }
    this.updateUserLikesDislikes();
    this.updateLikesDislikes(complaints).subscribe();
  }

  updateUserLikesDislikes() {
    if (!this.userId) return;


    const updateData = {
      likedComplaints: Array.from(this.likedComplaints),
      dislikedComplaints: Array.from(this.dislikedComplaints),
    };

    this.http.patch(`http://localhost:8080/users/${this.userId}/complaints`, updateData).subscribe({
      error: err => console.error('Erro ao atualizar usuário:', err)
    });
  }

  deleteComplaint(complaints: Complaints, complaintsList: Complaints[]) {
    this.usersService.getUserById(this.userId).subscribe(user => {
      if (!user || user.email !== complaints.userEmail) {
        this.messageService.showMessage('Você não tem permissão para excluir esta denúncia!', 'error');
        return;
      }

      // Confirmar se o usuário deseja realmente excluir a denúncia
      if (confirm('Tem certeza de que deseja excluir esta denúncia?')) {
        // Fazer a requisição DELETE para o JSON-Server
        this.http.delete(`http://localhost:8080/complaints/${complaints.id}`).subscribe(
          () => {
            // Se a requisição for bem-sucedida, remover a denúncia da lista localmente
            complaintsList = complaintsList.filter(c => c.id !== complaints.id);
            this.messageService.showMessage('Denúncia excluída com sucesso.', 'success');
          },
          error => console.error('Erro ao excluir denúncia:', error)
        );


      }
    }, error => console.error('Erro ao buscar usuário:', error));
  }

  isPostLiked(complaints: Complaints): boolean {
    return this.likedComplaints.has(complaints.id);
  }

  isPostDisliked(complaints: Complaints): boolean {
    return this.dislikedComplaints.has(complaints.id);
  }

  // Abre o formulário
  openForm(complaints: Complaints) {
    this.usersService.getUserById(this.userId).subscribe(user => {
      if (!user || user.email !== complaints.userEmail) {
        this.messageService.showMessage('Você não tem permissão para editar esta denúncia!', 'error');
        return;
      }

      this.formService.openUpdateForm(complaints);
    }, error => console.error('Erro ao buscar usuário:', error));
  }

  // Obtém todas as denúncias cadastradas no JSON-Server.
  getComplaints(): Observable<Complaints[]> {
    return this.http.get<Complaints[]>(this.apiUrl);
  }

  // Adiciona uma denúncia ao JSON-Server
  addComplaint(complaint: Complaints): Observable<Complaints> {
    return this.http.post<Complaints>(this.apiUrl, complaint);
  }

  // Atualiza a quantidade de curtidas e descurtidas de uma denúncia.
  updateLikesDislikes(complaints: Complaints): Observable<Complaints> {
    return this.http.put<Complaints>(`${this.apiUrl}/${complaints.id}`, complaints); // Atualiza a denúncia específica
  }

  updateComplaint(complaint: Complaints) {
    return this.http.put<Complaints>(`http://localhost:8080/complaints/${complaint.id}`, complaint);
  }

}
