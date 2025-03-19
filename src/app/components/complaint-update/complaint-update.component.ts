import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-complaint-update',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatInput,
    MatLabel,
    MatIcon,
    NgIf,
  ],
  templateUrl: './complaint-update.component.html',
  styleUrl: './complaint-update.component.css'
})
export class ComplaintUpdateComponent implements OnInit {

  // Evento emitido quando a denúncia é atualizada
  @Output() complaintUpdated = new EventEmitter<Complaints>();

  // Formulário reativo(Angular Material) que coleta as informações da denúncia.
  updateComplaintForm: FormGroup;

  // Evento emitido quando uma nova denúncia é adicionada.
  @Output() complaintAdded = new EventEmitter<Complaints>();

  // Variável para armazenar o arquivo de imagem selecionado.
  selectedFile: File | null = null

  // Controle de visibilidade do formulário.
  isFormVisible: boolean = false;

  // URL da imagem carregada.
  imageUrl: string = '';

  username = localStorage.getItem('username') || 'Visitante';

  complaintToUpdate: { imgUrl: string; userEmail: string; id: string; title: string; hiddenText: string; info: string ; time: string; likes: number; dislikes: number; expanded: boolean, status: string} = { id: '', userEmail: '', imgUrl: '', title: '', info: '', hiddenText: '', time: '', likes: 0, dislikes: 0, expanded: false, status: '' };

  status: string = this.complaintToUpdate.status || '';

  // Construtor do componente, injetando FormBuilder para construir o formulário reativo,
  // serviço de denúncias (metodos getComplaints, addComplaints e updateLikesDislikes),
  // serviço do formulário que gerencia a visibilidade do formulário e
  // serviço de upload de imagens.
  constructor(private fb: FormBuilder,
              private complaintsService: ComplaintsService,
              private messageService: MessageService,
              private formService: FormService,
              private imageUploadService: ImageUploadService,
              private usersService: UsersService
  ) {
    this.updateComplaintForm = this.fb.group({
      imgUrl: [''],
      title: ['', Validators.required],
      info: ['', Validators.required],
      hiddenText: ['', Validators.required]
    });

    // Subscribe para controlar a visibilidade do formulário.
    this.formService.isUpdateFormVisible$.subscribe(visible => {
      this.isFormVisible = visible;
    });
  }

  ngOnInit() {
    // Pega a denúncia a ser atualizada do serviço
    this.complaintToUpdate = this.formService.getComplaintToUpdate()!; // Asserção de não nulo

    if (this.complaintToUpdate) {
      // Preenche o formulário com os dados da denúncia a ser atualizada
      this.updateComplaintForm.patchValue({
        imgUrl: this.complaintToUpdate.imgUrl || '',
        title: this.complaintToUpdate.title || '',
        info: this.complaintToUpdate.info || '',
        hiddenText: this.complaintToUpdate.hiddenText || ''
      });
      this.imageUrl = this.complaintToUpdate.imgUrl || '';
      this.status = this.complaintToUpdate.status || '';
    }
  }

  updateStatus(newStatus: string) {
    this.status = newStatus;
  }

  // Metodo chamado ao submeter o formulário de denúncia.
  onSubmit() {
    if (this.updateComplaintForm.valid && this.complaintToUpdate) {
      this.usersService.getUserByUsername(this.username).subscribe(user => {
        const userEmail = user?.email || 'email@example.com';

        // Se houver um arquivo, envia a imagem primeiro
        if (this.selectedFile) {
          this.uploadImage(this.selectedFile).subscribe(
            (response) => {
              // Após o upload da imagem, atualiza a denúncia com a nova imagem
              const updatedComplaint: Complaints = {
                ...this.complaintToUpdate,
                userEmail: userEmail,
                imgUrl: response.imageUrl || this.complaintToUpdate.imgUrl,  // Se a imagem não for atualizada, mantemos a imagem antiga
                title: this.updateComplaintForm.value.title,
                info: this.updateComplaintForm.value.info,
                hiddenText: this.updateComplaintForm.value.hiddenText,
                id: this.complaintToUpdate.id,
                time: this.complaintToUpdate.time,
                likes: this.complaintToUpdate.likes,
                dislikes: this.complaintToUpdate.dislikes,
                expanded: this.complaintToUpdate.expanded,
                status: this.status
              };

              // Envia a denúncia atualizada para o JSON-Server
              this.complaintsService.updateComplaint(updatedComplaint).subscribe(
                (response) => {
                  this.complaintUpdated.emit(response); // Emite evento de atualização
                  this.updateComplaintForm.reset();
                  this.selectedFile = null;
                  this.closeForm();
                  this.messageService.showMessage('Denúncia atualizada com sucesso.', 'success');
                },
                (error) => console.error('Erro ao atualizar denúncia:', error)
              );
            },
            (error) => console.error('Erro ao fazer upload da imagem:', error)
          );
        } else {
          // Se não houver imagem, envia a denúncia atualizada sem imagem
          const updatedComplaint: Complaints = {
            ...this.complaintToUpdate, // Mantém os dados antigos
            userEmail: userEmail,
            imgUrl: this.complaintToUpdate.imgUrl, // Mantém a imagem existente
            title: this.updateComplaintForm.value.title,
            info: this.updateComplaintForm.value.info,
            hiddenText: this.updateComplaintForm.value.hiddenText,
            id: this.complaintToUpdate.id,
            status: this.status
          };

          // Envia a denúncia para o JSON-Server.
          this.complaintsService.updateComplaint(updatedComplaint).subscribe(
            (response) => {
              this.complaintUpdated.emit(response);
              this.updateComplaintForm.reset();
              this.selectedFile = null;
              this.closeForm();
              this.messageService.showMessage('Denúncia atualizada com sucesso.', 'success');
            },
            (error) => {
              console.error('Erro ao atualziar denúncia:', error);
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

  // Fecha o formulário de denúncia.
  closeForm() {
    this.formService.closeUpdateForm();
  }
}
