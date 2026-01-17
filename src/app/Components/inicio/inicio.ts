import { Component } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { Articulo } from '../../Modelos/Articulo';
import { Category } from '../../Modelos/Category';
import { Http } from '../../Services/http';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [DecimalPipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {
  articulos: Articulo[] = [];
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  isLoading: boolean = false;

  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  currentCategoryName: string | null = null;

  constructor(private http: Http) { }

  ngOnInit() {
    this.cargarCategories();
    this.cargarArticulos();
  }

  cargarCategories() {
    this.http.getCategories().subscribe({
      next: (response: any) => {
        console.log('Categories loaded:', response);
        this.categories = response.data || response;
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  cargarArticulos(categoriaNombre?: string, page: number = 0) {
    this.isLoading = true;
    this.currentPage = page;
    this.currentCategoryName = categoriaNombre || null;

    const obs = categoriaNombre
      ? this.http.getArticulosByCategoria(categoriaNombre)
      : this.http.getArticulos(page, this.pageSize);

    obs.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: any) => {
        console.log('Articles loaded:', response);

        const rawArticulos = response.data || (Array.isArray(response) ? response : []);
        this.totalPages = response.totalPages || (Array.isArray(response) ? 1 : 0);

        this.articulos = rawArticulos.map((art: any) => ({
          ...art,
          rating: art.rating || ((art.id % 3) + 3)
        }));
      },
      error: (err) => {
        console.error('Error fetching articles:', err);
        this.articulos = [];
        this.totalPages = 0;
      }
    });
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.cargarArticulos(this.currentCategoryName || undefined, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (value === 'all') {
      this.selectedCategoryId = null;
      this.cargarArticulos();
    } else {
      const category = this.categories.find(c => c.id === Number(value));
      if (category) {
        this.selectedCategoryId = category.id;
        this.cargarArticulos(category.name);
      }
    }
  }

  addToCart(articulo: Articulo) {
    console.log('Producto añadido:', articulo.name);
  }

  getStars(rating: number = 0): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
