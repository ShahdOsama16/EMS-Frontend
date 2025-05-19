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

  constructor(
    private cartService: SharedCartService,
    private router: Router,
    private apiService: ShareDataApiService 
  ) {}

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
    this.cartService.getCartItemsDetailed().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  changeQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      this.removeItem(item);
      return;
    }

    this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.calculateTotal();
        
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(item: any): void {
    this.cartService.removeCartItem(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
        this.calculateTotal();
        
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}