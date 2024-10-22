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
  Tempdata:any;
  // selectedSeries=null;

  categories = [
    { label: 'All', value: '' },
    { label: 'International', value: 'international' },
    { label: 'Women', value: 'women' },
    { label: 'Domestic', value: 'domestic' }
  ];

  // Variable to track the currently active category
  activeCategory: string = '';

  // Function to update the active category
  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  filterMatches(matches: any[]): any[] {
    // If 'All' category is selected, return all matches
    if (!this.activeCategory) {
      return matches;
    }
    
    // Otherwise, return matches that match the selected category
    return matches.filter(match => match.category === this.activeCategory);
  }

  getKeysData(serieslist: any): string[] {
    // Return keys where there are filtered matches
    return Object.keys(serieslist).filter(key => {
      const filteredMatches = this.filterMatches(serieslist[key]);
      return filteredMatches && filteredMatches.length > 0;
    });
  }


  

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
       console.log("series data",this.serieslist)
    })
    // this.apiservice.getCricketSeries().subscribe((res:any)=>{
    //   this.serieslist=res.data
    // })
  }
  // getkeysdata(obj:any){
  //   return Object.keys(obj)
  // }

  setMatchData(data:any){
   localStorage.setItem('seriesMatchData',JSON.stringify(data))
  }

}

