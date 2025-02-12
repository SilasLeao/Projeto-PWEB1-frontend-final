import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';


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

  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP e o Router para permitir roteamento entre as páginas
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

    // Verificar se o email já está cadastrado no db.json
    this.http.get<any[]>(`http://localhost:3000/users?email=${this.email}`).subscribe({
      next: (users) => {
        if (users.length > 0) {
          // Se o email já estiver em uso, exibe uma mensagem de erro
          this.errorMessage = 'Este email já está cadastrado.';
          return;
        }

        // Caso contrário, cria o novo usuário
        const newUser = {
          username: this.username,
          email: this.email,
          password: this.password
        };

        // Enviando para o db.json
        this.http.post('http://localhost:3000/users', newUser).subscribe({
          next: () => {
            alert('Cadastro realizado com sucesso!');
            localStorage.setItem('username', this.username); // Armazena o nome do usuário no localStorage para ser exibido posteriormente
            this.router.navigate(['/feed']); // Redireciona para a página de notícias
          },
          error: (err) => {
            this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Erro ao verificar email. Tente novamente.';
        console.error(err);
      }
    });
  }
}
