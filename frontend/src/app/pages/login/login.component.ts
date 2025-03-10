import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router'; // 🔥 Import Router
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // ✅ Import FormsModule and RouterOutlet
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loading: boolean = false; // ✅ Added loading attribute

  constructor(private apiService: ApiService, private router: Router, private snackbar: SnackbarService) { } // Inject Router

  onSubmit() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Username and Password cannot be empty ❌');
      return; // Stop API Call if fields are empty
    }

    this.loading = true; // 🔥 Show Spinner

    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Network Response:', response);
        if (response.status === 200 && response.body && response.body.token) {
          this.snackbar.showSuccess('Login Successful 🔥');
          console.log('JWT Token:', response.body.token);
          localStorage.setItem('jwtToken', response.body.token);
          localStorage.setItem('username', response.body.user);
          localStorage.setItem('email', response.body.email);

          setTimeout(() => { // Small delay for spinner effect
            this.router.navigate(['complaints']);
          }, 800);
        } else {
          alert('Invalid Username or Password ❌');
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.snackbar.showError('Login Failed ❌');
        this.loading = false; // ✅ Hide Spinner
      },
      complete: () => {
        this.loading = false; // ✅ Hide Spinner
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['register']); // ✅ Navigate to Register Page
  }
}
