import {Component, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import '@fortawesome/fontawesome-free/css/all.css';

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
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  logIn() {
    // Validação básica
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

    // Verificar se o email existe no banco de dados
    this.http.get<any[]>(`http://localhost:3000/users?email=${this.email}`).subscribe({
      next: (users) => {
        if (users.length > 0 && users[0].password === this.password) {
          localStorage.setItem('username', users[0].username); // Armazenando o nome do usuário
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
