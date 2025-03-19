import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MessageService} from '../../services/message.service';


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

  // Construtor do componente, injeta o HttpClient para fazer requisições HTTP e o Router para permitir roteamento entre as páginas
  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {}


  registerUser() {
    // Validação básica de preenchimento dos campos
    if (!this.username || !this.email || !this.password) {
      this.messageService.showMessage('Por favor, preencha todos os campos.', 'error');
      return;
    }

    // Validação de email (usando expressão regular)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.messageService.showMessage('Por favor, insira um email válido.', 'error');
      return;
    }
    // Chama o backend para verificar se o email já está registrado
    this.http.get<boolean>(`http://localhost:8080/checkEmail?email=${this.email}`).subscribe({
      next: (isEmailTaken) => {
        // Se o email já estiver registrado, exibe a mensagem de erro
        if (isEmailTaken) {
          this.messageService.showMessage('Este email já está cadastrado.', 'error');
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
              this.messageService.showMessage('Erro ao cadastrar usuário. Tente novamente.', 'error');
              console.error(err);
            }
          });
        }
      },
      error: (err) => {
        this.messageService.showMessage('Erro ao verificar email. Tente novamente.', 'error');
        console.error(err);
      }
    });
  }
}
