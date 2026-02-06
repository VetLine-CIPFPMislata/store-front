import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Inicio } from './Components/inicio/inicio';
import { Tienda } from './Components/tienda/tienda';
import { Carrito } from './Components/carrito/carrito';
import { Product } from './Components/product/product';
import { Perfil } from './Components/perfil/perfil';
import { MisPedidos } from './Components/mis-pedidos/mis-pedidos';
import { authguardGuard } from './guards/authguard-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'inicio', component: Inicio },
    { path: 'tienda', component: Tienda },
    { path: 'product/:id', component: Product },
    { path: 'carrito', component: Carrito, canActivate: [authguardGuard] },
    { path: 'perfil', component: Perfil, canActivate: [authguardGuard] },
    { path: 'mis-pedidos', component: MisPedidos, canActivate: [authguardGuard] },
    { path: '**', redirectTo: 'inicio' }
];
