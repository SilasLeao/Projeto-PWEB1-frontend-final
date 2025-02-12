import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Disponibiliza o serviço em toda a aplicação.
})

// Serviço responsável por gerenciar a visibilidade de um formulário na aplicação.
export class FormService {

  // BehaviorSubject que mantém o estado da visibilidade do formulário.
  private formVisible = new BehaviorSubject<boolean>(false);

  // Observable que permite que outros componentes observem mudanças na visibilidade do formulário.
  isFormVisible$ = this.formVisible.asObservable();

  // Metodo para abrir o formulário, alterando o estado para visível.
  openForm() {
    this.formVisible.next(true);
  }

  // Metodo para fechar o formulário, alterando o estado para invisível.
  closeForm() {
    this.formVisible.next(false);
  }
}
