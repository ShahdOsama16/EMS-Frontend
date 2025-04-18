import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedCartService {
    private cartItems: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
    private cartCountSubject = new BehaviorSubject<number>(this.calculateCartCount());
    cartCount$ = this.cartCountSubject.asObservable();
  
    addToCart(item: any): void {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push(item);
      }
      this.updateCart();
    }
  
    private updateCart(): void {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
      this.cartCountSubject.next(this.calculateCartCount());
    }
  
    private calculateCartCount(): number {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }
  
    updateCartCount(count: number): void { // Add this method
      this.cartCountSubject.next(count);
    }
  }