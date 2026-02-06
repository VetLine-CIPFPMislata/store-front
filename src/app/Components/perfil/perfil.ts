import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../Modelos/User';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  user: User | null = null;
  loading: boolean = false;
  error: string | null = null;

  userName: string | null = null;
  userEmail: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.userName = this.authService.getUserName();
    this.userEmail = this.authService.getUserEmail();

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;

        if (user.name !== this.userName) {
          this.authService.saveUserName(user.name);
          this.userName = user.name;
        }
        if (user.email !== this.userEmail) {
          this.authService.saveUserEmail(user.email);
          this.userEmail = user.email;
        }
      },
      error: (error) => {
        this.error = 'Error al cargar los datos del usuario';
        this.loading = false;
        console.error('Error al cargar usuario:', error);
      }
    });
  }
}
