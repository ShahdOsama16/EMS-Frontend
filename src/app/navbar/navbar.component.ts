import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service';
import { CommonModule } from '@angular/common';
import { SharedCartService } from '../../shared-cart.service';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, NgChartsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  logined: any;
  cartCount: number = 0;
  isAdmin: boolean = false;
  isSpecialUser: boolean = false; 
  specialUsernames = ['Shahd', 'Mariam','Sara','Maya']; 

  constructor(
    private shareDataApiService: ShareDataApiService,
    private router: Router,
    private cartService: SharedCartService
  ) { }

  logOut(): void {
    this.router.navigate(['/login']);
    this.shareDataApiService.clearAuthData();
    this.shareDataApiService.isLogin.next(false);
    this.isAdmin = false;
    this.isSpecialUser = false; 
  }

  ngOnInit(): void {
    this.shareDataApiService.isLogin.subscribe((x) => {
      this.logined = x;
      this.checkAdminStatus();
      this.checkSpecialUserStatus();
    });
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.checkAdminStatus();
    this.checkSpecialUserStatus(); 
  }

  checkAdminStatus(): void {
    if (this.logined) {
      this.isAdmin = this.shareDataApiService.isAdminUser();
    } else {
      this.isAdmin = false;
    }
  }

  checkSpecialUserStatus(): void {
    if (this.logined) {
      this.shareDataApiService.getCurrentUserDetails().subscribe({
        next: (userDetails) => {
          if (userDetails && userDetails.userName) {
            const currentUsernameLower = userDetails.userName.toLowerCase();
            this.isSpecialUser = this.specialUsernames.map(name => name.toLowerCase()).includes(currentUsernameLower);
          } else {
            this.isSpecialUser = false;
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          this.isSpecialUser = false; 
        }
      });
    } else {
      this.isSpecialUser = false;
    }
  }

  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 100;
  }
}

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar'); 
  if (navbar) { 
    if (window.scrollY > 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});