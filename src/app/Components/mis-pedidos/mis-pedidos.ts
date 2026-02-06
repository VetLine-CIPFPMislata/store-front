import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { CarritoService } from '../../Services/carrito.service';
import { Order } from '../../Modelos/Cart';

@Component({
  selector: 'app-mis-pedidos',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.scss',
})
export class MisPedidos implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectedOrder: Order | null = null;

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'Usuario no autenticado';
      return;
    }

    this.loading = true;
    this.error = null;

    this.carritoService.getUserOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => {
          // Ordenar por fecha descendente (más reciente primero)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los pedidos';
        this.loading = false;
        console.error('Error al cargar pedidos:', error);
      }
    });
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStateColor(state: string): string {
    switch (state.toUpperCase()) {
      case 'ORDER':
        return 'success';
      case 'CART':
        return 'warning';
      default:
        return 'default';
    }
  }

  getStateLabel(state: string): string {
    switch (state.toUpperCase()) {
      case 'ORDER':
        return 'Confirmado';
      case 'CART':
        return 'Carrito';
      default:
        return state;
    }
  }
}
