import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedCartService {
  private _cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this._cartCountSubject.asObservable();
  private baseUrl = 'https://passantmohamed-001-site1.mtempurl.com/api'; // Assuming this is still the correct base URL

  constructor(private http: HttpClient) {
    this.loadInitialCartCount();
  }

  private updateCartCount(items: any[]): void {
    this._cartCountSubject.next(items.reduce((total, item) => total + item.quantity, 0));
  }

  public loadInitialCartCount(): void {
    this.getCartItemsDetailed().subscribe({
      next: (items) => {
        this.updateCartCount(items);
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
    return this.http.post(`${this.baseUrl}/api/app/cart/to-cart/${productId}`, {}, { headers });
  }

  // GET /api/app/cart/cart-items
  getCartItemsDetailed(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/app/cart/cart-items`).pipe(
      map(response => {
        const items = response as any[];
        this.updateCartCount(items);
        return items.map(item => ({
          ...item,
          id: item.productId // Assuming 'productId' is the correct identifier
        }));
      })
    );
  }

  updateCartItemQuantity(itemId: string, quantity: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/api/app/cart/update-item`, { itemId, quantity }, { headers })
  }

  removeCartItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/cart/items/${itemId}`);
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
}