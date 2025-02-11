import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news.model';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {ComplaintListComponent} from '../complaint-list/complaint-list.component';
import {Complaints} from '../../models/complaints.model';
import {ComplaintsService} from '../../services/complaints.service';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    ComplaintListComponent,
    MatMenuTrigger
  ],
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css'
})
export class ComplaintComponent implements OnInit{
  username: string = '';
  complaintsList: Complaints[] = [];

  constructor(private complaintsService: ComplaintsService, private router: Router) {}
  ngOnInit() {
    // Recupera o nome do usuário armazenado no localStorage
    this.username = localStorage.getItem('username') || 'Visitante';
    this.loadComplaints();
  }

  loadComplaints() {
    this.complaintsService.getComplaints().subscribe((data: Complaints[]) => {
      this.complaintsList = data;
    });
  }

  navigateToFeed() {
    this.router.navigate(['/feed']);
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
