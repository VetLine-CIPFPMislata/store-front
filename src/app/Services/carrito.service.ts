import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Articulo } from '../Modelos/Articulo';

export interface CarritoItem {
    articulo: Articulo;
    cantidad: number;
    selected: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CarritoService {
    private carritoItems = new BehaviorSubject<CarritoItem[]>([]);
    public carritoItems$ = this.carritoItems.asObservable();

    constructor() {
        const guardado = localStorage.getItem('carrito');
        if (guardado) {
            this.carritoItems.next(JSON.parse(guardado));
        }
    }

    private guardar() {
        localStorage.setItem('carrito', JSON.stringify(this.carritoItems.value));
    }

    addToCart(articulo: Articulo) {
        const lista = this.carritoItems.value;
        const encontrado = lista.find(item => item.articulo.id === articulo.id);

        if (encontrado) {
            encontrado.cantidad++;
        } else {
            lista.push({ articulo, cantidad: 1, selected: true });
        }

        this.carritoItems.next(lista);
        this.guardar();
    }

    removeFromCart(articuloId: number) {
        const nuevaLista = this.carritoItems.value.filter(item => item.articulo.id !== articuloId);
        this.carritoItems.next(nuevaLista);
        this.guardar();
    }

    updateQuantity(articuloId: number, nuevaCantidad: number) {
        const lista = this.carritoItems.value;
        const item = lista.find(item => item.articulo.id === articuloId);

        if (item) {
            item.cantidad = nuevaCantidad;
            this.carritoItems.next(lista);
            this.guardar();
        }
    }

    toggleSelection(articuloId: number) {
        const lista = this.carritoItems.value;
        const item = lista.find(item => item.articulo.id === articuloId);

        if (item) {
            item.selected = !item.selected;
            this.carritoItems.next(lista);
            this.guardar();
        }
    }

    clearCart() {
        this.carritoItems.next([]);
        this.guardar();
    }
}
