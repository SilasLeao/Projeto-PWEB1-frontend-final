import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { CommonModule } from '@angular/common'; // Importe o CommonModule

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] // Adicione FormsModule nos imports
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  registerUser() {
    // Validação básica
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    // Verificar se o email já está cadastrado
    this.http.get<any[]>(`http://localhost:3000/users?email=${this.email}`).subscribe({
      next: (users) => {
        if (users.length > 0) {
          // Se encontrar usuários com o mesmo email, exibe uma mensagem de erro
          this.errorMessage = 'Este email já está cadastrado.';
          return;
        }

        // Caso contrário, criar o novo usuário
        const newUser = {
          username: this.username,
          email: this.email,
          password: this.password
        };

        // Enviando para o db.json
        this.http.post('http://localhost:3000/users', newUser).subscribe({
          next: () => {
            alert('Cadastro realizado com sucesso!');
            this.router.navigate(['/feed']); // Redireciona para a página de feed
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
