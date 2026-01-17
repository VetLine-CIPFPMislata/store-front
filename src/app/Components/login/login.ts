import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../Modelos/LoginRequest';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inicio']);
    }
  }

  onLogin() {
    this.errorMessage = '';

    if (!this.credentials.email.trim() || !this.credentials.password.trim()) {
      this.errorMessage = 'Por favor, introduce tu email y contraseña.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveUserEmail(response.email);
        this.authService.saveUserName(response.name);

        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            this.isLoading = false;
            this.router.navigate(['/inicio']);
          },
          error: (error) => {
            this.isLoading = false;
            this.authService.clearAuth();
            this.handleError(error, 'permisos');
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error, 'login');
      }
    });
  }

  private handleError(error: any, context: 'login' | 'permisos') {
    console.error(`Error en ${context}:`, error);

    if (error.status === 0) {
      this.errorMessage = 'No se pudo conectar con el servidor. Por favor, comprueba tu conexión.';
      return;
    }

    if (context === 'login') {
      switch (error.status) {
        case 400:
          this.errorMessage = 'Los datos introducidos no son válidos.';
          break;
        case 401:
          this.errorMessage = 'Correo electrónico o contraseña incorrectos.';
          break;
        case 500:
          this.errorMessage = 'Error interno en el servidor. Inténtalo más tarde.';
          break;
        default:
          this.errorMessage = error.error?.message || 'Ha ocurrido un error inesperado al iniciar sesión.';
      }
    } else if (context === 'permisos') {
      if (error.status === 403) {
        this.errorMessage = 'Acceso denegado. No tienes permisos de administrador.';
      } else {
        this.errorMessage = 'Error al verificar tu perfil. Intenta iniciar sesión de nuevo.';
      }
    }
  }
}
