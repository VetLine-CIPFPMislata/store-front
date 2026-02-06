import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { CarritoService } from '../../Services/carrito.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private carritoService = inject(CarritoService);
  private subscriptions: Subscription[] = [];

  isLoggedIn = false;
  cartCount = 0;

  constructor() {
    
  }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.authStatus$.subscribe(status => {
        this.isLoggedIn = status;
        if (status) {
          // Cargar el carrito cuando el usuario inicia sesión
          this.carritoService.loadCart().subscribe();
        }
      })
    );

    this.subscriptions.push(
      this.carritoService.cart$.subscribe(cart => {
        this.cartCount = cart?.totalProducts ?? 0;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

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
