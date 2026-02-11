import { Component, inject } from '@angular/core';
import { Articulo } from '../../Modelos/Articulo';
import { Category } from '../../Modelos/Category';
import { Http } from '../../Services/http';
import { Router, RouterLink } from '@angular/router';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-inicio',

  imports: [RouterLink, ProductCard],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {
  articulos: Articulo[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;

  private http = inject(Http);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarCategories();
    this.cargarDestacados();
  }

  cargarCategories(): void {
    this.http.getCategories().subscribe({
      next: (response: any) => {
        const allCategories: Category[] = response.data || response;
        const targetNames = ['juguetes para perros', 'accesorios', 'higiene y cuidado', 'snacks y premios'];
        this.categories = allCategories.filter(cat =>
          targetNames.includes(cat.name.toLowerCase())
        );
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  cargarDestacados(): void {
    this.isLoading = true;

    this.http.getArticulos(0, 50).subscribe({
      next: (response: any) => {
        const allItems = response.data || response;
        this.articulos = allItems.sort(() => Math.random() - 0.5).slice(0, 4);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading featured products', err);
        this.isLoading = false;
      }
    });
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/tienda'], { queryParams: { category: categoryId } });
  }
}
