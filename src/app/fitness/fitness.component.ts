import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FitnessDataService } from '../fitnessdataservice';

interface Workout {
  name: string;
  description: string;
  videoUrl: string;
  category: string;
  id: number;
}

@Component({
  selector: 'app-fitness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fitness.component.html',
  styleUrls: ['./fitness.component.css'],
})
export class FitnessComponent implements OnInit, OnDestroy {
  biTriWorkouts: Workout[] = [];
  private apiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/workout?MaxResultCount=36';
  private fitnessInfoApiUrl = 'https://passantmohamed-001-site1.mtempurl.com/api/app/fitness-info';
  private subscription?: Subscription;

  selectedMode: number | null = null;
  selectedPower: number | null = null;
  isOnOrOff: number | null = null;
  selectedTime: number | null = null;

  defaultMode = 0;
  initialPowerOff = 0;
  defaultTime = 0;

  modeNames: { [key: number]: string } = {
    1: 'Acupuncture',
    2: 'Stroke',
    3: 'Massage',
    4: 'Cupping',
    5: 'Manipulation',
    6: 'Scraping',
    7: 'Weight Reducing',
    8: 'Immunotherapy',
    0: 'Off',
  };

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private router: Router,
    private fitnessDataService: FitnessDataService
  ) {}

  ngOnInit(): void {
    this.fetchBiTriWorkouts();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  fetchBiTriWorkouts(): void {
    this.subscription = this.http.get<{ items: Workout[] }>(this.apiUrl).subscribe({
      next: (response) => {
        this.biTriWorkouts = response.items.filter(
          (workout) => workout.category === 'Biceps' || workout.category === 'Triceps'
        );
        console.log('Bi & Tri Workouts:', this.biTriWorkouts);
      },
      error: (error) => {
        console.error('Error fetching Bi & Tri workouts:', error);
      },
    });
  }

  getSafeVideoUrl(url: string | null | undefined): SafeResourceUrl | null {
    if (!url) return null;

    if (url.includes('youtube.com/shorts/')) {
      const shortId = url.split('shorts/')[1]?.split('?')[0];
      const embedUrl = `https://www.youtube.com/embed/${shortId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('be/')[1]?.split('?')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }

    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${videoId}`);
      }
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  sendFitnessCommand(
    onOrOff: number | null,
    mode: number | null,
    time: number | null,
    power: number | null
  ): void {
    const command = {
      onOrOff: onOrOff ?? this.isOnOrOff ?? 0,
      mode: mode ?? this.selectedMode ?? this.defaultMode,
      time: time ?? this.selectedTime ?? this.defaultTime,
      power: power ?? this.selectedPower ?? (onOrOff === 1 ? this.initialPowerOff : 1),
    };

    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    this.http.post<any>(this.fitnessInfoApiUrl, command, { headers }).subscribe({
      next: (response) => {
        console.log('Fitness command sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending fitness command:', error);
      },
    });

   
    if (onOrOff !== null) {
      this.isOnOrOff = onOrOff;
      if (onOrOff === 0) {
        this.resetAll();
      } else {
        this.selectedPower = this.initialPowerOff;
      }
    }

    if (mode !== null) this.selectedMode = mode;
    if (power !== null) this.selectedPower = power;
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

  getLastDataAsObject(): {
    onOrOff: number;
    mode: number;
    modeName: string;
    time: number;
    power: number;
    category: string;
  } {
    const onOrOffValue = this.isOnOrOff ?? 0;
    const modeValue = this.selectedMode ?? 0;
    const timeValue = this.selectedTime ?? 0;
    const powerValue = this.selectedPower ?? 0;

    return {
      onOrOff: onOrOffValue,
      mode: modeValue,
      modeName: this.getModeName(modeValue),
      time: timeValue,
      power: powerValue,
      category: 'Bi & Tri',
    };
  }

  submit(): void {
    const lastData = this.getLastDataAsObject();
    console.log('Submit Button Clicked - Last Data:', lastData);
    this.fitnessDataService.addFitnessData(lastData);
    this.router.navigate(['/fitness-info'], { state: { submitData: lastData } });
  }

  getModeName(mode: number | null): string {
    return mode !== null && this.modeNames[mode] ? this.modeNames[mode] : 'Unknown';
  }
}
