import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedCartService } from '../../shared-cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ShareDataApiService } from '../share-data-api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  cartItems: any[] = [];
  total: number = 0;
  cartSubscription: Subscription | undefined;
  errorMessage: string = '';
  isLoadingCart: boolean = false;
  checkoutForm: FormGroup;
  orderPlacedMessage: string = '';
  isLoadingOrderSummary: boolean = false;
  orderSummary: any;
  message: string = '';

  constructor(
    private cartService: SharedCartService,
    private router: Router,
    private apiService: ShareDataApiService,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.isLoggedIn = !!localStorage.getItem('authToken'); // Example
  }

  ngOnInit(): void {
    this.loadCartItems();
    if (this.isLoggedIn) {
      this.loadOrderSummary();
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadCartItems(): void {
    this.isLoadingCart = true;
    this.cartSubscription = this.cartService.getCartItemsDetailed().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotal();
        this.updateCartCount();
        this.isLoadingCart = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load cart items.';
        console.error('Error loading cart:', error);
        this.isLoadingCart = false;
      }
    });
  }

  loadOrderSummary(): void {
    this.isLoadingOrderSummary = true;
    this.apiService.getOrderSummary().subscribe({
      next: (data) => {
        console.log('Order Summary Data:', data);
        this.orderSummary = data;
        this.isLoadingOrderSummary = false;
      },
      error: (error) => {
        console.error('Error loading order summary:', error);
        this.isLoadingOrderSummary = false;
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }

  changeQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      this.removeItem(item);
      return;
    }

    this.isLoadingCart = true;
    this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
        if (index !== -1) {
          this.cartItems[index] = { ...this.cartItems[index], quantity: updatedItem.quantity };
          this.calculateTotal();
          this.updateCartCount();
        }
        this.isLoadingCart = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to update quantity.';
        console.error('Error updating quantity:', error);
        this.isLoadingCart = false;
      }
    });
  }

  removeItem(item: any): void {
    this.isLoadingCart = true;
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
        this.calculateTotal();
        this.updateCartCount();
        this.isLoadingCart = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to remove item.';
        console.error('Error removing item:', error);
        this.isLoadingCart = false;
      }
    });
  }

  updateCartCount(): void {
    const newCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.cartService.updateCartItemQuantity; // Corrected call
  }

  login(): void {
    localStorage.setItem('authToken', 'fake_token'); // Placeholder
    this.isLoggedIn = true;
    this.router.navigate(['/checkout']); // Redirect back to checkout
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Example
    this.isLoggedIn = false;
    this.orderSummary = null;
    this.message = 'Logged out successfully.';
  }

  proceedToCheckout(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.cartItems.length > 0) {
    } else {
      this.errorMessage = 'Your cart is empty. Add items to proceed.';
    }
  }


  placeOrder(): void {
    if (this.isLoggedIn) {
      if (this.checkoutForm.valid && this.cartItems.length > 0) {
        const orderData = {
          shippingInfo: this.checkoutForm.value,
          items: this.cartItems.map(item => ({
            productId: item.product?.id,
            quantity: item.quantity
          })),
          totalAmount: this.orderSummary?.total || this.total + 5,
          shippingCost: this.orderSummary?.shippingCost || 5
          // Add other necessary order details based on your API requirements
        };

        this.apiService.createOrder(orderData).subscribe({
          next: (response) => {
            console.log('Order placed successfully:', response);
            this.orderPlacedMessage = 'Order placed successfully!';
            this.cartService.clearCart().subscribe(() => {
              this.cartItems = [];
              this.total = 0;
              this.updateCartCount();
              this.checkoutForm.reset();
              this.router.navigate(['/order-confirmation']); // Adjust your route
            });
          },
          error: (error) => {
            console.error('Error placing order:', error);
            this.errorMessage = 'Failed to place order.';
            alert('There was an error placing your order. Please try again.');
          }
        });
      } else {
        this.errorMessage = 'Please fill in all shipping information and ensure your cart is not empty.';
        alert('Please fill in all shipping information and ensure your cart is not empty.');
      }
    } else {
      alert('Please log in to place your order.');
      this.router.navigate(['/login']); // Optionally redirect to login
    }
  }
}