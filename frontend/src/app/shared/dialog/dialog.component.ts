import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class DialogComponent {
  loading = true;
  suggestion: string = '';
  formattedSuggestion: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { suggestion: string }
  ) {}

  ngOnInit(): void {
    console.log('Dialog data:', this.data);

    setTimeout(() => {
      if (this.data && this.data.suggestion) {
        this.suggestion = this.data.suggestion;
        this.loading = false; // Stop Spinner
      }
    }, 2000); // Mock loading delay
  }

  getFormattedSuggestion(): string {
    return this.suggestion ? this.suggestion.replace(/\n/g, '<br>') : '';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
