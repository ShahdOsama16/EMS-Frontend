import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service';

@Component({
    selector: 'app-stretching',
    imports: [RouterLink, CommonModule],
    templateUrl: './stretching.component.html',
    styleUrl: './stretching.component.css'
})
export class StretchingComponent implements OnInit {
 constructor(private apiService: ShareDataApiService, private router: Router) { }
 workouts: any[] = [];



 allWorkouts: any[] = []; 
  chestWorkouts: any[] = []; 
  errorMessage: string = '';

  

  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.apiService.getWorkouts().subscribe(
      (response) => {
        console.log('API response received:', response);
        this.allWorkouts = response.items;
        this.filterChestWorkouts(); 
        console.log('All Workouts:', this.allWorkouts);
        console.log('Chest Workouts:', this.chestWorkouts);
      },
      (error) => {
        this.errorMessage = 'Failed to load workouts.';
        console.error('Error loading workouts:', error);
      }
    );
  }

  filterChestWorkouts(): void {
    this.chestWorkouts = this.allWorkouts.filter(workout =>
      workout.name.toLowerCase().includes('chest') 
    );
  }
}

