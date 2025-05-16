import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service';
import { CommonModule } from '@angular/common';

interface RecipeDetail {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  image: string | null; 
  id: number;
  mealType: string[];
  caloriesPerServing: number;
}

@Component({
  selector: 'app-single-product',
  imports: [CommonModule],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css'
})
export class SingleProductComponent implements OnInit {
  singleRecipe: RecipeDetail | null = null;
  errorMessage: string = '';
  imageBaseUrl = 'https://passantmohamed-001-site1.mtempurl.com/images/';

  constructor(
    private _ShareDataApiService: ShareDataApiService,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      const recipeId = params['id'];
      this.loadRecipeDetails(recipeId);
    });
  }

  loadRecipeDetails(id: string): void {
    this._ShareDataApiService.getSingleRecipe(parseInt(id)).subscribe({
      next: (res: any) => {
        if (res) {
          this.singleRecipe = {
            name: res.name,
            ingredients: res.ingredients,
            instructions: res.instructions,
            prepTimeMinutes: res.prepTimeMinutes,
            cookTimeMinutes: res.cookTimeMinutes,
            servings: res.servings,
            difficulty: res.difficulty,
            cuisine: res.cuisine,
            image: this.imageBaseUrl +res.image, 
            id: res.id,
            mealType: res.mealType,
            caloriesPerServing: res.caloriesPerServing,
          } as RecipeDetail;
          console.log('Single Recipe Details:', this.singleRecipe);
        } else {
          this.singleRecipe = null;
          this.errorMessage = 'Recipe not found.';
          console.error('Recipe not found with ID:', id);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error loading recipe details.';
        console.error('Error loading recipe by ID:', err);
      },
    });
  }
}