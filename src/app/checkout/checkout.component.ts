import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedCartService } from '../../shared-cart.service';
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
  orderSummarySubscription: Subscription | undefined;
  errorMessage: string = '';
  isLoadingCart: boolean = false;
  isLoadingOrderSummary: boolean = false;
  orderSummary: any;
  checkoutForm: FormGroup;
  orderPlacedMessage: string = '';

  constructor(
    private cartService: SharedCartService,
    private apiService: ShareDataApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  ngOnInit(): void {
    this.loadCartData();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.orderSummarySubscription) {
      this.orderSummarySubscription.unsubscribe();
    }
  }

  loadCartData(): void {
    this.isLoadingCart = true;
    this.cartSubscription = this.cartService.getCartItemsDetailed().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loadOrderSummary();
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
    this.orderSummarySubscription = this.apiService.getOrderSummary().subscribe({
      next: (summary) => {
        console.log('Order Summary Data:', summary);
        this.orderSummary = summary;
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

    // Immediately update the quantity in the local cartItems array
    const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
      this.cartItems[index] = { ...this.cartItems[index], quantity: newQuantity };
      this.calculateTotal();
      this.loadOrderSummary(); // Update order summary as quantity changes
    }

    // Then, make the API call to update the backend
    this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        // The local update is already done, no need to update again here
      },
      error: (error) => {
        this.errorMessage = 'Failed to update quantity.';
        console.error('Error updating quantity:', error);
        // Optionally, revert the local change if the API call fails
        if (index !== -1) {
          this.cartItems[index].quantity = item.quantity; // Revert to the old quantity
          this.calculateTotal();
          this.loadOrderSummary();
        }
      }
    });
  }

  removeItem(item: any): void {
    this.isLoadingCart = true;
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
        this.calculateTotal();
        this.loadOrderSummary(); // Update order summary after removing item
        this.isLoadingCart = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to remove item.';
        console.error('Error removing item:', error);
        this.isLoadingCart = false;
      }
    });
  }

  proceedToCheckout(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout-form']);
    } else {
      this.errorMessage = 'Your cart is empty. Add items to proceed.';
    }
  }

  login(): void {
    localStorage.setItem('authToken', 'fake_token');
    this.isLoggedIn = true;
    this.loadCartData();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.cartItems = [];
    this.total = 0;
    this.orderSummary = null;
  }

  placeOrder(): void {
    if (!this.isLoggedIn || !this.checkoutForm.valid || this.cartItems.length === 0) {
      this.errorMessage = '';
      alert(this.errorMessage);
      return;
    }

    const orderData = {
      shippingInfo: this.checkoutForm.value,
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      totalAmount: this.orderSummary?.total || this.total + 5,
      shippingCost: this.orderSummary?.shipping || 5
    };

    this.apiService.createOrder(true).subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);
        this.orderPlacedMessage = 'Order placed successfully!';
        this.cartService.clearCart().subscribe(() => {
          this.cartItems = [];
          this.total = 0;
          this.checkoutForm.reset();
          this.router.navigate(['/order-confirmation']);
        });
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.errorMessage = 'Failed to place order.';
        alert('There was an error placing your order. Please try again.');
      }
    });
  }
}