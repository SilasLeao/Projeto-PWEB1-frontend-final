import {Component, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import '@fortawesome/fontawesome-free/css/all.css';
import {MessageService} from '../../services/message.service';


// Componente responsável pelo formulário de login do usuário.
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule
  ],
  standalone: true
})

export class LoginComponent {
  // Armazena o email e senha digitados pelo usuário.
  email: string = '';
  password: string = '';

  // Construtor do componente, injeta o HttpClient para fazer requisições HTTP e o Router para permitir roteamento entre as páginas
  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {}

  logIn() {
    // Validação básica de preenchimento dos campos
    if (!this.email || !this.password) {
      this.messageService.showMessage('Por favor, preencha todos os campos.', 'error');
      return;
    }

    // Validação de email (usando expressão regular)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.messageService.showMessage('Por favor, insira um email válido.', 'error');
      return;
    }

    // Enviando requisição para o backend
    this.http.post<any>('http://localhost:8080/login', { email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('username', response.username);
        this.messageService.showMessage('Login realizado com sucesso.', 'success');
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        this.messageService.showMessage('Email ou senha inválidos.', 'error');
        console.error(err);
      }
    });
  }
}
