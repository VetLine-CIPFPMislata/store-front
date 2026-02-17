import { Component, inject, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { CarritoService } from '../../Services/carrito.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);
  private carritoService = inject(CarritoService);
  private subscriptions: Subscription[] = [];

  isLoggedIn = false;
  cartCount = 0;
  userName: string | null = null;
  showUserDropdown = false;

  constructor() {

  }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.authStatus$.subscribe(status => {
        this.isLoggedIn = status;
        if (status) {
          this.carritoService.loadCart().subscribe();
          this.userName = this.authService.getUserName();
        } else {
          this.userName = null;
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

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown() {
    this.showUserDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header__user-menu')) {
      this.showUserDropdown = false;
    }
  }

  navigateToProfile() {
    this.closeUserDropdown();
    this.router.navigate(['/perfil']);
  }

  navigateToOrders() {
    this.closeUserDropdown();
    this.router.navigate(['/mis-pedidos']);
  }

  onLogout() {
    this.closeUserDropdown();
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
