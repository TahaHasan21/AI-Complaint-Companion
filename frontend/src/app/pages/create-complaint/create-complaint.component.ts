import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AiService } from '../../services/ai.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

interface Complaint {
  title: string;
  description: string;
  priority: string;
  status: string;       // Default status
  suggestions: string;
  createdAt: Date;
  updatedAt: Date;
}


@Component({
  selector: 'app-create-complaint',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatIconModule]
})
export class CreateComplaintComponent {
  complaintForm: FormGroup;
  isLoading: boolean = false;
  success = false;
  desc: FormGroup;

  complaint : Complaint = {
    title: '',
    description: '',
    priority: '',
    status: '',       // Default status
    suggestions: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private aiService: AiService,
    private snackbar: SnackbarService
  ) {
    this.complaintForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      useChatbot: [false]
    });
    this.desc = this.fb.group({
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched(); // Show validation messages
      this.snackbar.showError('Please fill all required fields');
      return;
    }
  
    this.isLoading = true; // Show loader on button click
    this.complaint = {
      ...this.complaint,
      ...this.complaintForm.value,
    };
  
    this.complaintService.createComplaint(this.complaint).subscribe({
      next: (res) => {
        this.isLoading = false; // Stop loader first
        this.snackbar.showSuccess('Complaint Created Successfully');
  
        // 🔥 Show Tick Icon
        this.success = true; 
  
        // Wait 2 seconds before navigating
        setTimeout(() => {
          this.router.navigate(['/complaints']);
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.snackbar.showError('Failed to Create Complaint');
        this.isLoading = false; // Stop loader
      }
    });
  }
  
  openSuggestionDialog() {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '150vw',
        maxHeight: '700px',
        disableClose: true, // This will prevent the dialog from closing automatically
      });
    
      dialogRef.componentInstance.loading = true; // Show spinner initially
    
      const description = this.complaintForm.get('description')?.value; // Get Description Value

      this.aiService.getSuggestions(description).subscribe({
        next: (res) => {
          dialogRef.componentInstance.suggestion = (res as any).suggestion; // Set Suggestion
          dialogRef.componentInstance.loading = false; // Stop Spinner
        },
        error: (err) => {
          console.log(err);
          dialogRef.componentInstance.loading = false; // Stop Spinner on Error
        }
      });
    }

}
