// admin-dashboard.component.ts (using ng2-charts)
import { Component, OnInit, OnDestroy } from '@angular/core';
 import { Router, RouterLink } from '@angular/router';
 import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
 import { NgChartsModule } from 'ng2-charts';
 import { ShareDataApiService } from '../share-data-api.service'; 
 import { Subscription } from 'rxjs';

 @Component({
  selector: 'app-admin-dashboard',
  imports: [NgChartsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
 })
 export class AdminDashboardComponent implements OnInit, OnDestroy {

  totalUsers: number = 0;
  userCountSubscription: Subscription | undefined;
  errorMessage: string = '';

 
  public barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Users Registered' }
    ]
  };

  public pieChartLabels: string[] = ['product', 'recipes', 'workouts'];
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{
      data: [300, 500, 100]
    }]
  };
  public pieChartType: ChartType = 'pie';

 
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Website Traffic',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public lineChartType: ChartType = 'line';

  constructor(private router: Router, private shareddataapiservice: ShareDataApiService) { }

  ngOnInit(): void {
    this.loadTotalUserCount();
  }

  ngOnDestroy(): void {
    if (this.userCountSubscription) {
      this.userCountSubscription.unsubscribe();
    }
  }

  loadTotalUserCount(): void {
    this.userCountSubscription = this.shareddataapiservice.getUsersLookupCount().subscribe({
      next: (count) => {
        this.totalUsers = count;
      },
      error: (error) => {
        this.errorMessage = '';
        console.error(this.errorMessage, error);
      }
    });
  }
 }