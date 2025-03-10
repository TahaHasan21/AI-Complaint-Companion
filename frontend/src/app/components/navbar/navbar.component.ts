import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  constructor(private router: Router) {}

  ngOnInit(){
    document.getElementById('darkModeToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });  
  }
  
  logout() {
    localStorage.clear(); 
    window.location.href = '/login';
  }

  showNavbar() {
    return this.router.url !== '/';
  }
}
