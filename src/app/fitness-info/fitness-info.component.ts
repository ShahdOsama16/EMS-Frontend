import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShareDataApiService } from '../share-data-api.service';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FitnessDataService } from '../fitnessdataservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fitness-info',
  imports: [RouterLink, CommonModule],
  templateUrl: './fitness-info.component.html',
  styleUrls: ['./fitness-info.component.css']
})
export class FitnessInfoComponent implements OnInit, OnDestroy {
  fitnessData: any[] = [];
  error: string = '';
  selectedFitnessId: string | null = null;
  private subscription: Subscription | undefined;
  submitData: any;
  routePath: string; 
  selectedWorkoutCategory: string = ''; 

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
    this.fitnessData = this.fitnessDataService.getFitnessData();
    this.loadFitnessInfo();
    console.log('FitnessInfoComponent - ngOnInit - Initial fitnessData:', this.fitnessData);

    this.subscription = this.fitnessDataService.fitnessData$.subscribe(data => {
      this.fitnessData = data;
      console.log('FitnessInfoComponent - Data received from subscription:', this.fitnessData);
    });

    
    if (this.submitData && this.submitData.category) { 
      this.selectedWorkoutCategory = this.submitData.category;
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
      this.router.navigate([this.routePath], { replaceUrl: true });
      this.submitData = null;
      console.log('FitnessInfoComponent - ngOnInit - submitData processed and cleared.');
    } else {
      console.log('FitnessInfoComponent - ngOnInit - No submitData to process or no category in it.');
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
      next: (response) => {
        const items = response.items || [];
        this.fitnessData = items.map((item: any) => {
          return {
            category: item.workout || 'Category',
            time: item.time,
            power: item.power,
            modeName: this.getModeName(item.mode),
          };
        });
        console.log('FitnessInfoComponent - loadFitnessInfo - Mapped Data:', this.fitnessData);
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error loading fitness information.';
        console.error('FitnessInfoComponent - loadFitnessInfo - Error:', err);
      },
    });
  }
  getModeName(mode: number): string {
    switch (mode) {
      case 1:
        return 'Acupuncture';
      case 2:
        return 'Stroke';
      case 3:
        return 'Massage';
      case 4:
        return 'Cupping';
      case 5:
        return 'Manipulation';
      case 6:
        return 'Scraping';
      case 7:
        return 'Weight Reducing';
      case 8:
        return 'Immunotherapy';
      default:
        return 'Off';
    }
  }
 updateCategory(index: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      this.fitnessData[index].category = selectElement.value;
      console.log(`Category updated for index ${index}:`, this.fitnessData[index].category);
    }
  }
  
 chooseWorkout(event: Event): void {
  const workoutName = (event.target as HTMLSelectElement)?.value;
  if (workoutName) {
    this.selectedWorkoutCategory = workoutName;
    console.log('Selected Workout Category:', this.selectedWorkoutCategory);
    this.loadFitnessInfo();
  } else {
    console.warn('Could not get the value from the event target.');
  }
}

  createFitnessEntry(newFitnessData: any): void {
    this.apiService.createFitnessInfo(newFitnessData).subscribe({
      next: (response) => {
        console.log('Fitness info created:', response);
        this.loadFitnessInfo();
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
        this.loadFitnessInfo();   
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
        this.loadFitnessInfo(); 
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