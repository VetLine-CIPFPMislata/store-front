import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '../../Services/http';
import { CarritoService } from '../../Services/carrito.service';
import { AuthService } from '../../Services/auth.service';
import { Articulo } from '../../Modelos/Articulo';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  product: Articulo | null = null;
  quantity: number = 1;
  selectedImage: string = '';
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: Http,
    private carritoService: CarritoService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    } else {
      this.error = 'ID de producto no válido';
      this.isLoading = false;
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.http.getArticuloById(id).subscribe({
      next: (response: any) => {
        this.product = response.data || response;
        this.selectedImage = this.product?.pictureProduct || '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.error = 'Error al cargar el producto';
        this.isLoading = false;
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < (this.product.quantity || 100)) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  isAddingToCart: boolean = false;

  addToCart(): void {

    if (this.isAddingToCart) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.isAddingToCart = true;
      this.carritoService.addToCart(this.product.id, this.quantity).subscribe({
        next: (cart) => {
          this.isAddingToCart = false;
          if (cart) {
            this.quantity = 1;
          }
        },
        error: () => {
          this.isAddingToCart = false;
        }
      });
    }
  }

  getStars(rating: number = 0): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars;
  }

  getDiscountPercentage(): number {
    if (this.product?.basePrice && this.product?.price) {
      return Math.round((1 - this.product.price / this.product.basePrice) * 100);
    }
    return 0;
  }

  volverInicio(): void {
    this.router.navigate(['/inicio']);
  }
}
