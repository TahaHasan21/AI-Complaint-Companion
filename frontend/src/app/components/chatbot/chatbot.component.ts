import { Component } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  showChat = false;
  message = '';
  aiResponse: string = '';
  isLoading = false;

  constructor(private aiService: AiService) {}

  toggleChat() {
    this.showChat = !this.showChat;
  }

  askChatbot() {
    if (!this.message.trim()) {
      alert('Please enter a message!');
      return;
    }
    this.isLoading = true;
    this.aiResponse = '';

    this.aiService.getSuggestions(this.message).subscribe({
      next: (res) => {
        this.aiResponse = res.toString();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('AI API Error:', err);
        this.aiResponse = 'Sorry, I could not process your request at the moment.';
        this.isLoading = false;
      },
    });
  }
}
