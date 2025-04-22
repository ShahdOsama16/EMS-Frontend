import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedCartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  private baseUrl = 'https://passantmohamed-001-site1.mtempurl.com/api';

  constructor(private http: HttpClient) {
    this.loadInitialCartCount();
  }

  private loadInitialCartCount(): void {
    this.getCartItemsDetailed().subscribe({
      next: (items) => {
        this.cartCountSubject.next(items.reduce((total, item) => total + item.quantity, 0));
      },
      error: (error) => {
        console.error('Error loading initial cart count:', error);
      }
    });
  }

  // POST /add
  addToCart(productData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/add`, productData, { headers });
  }

  // GET /items
  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/items`);
  }

  // POST /api/app/cart/to-cart/{productId}
  addProductToCart(productId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`<span class="math-inline">\{this\.baseUrl\}/api/app/cart/to\-cart/</span>{productId}`, {}, { headers });
  }

  // GET /api/app/cart/cart-items
  getCartItemsDetailed(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/app/cart/cart-items`).pipe(
      // Assuming the response is directly the array now
      map(response => response as any[])
    );
  }

  updateCartItemQuantity(itemId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`<span class="math-inline">\{this\.baseUrl\}/api/cart/items/</span>{itemId}`, { quantity });
  }

  removeCartItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`<span class="math-inline">\{this\.baseUrl\}/api/cart/items/</span>{itemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/cart`);
  }

  createOrder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/create`, orderData, { headers });
  }

  placeOrder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/api/app/order/order`, orderData, { headers });
  }

  getOrderSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/app/order/order-summary`);
  }

  // updateCartCount(): void {
  //   if (this.cartService.cartCount$) {
  //     (this.cartService.cartCount$ as BehaviorSubject<number>).next(
  //       this.cartItems.reduce((total, item) => total + item.quantity, 0)
  //     );
  //   }
  // }


}