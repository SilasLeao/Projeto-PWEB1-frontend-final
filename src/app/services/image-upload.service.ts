import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private apiUrl = 'http://localhost:3200/upload'; // A URL do seu backend

  constructor(private http: HttpClient) {}

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData); // Envia a imagem para o backend
  }
}
