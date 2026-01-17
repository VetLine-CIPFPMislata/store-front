import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-header', 
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
 constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogout() {
    this.authService.clearAuth();
    this.router.navigate(['/login']);
  }
}
