import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CarritoService } from '../../Services/carrito.service';
import { User } from '../../Modelos/User';
import { Order } from '../../Modelos/Cart';

import { OrderDetailComponent } from '../order-detail/order-detail';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, OrderDetailComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  user: User | null = null;
  loading: boolean = false;
  error: string | null = null;

  userName: string | null = null;
  userEmail: string | null = null;

  lastOrder: Order | null = null;
  selectedOrder: Order | null = null;

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;

    const userId = this.authService.getUserId();

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;

        this.sincronizarDatosLocalStorage(user);

        if (userId) {
          this.loadLastOrder(userId);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.error = 'No se han podido cargar los datos de tu perfil.';
        this.loading = false;
      }
    });
  }

  private sincronizarDatosLocalStorage(user: User) {
    if (user.name !== this.authService.getUserName()) {
      this.authService.saveUserName(user.name);
    }
    if (user.email !== this.authService.getUserEmail()) {
      this.authService.saveUserEmail(user.email);
    }
  }

  loadLastOrder(userId: number) {
    this.carritoService.getUserOrders(userId).subscribe({
      next: (orders) => {
        if (orders.length > 0) {
          const posicionUltimo = orders.length - 1;
          this.lastOrder = orders[posicionUltimo];
        } else {
          this.lastOrder = null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
