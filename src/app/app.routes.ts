import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Inicio } from './Components/inicio/inicio';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'inicio', component: Inicio },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
