import { Component, EventEmitter, Output  } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Complaints } from '../../models/complaints.model';
import { ComplaintsService } from '../../services/complaints.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-complaint-insert',
  templateUrl: './complaint-insert.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatInput,
    MatLabel,
    MatIcon,
    NgIf,
  ],
  styleUrls: ['./complaint-insert.component.css']
})
export class ComplaintInsertComponent {
  complaintForm: FormGroup;
  @Output() complaintAdded = new EventEmitter<Complaints>();
  selectedFile: File | null = null
  isFormVisible: boolean = false;

  constructor(private fb: FormBuilder, private formService: FormService) {
    this.complaintForm = this.fb.group({
      imgUrl: [''],
      title: ['', Validators.required],
      info: ['', Validators.required],
      hiddenText: ['', Validators.required],
      like: 0,
      dislike: 0,
      expanded: "false"
    });

    this.formService.isFormVisible$.subscribe(visible => {
      this.isFormVisible = visible;
    });
  }

  onSubmit() {
    if (this.complaintForm.valid) {
      const formData = new FormData();
      formData.append('title', this.complaintForm.get('title')?.value);
      formData.append('info', this.complaintForm.get('info')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      console.log('Denúncia enviada:', formData);
      this.complaintForm.reset();
      this.selectedFile = null;
      this.closeForm();
    }
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Armazena o arquivo selecionado
    }
  }

  closeForm() {
    this.formService.closeForm();
  }
}
