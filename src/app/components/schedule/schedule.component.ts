import { Component, OnInit  } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';


// Componente responsável por exibir e gerenciar um calendário de eventos.
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

  // Nome do usuário logado
  username: string = '';

  // Variáveis para controle
  currentMonth: number = 0;
  currentYear: number = 0;
  monthNames: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  weekDays: string[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Estrutura do calendário
  calendar: number[][] = [];

  // Eventos armazenados por data
  events: { [key: string]: string[] } = {};

  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP e o Router para permitir roteamento entre as páginas
  constructor(private router: Router, private http: HttpClient) {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
  }

  // Metodo executado na inicialização do componente.
  ngOnInit() {
    // Recupera o nome do usuário armazenado no localStorage
    this.username = localStorage.getItem('username') || 'Visitante';
    // Carrega os eventos do db.json
    this.loadEvents();
    this.generateCalendar();
  }

  // Carrega os eventos do servidor e os organiza por data.
  loadEvents() {
    this.http.get<{ id: string, date: string, description: string[] }[]>('http://localhost:3000/events')
      .subscribe(data => {
        this.events = data.reduce((acc, event) => {
          acc[event.date] = event.description;
          return acc;
        }, {} as { [key: string]: string[] });
      });
  }

  // Gera a estrutura do calendário para o mês e ano atual.
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

  // Alterna para o mês anterior e gera o calendário novamente.
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  // Alterna para o mês seguinte e gera o calendário novamente.
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  // Retorna os eventos associados a um determinado dia.
  getEvents(day: number): string[] {
    const dateKey = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return this.events[dateKey] || [];
  }

  // Navega para a página de denúncias.
  navigateToComplaint() {
    this.router.navigate(['/complaint']);
  }

  // Navega para a página de notícias.
  navigateToFeed() {
    this.router.navigate(['/feed']);
  }

  // Realiza o logout do usuário e redireciona para a tela de login.
  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
