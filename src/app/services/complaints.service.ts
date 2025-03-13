import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaints } from '../models/complaints.model';

@Injectable({
  providedIn: 'root' // Disponibiliza o serviço em toda a aplicação.
})
export class ComplaintsService {
  private apiUrl = 'http://localhost:3000/complaints'; // URL do db.json

  // Construtor do serviço, injeta o HttpClient para fazer requisições HTTP.
  constructor(private http: HttpClient) {}

  // Obtém todas as denúncias cadastradas no JSON-Server.
  getComplaints(): Observable<Complaints[]> {
    return this.http.get<Complaints[]>(this.apiUrl);
  }

  // Adiciona uma denúncia ao JSON-Server
  addComplaint(complaint: Complaints): Observable<Complaints> {
    return this.http.post<Complaints>(this.apiUrl, complaint);
  }

  // Atualiza a quantidade de curtidas e descurtidas de uma denúncia.
  updateLikesDislikes(complaints: Complaints): Observable<Complaints> {
    return this.http.put<Complaints>(`${this.apiUrl}/${complaints.id}`, complaints); // Atualiza a denúncia específica
  }

}
