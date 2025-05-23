import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ShareDataApiService } from '../share-data-api.service';
import { Router, RouterLink } from '@angular/router';

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  image: string;
  mealType: string; 
}
@Component({
  selector: 'app-recipes',
  imports: [CommonModule,],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipes: any[] = [];
  errorMessage: string = '';

  constructor(private _ShareDataApiService: ShareDataApiService, private _Router: Router) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this._ShareDataApiService.getRecipes().subscribe(
      {
        next: (res: { totalCount: number; items: any[] }) => {
          console.log('Recipes from API:', res);
          this.recipes = res.items.map((item: any, index: number) => ({
            ...item,
            image: `https://passantmohamed-001-site1.mtempurl.com/images/${item.image}`,
            id: index+1
          
          }));
          console.log('this.recipes after assignment:', this.recipes);
        },
        error: (err) => {
          console.error('Error loading recipes:', err);
          this.errorMessage = 'Failed to load recipes.';
        },
        complete: () => {
          console.log('Loading recipes complete');
        }
      }
    );
  }

  viewRecipeDetail(id: number): void {
         console.log('viewRecipeDetail called with id:', id);
        this._Router.navigate(['/recipe', id]);
        
    console.log('Navigation triggered to /recipe/', id);
      }
    
    
    
     trackByRecipeId(index: number, recipe: any): number {
        return recipe.id;
     }
}