import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UsersService} from '../../services/users.service';


// Componente responsável pelo registro de novos usuários.
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class RegisterComponent {
  // // Campos para capturar as informações do usuário
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Mensagem de erro a ser exibida em caso de falha

  // Construtor do componente, injeta o HttpClient para fazer requisições HTTP e o Router para permitir roteamento entre as páginas
  constructor(private http: HttpClient, private router: Router) {}


  registerUser() {
    // Validação básica de preenchimento dos campos
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    // Validação de email (usando expressão regular)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, insira um email válido.';
      return;
    }
    // Chama o backend para verificar se o email já está registrado
    this.http.get<boolean>(`http://localhost:8080/checkEmail?email=${this.email}`).subscribe({
      next: (isEmailTaken) => {
        // Se o email já estiver registrado, exibe a mensagem de erro
        if (isEmailTaken) {
          this.errorMessage = 'Este email já está cadastrado.';
        } else {
          // Caso o email não esteja registrado, faz o cadastro do usuário
          const newUser = {
            username: this.username,
            email: this.email,
            password: this.password,
            likedPosts: [],
            dislikedPosts: []
          };

          // Enviar o novo usuário para o backend
          this.http.post('http://localhost:8080/users', newUser).subscribe({
            next: () => {
              alert('Cadastro realizado com sucesso!');
              localStorage.setItem('username', this.username);
              this.router.navigate(['/feed']);
            },
            error: (err) => {
              this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
              console.error(err);
            }
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Erro ao verificar email. Tente novamente.';
        console.error(err);
      }
    });
  }
}
