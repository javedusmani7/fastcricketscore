import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit{
  serieslist: any;
  currentRoute: any;
  // selectedSeries=null;

  constructor(private apiservice:ServiceService, private router: Router){
    this.router.events.subscribe(()=>{
      this.currentRoute=router.url
      this.currentRoute = this.extractSegment(router.url);
    })

  }
  private extractSegment(url: string): string {
    // Remove the leading slash if it exists
    return url.startsWith('/') ? url.slice(1) : url;
  }
  ngOnInit(): void {

    this.apiservice.getCompetitionData().subscribe((res:any)=>{
       this.serieslist=res.data
    })
    // this.apiservice.getCricketSeries().subscribe((res:any)=>{
    //   this.serieslist=res.data
    // })
  }
  getkeysdata(obj:any){
    return Object.keys(obj)
  }

}
