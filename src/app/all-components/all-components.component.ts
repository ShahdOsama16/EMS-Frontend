import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { AboutComponent } from '../about/about.component';
import { FooterComponent } from '../footer/footer.component';
import { BuyproductComponent } from '../buyproduct/buyproduct.component';
import { WorkoutsComponent } from '../workouts/workouts.component'; // Import WorkoutsComponent
import { RecipesComponent } from '../recipes/recipes.component';   // Import RecipesComponent
import { ContactComponent } from '../contact/contact.component';   // Import ContactComponent

@Component({
  selector: 'app-all-components',
  standalone: true,
  imports: [
    ProductComponent,
    AboutComponent,
    FooterComponent,
    BuyproductComponent,
    WorkoutsComponent, // Add WorkoutsComponent to imports
    RecipesComponent,  // Add RecipesComponent to imports
    ContactComponent,  // Add ContactComponent to imports
  ],
  templateUrl: './all-components.component.html',
  styleUrl: './all-components.component.css',
})
export class AllComponentsComponent {}