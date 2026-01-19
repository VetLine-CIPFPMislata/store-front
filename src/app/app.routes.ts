import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Inicio } from './Components/inicio/inicio';
import { Carrito } from './Components/carrito/carrito';
import { authguardGuard } from './guards/authguard-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'inicio', component: Inicio },
    { path: 'carrito', component: Carrito, canActivate: [authguardGuard] },
    { path: '**', redirectTo: 'inicio' }
];
