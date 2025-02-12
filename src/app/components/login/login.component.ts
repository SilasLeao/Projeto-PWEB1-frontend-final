import {Component, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import '@fortawesome/fontawesome-free/css/all.css';


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
  // Mensagem de erro exibida caso ocorra alguma falha no login.
  errorMessage: string = '';

  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP e o Router para permitir roteamento entre as páginas
  constructor(private http: HttpClient, private router: Router) {}

  logIn() {
    // Validação básica de preenchimento dos campos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    // Validação de email (usando expressão regular)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, insira um email válido.';
      return;
    }

    // Verificar se o email existe no banco de dados e se a senha está correta.
    this.http.get<any[]>(`http://localhost:3000/users?email=${this.email}`).subscribe({
      next: (users) => {
        if (users.length > 0 && users[0].password === this.password) {
          localStorage.setItem('username', users[0].username); // Armazena o nome do usuário no localStorage para ser exibido posteriormente
          this.router.navigate(['/feed']); // Redireciona para a página de feed
        } else {
          this.errorMessage = 'Email ou senha inválidos';
        }
      },
      error: (err) => {
        this.errorMessage = 'Erro ao verificar usuário. Tente novamente.';
        console.error(err);
      }
    });
  }
}
