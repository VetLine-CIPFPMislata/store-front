import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Order } from '../../Modelos/Cart';

@Component({
    selector: 'app-order-detail',
    imports: [DecimalPipe],
    templateUrl: './order-detail.html',
    styleUrl: './order-detail.scss'
})
export class OrderDetailComponent {
    @Input() order: Order | null = null;
    @Output() close = new EventEmitter<void>();

    closeOrderDetails() {
        this.close.emit();
    }

    formatDate(dateString: string): string {
        if (!dateString) return '';
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
        if (!state) return 'default';
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
        if (!state) return '';
        switch (state.toUpperCase()) {
            case 'ORDER':
                return 'Confirmado';
            case 'CART':
                return 'Carrito';
            default:
                return state;
        }
    }

    getShippingCost(total: number): number {
        return total >= 20 ? 0 : 4.99;
    }

    getTotalWithShipping(total: number): number {
        return total + this.getShippingCost(total);
    }
}
