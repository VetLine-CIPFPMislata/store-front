import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Modelos/Category';
import { AuthService } from './auth.service';
import { Articulo } from '../Modelos/Articulo';

@Injectable({
    providedIn: 'root'
})
export class Http {
    private urlProducts = 'http://store-back-vetline.preproducciondaw.cip.fpmislata.com/api/products';
    private urlCategories = 'http://store-back-vetline.preproducciondaw.cip.fpmislata.com/api/categories/public';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }       

    getArticulos(page: number = 0, size: number = 10): Observable<Articulo[]> {
        return this.http.get<Articulo[]>(`${this.urlProducts}/public?page=${page + 1}&size=${size}`, { headers: this.getHeaders() });
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.urlCategories}`, { headers: this.getHeaders() });
    }

    getArticulosByCategoria(categoria: string): Observable<Articulo[]> {
        return this.http.get<Articulo[]>(`${this.urlProducts}/search/category/${categoria}`, { headers: this.getHeaders() });
    }

    getArticuloById(id: number): Observable<Articulo> {
        return this.http.get<Articulo>(`${this.urlProducts}/${id}`, { headers: this.getHeaders() });
    }
}
