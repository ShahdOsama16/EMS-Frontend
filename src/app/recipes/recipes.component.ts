// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ShareDataApiService } from '../share-data-api.service';
// import { Router, RouterLink } from '@angular/router';

// interface Recipe {
//   id: number
//   name: string
//   image: string
//   mealType: string[]
// }
// @Component({
//     selector: 'app-recipes',
//     imports: [CommonModule, ],
//     templateUrl: './recipes.component.html',
//     styleUrl: './recipes.component.css'
// })
// export class RecipesComponent implements OnInit{
//   constructor(private _ShareDataApiService:ShareDataApiService, private _Router:Router){}
//   recipes: any=[];
//   ngOnInit(): void {
//     this._ShareDataApiService.getProducts().subscribe(
//       {
//         next: (res) => {
//           // console.log(res.recipes);
//           console.log(res);
//           // this.recipes = res.recipes;
//           this.recipes = res;
//           console.log(this.recipes)
//         },
//         error: (err) =>{
//           console.log(err);
//         },
//         complete: () =>{
//           console.log("complete");
//         }
//       }
//     );

//   }
//   getSingleRecipe(id: number){
//     this._Router.navigate(['recipe', id])
//   }

// }import { CommonModule } from '@angular/common';
//  import { Component, OnInit } from '@angular/core';
//  import { ShareDataApiService } from '../share-data-api.service';
//  import { Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';

//  interface Recipe {
//   name: string;
//   ingredients: string[];
//   instructions: string[];
//   prepTimeMinutes: number;
//   cookTimeMinutes: number;
//   servings: number;
//   difficulty: string;
//   cuisine: string;
//  }

//  @Component({
//   selector: 'app-recipes',
//   imports: [CommonModule,],
//   templateUrl: './recipes.component.html',
//   styleUrl: './recipes.component.css'
//  })
//  export class RecipesComponent implements OnInit {
//   recipes: any[] = []; // Keep as 'any[]' since the API doesn't have a direct 'id' or 'image'
//   errorMessage: string = '';

//   constructor(private _ShareDataApiService: ShareDataApiService, private _Router: Router) {}

//   ngOnInit(): void {
//     this.loadRecipes();
//   }

//   loadRecipes(): void {
//     this._ShareDataApiService.getRecipes().subscribe(
//       {
//         next: (res) => {
//           console.log('Recipes from API:', res);
//           this.recipes = res.items; 
//           console.log('this.recipes after assignment:', this.recipes); 
//         },
//         error: (err) => {
//           console.error('Error loading recipes:', err);
//           this.errorMessage = 'Failed to load recipes.';
//         },
//         complete: () => {
//           console.log('Loading recipes complete');
//         }
//       }
//     );
//   }

//   getSingleRecipe(index: number): void { 
//     console.log('Navigating to recipe at index:', index);
    
//   }

//   trackByIndex(index: number, item: any): number {
//     return index;
//   }
//  }




// import { CommonModule } from '@angular/common';
//  import { Component, OnInit } from '@angular/core';
//  import { ShareDataApiService } from '../share-data-api.service';
//  import { Router, RouterLink } from '@angular/router';

//  interface Recipe {
//   name: string;
//   ingredients: string[];
//   instructions: string[];
//   prepTimeMinutes: number;
//   cookTimeMinutes: number;
//   servings: number;
//   difficulty: string;
//   cuisine: string;
//   image: string; // Add the image property to your interface
//  }

//  @Component({
//   selector: 'app-recipes',
//   imports: [CommonModule, ],
//   templateUrl: './recipes.component.html',
//   styleUrl: './recipes.component.css'
//  })
//  export class RecipesComponent implements OnInit {
//   recipes: any[] = []; // Keep as 'any[]' initially for flexibility
//   errorMessage: string = '';

//   constructor(private _ShareDataApiService: ShareDataApiService, private _Router: Router) {}

//   ngOnInit(): void {
//     this.loadRecipes();
//   }

//   loadRecipes(): void {
//     this._ShareDataApiService.getRecipes().subscribe(
//       {
//         next: (res) => {
//           console.log('Recipes from API:', res);
//           this.recipes = res.items.map((item: any) => ({
//             ...item,
//             // **IMPORTANT: ADJUST THE IMAGE URL GENERATION LOGIC BELOW**
//             image: `https://via.placeholder.com/150/FFC107/000000?Text=${item.name.replace(/\s+/g, '+')}`
//             // **REPLACE THE PLACEHOLDER URL WITH YOUR ACTUAL IMAGE URL LOGIC**
//             // Example if your API had an 'imageUrl' property:
//             // image: item.imageUrl
//             // Example if you need to construct the URL based on name:
//             // image: `https://your-image-server.com/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
//           }));
//           console.log('this.recipes after assignment:', this.recipes);
//         },
//         error: (err) => {
//           console.error('Error loading recipes:', err);
//           this.errorMessage = 'Failed to load recipes.';
//         },
//         complete: () => {
//           console.log('Loading recipes complete');
//         }
//       }
//     );
//   }

