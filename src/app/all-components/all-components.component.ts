import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { AboutComponent } from '../about/about.component';
import { FooterComponent } from '../footer/footer.component';
import { BuyproductComponent } from '../buyproduct/buyproduct.component';
import { WorkoutsComponent } from '../workouts/workouts.component'; 
import { RecipesComponent } from '../recipes/recipes.component';  
import { ContactComponent } from '../contact/contact.component';   
import {  ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from '../checkout/checkout.component';

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
    ContactComponent, 
    ReactiveFormsModule,
    CheckoutComponent, // Add ContactComponent to imports
    ContactComponent,

  ],
  templateUrl: './all-components.component.html',
  styleUrl: './all-components.component.css',
})
export class AllComponentsComponent {}