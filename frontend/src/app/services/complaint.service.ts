import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../models/complaint.model';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  private API_URL = 'http://localhost:8080/api/complaints';

  constructor(private http: HttpClient) {}

  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.API_URL);
  }

  getComplaintsByUser(username: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.API_URL}/user?username=${username}`);
  }

  getComplaintById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.API_URL}/${id}`);
  }

  deleteComplaint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  createComplaint(complaintData: any): Observable<any> {
    return this.http.post(`${this.API_URL}`, complaintData);
  }

  updateComplaint(id: number, complaint: Complaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.API_URL}/${id}`, complaint);
  }

  updateComplaintStatus(id: number, status: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/status`, status);
  }
}
