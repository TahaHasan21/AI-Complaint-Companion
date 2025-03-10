import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api/auth';

constructor(private http: HttpClient) {
  this.http = http;
}


login(credentials: any) {
  return this.http.post('http://localhost:8080/api/auth/login', credentials, {
    observe: 'response', // ✅ This will force Angular to treat every status as Success
    responseType: 'json' 
  });
}


register(user: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/register`, user, { responseType: 'json' });
}

  
}
