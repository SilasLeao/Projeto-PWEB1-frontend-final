import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaints } from '../models/complaints.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {
  private apiUrl = 'http://localhost:3000/complaints'; // URL do db.json

  constructor(private http: HttpClient) {}

  getComplaints(): Observable<Complaints[]> {
    return this.http.get<Complaints[]>(this.apiUrl);
  }

  addComplaint(complaint: Complaints): Observable<Complaints> {
    return this.http.post<Complaints>(this.apiUrl, complaint);
  }

  // Método para atualizar os likes ou dislikes de uma notícia
  updateLikesDislikes(complaints: Complaints): Observable<Complaints> {
    return this.http.put<Complaints>(`${this.apiUrl}/${complaints.id}`, complaints); // Atualiza a notícia específica
  }
}
