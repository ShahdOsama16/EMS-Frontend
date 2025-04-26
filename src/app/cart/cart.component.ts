import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedCartService } from '../../shared-cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShareDataApiService } from '../share-data-api.service'; // Assuming you might need it

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
    private apiService: ShareDataApiService // If you are using it here
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      // Optionally update a local cart count display if needed
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
        console.log('Cart Items:', this.cartItems); // Add this line
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.errorMessage = 'Failed to load cart items.';
        this.isLoading = false;
        // Optionally display an error message to the user
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  }

  changeQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      this.removeItem(item);
      return;
    }

    this.isLoading = true;
    this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
        if (index !== -1) {
          this.cartItems[index] = { ...this.cartItems[index], quantity: updatedItem.quantity };
          this.calculateTotal();
          this.cartService.loadInitialCartCount(); // Refresh cart count in service
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.errorMessage = 'Failed to update quantity.';
        this.isLoading = false;
        // Optionally display an error message
      }
    });
  }

  removeItem(item: any): void {
    this.isLoading = true;
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
        this.calculateTotal();
        this.cartService.loadInitialCartCount(); // Refresh cart count in service
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.errorMessage = 'Failed to remove item.';
        this.isLoading = false;
        // Optionally display an error message
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}