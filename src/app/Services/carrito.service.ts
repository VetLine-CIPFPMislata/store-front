import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Cart, CartItem, AddToCartRequest, UpdateQuantityRequest, CheckoutRequest, Order } from '../Modelos/Cart';

@Injectable({
    providedIn: 'root'
})
export class CarritoService {
    private urlCarts = 'http://store-back-vetline.producciondaw.cip.fpmislata.com/api/carts';
    private urlOrders = 'http://store-back-vetline.producciondaw.cip.fpmislata.com/api/orders';

    private cart = new BehaviorSubject<Cart | null>(null);
    public cart$ = this.cart.asObservable();

    private loading = new BehaviorSubject<boolean>(false);
    public loading$ = this.loading.asObservable();

    private error = new BehaviorSubject<string | null>(null);
    public error$ = this.error.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    private getUserId(): number | null {
        return this.authService.getUserId();
    }

    loadCart(): Observable<Cart | null> {
        const userId = this.getUserId();
        if (!userId) {
            this.error.next('Usuario no autenticado');
            return of(null);
        }

        this.loading.next(true);
        this.error.next(null);

        return this.http.get<Cart>(`${this.urlCarts}/user/${userId}`, { headers: this.getHeaders() })
            .pipe(
                tap(cart => {
                    this.cart.next(cart);
                    this.loading.next(false);
                }),
                catchError(error => {
                    this.loading.next(false);
                    if (error.status === 404) {

                        this.cart.next(null);
                        return of(null);
                    }
                    this.handleError(error);
                    return of(null);
                })
            );
    }

    addToCart(productId: number, quantity: number = 1): Observable<Cart | null> {
        const userId = this.getUserId();
        if (!userId) {
            this.error.next('Usuario no autenticado');
            return of(null);
        }

        this.loading.next(true);
        this.error.next(null);

        const request: AddToCartRequest = { productId, quantity };

        return this.http.post<Cart>(`${this.urlCarts}/${userId}/items`, request, { headers: this.getHeaders() })
            .pipe(
                tap(cart => {
                    this.cart.next(cart);
                    this.loading.next(false);
                }),
                catchError(error => {
                    this.loading.next(false);
                    this.handleError(error);
                    return of(null);
                })
            );
    }

    updateQuantity(cartItemId: number, newQuantity: number): Observable<Cart | null> {
        const userId = this.getUserId();
        if (!userId) {
            this.error.next('Usuario no autenticado');
            return of(null);
        }

        if (newQuantity < 1) {
            this.error.next('La cantidad debe ser mayor a 0');
            return of(null);
        }

        this.loading.next(true);
        this.error.next(null);

        const request: UpdateQuantityRequest = { quantity: newQuantity };

        return this.http.put<Cart>(`${this.urlCarts}/${userId}/items/${cartItemId}`, request, { headers: this.getHeaders() })
            .pipe(
                tap(cart => {
                    this.cart.next(cart);
                    this.loading.next(false);
                }),
                catchError(error => {
                    this.loading.next(false);
                    this.handleError(error);
                    return of(null);
                })
            );
    }


    removeItem(cartItemId: number): Observable<boolean> {
        const userId = this.getUserId();
        if (!userId) {
            this.error.next('Usuario no autenticado');
            return of(false);
        }

        this.loading.next(true);
        this.error.next(null);

        return new Observable<boolean>(observer => {
            this.http.delete(`${this.urlCarts}/${userId}/items/${cartItemId}`, {
                headers: this.getHeaders(),
                observe: 'response'
            }).subscribe({
                next: () => {
                    this.loading.next(false);
                    this.loadCart().subscribe();
                    observer.next(true);
                    observer.complete();
                },
                error: (error) => {
                    this.loading.next(false);
                    this.handleError(error);
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }


    checkout(shippingAddress: string): Observable<Order | null> {
        const userId = this.getUserId();
        if (!userId) {
            this.error.next('Usuario no autenticado');
            return of(null);
        }

        const currentCart = this.cart.value;
        if (!currentCart || currentCart.items.length === 0) {
            this.error.next('El carrito está vacío');
            return of(null);
        }

        this.loading.next(true);
        this.error.next(null);

        const request: CheckoutRequest = { address: shippingAddress };

        return this.http.post<Order>(`${this.urlOrders}/${userId}/checkout`, request, { headers: this.getHeaders() })
            .pipe(
                tap(order => {
                    this.loading.next(false);
                    this.cart.next({
                        ...currentCart,
                        totalProducts: 0,
                        totalPrice: 0,
                        items: []
                    });
                }),
                catchError(error => {
                    this.loading.next(false);
                    this.handleError(error);
                    return of(null);
                })
            );
    }

    getUserOrders(userId: number): Observable<Order[]> {
        this.loading.next(true);
        this.error.next(null);

        return this.http.get<Order[]>(`${this.urlOrders}/user/${userId}`, { headers: this.getHeaders() })
            .pipe(
                tap(() => {
                    this.loading.next(false);
                }),
                catchError(error => {
                    this.loading.next(false);
                    this.handleError(error);
                    return of([]);
                })
            );
    }

    getTotalItems(): number {
        const currentCart = this.cart.value;
        return currentCart?.totalProducts ?? 0;
    }

    getTotalPrice(): number {
        const currentCart = this.cart.value;
        return currentCart?.totalPrice ?? 0;
    }

    isEmpty(): boolean {
        const currentCart = this.cart.value;
        return !currentCart || currentCart.items.length === 0;
    }

    clearError(): void {
        this.error.next(null);
    }


    private handleError(error: any): void {
        let errorMessage = 'Error desconocido';

        if (error.status === 400) {
            errorMessage = error.error?.message || 'Datos inválidos';
        } else if (error.status === 401) {
            errorMessage = 'Sesión expirada, por favor inicia sesión';
        } else if (error.status === 403) {
            errorMessage = 'No tienes permiso para esta acción';
        } else if (error.status === 404) {
            errorMessage = 'Recurso no encontrado';
        } else if (error.status === 500) {
            errorMessage = 'Error del servidor';
        } else if (error.error?.message) {
            errorMessage = error.error.message;
        }

        this.error.next(errorMessage);
        console.error('CarritoService Error:', error);
    }
}
