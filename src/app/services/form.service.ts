import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Complaints} from '../models/complaints.model';

@Injectable({
  providedIn: 'root' // Disponibiliza o serviço em toda a aplicação.
})

// Serviço responsável por gerenciar a visibilidade de um formulário na aplicação.
export class FormService {

  complaintToUpdate: Complaints | undefined;

  // BehaviorSubjects que mantêm o estado da visibilidade de cada formulário.
  private insertFormVisible = new BehaviorSubject<boolean>(false);
  private updateFormVisible = new BehaviorSubject<boolean>(false);


  // Observables que permitem que outros componentes observem mudanças na visibilidade dos formulários.
  isInsertFormVisible$ = this.insertFormVisible.asObservable();
  isUpdateFormVisible$ = this.updateFormVisible.asObservable();

  // Métodos para controlar a visibilidade do formulário de inserção.
  openInsertForm() {
    this.insertFormVisible.next(true);
  }

  closeInsertForm() {
    this.insertFormVisible.next(false);
  }

  // Métodos para controlar a visibilidade do formulário de atualização.
  openUpdateForm(complaints: Complaints) {
    this.complaintToUpdate = complaints
    this.updateFormVisible.next(true);
  }

  closeUpdateForm() {
    this.updateFormVisible.next(false);
  }

  getComplaintToUpdate() {
    return this.complaintToUpdate;
  }
}
