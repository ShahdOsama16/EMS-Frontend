import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { FitnessDataService } from '../fitnessdataservice';

interface WorkoutDetail {
  name: string;
  description: string;
  videoUrl: string | null;
  category: string;
  id: number;
}

@Component({
  selector: 'app-yoga',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './yoga.component.html',
  styleUrls: ['./yoga.component.css'],
})
export class YogaComponent implements OnInit, OnDestroy {
  shoulderworkouts: WorkoutDetail[] = [];
  errorMessage: string = '';
  VideoBaseUrl = 'https://passantmohamed-001-site1.mtempurl.com/videos/';
  private fitnessInfoApiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/fitness-info';
  private apiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/workout?MaxResultCount=36';
  private deviceId = 11;
  private workoutSubscription?: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,private router:Router,
    private fitnessDataService: FitnessDataService
  ) { }

  ngOnInit(): void {
    this.loadShoulderWorkouts();
  }

  ngOnDestroy(): void {
    if (this.workoutSubscription) {
      this.workoutSubscription.unsubscribe();
    }
  }

  loadShoulderWorkouts(): void {
    this.workoutSubscription = this.http.get<any>(this.apiUrl).subscribe({ 
      next: (res: any) => {
        if (res && res.items) {
          this.shoulderworkouts = res.items
            .filter((workout: any) => workout.category?.toLowerCase() === 'shoulders' && workout.videoUrl)
            .map((workout: any) => ({
              name: workout.name,
              description: workout.description,
              videoUrl: workout.videoUrl?.startsWith('http')
                ? workout.videoUrl
                : this.VideoBaseUrl + workout.videoUrl,
              category: workout.category,
              id: workout.id,
            } as WorkoutDetail));
          console.log('Shoulder Workouts (with videoUrl):', this.shoulderworkouts);
        } else {
          this.shoulderworkouts = [];
          this.errorMessage = 'No shoulder workouts with videos found.';
          console.log(this.errorMessage);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error loading shoulder workouts.';
        console.error('Error loading workouts:', err);
      },
    });
  }

  getSafeVideoUrl(url: string | null): SafeResourceUrl | null {
    if (!url) return null;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId: string | undefined;

      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('shorts/')) {
        videoId = url.split('shorts/')[1]?.split('?')[0];
      }

      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;  
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    }

    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
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
  const categoryValue = 'Shoulder';

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
