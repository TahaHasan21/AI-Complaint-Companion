import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NgxChartsModule, RouterModule]

})
export class HomeComponent implements OnInit {

  chartData: { name: string; value: number }[] = [];

  complaintStats = [
    { name: 'Open', value: 5 },
    { name: 'Closed', value: 3 },
    { name: 'High Priority', value: 4 }
  ];

  colorScheme : Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
    name: 'custom',
    selectable: false,
    group: ScaleType.Time
  };

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchComplaintStats();
    // setInterval(() => {
    //   this.fetchComplaintStats();
    // }, 10000);
  }
  
  fetchComplaintStats() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`);

    this.http.get<any>('http://localhost:8080/api/complaints/statistics', { headers }).subscribe((data) => {
      this.chartData = [
        { name: 'Open', value: data.open },
        { name: 'In Progress', value: data.inProgress },
        { name: 'Closed', value: data.closed }
      ];
    });
  }

  navigateToCreateComplaint() {
    this.router.navigate(['/create-complaint']);
  }
  
}