//   getSingleRecipe(index: number): void { // Use index as a temporary identifier
//     // You'll need a proper ID from your backend for a real single recipe view
//     console.log('Navigating to recipe at index:', index);
//     // For now, you can just log the index or navigate based on index if needed
//     // this._Router.navigate(['recipe', this.recipes[index]?.name.replace(/\s+/g, '-').toLowerCase()]);
//   }

//   trackByIndex(index: number, item: any): number {
//     return index;
//   }
//  }



// import { CommonModule } from '@angular/common';
//  import { Component, OnInit } from '@angular/core';
//  import { ShareDataApiService } from '../share-data-api.service';
//  import { Router, RouterLink } from '@angular/router';

//  interface Recipe {
//   name: string;
//   ingredients: string[];
//   instructions: string[];
//   prepTimeMinutes: number;
//   cookTimeMinutes: number;
//   servings: number;
//   difficulty: string;
//   cuisine: string;
//   image: string; 
//  }

//  @Component({
//   selector: 'app-recipes',
//   imports: [CommonModule,],
//   templateUrl: './recipes.component.html',
//   styleUrl: './recipes.component.css'
//  })
//  export class RecipesComponent implements OnInit {
//   recipes: any[] = []; 
//   errorMessage: string = '';

//   constructor(private _ShareDataApiService: ShareDataApiService, private _Router: Router) {}

//   ngOnInit(): void {
//     this.loadRecipes();
//   }

//   loadRecipes(): void {
//     this._ShareDataApiService.getRecipes().subscribe(
//       {
//         next: (res) => {
//           console.log('Recipes from API:', res);
//           this.recipes = res.items.map((item: any) => ({
//             ...item,
           
//             image: `https://passantmohamed-001-site1.mtempurl.com/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
           
//           }));
//           console.log('this.recipes after assignment:', this.recipes);
//         },
//         error: (err) => {
//           console.error('Error loading recipes:', err);
//           this.errorMessage = 'Failed to load recipes.';
//         },
//         complete: () => {
//           console.log('Loading recipes complete');
//         }
//       }
//     );
//   }

//   getSingleRecipe(index: number): void { 
//     console.log('Navigating to recipe at index:', index);
    
//   }

//   trackByIndex(index: number, item: any): number {
//     return index;
//   }
//   navigateToSingle(): void {
//     this._Router.navigate(['/recipe', 1]);
//   }



//  }



// import { CommonModule } from '@angular/common';
//  import { Component, OnInit } from '@angular/core';
//  import { ShareDataApiService } from '../share-data-api.service';
//  import { Router, RouterLink } from '@angular/router';

//  interface Recipe {
//   name: string;
//   ingredients: string[];
//   instructions: string[];
//   prepTimeMinutes: number;
//   cookTimeMinutes: number;
//   servings: number;
//   difficulty: string;
//   cuisine: string;
//   image: string;
//  }

//  @Component({
//   selector: 'app-recipes',
//   imports: [CommonModule,],
//   templateUrl: './recipes.component.html',
//   styleUrl: './recipes.component.css'
//  })
//  export class RecipesComponent implements OnInit {
//   recipes: any[] = [];
//   errorMessage: string = '';

//   constructor(private _ShareDataApiService: ShareDataApiService, private _Router: Router) {}

//   ngOnInit(): void {
//     this.loadRecipes();
//   }

//   loadRecipes(): void {
//     this._ShareDataApiService.getRecipes().subscribe(
//       {
//         next: (res) => {
//           console.log('Recipes from API:', res);
//           this.recipes = res.items.map((item: any, index: number) => ({
//             ...item,
//             image: `https://passantmohamed-001-site1.mtempurl.com/images/${item.imageName}`,
//             id: index
//           }));
//           console.log('this.recipes after assignment:', this.recipes);
//         },
//         error: (err) => {
//           console.error('Error loading recipes:', err);
//           this.errorMessage = 'Failed to load recipes.';
//         },
//         complete: () => {
//           console.log('Loading recipes complete');
//         }
//       }
//     );
//   }

//   viewRecipeDetail(id: number): void {
//     console.log('viewRecipeDetail called with id:', id);
//     this._Router.navigate(['/recipe', id]);
//     console.log('Navigation triggered to /recipe/', id);
//   }



//   trackByRecipeId(index: number, recipe: any): number {
//     return recipe.id;
//   }
//  }

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

  mealType: string; // New property to hold the joined string
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