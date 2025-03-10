import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 🛑 Add this
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthInterceptor } from './shared/services/auth.interceptor'; // 🔥 Import Interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])), // 💪 This Line Will Fix It 🔥
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(
      MatButtonModule,
      MatInputModule,
      MatCardModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      RouterModule
    ),
  ],
};
