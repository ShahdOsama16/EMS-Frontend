// adminproduct.component.ts
import { Component, OnInit } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { Router, RouterLink } from '@angular/router';
 import { ShareDataApiService } from '../share-data-api.service'; // Adjust path
 import { Observable, Subscription } from 'rxjs';

 interface Product {
  id: string; // Assuming your backend returns an ID
  imageUrl: string;
  name: string;
  category: string;
  price: string;
 }

 @Component({
  selector: 'app-adminproduct',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './adminproduct.component.html',
  styleUrls: ['./adminproduct.component.css'],
 })
 export class AdminproductComponent implements OnInit {
  products: any ;
  productSubscription: Subscription | undefined;
  errorMessage: string = '';

  constructor(private router: Router, private shareddataapiservice: ShareDataApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.productSubscription = this.shareddataapiservice.getProducts().subscribe({
      next: (data) => {
        this.products = data; // Assuming the API returns an array of products
      },
      error: (error) => {
        this.errorMessage = 'Error loading products.';
        console.error(this.errorMessage, error);
      },
    });
  }

  updateProduct(product: Product): void {
    // Navigate to an update product page with the product ID
    this.router.navigate(['/admin/update-product', product.id]);
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.shareddataapiservice.deleteUser(product.id).subscribe({
        next: (response) => {
          console.log('Product deleted:', response);
          this.loadProducts(); // Reload the product list
        },
        error: (error) => {
          this.errorMessage = 'Error deleting product.';
          console.error(this.errorMessage, error);
        },
      });
    }
  }
 }