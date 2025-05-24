import { HttpClient, HttpHeaders } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { BehaviorSubject, Observable } from 'rxjs';

 @Injectable({
  providedIn: 'root'
 })
 export class ShareDataApiService {
  isLogin = new BehaviorSubject<boolean>(!!localStorage.getItem('accessToken')); 
  private baseUrl = 'https://passantmohamed-001-site1.mtempurl.com/api'; 
  private userRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('user_role'));
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  constructor(private _httpClient: HttpClient) { }
 isAdminUser(): boolean {
    return this.userRoleSubject.value === 'admin';
  }
  login(loginData: any): Observable<any> {
   const headers = new HttpHeaders({
    'accept': 'text/plain',
    'Content-Type': 'application/json',
    'RequestVerificationToken': 'CFdJ8G9kUgQegpFMINWX2j02IETD4xFc6pJMTX1GPr-  gMcNXAWIfjfa7bdJdg2eCwAVt6A_Adj16sP_dVTM8yxlvUkNH40wruBUlqi4-qesM8S70ggb7hPAPM2PtJ-P36-2rQlkBkVrCIImd7IVfT-CPe3Nw',
    'X-Requested-With': 'XMLHttpRequest'
   });
   return this._httpClient.post(`${this.baseUrl}/app/authentication/login`, loginData, { headers });
  }

  register(userData: any): Observable<any> {
   const headers = new HttpHeaders({
    'accept': 'text/plain',
    'Content-Type': 'application/json',
   });
   return this._httpClient.post(`${this.baseUrl}/app/authentication/register`, userData, { headers });
  }

  getProductbyID(id: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/product/${id}`);
  }

  createProduct(productData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Custom-Header': 'some-admin-value'
    });
    return this._httpClient.post(`${this.baseUrl}/product`, productData, { headers });
  }
  // ABP Framework Core Endpoints
  getAbpApiDefinition(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/abp/api-definition`);
  }

  getAbpApplicationConfiguration(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/abp/application-configuration`);
  }

  getAbpApplicationLocalization(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/abp/application-localization`);
  }
  // Account Endpoints
  sendPasswordResetCode(resetRequest: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/account/send-password-reset-code`, resetRequest, { headers });
  }

  verifyPasswordResetToken(verificationRequest: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/account/verify-password-reset-token`, verificationRequest, { headers });
  }
  resetPassword(resetData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/account/reset-password`, resetData, { headers });
  }

  registerAuth(userData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/app/authentication/register`, userData, { headers });
  }
  getTenantByPhoneNumber(phoneNumber: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/app/authentication/tenant\-by\-phone\-number\-dto?phoneNumber\=</span>{phoneNumber}`);
  }
  getCurrentUserDetails(): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    });
    return this._httpClient.get(
      `${this.baseUrl}/app/authentication/current-user-details`, 
      { headers }
    );
  }

  // Cart Endpoints
  addToCart(productData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._httpClient.post(`${this.baseUrl}/add`, productData, { headers });
  }

  // GET /items
  getCartItems(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.baseUrl}/items`);
  }

  // POST /api/app/cart/to-cart/{productId}
  addProductToCart(productId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._httpClient.post(`${this.baseUrl}/api/app/cart/to-cart/${productId}`, {}, { headers });
  }

  // GET /api/app/cart/cart-items
  getCartItemsDetailed(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.baseUrl}/api/app/cart/cart-items`);
  }

  updateCartItemQuantity(itemId: string, quantity: number): Observable<any> {
    return this._httpClient.put<any>(`${this.baseUrl}/api/cart/items/${itemId}`, { quantity });
  }

  removeCartItem(itemId: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/api/cart/items/${itemId}`);
  }

  clearCart(): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/app/cart/from-cart/1`);
  }
  // ContactUs Endpoints
  createContactUs(contactData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/app/contact-us`, contactData, { headers });
  }
  getContactUsList(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/app/contact-us`);
  }
  updateContactUs(id: string, contactData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.put(`<span class="math-inline">\{this\.baseUrl\}/app/contact\-us/</span>{id}`, contactData, { headers });
  }
  deleteContactUs(id: string): Observable<any> {
   return this._httpClient.delete(`<span class="math-inline">\{this\.baseUrl\}/app/contact\-us/</span>{id}`);
  }
  getContactUsById(id: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/app/contact\-us/</span>{id}`);
  }
  // DynamicClaims Endpoint
  refreshDynamicClaims(): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/account/dynamic-claims/refresh`, {}, { headers });
  }
  // EmailSettings Endpoints
  getEmailSettings(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/setting-management/emailing`);
  }
  updateEmailSettings(settings: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/setting-management/emailing`, settings, { headers });
  }
  sendTestEmail(testEmailData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/setting-management/emailing/send-test-email`, testEmailData, { headers });
  }
  // Features Endpoints
  getFeatures(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/feature-management/features`);
  }
  updateFeatures(featureData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.put(`${this.baseUrl}/feature-management/features`, featureData, { headers });
  }
  deleteFeatures(featureData: any): Observable<any> {
   return this._httpClient.delete(`${this.baseUrl}/feature-management/features`, featureData);
  }
  logoutAccount(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/account/logout`);
  }
  checkPassword(passwordData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/account/check-password`, passwordData, { headers });
  }
  // Order Endpoints
  createOrder(isCod: boolean): Observable<any> {
    const token = localStorage.getItem('accessToken'); 
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,       
      'Content-Type': 'application/json'
    });
  
    return this._httpClient.post(
      `${this.baseUrl}/app/order/order?isCod=${isCod}`,
      {}, 
      { headers } 
    );
  }
  placeOrder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._httpClient.post(`${this.baseUrl}/api/app/order/order`, orderData, { headers });
  }
  getOrderSummary(): Observable<any> {
    const token = localStorage.getItem('accessToken'); 
   
     const headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`,       
    'Content-Type': 'application/json'
     });
     return this._httpClient.get<any>(`${this.baseUrl}/app/order/order-summary`, { headers });
   }
  // Permissions Endpoints
  getPermissions(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/permission-management/permissions`);
  }
  updatePermissions(permissionData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.put(`${this.baseUrl}/permission-management/permissions`, permissionData, { headers });
  }
  // Product Endpoints (rest are fine)
  getProducts(): Observable<any> {
   return this._httpClient.get(`https://passantmohamed-001-site1.mtempurl.com/api/app/product?MaxResultCount=1000`);
  }
  getProductsbyID(id:number): Observable<any> {
   return this._httpClient.get(`https://passantmohamed-001-site1.mtempurl.com/api/app/product/1`);
  }
  // Profile Endpoints
  getMyProfile(): Observable<any> {
    const token = localStorage.getItem('accessToken'); 
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,           
      'Content-Type': 'application/json'             
    });
  
    return this._httpClient.get(
      'https://passantmohamed-001-site1.mtempurl.com/api/app/authentication/current-user-details',
      { headers }
    );
  }
  getCurrentProfileDetails(): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
   'Accept': 'application/json' 
   });
     return this._httpClient.get(
  'https://passantmohamed-001-site1.mtempurl.com/api/app/authentication/profile',
   { headers }
   );
    }
    updateMyProfile(profileData: any): Observable<any> {
      const token = localStorage.getItem('accessToken');
      const headers = new HttpHeaders({
  'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
    });
      return this._httpClient.put(`https://passantmohamed-001-site1.mtempurl.com/api/app/authentication/profile`, profileData, { headers });
       }
  changePassword(passwordData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/account/my-profile/change-password`, passwordData, { headers });
  }
  // Recipe Endpoints
  getRecipes(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/app/recipe/?MaxResultCount=66`); 
  }

  getSingleRecipe(id: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/app/recipe/${id}`);
  }
  getRecipesbyid(id: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/app/recipe/${id}`); 
  }
  // TimeZoneSettings Endpoints
  getTimezoneSettings(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/setting-management/timezone`);
  }
  updateTimezoneSettings(timezoneInfo: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/setting-management/timezone`, timezoneInfo, { headers });
  }
  getTimezones(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/setting-management/timezone/timezones`);
  }
  // User Endpoints 
  getUserById(id: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/</span>{id}`);
  }
  updateUser(id: string, userData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.put(`<span class="math-inline">\{this\.baseUrl\}/identity/users/</span>{id}`, userData, { headers });
  }
  deleteUser(id: string): Observable<any> {
   return this._httpClient.delete(`<span class="math-inline">\{this\.baseUrl\}/identity/users/</span>{id}`);
  }
  getUsers(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/identity/users`);
  }
  createUser(userData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/identity/users`, userData, { headers });
  }
  getUserRoles(id: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/</span>{id}/roles`);
  }
  updateUserRoles(id: string, rolesData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.put(`<span class="math-inline">\{this\.baseUrl\}/identity/users/</span>{id}/roles`, rolesData, { headers });
  }
  getAssignableRoles(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/identity/users/assignable-roles`);
  }
  getUserByUsername(userName: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/by\-username/</span>{userName}`);
  }
  getUserByEmail(email: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/by\-email/</span>{email}`);
  }
  // UserLookup Endpoints (Binding the APIs from the third image)
  getUserLookupById(id: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/lookup/</span>{id}`);
  }
  getUserLookupByUsername(userName: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/lookup/by\-username/</span>{userName}`);
  }
  searchUsersLookup(filter?: string, sorting?: string, skipCount?: number, maxResultCount?: number): Observable<any> {
   let params = '';
   if (filter) {
    params += `filter=${filter}&`;
   }
   if (sorting) {
    params += `sorting=${sorting}&`;
   }
   if (skipCount !== undefined) {
    params += `skipCount=${skipCount}&`;
   }
   if (maxResultCount !== undefined) {
    params += `maxResultCount=${maxResultCount}&`;
   }
  
   if (params.endsWith('&')) {
    params = params.slice(0, -1);
   }
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/lookup/search</span>{params ? '?' + params : ''}`);
  }
  getUsersLookupCount(filter?: string): Observable<any> {
   let params = '';
   if (filter) {
    params += `filter=${filter}`;
   }
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/identity/users/lookup/count</span>{params ? '?' + params : ''}`);
  }
  // Workout Endpoints
  createWorkout(workoutData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.post(`${this.baseUrl}/app/workout?MaxResultCount=33`, workoutData, { headers });
  }
  getWorkouts(): Observable<any> {
   return this._httpClient.get(`${this.baseUrl}/app/workout?MaxResultCount=33`);
  }
  updateWorkout(id: string, workoutData: any): Observable<any> {
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this._httpClient.put(`<span class="math-inline">\{this\.baseUrl\}/app/workout?MaxResultCount\=33</span>{id}`, workoutData, { headers });
  }
  deleteWorkout(id: string): Observable<any> {
   return this._httpClient.delete(`<span class="math-inline">\{this\.baseUrl\}/app/workout?MaxResultCount\=33</span>{id}`);
  }
  getWorkoutById(id: string): Observable<any> {
   return this._httpClient.get(`<span class="math-inline">\{this\.baseUrl\}/app/workout?MaxResultCount\=33</span>{id}`);
  }

  getSingleProduct(id: number): Observable<any> {
   return this._httpClient.get(`https://dummyjson.com/products/${id}`);
  }

  getContactMessages(): Observable<any> {
    return this._httpClient.get(`https://passantmohamed-001-site1.mtempurl.com/api/app/contact-us`);
  }
  // Example of a method to make an authenticated request
  getSecureData(): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this._httpClient.get(`${this.baseUrl}/api/secure-endpoint`, { headers });
  }
  clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_role');
    console.log('Authentication data cleared on logout.');
  }
  

  // FitnessInfo Endpoints
  getFitnessInfo(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/app/fitness-info?MaxResultCount=1000`, { headers: this.getAuthHeaders() });
  }
  createFitnessInfo(fitnessData: any): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/app/fitness-info`, fitnessData, { headers: this.getAuthHeaders() });
  }
  generateFitnessCommandString(fitnessData: any): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/app/fitness-info/generate-command-string`, fitnessData, { headers: this.getAuthHeaders() });
  }
  updateFitnessCommandString(id: string, commandStringData: any): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/app/fitness-info/${id}/command-string`, commandStringData, { headers: this.getAuthHeaders() });
  }
  getFitnessCommandAsPayload(id: string): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/app/fitness-info/${id}/command-as-payload`, { headers: this.getAuthHeaders() });
  }
  getFitnessCommandStringById(id: string): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/app/fitness-info/${id}/command-string-by-id`, { headers: this.getAuthHeaders() });
  }
  updateFitnessInfo(id: string, fitnessData: any): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/app/fitness-info/${id}`, fitnessData, { headers: this.getAuthHeaders() });
  }
  deleteFitnessInfo(id: string): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/app/fitness-info/${id}`, { headers: this.getAuthHeaders() });
  }
  getFitnessInfoById(id: string): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/app/fitness-info/${id}`, { headers: this.getAuthHeaders() });
  }
}



