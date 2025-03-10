import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-complaint-history',
  imports: [CommonModule],
  templateUrl: './complaint-history.component.html',
  styleUrl: './complaint-history.component.css'
})
export class ComplaintHistoryComponent {

  getStatusClass(status: string) {
    return {
      'open': status === 'open',
      'in-progress': status === 'in_progress',
      'closed': status === 'closed'
    };
  }
  
}
