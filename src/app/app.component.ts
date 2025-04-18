import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { WorkoutsComponent } from './workouts/workouts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent], //Remove all unused imports.
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {

  // constructor(private authservice: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   this.authservice.checkAuthOnStartup(); // Check for existing token
  // }
}