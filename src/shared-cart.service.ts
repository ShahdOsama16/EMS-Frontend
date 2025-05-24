import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedCartService {
  private _cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this._cartCountSubject.asObservable();
  private baseUrl = 'https://passantmohamed-001-site1.mtempurl.com/api'; 

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
  addToCart(productData: any): Observable<any> {
    const token = localStorage.getItem('accessToken'); 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`https://passantmohamed-001-site1.mtempurl.com/add`, productData, { headers });
  }
  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/items`);
  }
  addProductToCart(productId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/api/app/cart/to-cart/${productId}`, {}, { headers });
  }

  getCartItemsDetailed(): Observable<any[]> {
    const token = localStorage.getItem('accessToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any[]>(`${this.baseUrl}/app/cart/cart-items`, { headers }).pipe(
      map(items => {
        this.updateCartCount(items);
        return items.map(item => ({
          ...item,
          id: item.productId 
        }));
      })
    );
  }
  updateCartItemQuantity(productId: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(
      `${this.baseUrl}/app/cart/cart-item/${productId}?quantity=${quantity}`,
      {}, 
      { headers }
    );
  }

  removeCartItem(itemId: string): Observable<void> {
  
    const token = localStorage.getItem('accessToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete<void>(
      `${this.baseUrl}/app/cart/from-cart/1`,
      { headers }
    );
  }
  clearCart(): Observable<void> {
    const token = localStorage.getItem('accessToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete<void>(
      `${this.baseUrl}/app/cart/from-cart/1`,
      { headers }
    );
  }
   createOrder(): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'text/plain',
      'X-Requested-With': 'XMLHttpRequest'
    });
  
    return this.http.post(
      'https://passantmohamed-001-site1.mtempurl.com/api/app/order/order?isCod=true',
      {}, 
      { headers }
    );
  }

  placeOrder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/api/app/order/order`, orderData, { headers });
  }

  getOrderSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/app/order/order-summary`);
  }
}