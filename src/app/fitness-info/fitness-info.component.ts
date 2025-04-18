import { Component, OnInit  } from '@angular/core';
 import { ShareDataApiService } from '../share-data-api.service'; // Adjust the path
import { RouterLink } from '@angular/router';

 @Component({
  selector: 'app-fitness-info',
  imports:[RouterLink],
  templateUrl: './fitness-info.component.html',
  styleUrls: ['./fitness-info.component.css']
 })
 export class FitnessInfoComponent implements OnInit {
  fitnessData: any[] = [];
  error: string = '';

  constructor(private apiService: ShareDataApiService) {}

  ngOnInit(): void {
   this.loadFitnessInfo();
  }

  loadFitnessInfo(): void {
   this.apiService.getFitnessInfo().subscribe({
    next: (data) => {
     this.fitnessData = data; // Assuming the API returns an array of fitness info
     console.log('Fitness Data:', this.fitnessData);
     this.error = '';
    },
    error: (err) => {
     this.error = 'Error loading fitness information.';
     console.error(this.error, err);
    }
   });
  }

  // You might have a form to create new fitness info
  createFitnessEntry(newFitnessData: any): void {
   this.apiService.createFitnessInfo(newFitnessData).subscribe({
    next: (response) => {
     console.log('Fitness info created:', response);
     this.loadFitnessInfo(); // Reload data after creation
     // Optionally reset the form
    },
    error: (err) => {
     this.error = 'Error creating fitness information.';
     console.error(this.error, err);
    }
   });
  }
 }