import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CarritoService } from '../../Services/carrito.service';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  cartCount$!: Observable<number>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private carritoService: CarritoService
  ) { }

  ngOnInit() {
    this.cartCount$ = this.carritoService.carritoItems$.pipe(
      map(items => items.reduce((total, item) => total + item.cantidad, 0))
    );
  }

  onLogout() {
    this.authService.clearAuth();
    this.router.navigate(['/login']);
  }
}
