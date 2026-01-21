import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Inicio } from './Components/inicio/inicio';
import { Carrito } from './Components/carrito/carrito';
import { Product } from './Components/product/product';
import { authguardGuard } from './guards/authguard-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'inicio', component: Inicio },
    { path: 'product/:id', component: Product },
    { path: 'carrito', component: Carrito, canActivate: [authguardGuard] },
    { path: '**', redirectTo: 'inicio' }
];
