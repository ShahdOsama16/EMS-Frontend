import { Component, OnInit } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { ShareDataApiService } from '../share-data-api.service'; // Adjust the path
 import { Router } from '@angular/router';

 @Component({
   selector: 'app-checkout',
   imports: [CommonModule],
   templateUrl: './checkout.component.html',
   styleUrl: './checkout.component.css'
 })
 export class CheckoutComponent implements OnInit {
   cartItems: any[] = [];
   total: number = 0;
   isLoggedIn: boolean = false; // Simple auth

   constructor(private apiService: ShareDataApiService, private router: Router) {}

   ngOnInit(): void {
     this.apiService.getOrderSummary().subscribe({
       next: (summary) => {
         this.cartItems = summary.items || []; // Adjust based on your API response structure
         this.total = summary.total || 0; // Adjust based on your API response structure
       },
       error: (error) => {
         console.error('Error fetching order summary:', error);
         // Optionally show an error message to the user
         // Fallback to local storage (or handle error differently)
         this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
         this.calculateTotal();
       }
     });
     // Simple auth: Replace with your actual auth mechanism
     this.isLoggedIn = localStorage.getItem('authToken') != null;
   }

   calculateTotal(): void {
     this.total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
   }

   login(): void {
     // Replace this with your actual login logic (e.g., redirect to a login page)
     // After successful login, you would typically:
     // 1. Receive an authentication token from the backend.
     // 2. Store the token (e.g., in localStorage, sessionStorage, or a cookie).
     // 3. Set isLoggedIn to true.
     localStorage.setItem('authToken', 'fake_token'); // Placeholder
     this.isLoggedIn = true;
     this.router.navigate(['/checkout']); // Redirect back to checkout
   }

   logout(): void {
     // Replace this with your actual logout logic
     // This might involve:
     // 1. Clearing the authentication token.
     // 2. Redirecting to a login page.
     localStorage.removeItem('authToken');
     this.isLoggedIn = false;
     this.router.navigate(['/']); // Redirect to home or login
   }

   placeOrder(): void {
     if (this.isLoggedIn) {
       const orderData = {
         items: this.cartItems, // Or format it according to your API
         total: this.total,
         // Add other necessary order details (shipping address, etc.)
       };

       this.apiService.placeOrder(orderData).subscribe({
         next: (response) => {
           console.log('Order placed successfully:', response);
           // Optionally clear the cart on success
           localStorage.removeItem('cart');
           // Redirect to a confirmation page
           this.router.navigate(['/order-confirmation']);
         },
         error: (error) => {
           console.error('Error placing order:', error);
           alert('There was an error placing your order. Please try again.');
         }
       });
     } else {
       alert('Please log in to place your order.');
     }
   }
 }