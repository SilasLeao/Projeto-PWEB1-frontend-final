import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private formVisible = new BehaviorSubject<boolean>(false);
  isFormVisible$ = this.formVisible.asObservable();

  openForm() {
    this.formVisible.next(true);
  }

  closeForm() {
    this.formVisible.next(false);
  }
}
