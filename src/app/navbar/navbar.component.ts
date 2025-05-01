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
  isSpecialUser: boolean = false; // New property to track the specific user
  specialUsernames = ['Shahd', 'Mariam','Sara','Maya']; // Array of usernames who should see the icon

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
    this.isSpecialUser = false; // Reset on logout
  }

  ngOnInit(): void {
    this.shareDataApiService.isLogin.subscribe((x) => {
      this.logined = x;
      this.checkAdminStatus();
      this.checkSpecialUserStatus(); // Call this when login status changes
    });

    // Subscribe to cart count changes
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.checkAdminStatus();
    this.checkSpecialUserStatus(); // Check on component initialization
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
          // Assuming your user details response has a 'userName' property
          if (userDetails && userDetails.userName) {
            const currentUsernameLower = userDetails.userName.toLowerCase();
            this.isSpecialUser = this.specialUsernames.map(name => name.toLowerCase()).includes(currentUsernameLower);
          } else {
            this.isSpecialUser = false;
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          this.isSpecialUser = false; // Default to false on error
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
  const navbar = document.querySelector('.navbar'); // Select by class name
  if (navbar) { // Check if the element exists before trying to manipulate it
    if (window.scrollY > 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});