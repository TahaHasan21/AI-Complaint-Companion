import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Complaint } from '../../models/complaint.model';
import { ComplaintService } from '../../services/complaint.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css'],
  imports: [FormsModule, CommonModule, MatDialogModule],
  standalone: true,
})
export class EditDialogComponent {
  complaint: Complaint;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Complaint,
    private complaintService: ComplaintService,
    private snackbar: SnackbarService
  ) {
    this.complaint = { ...data }; // Pre-filled Data
  }

  saveComplaint() {
    this.loading = true;

    this.complaintService.updateComplaint(this.complaint.id, this.complaint).subscribe({
      next: () => {
        this.snackbar.showSuccess('Complaint Updated Successfully ✅');
        this.dialogRef.close(this.complaint); // Close Dialog + Pass Data
      },
      error: () => {
        this.snackbar.showError('Failed to Update Complaint');
        this.loading = false;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(); // Close Dialog
  }
}
