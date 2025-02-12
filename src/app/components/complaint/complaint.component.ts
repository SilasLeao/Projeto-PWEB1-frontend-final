import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintInsertComponent } from '../complaint-insert/complaint-insert.component';
import { Complaints } from '../../models/complaints.model';
import { ComplaintsService } from '../../services/complaints.service';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {ComplaintListComponent} from '../complaint-list/complaint-list.component';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import { FormService } from '../../services/form.service';

// Componente responsável pelo feed de denúncias da aplicação.
@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [
    ComplaintInsertComponent,
    MatIcon,
    MatMenu,
    ComplaintListComponent,
    MatMenuTrigger,
    MatMenuItem,
    MatFabButton,
    MatIconButton,
    NgIf
  ],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})

export class ComplaintComponent implements OnInit {
  // Nome do usuário logado.
  username: string = '';

  // Lista de denúncias carregadas do JSON-Server.
  complaintsList: Complaints[] = [];

  // Flag que controla se o formulário de denúncia está aberto ou fechado.
  formOpen: boolean = false;

  // serviço de denúncias (metodos getComplaints, addComplaints e updateLikesDislikes),
  // router para roteamento das páginas da aplicação e
  // serviço do formulário que gerencia a visibilidade do formulário.
  constructor(private complaintsService: ComplaintsService, private router: Router, private formService: FormService) {}

  // Inicializa o componente.
  ngOnInit() {
    // Carrega o nome do usuário do 'localStorage'.
    this.username = localStorage.getItem('username') || 'Visitante';
    this.loadComplaints();
  }

  // Carrega a lista de denúncias do JSON-Server.
  loadComplaints() {
    this.complaintsService.getComplaints().subscribe((data: Complaints[]) => {
      this.complaintsList = data;
    });
  }

  // Abre o formulário
  openForm() {
    this.formOpen = true;
    this.formService.openForm();
  }

  // Fecha o formulário
  closeForm() {
    this.formOpen = false;
    this.formService.closeForm();
  }

  // Metodo chamado quando uma nova denúncia é adicionada com sucesso.
  complaintAdded(complaint: Complaints) {
    this.complaintsList.push(complaint); // Adiciona a denúncia à lista
    this.closeForm(); // Fecha o formulário
  }

  // Navega para a tela de feed de denúncias.
  navigateToFeed() {
    this.router.navigate(['/feed']);
  }

  // Navega para a tela do calendário de eventos.
  navigateToSchedule() {
    this.router.navigate(['/schedule']);
  }

  // Realiza o logout do usuário
  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
