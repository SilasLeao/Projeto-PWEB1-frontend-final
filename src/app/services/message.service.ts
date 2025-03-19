import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  showMessage(message: string, type: 'success' | 'error' | 'info' = 'info') {


    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }
}
