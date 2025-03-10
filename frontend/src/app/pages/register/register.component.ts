import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule, RouterModule]
})
export class RegisterComponent {
  // username: string = '';
  // password: string = '';
  errorMessage: string = '';

  user = {
    username: '',
    password: '',
    email : '',
    confirmPassword: ''
  };

  loading: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private snackbar: SnackbarService) { }

  register() {
    if (!this.user.username || !this.user.password || !this.user.confirmPassword || !this.user.email) {
      this.errorMessage = 'All fields are required!';
    } else if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords does not match!';
    } else {
      this.errorMessage = '';
      this.apiService.register(this.user).subscribe({
        next: (response) => {
          if(response.message == "Username or Email already exists!"){
            this.snackbar.showError('❌ Username or email already exists! Please register with new one');
            return;
          }
          this.snackbar.showSuccess('✅ Registration Successful');
          this.router.navigate(['/login']); // Redirect to Login Page
        },
        error: (err) => {
          console.log(err);
          this.snackbar.showError('❌ Registration Failed');
        }
      });
    }
  }
}
