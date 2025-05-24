
import { Component, OnInit } from '@angular/core';
import { ShareDataApiService } from '../share-data-api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class WorkoutsComponent implements OnInit {
  allWorkouts: any[] = [];
  chestWorkouts: any[] = [];
  errorMessage: string = '';
  constructor(private apiService: ShareDataApiService, private router: Router) { }
  ngOnInit(): void {
    this.loadWorkouts();
  }
  loadWorkouts(): void {
    this.apiService.getWorkouts().subscribe(
      (response) => {
        console.log('API response received in WorkoutsComponent:', response);
        this.allWorkouts = response.items;
        this.filterChestWorkouts();
        console.log('All Workouts in WorkoutsComponent:', this.allWorkouts);
        console.log('Chest Workouts in WorkoutsComponent:', this.chestWorkouts);
      },
      (error) => {
        this.errorMessage = 'Failed to load workouts.';
        console.error('Error in WorkoutsComponent loading workouts:', error);
      }
    );
  }

  filterChestWorkouts(): void {
    this.chestWorkouts = this.allWorkouts.filter(workout =>
      workout.name && workout.name.toLowerCase().includes('chest')
    );
  }

  navigateToWorkoutDetails(workoutId: any): void {
    this.router.navigate(['/workout-details', workoutId]);
  }

  navigateToStretching(workoutId: any): void {
    this.router.navigate(['/stretching', workoutId]);
  }

  navigateToFitness(): void {
    this.router.navigate(['/fitness']);
  }

  navigateToYoga(): void {
    this.router.navigate(['/yoga']);
  }

  navigateToZumba(): void {
    this.router.navigate(['/zumba']);
  }

  navigateToAerobics(): void {
    this.router.navigate(['/aerobics']);
  }

  navigateToBoxing(): void {
    this.router.navigate(['/boxing']);
  }
}