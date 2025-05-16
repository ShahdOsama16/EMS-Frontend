import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { myGuardGuard } from './my-guard.guard';
import { WorkoutsComponent } from './workouts/workouts.component';
import { StretchingComponent } from './stretching/stretching.component';
import { FitnessComponent } from './fitness/fitness.component';
import { YogaComponent } from './yoga/yoga.component';
import { ZumbaComponent } from './zumba/zumba.component';
import { AerobicsComponent } from './aerobics/aerobics.component';
import { BoxingComponent } from './boxing/boxing.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { AllComponentsComponent } from './all-components/all-components.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BuyproductComponent } from './buyproduct/buyproduct.component';
import { BuysingleproductComponent } from './buysingleproduct/buysingleproduct.component';
import { CartComponent } from './cart/cart.component'; 
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MessageComponent } from './message/message.component';
import { AdminproductComponent } from './adminproduct/adminproduct.component';
import { FitnessInfoComponent } from './fitness-info/fitness-info.component';
import { ProfileComponent } from './profile/profile.component';




export const routes: Routes = [
    {path:'', redirectTo: 'all', pathMatch: 'full'},
    {path:'products', component: ProductComponent, canActivate:[myGuardGuard]},
    {path:'about', component: AboutComponent, canActivate:[myGuardGuard]},
    {path:'cart',component:CartComponent},
    { path: 'checkout', component: CheckoutComponent },
    {path:'admin-dashboard',component:AdminDashboardComponent, canActivate:[myGuardGuard]},
    {path:'message',component:MessageComponent, canActivate:[myGuardGuard]},
    {path: 'fitness-info', component: FitnessInfoComponent },
    {path:'profile',component:ProfileComponent, canActivate:[myGuardGuard]},
    {path:'adminproduct',component:AdminproductComponent, canActivate:[myGuardGuard]},
    {path:'buyProduct', component: BuyproductComponent ,canActivate:[myGuardGuard]},
    {path:'buysingleproduct', component: BuysingleproductComponent, canActivate:[myGuardGuard]},
    {path:'register', component: RegisterComponent},
    {path:'login', component: LoginComponent},
    { path: 'stretching/:id', component: StretchingComponent },
    {path:"workouts", component:WorkoutsComponent},
    {path:"stretching",component:StretchingComponent },
    {path:"fitness",component:FitnessComponent},
    {path:"yoga",component:YogaComponent},
    {path:"zumba",component:ZumbaComponent},
    {path:"aerobics",component:AerobicsComponent},
    {path:"fitness",component:FitnessComponent},
    {path:"boxing",component:BoxingComponent},
    {path:"recipes",component:RecipesComponent,canActivate:[myGuardGuard]},
    {path:"recipe/:id",component:SingleProductComponent,canActivate:[myGuardGuard]},
    { path: 'product/:id', component: BuysingleproductComponent },
    {path:"contact",component:ContactComponent, canActivate:[myGuardGuard]},
    {path:"footer",component:FooterComponent, canActivate:[myGuardGuard]},
    {path:"all",component:AllComponentsComponent, canActivate:[myGuardGuard]},
    {path:'**', component: RegisterComponent}
];
