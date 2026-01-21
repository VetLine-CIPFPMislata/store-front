import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CarritoService } from '../../Services/carrito.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private carritoService = inject(CarritoService);

  isLoggedIn = false;
  cartCount = 0;

  constructor() {
    
  }

  ngOnInit() {
    this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.carritoService.carritoItems$.subscribe(items => {
      let total = 0;
      for (let item of items) {
        total += item.cantidad;
      }
      this.cartCount = total;
    }); }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearAuth();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        this.authService.clearAuth();
        this.router.navigate(['/login']);
      }
    });
  }
}
