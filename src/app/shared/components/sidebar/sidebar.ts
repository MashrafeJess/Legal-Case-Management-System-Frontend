import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styles: [`
    .hover-nav:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `]
})
export class Sidebar implements OnInit {
  userName    = '';
  userInitial = '';
  userRole    = '';
  isAdmin     = false;
  isLawyer    = false;
  isClient    = false;

  constructor(
    private authService: AuthService,
    private router:      Router
  ) {}

  ngOnInit(): void {
    const user       = this.authService.getUser();
    this.userName    = user?.userName ?? 'User';
    this.userRole    = user?.role     ?? '';
    this.userInitial = this.userName.charAt(0).toUpperCase();
    this.isAdmin     = this.userRole === 'Admin';
    this.isLawyer    = this.userRole === 'Lawyer';
    this.isClient    = this.userRole === 'Client';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
