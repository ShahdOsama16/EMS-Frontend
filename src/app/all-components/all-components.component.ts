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
import { FitnessInfoComponent } from '../fitness-info/fitness-info.component';

@Component({
  selector: 'app-all-components',
  standalone: true,
  imports: [
    ProductComponent,
    AboutComponent,
    FooterComponent,
    BuyproductComponent,
    WorkoutsComponent, 
    RecipesComponent,
    ContactComponent, 
    ReactiveFormsModule,
    CheckoutComponent, 
    ContactComponent,
    FitnessInfoComponent,

  ],
  templateUrl: './all-components.component.html',
  styleUrl: './all-components.component.css',
})
export class AllComponentsComponent {}