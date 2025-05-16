import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedCartService } from '../../shared-cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShareDataApiService } from '../share-data-api.service'; 

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  total: number = 0;
  private cartSubscription: Subscription | undefined;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private cartService: SharedCartService,
    private router: Router,
    private apiService: ShareDataApiService 
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      
      console.log('Cart Count Updated:', count);
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.cartService.getCartItemsDetailed().subscribe({
      next: (items) => {
        this.cartItems = items;
        console.log('Cart Items:', this.cartItems); 
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.errorMessage = 'Failed to load cart items.';
        this.isLoading = false;
        
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  }

  changeQuantity(item: any, change: number): void {
    const originalQuantity = item.quantity;
    const newQuantity = originalQuantity + change;

    if (newQuantity <= 0) {
      this.removeItem(item);
      return;
    }
    const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
      this.cartItems[index] = { ...this.cartItems[index], quantity: newQuantity };
      this.calculateTotal();
    }

    this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
      next: (response) => {
        console.log('Quantity updated successfully on server:', response);
        
      },
      error: (error) => {
        this.errorMessage = 'Failed to update quantity.';
        console.error('Error updating quantity:', error);
        if (index !== -1) {
          this.cartItems[index] = { ...this.cartItems[index], quantity: originalQuantity };
          this.calculateTotal(); 
        }
      }
    });
  }

  removeItem(item: any): void {
    this.isLoading = true;
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
        this.calculateTotal();
        this.cartService.loadInitialCartCount(); 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.errorMessage = 'Failed to remove item.';
        this.isLoading = false;
        
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}