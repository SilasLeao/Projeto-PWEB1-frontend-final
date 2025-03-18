import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import { ComplaintsService } from '../../services/complaints.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Complaints} from '../../models/complaints.model';
import {HttpClient} from '@angular/common/http';
import {FormService} from '../../services/form.service';
import { ComplaintComponent } from '../complaint/complaint.component';
import {UsersService} from '../../services/users.service';

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





  // Construtor do componente, injeta o serviço de denúncias (metodos getComplaints, addComplaints e updateLikesDislikes) para interagir com o db.json.
  constructor(private complaintsService: ComplaintsService, private http: HttpClient, private formService: FormService, private usersService: UsersService) {}

  ngOnInit() {
    this.loadUserLikes();
  }

  loadUserLikes() {
    this.complaintsService.loadUserLikes();
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
    this.complaintsService.likePost(complaints);
  }

  // Incrementa o número de "dislikes" de uma postagem e atualiza no JSON-Server.
  dislikePost(complaints: Complaints) {
    this.complaintsService.dislikePost(complaints);
  }

  deleteComplaint(complaints: Complaints, complaintsList: Complaints[]) {
    this.complaintsService.deleteComplaint(complaints, complaintsList)
  }

  isPostLiked(complaints: Complaints): boolean {
    return this.complaintsService.isPostLiked(complaints)
  }

  isPostDisliked(complaints: Complaints): boolean {
    return this.complaintsService.isPostDisliked(complaints)
  }

  // Abre o formulário
  openForm(complaints: Complaints) {
    this.complaintsService.openForm(complaints)
  }

  // Fecha o formulário
  closeForm() {
    this.formService.closeUpdateForm();
  }
}
