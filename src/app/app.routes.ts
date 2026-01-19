import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Inicio } from './Components/inicio/inicio';
import { Carrito } from './Components/carrito/carrito';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'inicio', component: Inicio },
    { path: 'carrito', component: Carrito },
    { path: '**', redirectTo: 'login' }
];
