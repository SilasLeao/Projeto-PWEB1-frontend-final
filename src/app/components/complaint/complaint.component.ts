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
  username: string = '';
  complaintsList: Complaints[] = [];
  formOpen: boolean = false;

  constructor(private complaintsService: ComplaintsService, private router: Router, private formService: FormService) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Visitante';
    this.loadComplaints();
  }

  loadComplaints() {
    this.complaintsService.getComplaints().subscribe((data: Complaints[]) => {
      this.complaintsList = data;
    });
  }

  openForm() {
    this.formOpen = true;
    this.formService.openForm();
  }

  closeForm() {
    this.formOpen = false;
    this.formService.closeForm();
  }

  complaintAdded(complaint: Complaints) {
    this.complaintsList.push(complaint); // Adiciona a denúncia à lista
    this.closeForm(); // Fecha o formulário
  }

  navigateToFeed() {
    this.router.navigate(['/feed']);
  }

  navigateToSchedule() {
    this.router.navigate(['/schedule']);
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
