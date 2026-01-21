import { Component, Input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Articulo } from '../../Modelos/Articulo';
import { AuthService } from '../../Services/auth.service';
import { CarritoService } from '../../Services/carrito.service';

@Component({
    selector: 'app-product-card',
    imports: [DecimalPipe],
    templateUrl: './product-card.html',
    styleUrl: './product-card.scss'
})
export class ProductCard {
    @Input() articulo!: Articulo;

    private authService = inject(AuthService);
    private router = inject(Router);
    private carritoService = inject(CarritoService);

    addToCart(event: Event, articulo: Articulo) {
        event.stopPropagation();
        if (!this.authService.isAuthenticated()) {
            alert('Debes iniciar sesión para añadir productos al carrito');
            this.router.navigate(['/login']);
            return;
        }
        this.carritoService.addToCart(articulo);
    }

    viewProduct() {
        this.router.navigate(['/product', this.articulo.id]);
    }

    getStars(cantidad: number = 0): number[] {
        return Array(Math.floor(cantidad)).fill(0);
    }
}
