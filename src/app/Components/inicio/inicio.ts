import { Component } from '@angular/core';
import { Articulo } from '../../Modelos/Articulo';
import { Category } from '../../Modelos/Category';
import { Http } from '../../Services/http';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../Services/carrito.service';

@Component({
  selector: 'app-inicio',
  imports: [DecimalPipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {
  articulos: Articulo[] = [];
  categories: Category[] = [];

  isLoading: boolean = false;
  selectedCategoryId: number | null = null;

  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  currentCategoryName: string | null = null;

  constructor(
    private http: Http,
    private authService: AuthService,
    private router: Router,
    private carritoService: CarritoService
  ) { }

  ngOnInit(): void {
    this.cargarCategories();
    this.cargarArticulos();
  }
  cargarCategories(): void {
    this.http.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || response;
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
    this.cargarArticulos();
  }

  cargarArticulos(categoriaNombre?: string, page: number = 0): void {
    this.isLoading = true;
    this.currentPage = page;

    if (categoriaNombre) {
      this.http.getArticulosByCategoria(categoriaNombre).subscribe((response: any) => {
        this.articulos = response.data || response;
        this.totalPages = 1;
        this.isLoading = false;
      });
    } else {
      this.http.getArticulos(page, this.pageSize).subscribe((response: any) => {
        console.log(response);
        this.articulos = response.data || response;
        this.totalPages = response.totalPages || 1;
        this.isLoading = false;
      });
    }

  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.cargarArticulos(this.currentCategoryName || undefined, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const idSeleccionado = select.value;

    if (idSeleccionado === 'all') {
      this.selectedCategoryId = null;
      this.cargarArticulos();
    } else {
      const catEncontrada = this.categories.find(c => c.id === Number(idSeleccionado));
      if (catEncontrada) {
        this.selectedCategoryId = catEncontrada.id;
        this.cargarArticulos(catEncontrada.name);
      }
    }
  }

  addToCart(articulo: Articulo) {
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para añadir productos al carrito');
      this.router.navigate(['/login']);
      return;
    }
    this.carritoService.addToCart(articulo);
  }

  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  getStars(cantidad: number = 0): number[] {
    return Array(Math.floor(cantidad)).fill(0);
  }
}


