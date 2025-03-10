import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileComponent {
  complaintCount = 0;
  username = localStorage.getItem('username');
  email = localStorage.getItem('email');
  jwtToken = localStorage.getItem('jwtToken');
  joinedDate = new Date().toLocaleDateString();
  selectedFile: File | null = null;
  profileImage: any;
  imagePreview: string | null = null;


  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const headers = {
      Authorization: `Bearer ${this.jwtToken}`
    };
  
    this.http.get(`http://localhost:8080/api/auth/profile-image/${this.username}`, {
      headers,
      responseType: 'blob' // Fetching as a Blob (binary image data)
    }).subscribe({
      next: (image) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.profileImage = reader.result;
        };
        reader.readAsDataURL(image);
      },
      error: (err) => {
        console.error("❌ Failed to load profile image:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not load profile image. Please try again later.'
        });
      }
    });
  
    this.complaintCount = 7; // Placeholder value
  }
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/Login']);
  }

  copyToken() {
    navigator.clipboard.writeText(this.jwtToken!);
    alert('JWT Token Copied! ✅');
  }

  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Image Preview
  
        // Automatically Upload API Call
        this.uploadProfileImage();
      };
      reader.readAsDataURL(file);
    }
  }
  
  uploadProfileImage() {
    const formData = new FormData();
    if (this.username) {
      formData.append('username', this.username);
    } else {
      console.error('Username is null');
    }
    formData.append('image', this.selectedFile!);
  
    this.http.post('http://localhost:8080/api/auth/upload-profile-image', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      },
      responseType: 'text'
    } ).subscribe({
      next: (res) => {
        console.log('✅ Image Uploaded Successfully', res);
        Swal.fire({
          icon: 'success',
          title: 'Profile Photo Uploaded Successfully!'
        });
      },
      error: (err) => {
        console.error('❌ Image Upload Failed', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Upload Profile Photo',
        });
      }
    });
  }
  
  
}
