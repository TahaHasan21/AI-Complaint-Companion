import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { EditDialogComponent } from '../../shared/edit-dialog/edit-dialog.component';



@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.css'],
  imports: [CommonModule, RouterModule, FormsModule] 
})
export class ComplaintListComponent implements OnInit {
  complaints: Complaint[] = [];
  isLoading: boolean = false; 
  selectedComplaint: Complaint | null = null;
  aiSuggestion: string = '';
  showSuggestion: boolean = false;
  isFetching: boolean = false;

  constructor(private complaintService: ComplaintService, private aiService: AiService,
    public dialog: MatDialog, private snackbar: SnackbarService, private router: Router) {}

  ngOnInit(): void {
    this.getAllComplaints();
  }

  // getAllComplaints(): void {
  //   this.isLoading = true; // Start Loader
  //   this.complaintService.getComplaints().subscribe({
  //     next: (data) => {
  //       this.complaints = data;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching complaints:', err);
  //       this.snackbar.showError('Failed to Fetch Complaints');
  //     },
  //     complete: () => {
  //       this.isLoading = false; // Stop Loader
  //     }
  //   });
  // }

  getAllComplaints(): void {
    this.isLoading = true; // Start Loader
  
    const username = localStorage.getItem('username'); // 🔑 Get username from JWT Token
  
    this.complaintService.getComplaintsByUser(username!).subscribe({
      next: (data) => {
        this.complaints = data;
        this.isLoading = false; // Stop Loader
      },
      error: (err) => {
        console.error('Error fetching complaints:', err);
        this.snackbar.showError('Failed to Fetch Complaints');
        this.isLoading = false; // Stop Loader
      }
    });
  }
  



  deleteComplaint(id: number) {
    this.complaintService.deleteComplaint(id).subscribe({
      next: () => {
        this.snackbar.showSuccess('Complaint Deleted Successfully!');
        this.getAllComplaints(); // Refresh List
      },
      error: () => {
        this.snackbar.showError('Failed to Fetch Complaints');
      }
    });
  }

  getPriorityClass(priority: string) {
    return {
      high: priority === 'High',
      medium: priority === 'Medium',
      low: priority === 'Low',
    };
  }

  // viewComplaint(complaint: Complaint) {
  //   alert(`Complaint Details: ${complaint.description}`);
  // }

  editComplaint(complaint: Complaint) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '500px',
      data: complaint,
    });
  
    dialogRef.afterClosed().subscribe((updatedComplaint) => {
      if (updatedComplaint) {
        this.updateComplaint(updatedComplaint.id, updatedComplaint);
      }
    });
  }
  
  
  updateComplaint(complaintId: number, updatedData: any) {
    // Optimistic UI Update
    const index = this.complaints.findIndex(c => c.id === complaintId);
    const oldComplaint = { ...this.complaints[index] };
  
    this.complaints[index] = { ...this.complaints[index], ...updatedData }; // Instant Update
  
    this.complaintService.updateComplaint(complaintId, updatedData).subscribe({
      next: (res) => {
        console.log("Complaint Updated");
      },
      error: (err) => {
        console.log("Update failed", err);
        this.complaints[index] = oldComplaint; // Revert back on Error
      },

    });
  }

  updateStatus(complaintId: number, status: string) {
    console.log(`Updating status to: ${status}`);
    this.complaintService.updateComplaintStatus(complaintId, { status: status }).subscribe({
      next: () => {
        this.snackbar.showSuccess(`Status updated to ${status} ✅`);
        this.getAllComplaints(); // Refresh List
      },
      error: (err) => {
        console.error('Failed to update status:', err);
        this.snackbar.showError('Failed to update Status');
      }
    });
  }
  
  
  

  viewComplaint(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.showSuggestion = false; // Reset
  }
  
  getSuggestion(complaintId: number) {
    
    this.aiService.getSuggestions(this.selectedComplaint!.description).subscribe({
      next: (res) => {
        this.aiSuggestion = (res as any).suggestion; 
        this.openAiDialog(); 
      },
      error: (err) => {
        console.error(err);
        this.snackbar.showError('Failed to Fetch Complaints');
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
  
    this.aiService.getSuggestions(this.selectedComplaint!.description).subscribe({
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
  
  
  refreshSuggestion(id: number) {
    this.isFetching = true;
    this.complaintService.getComplaintById(id).subscribe((res) => {
      this.selectedComplaint!.suggestion = res.suggestion;
      this.isFetching = false;
    });
  }
  

  closeModal() {
    this.selectedComplaint = null;
  }

  getAiSuggestions(id: number) {
    this.snackbar.showInfo('Fetching Suggestions... ');
    this.complaintService.getComplaintById(id).subscribe((res) => {
      this.selectedComplaint!.suggestion = res.suggestion;
    });
  }
  
  openAiDialog() {
    this.dialog.open(DialogComponent, {
      width: '100%', // Customize Width 
      data: { suggestion: this.aiSuggestion } // Pass Suggestion Here
    });
  }
  
  navigateToCreateComplaint() {
    this.router.navigate(['/create-complaint']);
  }  


} 
