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
import { UsersService } from '../../services/users.service';

// Componente para inserção de novas denúncias.
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

  // Formulário reativo(Angular Material) que coleta as informações da denúncia.
  insertComplaintForm: FormGroup;

  // Evento emitido quando uma nova denúncia é adicionada.
  @Output() complaintAdded = new EventEmitter<Complaints>();

  // Variável para armazenar o arquivo de imagem selecionado.
  selectedFile: File | null = null

  // Controle de visibilidade do formulário.
  isFormVisible: boolean = false;

  // URL da imagem carregada.
  imageUrl: string = '';

  // Construtor do componente, injetando FormBuilder para construir o formulário reativo,
  // serviço de denúncias (metodos getComplaints, addComplaints e updateLikesDislikes),
  // serviço do formulário que gerencia a visibilidade do formulário e
  // serviço de upload de imagens.
  constructor(private fb: FormBuilder,
              private complaintsService: ComplaintsService,
              private formService: FormService,
              private imageUploadService: ImageUploadService,
              private usersService: UsersService
  ) {
    this.insertComplaintForm = this.fb.group({
      imgUrl: [''],
      title: ['', Validators.required],
      info: ['', Validators.required],
      hiddenText: ['', Validators.required],
      likes: 0,
      dislikes: 0,
      expanded: "false"
    });

    // Subscribe para controlar a visibilidade do formulário.
    this.formService.isInsertFormVisible$.subscribe(visible => {
      this.isFormVisible = visible;
    });
  }

  username = localStorage.getItem('username') || 'Visitante';

  // Metodo chamado ao submeter o formulário de denúncia.
  onSubmit() {
    if (this.insertComplaintForm.valid) {
      this.usersService.getUserByUsername(this.username).subscribe(user => {
        const userEmail = user.email || 'email@example.com';

        // Se houver um arquivo, envia a imagem primeiro
        if (this.selectedFile) {
          this.uploadImage(this.selectedFile).subscribe(
            (response) => {
              // Após o upload da imagem, cria a denúncia
              const newComplaint: Complaints = {
                id: this.generateId(),
                status: 'Pendente',
                userEmail: userEmail,
                imgUrl: response.imageUrl,
                title: this.insertComplaintForm.value.title,
                time: "Há 1 minuto",
                info: this.insertComplaintForm.value.info,
                hiddenText: this.insertComplaintForm.value.hiddenText,
                likes: 0,
                dislikes: 0,
                expanded: false
              };

              // Envia a denúncia para o JSON-Server.
              this.complaintsService.addComplaint(newComplaint).subscribe(
                (response) => {
                  this.complaintAdded.emit(response); // Emite evento de adição
                  this.insertComplaintForm.reset();
                  this.selectedFile = null;
                  this.closeForm();
                },
                (error) => console.error('Erro ao enviar denúncia:', error)
              );
            },
            (error) => console.error('Erro ao fazer upload da imagem:', error)
          );
        } else {
          // Se não houver imagem, envia a denúncia sem imagem
          const newComplaint: Complaints = {
            id: this.generateId(),
            status: 'Pendente',
            userEmail: userEmail, // Adicionando o e-mail aqui também
            imgUrl: '', // Sem imagem
            title: this.insertComplaintForm.value.title,
            time: "Há 1 minuto",
            info: this.insertComplaintForm.value.info,
            hiddenText: this.insertComplaintForm.value.hiddenText,
            likes: 0,
            dislikes: 0,
            expanded: false
          };

          // Envia a denúncia para o JSON-Server.
          this.complaintsService.addComplaint(newComplaint).subscribe(
            (response) => {
              console.log('Denúncia enviada com sucesso:', response);
              this.complaintAdded.emit(response);
              this.insertComplaintForm.reset();
              this.selectedFile = null;
              this.closeForm();
            },
            (error) => {
              console.error('Erro ao enviar denúncia:', error);
            }
          );
        }
      });
    }
  }


  // Realiza o upload da imagem selecionada.
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return this.imageUploadService.uploadImage(formData); // Envia o FormData(imagem) para o serviço
  }

  // Captura o arquivo de imagem selecionado e o armazena, mostrando o nome da imagem no formulário.
  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

    }
  }

  // Gera um ID aleatório para a denúncia.
  generateId() {
    return (Math.floor(1000 + Math.random() * 9000)).toString(); // Gera um número aleatório de 4 dígitos
  }

  // Fecha o formulário de denúncia.
  closeForm() {
    this.formService.closeInsertForm();
  }
}
