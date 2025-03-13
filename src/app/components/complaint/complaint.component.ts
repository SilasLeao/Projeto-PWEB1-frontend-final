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
import {ComplaintUpdateComponent} from '../complaint-update/complaint-update.component';
import { Subscription } from 'rxjs';

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
    NgIf,
    ComplaintUpdateComponent
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
  insertFormOpen: boolean = false;
  updateFormOpen: boolean = false;

  private insertFormSubscription!: Subscription;
  private updateFormSubscription!: Subscription;

  // serviço de denúncias (metodos getComplaints, addComplaints e updateLikesDislikes),
  // router para roteamento das páginas da aplicação e
  // serviço do formulário que gerencia a visibilidade do formulário.
  constructor(private complaintsService: ComplaintsService, private router: Router, private formService: FormService) {}

  // Inicializa o componente.
  ngOnInit() {
    // Carrega o nome do usuário do 'localStorage'.
    this.username = localStorage.getItem('username') || 'Visitante';
    this.loadComplaints();

    // **Assinando os observables para atualizar automaticamente as variáveis**
    this.insertFormSubscription = this.formService.isInsertFormVisible$.subscribe(
      (isVisible) => this.insertFormOpen = isVisible
    );

    this.updateFormSubscription = this.formService.isUpdateFormVisible$.subscribe(
      (isVisible) => this.updateFormOpen = isVisible
    );
  }

  ngOnDestroy() {
    // **Evita vazamento de memória ao desinscrever**
    if (this.insertFormSubscription) {
      this.insertFormSubscription.unsubscribe();
    }
    if (this.updateFormSubscription) {
      this.updateFormSubscription.unsubscribe();
    }
  }

  // Carrega a lista de denúncias do JSON-Server.
  loadComplaints() {
    this.complaintsService.getComplaints().subscribe((data: Complaints[]) => {
      this.complaintsList = data;
    });
  }

  openInsertForm() {
    this.formService.openInsertForm();
  }

  closeInsertForm() {
    this.formService.closeInsertForm();
  }

  closeUpdateForm() {
    this.formService.closeUpdateForm();
  }

  // Metodo chamado quando uma nova denúncia é adicionada com sucesso.
  complaintAdded(complaint: Complaints) {
    this.complaintsList.push(complaint); // Adiciona a denúncia à lista
  }

  onComplaintUpdated(updatedComplaint: Complaints) {

    this.loadComplaints();
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
