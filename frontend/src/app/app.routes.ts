import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ComplaintListComponent } from './pages/complaint-list/complaint-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateComplaintComponent } from './pages/create-complaint/create-complaint.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './shared/services/auth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: 'home', component: HomeComponent },
        { path: 'complaints', component: ComplaintListComponent, canActivate: [AuthGuard]  },
        { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
        { path: 'create-complaint', component: CreateComplaintComponent, canActivate: [AuthGuard]  }
      ]
    },
    { path: '**', redirectTo: '' }
];
