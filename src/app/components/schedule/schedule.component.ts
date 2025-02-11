import { Component, OnInit  } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {PostListComponent} from '../post-list/post-list.component';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import {NewsService} from '../../services/news.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-schedule',
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit {
  username: string = '';
  currentMonth: number = 0;
  currentYear: number = 0;
  monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  calendar: number[][] = [];
  events: { [key: string]: string[] } = {};

  constructor(private router: Router, private http: HttpClient) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
  }

  ngOnInit() {
    // Recupera o nome do usuário armazenado no localStorage
    this.username = localStorage.getItem('username') || 'Visitante';
    this.loadEvents();
    this.generateCalendar();
  }

  loadEvents() {
    this.http.get<{ id: string, date: string, description: string[] }[]>('http://localhost:3000/events')
      .subscribe(data => {
        this.events = data.reduce((acc, event) => {
          acc[event.date] = event.description;
          return acc;
        }, {} as { [key: string]: string[] });
      });
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    let dayCounter = 1;
    this.calendar = [];

    for (let week = 0; week < 6; week++) {
      let row: number[] = [];
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < firstDay) || dayCounter > daysInMonth) {
          row.push(0);
        } else {
          row.push(dayCounter++);
        }
      }
      this.calendar.push(row);
      if (dayCounter > daysInMonth) break;
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  getEvents(day: number): string[] {
    const dateKey = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.events[dateKey] || [];
  }

  navigateToComplaint() {
    this.router.navigate(['/complaint']);
  }

  navigateToFeed() {
    this.router.navigate(['/feed']);
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
