// import { Component, OnInit } from '@angular/core';
// import { SharedCartService } from '../../shared-cart.service';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';

// @Component({
//     selector: 'app-cart',
//     imports: [CommonModule],
//     templateUrl: './cart.component.html',
//     styleUrl: './cart.component.css'
// })
// export class CartComponent implements OnInit {
//   cartItems: any[] = [];
//   total: number = 0;



//   constructor(private cartService: SharedCartService, private router: Router) {}

//   ngOnInit(): void {
//     this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
//     this.calculateTotal();
//   }

//   calculateTotal(): void {
//     this.total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   }

//   changeQuantity(item: any, change: number): void {
//     item.quantity += change;
//     if (item.quantity <= 0) {
//       this.removeItem(item);
//     } else {
//       localStorage.setItem('cart', JSON.stringify(this.cartItems));
//       this.calculateTotal();
//       if (this.cartService.cartCount$) { // Check if cartCountSubject exists
//           (this.cartService.cartCount$ as BehaviorSubject<number>).next(this.cartItems.reduce((total, item) => total + item.quantity, 0));
//       }
//     }
//   }

//   removeItem(item: any): void {
//     this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
//     localStorage.setItem('cart', JSON.stringify(this.cartItems));
//     this.calculateTotal();
//       if(this.cartService.cartCount$){
//           (this.cartService.cartCount$ as BehaviorSubject<number>).next(this.cartItems.reduce((total, item) => total + item.quantity, 0));
//       }
//   }

//   proceedToCheckout(): void {
//     this.router.navigate(['/checkout']);
//   }
// }

import { Component, OnInit } from '@angular/core';
 import { SharedCartService } from '../../shared-cart.service';
 import { CommonModule } from '@angular/common';
 import { Router } from '@angular/router'; // Import Router
 import { BehaviorSubject } from 'rxjs';
 import { ShareDataApiService } from '../share-data-api.service'; // Assuming you might need it

 @Component({
   selector: 'app-cart',
   imports: [CommonModule],
   templateUrl: './cart.component.html',
   styleUrl: './cart.component.css'
 })
 export class CartComponent implements OnInit {
   cartItems: any[] = [];
   total: number = 0;

   constructor(
     private cartService: SharedCartService,
     private router: Router, // Inject Router
     private apiService: ShareDataApiService // If you are using it here
   ) {}

   ngOnInit(): void {
     this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
     this.calculateTotal();
   }

   calculateTotal(): void {
     this.total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
   }

   changeQuantity(item: any, change: number): void {
     item.quantity += change;
     if (item.quantity <= 0) {
       this.removeItem(item);
     } else {
       localStorage.setItem('cart', JSON.stringify(this.cartItems));
       this.calculateTotal();
       if (this.cartService.cartCount$) {
         (this.cartService.cartCount$ as BehaviorSubject<number>).next(this.cartItems.reduce((total, item) => total + item.quantity, 0));
       }
     }
   }

   removeItem(item: any): void {
     this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
     localStorage.setItem('cart', JSON.stringify(this.cartItems));
     this.calculateTotal();
     if (this.cartService.cartCount$) {
       (this.cartService.cartCount$ as BehaviorSubject<number>).next(this.cartItems.reduce((total, item) => total + item.quantity, 0));
     }
   }

   proceedToCheckout(): void {
     this.router.navigate(['/checkout']); // Navigate to the checkout route
   }
 }