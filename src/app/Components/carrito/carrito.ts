import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService, CarritoItem } from '../../Services/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class Carrito {
  items: CarritoItem[] = [];
  subtotal: number = 0;
  total: number = 0;
  costeEnvio: number = 4.99;

  showConfirmModal = false;
  itemToDeleteId: number | null = null;

  constructor(private carritoService: CarritoService) { }

  ngOnInit() {
    this.carritoService.carritoItems$.subscribe(data => {
      this.items = data;
      this.actualizarTotales();
    });
  }

  actualizarTotales() {
    this.subtotal = 0;

    for (let item of this.items) {
      if (item.selected) {
        this.subtotal = this.subtotal + (item.articulo.price * item.cantidad);
      }
    }

    if (this.subtotal >= 20 || this.subtotal === 0) {
      this.costeEnvio = 0;
    } else {
      this.costeEnvio = 4.99;
    }

    this.total = this.subtotal + this.costeEnvio;
  }

  toggleSelection(articuloId: number) {
    this.carritoService.toggleSelection(articuloId);
  }

  increaseQuantity(articuloId: number, currentQuantity: number) {
    this.carritoService.updateQuantity(articuloId, currentQuantity + 1);
  }

  decreaseQuantity(articuloId: number, currentQuantity: number) {
    if (currentQuantity > 1) {
      this.carritoService.updateQuantity(articuloId, currentQuantity - 1);
    } else if (currentQuantity === 1) {
      this.openConfirmModal(articuloId);
    }
  }

  removeItem(articuloId: number) {
    this.openConfirmModal(articuloId);
  }

  openConfirmModal(articuloId: number) {
    this.itemToDeleteId = articuloId;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.itemToDeleteId = null;
  }

  confirmDelete() {
    if (this.itemToDeleteId !== null) {
      this.carritoService.removeFromCart(this.itemToDeleteId);
      this.closeConfirmModal();
    }
  }
}
