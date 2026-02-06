import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../Modelos/RegisterRequest';
import { AuthService } from '../../Services/auth.service';

@Component({
    selector: 'app-register',
    imports: [FormsModule],
    templateUrl: './register.html',
    styleUrl: './register.scss',
})
export class Register {
    registerData: RegisterRequest = {
        name: '',
        email: '',
        password: '',
        phone: ''
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

    onRegister() {
        this.errorMessage = '';

        if (!this.registerData.name.trim() || !this.registerData.email.trim() || !this.registerData.password.trim()) {
            this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
            return;
        }

        if (this.registerData.password.length < 6) {
            this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.registerData.email)) {
            this.errorMessage = 'Por favor, introduce un email válido.';
            return;
        }

        this.isLoading = true;

        this.authService.register(this.registerData).subscribe({
            next: (response) => {
                this.authService.saveToken(response.token);
                this.authService.saveUserEmail(response.email);
                this.authService.saveUserName(response.name);
                this.authService.saveUserId(response.id);

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
                this.handleError(error, 'register');
            }
        });
    }

    private handleError(error: any, context: 'register' | 'permisos') {
        console.error(`Error en ${context}:`, error);

        if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor. Por favor, comprueba tu conexión.';
            return;
        }

        if (context === 'register') {
            switch (error.status) {
                case 400:
                    this.errorMessage = 'Los datos introducidos no son válidos.';
                    break;
                case 409:
                    this.errorMessage = 'Este email ya está registrado. Por favor, usa otro.';
                    break;
                case 500:
                    this.errorMessage = 'Error interno en el servidor. Inténtalo más tarde.';
                    break;
                default:
                    this.errorMessage = error.error?.message || 'Ha ocurrido un error inesperado al registrarse.';
            }
        } else if (context === 'permisos') {
            if (error.status === 403) {
                this.errorMessage = 'Acceso denegado. No tienes permisos.';
            } else {
                this.errorMessage = 'Error al verificar tu perfil. Intenta registrarte de nuevo.';
            }
        }
    }
}
