
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FitnessDataService {
  private _fitnessData = new BehaviorSubject<any[]>(this.loadFitnessData());
  readonly fitnessData$ = this._fitnessData.asObservable();
  private readonly STORAGE_KEY = 'fitnessData';

  constructor() {
    console.log('FitnessDataService constructed. Initial data:', this._fitnessData.getValue());
  }
  private loadFitnessData(): any[] {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    const loadedData = storedData ? JSON.parse(storedData) : [];
    console.log('FitnessDataService - loadFitnessData:', loadedData);
    return loadedData;
  }
  private saveFitnessData(data: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    console.log('FitnessDataService - saveFitnessData:', data);
  }
  addFitnessData(newData: any): void {
    const currentValue = this._fitnessData.getValue();
    const newValue = [...currentValue, newData];
    this._fitnessData.next(newValue);
    this.saveFitnessData(newValue);
  }

  setFitnessData(data: any[]): void {
    this._fitnessData.next(data);
    this.saveFitnessData(data);
  }

  getFitnessData(): any[] {
    const currentValue = this._fitnessData.getValue();
    console.log('FitnessDataService - getFitnessData:', currentValue);
    return currentValue;
  }

  clearFitnessData(): void {
    this._fitnessData.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('FitnessDataService - clearFitnessData called');
  }
}
