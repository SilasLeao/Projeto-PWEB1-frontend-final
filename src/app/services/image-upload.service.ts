import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Disponibiliza o serviço em toda a aplicação.
})

// Serviço responsável por gerenciar o upload de imagens para o backend.
export class ImageUploadService {

  private apiUrl = 'http://localhost:3200/upload'; // A URL do backend com endpoint de upload

  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP.
  constructor(private http: HttpClient) {}

  // Faz o upload de uma imagem para o backend.
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
