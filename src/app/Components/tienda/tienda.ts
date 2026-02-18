import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Articulo } from '../../Modelos/Articulo';
import { Category } from '../../Modelos/Category';
import { Http } from '../../Services/http';
import { ProductCard } from '../product-card/product-card';

@Component({
    selector: 'app-tienda',
    imports: [ProductCard],
    templateUrl: './tienda.html',
    styleUrl: './tienda.scss'
})
export class Tienda {
    articulos: Articulo[] = [];
    filteredArticulos: Articulo[] = []; 
    categories: Category[] = [];
    allArticulos: Articulo[] = []; 

    isLoading: boolean = false;
    selectedCategoryId: number | null = null;
    isSearching: boolean = false; 

    currentPage: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    currentCategoryName: string | null = null;

    private http = inject(Http);
    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        this.cargarData();
    }

    cargarData(): void {
        this.http.getArticulos(0, 100).subscribe({
            next: (response: any) => {
                this.allArticulos = response.data || response;
            },
            error: (err) => {
                console.error('Error al cargar todos los artículos:', err);
            }
        });

        this.http.getCategories().subscribe({
            next: (response: any) => {
                this.categories = response.data || response;
                this.checkQueryParams();
            },
            error: (err) => {
                console.error('Error al cargar categorías:', err);
                
                this.cargarArticulos();
            }
        });
    }

    checkQueryParams() {
        this.route.queryParams.subscribe(params => {
            const catId = params['category'];
            const searchQuery = params['search'];

            if (catId) {
                const cat = this.categories.find(c => c.id == catId);
                if (cat) {
                    this.selectedCategoryId = cat.id;
                    this.cargarArticulos(cat.name);
                } else {
                    this.cargarArticulos();
                }
            } else if (searchQuery) {
      
                this.http.getArticulos(0, 100).subscribe((response: any) => {
                    const allData = response.data || response;
                    this.articulos = allData;
                    const query = searchQuery.toLowerCase();
                    this.filteredArticulos = allData.filter((a: any) =>
                        a.name.toLowerCase().includes(query) ||
                        a.productDescription?.toLowerCase().includes(query)
                    );
                    this.isLoading = false;
                });
            } else {
                this.cargarArticulos();
            }
        });
    }

    cargarArticulos(categoriaNombre?: string, page: number = 0): void {
        this.isLoading = true;
        this.currentPage = page;
        this.isSearching = false;

        if (categoriaNombre) {
            this.http.getArticulosByCategoria(categoriaNombre).subscribe((response: any) => {
                this.articulos = response.data || response;
                this.filteredArticulos = this.articulos;
                this.totalPages = 1;
                this.isLoading = false;
            });
        } else {
            this.http.getArticulos(page, this.pageSize).subscribe((response: any) => {
                this.articulos = response.data || response;
                this.filteredArticulos = this.articulos;
                this.totalPages = response.totalPages || 1;
                this.isLoading = false;
            });
        }
    }

    onSearch(event: Event): void {
        const input = event.target as HTMLInputElement;
        const query = input.value.toLowerCase().trim();

        if (!query) {
            this.filteredArticulos = this.articulos;
            this.isSearching = false;
            return;
        }

        this.filteredArticulos = this.allArticulos.filter(articulo =>
            articulo.name.toLowerCase().includes(query) ||
            articulo.productDescription?.toLowerCase().includes(query)
        );
        this.isSearching = true;
    }

    changePage(newPage: number): void {
        if (newPage >= 0 && newPage < this.totalPages) {
            this.cargarArticulos(this.currentCategoryName || undefined, newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    onCategorySelect(categoryId: number | null): void {
        if (categoryId === null) {
            this.selectedCategoryId = null;
            this.currentCategoryName = null;
            this.cargarArticulos();
        } else {
            const catEncontrada = this.categories.find(c => c.id === categoryId);
            if (catEncontrada) {
                this.selectedCategoryId = catEncontrada.id;
                this.currentCategoryName = catEncontrada.name;
                this.cargarArticulos(catEncontrada.name);
            }
        }
    }
}
