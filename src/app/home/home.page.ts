import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

interface HealthData {
  bpm: number;
  spo2: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  bpm: number = 0;
  spo2: number = 0;
  error: string | null = null; 
  private intervalId: any; 
  private dataSubscription!: Subscription; 

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.fetchData(); 
    this.intervalId = setInterval(() => {
      this.fetchData(); 
    }, 5000);
  }

  fetchData() {
    this.dataSubscription = this.dataService.getData().subscribe(
      (data: HealthData) => {
        this.bpm = data.bpm;
        this.spo2 = data.spo2;
        this.error = null; 
      },
      error => {
        console.error('Error fetching data', error);
        this.error = 'Failed to fetch data'; 
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); 
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe(); 
    }
  }
}
