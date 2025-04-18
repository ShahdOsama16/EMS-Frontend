import { Component, OnInit } from '@angular/core';
import { SharedCartService } from '../../shared-cart.service';

@Component({
  selector: 'app-cart.',
  standalone: true,
  imports: [],
  templateUrl: './cart..component.html',
  styleUrl: './cart..component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: SharedCartService) {}

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
      this.cartService['cartCountSubject'].next(this.cartItems.reduce((total, item) => total + item.quantity, 0)); // Corrected line
    }
  }

  removeItem(item: any): void {
    this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.calculateTotal();
    this.cartService['cartCountSubject'].next(this.cartItems.reduce((total, item) => total + item.quantity, 0)); // Corrected line
  }
}
