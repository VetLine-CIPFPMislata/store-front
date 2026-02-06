import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CarritoService } from '../../Services/carrito.service';
import { AuthService } from '../../Services/auth.service';
import { Cart, CartItem } from '../../Modelos/Cart';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, DecimalPipe, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class Carrito implements OnInit, OnDestroy {
  cart: Cart | null = null;
  loading: boolean = false;
  error: string | null = null;
  costeEnvio: number = 4.99;

  showConfirmModal = false;
  itemToDeleteId: number | null = null;

  showCheckoutModal = false;
  shippingAddress: string = '';
  checkoutSuccess = false;
  orderId: number | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.carritoService.cart$.subscribe(cart => {
        this.cart = cart;
      })
    );

    this.subscriptions.push(
      this.carritoService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    this.subscriptions.push(
      this.carritoService.error$.subscribe(error => {
        this.error = error;
      })
    );

    if (this.authService.isAuthenticated()) {
      this.carritoService.loadCart().subscribe();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get subtotal(): number {
    return this.cart?.totalPrice ?? 0;
  }

  get total(): number {
    return this.subtotal + this.costeEnvio;
  }

  get items(): CartItem[] {
    return this.cart?.items ?? [];
  }

  get isEnvioGratis(): boolean {
    return this.subtotal >= 20 || this.subtotal === 0;
  }

  get costeEnvioCalculado(): number {
    return this.isEnvioGratis ? 0 : this.costeEnvio;
  }

  get totalConEnvio(): number {
    return this.subtotal + this.costeEnvioCalculado;
  }

  increaseQuantity(cartItemId: number, currentQuantity: number) {
    this.carritoService.updateQuantity(cartItemId, currentQuantity + 1).subscribe();
  }

  decreaseQuantity(cartItemId: number, currentQuantity: number) {
    if (currentQuantity > 1) {
      this.carritoService.updateQuantity(cartItemId, currentQuantity - 1).subscribe();
    } else if (currentQuantity === 1) {
      this.openConfirmModal(cartItemId);
    }
  }

  removeItem(cartItemId: number) {
    this.openConfirmModal(cartItemId);
  }

  openConfirmModal(cartItemId: number) {
    this.itemToDeleteId = cartItemId;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.itemToDeleteId = null;
  }

  confirmDelete() {
    if (this.itemToDeleteId !== null) {
      this.carritoService.removeItem(this.itemToDeleteId).subscribe(() => {
        this.closeConfirmModal();
      });
    }
  }

  openCheckoutModal() {
    if (this.items.length === 0) {
      return;
    }
    this.showCheckoutModal = true;
    this.checkoutSuccess = false;
    this.shippingAddress = '';
  }

  closeCheckoutModal() {
    this.showCheckoutModal = false;
    this.shippingAddress = '';
    if (this.checkoutSuccess) {
      this.carritoService.loadCart().subscribe();
    }
  }

  confirmCheckout() {
    if (!this.shippingAddress.trim()) {
      this.error = 'Por favor, ingresa una dirección de envío';
      return;
    }

    this.carritoService.checkout(this.shippingAddress).subscribe(order => {
      if (order) {
        this.checkoutSuccess = true;
        this.orderId = order.id;
      }
    });
  }

  clearError() {
    this.carritoService.clearError();
  }

  goToShop() {
    this.router.navigate(['/tienda']);
  }
}
