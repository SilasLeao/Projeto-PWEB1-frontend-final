import { Component, EventEmitter, Output  } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Complaints } from '../../models/complaints.model';
import { ComplaintsService } from '../../services/complaints.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import { FormService } from '../../services/form.service';
import { ImageUploadService } from '../../services/image-upload.service';
import {HttpClient} from '@angular/common/http';

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
  imageUrl: string = '';

  constructor(private fb: FormBuilder,
              private complaintsService: ComplaintsService,
              private formService: FormService,
              private imageUploadService: ImageUploadService
  ) {
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
      // Se houver um arquivo, envia a imagem primeiro
      if (this.selectedFile) {
        this.uploadImage(this.selectedFile).subscribe(
          (response) => {
            // Após o upload da imagem, cria a denúncia
            const newComplaint: Complaints = {
              id: this.generateId(),
              imgUrl: response.imageUrl, // Usa a URL da imagem retornada
              title: this.complaintForm.value.title,
              time: "Há 1 minuto",
              info: this.complaintForm.value.info,
              hiddenText: this.complaintForm.value.hiddenText,
              like: 0,
              dislike: 0,
              expanded: false
            };

            this.complaintsService.addComplaint(newComplaint).subscribe(
              (response) => {
                this.complaintAdded.emit(response); // Emite evento de adição
                this.complaintForm.reset();
                this.selectedFile = null;
                this.closeForm();
              },
              (error) => {
                console.error('Erro ao enviar denúncia:', error);
              }
            );
          },
          (error) => {
            console.error('Erro ao fazer upload da imagem:', error);
          }
        );
      } else {
        // Se não houver imagem, envia a denúncia sem imagem
        const newComplaint: Complaints = {
          id: this.generateId(),
          imgUrl: '', // Sem imagem
          title: this.complaintForm.value.title,
          time: "Há 1 minuto",
          info: this.complaintForm.value.info,
          hiddenText: this.complaintForm.value.hiddenText,
          like: 0,
          dislike: 0,
          expanded: false
        };

        this.complaintsService.addComplaint(newComplaint).subscribe(
          (response) => {
            console.log('Denúncia enviada com sucesso:', response);
            this.complaintAdded.emit(response);
            this.complaintForm.reset();
            this.selectedFile = null;
            this.closeForm();
          },
          (error) => {
            console.error('Erro ao enviar denúncia:', error);
          }
        );
      }
    }
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return this.imageUploadService.uploadImage(formData); // Envia o FormData para o serviço
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Armazena o arquivo selecionado

      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

    }
  }

  generateId() {
    return (Math.floor(1000 + Math.random() * 9000)).toString(); // Gera um número aleatório de 4 dígitos
  }

  closeForm() {
    this.formService.closeForm();
  }
}
