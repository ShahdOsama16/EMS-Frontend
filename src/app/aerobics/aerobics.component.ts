import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShareDataApiService } from '../share-data-api.service';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FitnessDataService } from '../fitnessdataservice';
interface Workout {
  name: string;
  description: string;
  videoUrl: string | null;
  category: string;
  id: number;
}
@Component({
  selector: 'app-aerobics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aerobics.component.html',
  styleUrls: ['./aerobics.component.css'],
})
export class AerobicsComponent implements OnInit, OnDestroy {
  legsWorkouts: Workout[] = [];
  private apiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/workout?MaxResultCount=36';
  private fitnessInfoApiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/fitness-info';
  private deviceId = 11; 
  private subscription: Subscription | undefined;
  constructor(private sanitizer: DomSanitizer, private http: HttpClient,
    private router:Router,private fitnessDataService: FitnessDataService ) { }
  ngOnInit(): void {
    this.fetchLegsWorkouts();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  fetchLegsWorkouts(): void {
    this.subscription = this.http.get<{ items: Workout[] }>(this.apiUrl).subscribe(
      (response) => {
        this.legsWorkouts = response.items.filter(workout => workout.category?.toLowerCase() === 'legs');
        console.log('Legs Workouts:', this.legsWorkouts);
      },
      (error) => {
        console.error('Error fetching legs workouts:', error);
      }
    );
  }
  getSafeVideoUrl(url: string | null | undefined): SafeResourceUrl | null {
    if (!url) return null;

    let videoId: string | undefined;

    if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }

    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }

      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }

    if (url.includes('vimeo.com')) {
      videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${videoId}`);
      }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
      selectedMode: number | null = null;
      selectedPower: number | null = null;
      isOnOrOff: number | null = null;
      selectedTime: number | null = null;
      defaultMode: number = 0; 
     initialPowerOff: number = 0; 
      defaultTime: number = 0;   
      sendFitnessCommand(onOrOff: number | null, mode: number | null, time: number | null, power: number | null): void {
        const command = {
          onOrOff: onOrOff !== null ? onOrOff : this.isOnOrOff !== null ? this.isOnOrOff : 0, 
          mode: mode !== null ? mode : this.selectedMode !== null ? this.selectedMode : this.defaultMode,
          time:time !== null ? time: this.selectedTime !== null ? this.selectedTime : this.defaultTime, 
          power: power !== null ? power : this.selectedPower !== null ? this.selectedPower :  (onOrOff === 1 ? this.initialPowerOff : 1)
        };
        const token = localStorage.getItem('accessToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
        console.log('Sending command to:', this.fitnessInfoApiUrl);
        console.log('Command body:', JSON.stringify(command, null, 2));
        this.http.post<any>(this.fitnessInfoApiUrl, command, { headers })
          .subscribe({
            next: (response) => {
              console.log('Fitness command sent successfully:', response);
            },
            error: (error) => {
              console.error('Error sending fitness command:', error);
              console.error('Error details:', error);
            }
          });
        if (onOrOff !== null) {
          this.isOnOrOff = onOrOff;
          if (onOrOff === 0) {
        this.resetAll();
      } else if (onOrOff === 1) {
        this.selectedPower = this.initialPowerOff; 
      }
        }
        if (mode !== null) {
          this.selectedMode = mode;
        }
        if (power !== null) {
          this.selectedPower = power;
        }
        if (time !== null) {
      this.selectedTime = time;
       console.log('Time button clicked, selectedTime:', this.selectedTime); 
    }
      }
    selectAllTime(): void {
    this.selectedTime = null;
    console.log('Selected Time: All Time');
  }
  resetAll(): void {
    this.selectedMode = 0;
    this.selectedPower = 0;
    this.selectedTime = 0;
    console.log('All settings reset to zero.');
  }
 getLastDataAsObject(): any {
  const onOrOffValue = this.isOnOrOff !== null ? this.isOnOrOff : 0;
  const modeValue = this.selectedMode !== null ? this.selectedMode : 0;
  const modeNameValue = this.getModeName(this.selectedMode);
  const timeValue = this.selectedTime !== null ? this.selectedTime : 0;
  const powerValue = this.selectedPower !== null ? this.selectedPower : 0;
  const categoryValue = 'Legs';
  console.log('onOrOffValue:', onOrOffValue);
  console.log('modeValue:', modeValue);
  console.log('modeNameValue:', modeNameValue);
  console.log('timeValue:', timeValue);
  console.log('powerValue:', powerValue);
  console.log('categoryValue:', categoryValue);
  return {
    onOrOff: onOrOffValue,
    mode: modeValue,
    modeName: modeNameValue,
    time: timeValue,
    power: powerValue,
    category: categoryValue
  };
}
submit(): void {
    const lastData = this.getLastDataAsObject();
    console.log('Submit Button Clicked - Last Data:', lastData);
    this.fitnessDataService.addFitnessData(lastData);
    this.router.navigate(['/fitness-info'], { state: { submitData: lastData } });
  }
  modeNames: { [key: number]: string } = {
    1: 'Acupuncture',
    2: 'Stroke',
    3: 'Massage',
    4: 'Cupping',
    5: 'Manipulation',
    6: 'Scraping',
    7: 'Weight Reducing',
    8: 'Immunotherapy',
    0: 'Off'
   }
  getModeName(mode: number | null): string {
    return mode !== null && this.modeNames[mode] ? this.modeNames[mode] : 'Unknown';
  }
}