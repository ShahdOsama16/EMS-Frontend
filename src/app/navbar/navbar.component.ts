import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service';
import { CommonModule } from '@angular/common';
import { SharedCartService } from '../../shared-cart.service';
import { NgChartsModule } from 'ng2-charts';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive, CommonModule,NgChartsModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  logined:any;
  cartCount: number = 0;
  
  constructor (private shareDataApiService: ShareDataApiService,
    private router: Router,
    private cartService: SharedCartService){

  }
  logOut(): void {
    this.router.navigate(['/login']);
    this.shareDataApiService.clearAuthData();
    this.shareDataApiService.isLogin.next(false);
  }


  ngOnInit(): void {
    this.shareDataApiService.isLogin.subscribe((x) => {
      this.logined = x;
    });

    // Subscribe to cart count changes
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
      
    });
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




