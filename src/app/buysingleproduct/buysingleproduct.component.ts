import { CommonModule } from '@angular/common';
 import { Component, OnInit } from '@angular/core';
 import { ActivatedRoute, Router, RouterLink } from '@angular/router';
 import { ShareDataApiService } from '../share-data-api.service';
 import { SharedCartService } from '../../shared-cart.service';
 import { catchError, of } from 'rxjs';
 import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

 @Component({
  selector: 'app-buysingleproduct',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './buysingleproduct.component.html',
  styleUrl: './buysingleproduct.component.css'
 })
 export class BuysingleproductComponent implements OnInit {
  singleProduct: any;
  errorMessage: string = '';
  loading: boolean = true;
  productIdFromRoute: string | null = null;
  products: any[] = [];
  quantityToAdd: number = 1;
  showCreateForm: boolean = false;
  createProductForm: FormGroup;
  createErrorMessage: string = '';
  createSuccessMessage: string = '';

  constructor(
    private _SharedDataService: ShareDataApiService,
    private cartService: SharedCartService,
    private _ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createProductForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      quantityAvailable: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      this.productIdFromRoute = params['id'];
      console.log('Product ID from Route:', this.productIdFromRoute);
      this.fetchProductDetails(this.productIdFromRoute);
    });
  }

  fetchProductDetails(productId: string | null): void {
    if (!1 || isNaN((1))) {
      this.errorMessage = 'Invalid product ID in the URL.';
      this.loading = false;
      console.error('Invalid product ID in the URL.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this._SharedDataService.getProductsbyID((1)).pipe( 
      catchError((err) => {
        this.errorMessage = 'Error loading product details.';
        console.error('Error loading product details:', err);
        this.loading = false;
        return of(null);
      })
    ).subscribe((product) => {
      this.loading = false;
      console.log('Product received:', product);
      if (product) {
        this.singleProduct = product;
        console.log('Single Product assigned:', this.singleProduct);
      } else {
        this.errorMessage = 'Product not found.';
        console.error('Product not found.');
      }
    });
  }

  addToCart(): void {
    if (this.singleProduct && this.quantityToAdd > 0) {
      const cartItem = {
        id: this.singleProduct.id,
        name: this.singleProduct.title,
        image: this.singleProduct.imageUrl,
        price: this.singleProduct.price,
        quantity: this.quantityToAdd,
      };
      this.cartService.addToCart(cartItem);
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.createErrorMessage = '';
    this.createSuccessMessage = '';
    this.createProductForm.reset();
  }

  onCreateProductSubmit(): void {
    if (this.createProductForm.valid) {
      this._SharedDataService.createProduct(this.createProductForm.value).subscribe({
        next: (response) => {
          console.log('Product created:', response);
          this.createSuccessMessage = 'Product created successfully!';
          this.createErrorMessage = '';
          this.createProductForm.reset();
          this.showCreateForm = false;
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.createErrorMessage = 'Error creating product.';
          this.createSuccessMessage = '';
        }
      });
    } else {
      this.createErrorMessage = 'Please fill in all required fields correctly.';
      this.createSuccessMessage = '';
    }
  }
 }