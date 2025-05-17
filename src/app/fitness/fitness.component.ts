import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShareDataApiService } from '../share-data-api.service';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FitnessDataService } from '../fitnessdataservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fitness-info',
  imports: [CommonModule],
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.css']
})
export class FitnessInfoComponent implements OnInit, OnDestroy {
  fitnessData: any[] = [];
  error: string = '';
  selectedFitnessId: string | null = null;
  private subscription: Subscription | undefined;
  submitData: any;
  routePath: string; // Store the current route

  constructor(
    private apiService: ShareDataApiService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fitnessDataService: FitnessDataService
  ) {
    this.submitData = this.router.getCurrentNavigation()?.extras?.state?.['submitData'];
    this.routePath = '/fitness-info'; 
    console.log('FitnessInfoComponent constructed. submitData from state:', this.submitData);
  }

  ngOnInit(): void {
    console.log('FitnessInfoComponent - ngOnInit started');

    // Load initial data directly from the service
    this.fitnessData = this.fitnessDataService.getFitnessData();
    //  this.loadFitnessInfo();
    console.log('FitnessInfoComponent - ngOnInit - Initial fitnessData:', this.fitnessData);

    // Subscribe to future updates from the service
    this.subscription = this.fitnessDataService.fitnessData$.subscribe(data => {
      this.fitnessData = data;
      console.log('FitnessInfoComponent - Data received from subscription:', this.fitnessData);
    });

    // Process submitData only once after the component is initialized
    if (this.submitData) {
      console.log('FitnessInfoComponent - ngOnInit - Processing submitData:', this.submitData);
      const isDuplicate = this.fitnessData.some(item =>
        item.category === this.submitData.category &&
        item.time === this.submitData.time &&
        item.power === this.submitData.power &&
        item.mode === this.submitData.mode
      );

      if (!isDuplicate) {
        this.fitnessData = [...this.fitnessData, this.submitData];
        this.fitnessDataService.setFitnessData(this.fitnessData);
        console.log('FitnessInfoComponent - ngOnInit - submitData added. New fitnessData:', this.fitnessData);
      }

      // Clear submitData and router state to prevent re-processing
       this.router.navigate([this.routePath], { replaceUrl: true });
      this.submitData = null;
      console.log('FitnessInfoComponent - ngOnInit - submitData processed and cleared.');
    } else {
      console.log('FitnessInfoComponent - ngOnInit - No submitData to process.');
    }

    console.log('FitnessInfoComponent - ngOnInit finished. Current fitnessData:', this.fitnessData);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      console.log('FitnessInfoComponent - ngOnDestroy - Subscription unsubscribed.');
    }
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

loadFitnessInfo(): void {
    this.apiService.getFitnessInfo().subscribe({
      next: (data) => {
        this.fitnessData = data; // Directly assign
        console.log('FitnessInfoComponent - loadFitnessInfo - Data from API:', data);
        // this.fitnessDataService.setFitnessData(data); //  DON'T USE THIS HERE.
        this.error = '';
      },
      error: (err) => {

      this.error = 'Error loading fitness information.';
      console.error('FitnessInfoComponent - loadFitnessInfo - Error:', err);
    }
  });
}

  createFitnessEntry(newFitnessData: any): void {
    this.apiService.createFitnessInfo(newFitnessData).subscribe({
      next: (response) => {
        console.log('Fitness info created:', response);
        this.loadFitnessInfo(); // Reload from API
      },
      error: (err) => {
        this.error = 'Error creating fitness information.';
        console.error(this.error, err);
      }
    });
  }

  generateCommand(dataToGenerate: any): void {
    this.apiService.generateFitnessCommandString(dataToGenerate).subscribe({
      next: (response) => {
        console.log('Command String Generated:', response);
      },
      error: (err) => {
        console.error('Error generating command string:', err);
      }
    });
  }

  updateCommand(id: string, newCommand: any): void {
    this.apiService.updateFitnessCommandString(id, newCommand).subscribe({
      next: (response) => {
        console.log(`Command String for ID ${id} updated:`, response);
      },
      error: (err) => {
        console.error(`Error updating command string for ID ${id}:`, err);
      }
    });
  }



  getCommandAsPayload(id: string): void {
    this.apiService.getFitnessCommandAsPayload(id).subscribe({
      next: (payload) => {
        console.log(`Command as Payload for ID ${id}:`, payload);
      },
      error: (err) => {
        console.error(`Error fetching command as payload for ID ${id}:`, err);
      }
    });
  }

  getCommandStringById(id: string): void {
    this.apiService.getFitnessCommandStringById(id).subscribe({
      next: (command) => {
        console.log(`Command String for ID ${id}:`, command);
      },
      error: (err) => {
        console.error(`Error fetching command string for ID ${id}:`, err);
      }
    });
  }

  updateFitnessItem(id: string, updatedData: any): void {
    this.apiService.updateFitnessInfo(id, updatedData).subscribe({
      next: (response) => {
        console.log(`Fitness info with ID ${id} updated:`, response);
        this.loadFitnessInfo();  // Reload from API
      },
      error: (err) => {
        console.error(`Error updating fitness info with ID ${id}:`, err);
      }
    });
  }

  deleteFitnessItem(id: string): void {
    this.apiService.deleteFitnessInfo(id).subscribe({
      next: (response) => {
        console.log(`Fitness info with ID ${id} deleted:`, response);
        this.loadFitnessInfo(); // Reload from API.
      },
      error: (err) => {
        console.error(`Error deleting fitness info with ID ${id}:`, err);
      }
    });
  }

  fetchFitnessItemById(id: string): void {
    this.apiService.getFitnessInfoById(id).subscribe({
      next: (item) => {
        console.log(`Fitness info with ID ${id}:`, item);
        this.selectedFitnessId = id;
      },
      error: (err) => {
        console.error(`Error fetching fitness info with ID ${id}:`, err);
      }
    });
  }
}

