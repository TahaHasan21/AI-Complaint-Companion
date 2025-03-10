import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private http: HttpClient){ }

  getSuggestions(description: string) {
    return this.http.post('http://localhost:8080/api/chatbot/suggestions', { description });
  }
  
}
