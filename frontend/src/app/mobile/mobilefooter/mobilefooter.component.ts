import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-mobilefooter',
  templateUrl: './mobilefooter.component.html',
  styleUrls: ['./mobilefooter.component.css']
})
export class MobilefooterComponent implements OnInit{
  currentPath:any
  mainFooter=true
  constructor(private router: Router, private route: ActivatedRoute){}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      this.currentPath = this.router.url
      // this.extractValue(this.currentPath);
      // this.extractValue2(this.currentPath);
      if(event instanceof NavigationEnd) {
        this.mainFooter = !(event.url.includes('/live-cricket-score') )
        // this.showheader = (event.url.includes('/live') || event.url.includes('/livecricket-score') || event.url.includes('scorecard') || event.url.includes('/squad'))

      }
  })
}
}
