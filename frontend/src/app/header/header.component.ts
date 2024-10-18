import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { ChildSheduleComponent } from '../child-shedule/child-shedule.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cricketMenuList: any
  selected = false
  activeIndex: any;
  currentPath: any
  showheader: boolean = true
  evenSlug: any;
  series: any;
  liveroute: any
  livehiddenheader = false
  buleheader = false
  selectedName = ""
  evenSlug2: any;
  slugs: any;
  mainheader=true
  activeSlugsName=2
  constructor(private apiservice: ServiceService, private router: Router, private route: ActivatedRoute) {

    this.router.events.subscribe((event) => {
      this.currentPath = router.url
      this.extractValue(this.currentPath);
      this.extractValue2(this.currentPath);
      if(event instanceof NavigationEnd) {
        this.mainheader = !(event.url.includes('/live') || event.url.includes('/livecricket-score') || event.url.includes('scorecard') || event.url.includes('/squad') || event.url.includes('/about-us'))
        // this.showheader = (event.url.includes('/live') || event.url.includes('/livecricket-score') || event.url.includes('scorecard') || event.url.includes('/squad'))

      }
      this.getRoute(this.currentPath)

      if (this.currentPath == "/cricket-schedule") {
        this.showheader = true
        this.buleheader = false
        this.selected = true
        this.activeIndex=null
      } else if (this.currentPath == "/home") {
        this.showheader = true
        this.buleheader = false
        this.selected = true
        this.activeIndex=null
      }
      else if (this.currentPath == "/series") {
        this.showheader = true
        this.buleheader = false

      }
       else if (this.liveroute == "/iccRanking") {
        this.showheader = true
        this.buleheader = false
      }
      else if (this.liveroute == "/home") {
        this.showheader = true
        this.buleheader = false
      }
      else if (this.liveroute == "/player") {
        this.showheader = true
        this.buleheader = false
      }else if (this.liveroute == "/cricket-news") {
        this.showheader = true
        this.buleheader = false
      }else if (this.liveroute == "/team") {
        this.showheader = true
        this.buleheader = false
      }
      else {
        this.showheader = false
        this.livehiddenheader = false
        this.buleheader = true
      }
    })


  }
  private extractValue(param: string): any {
    const parts = param.split('/');
    this.evenSlug = parts[2];
  }
  private extractValue2(param: string): any {
    const parts = param.split('/');
    this.evenSlug2 =parts[2];
  }

  ngOnInit(): void {
    this.getCricketMenu()
    this.slugs=this.evenSlug2 || this.evenSlug

  }
  getRoute(url: string): any {
    const parts = url.split('/');
    this.liveroute = '/' + parts[1];
  }
  isRouteActive(routePath: string): boolean {

    return this.router.url.includes(routePath);
  }

  getCricketMenu() {
    this.apiservice.getCricketMenus().subscribe((res: any) => {
      this.cricketMenuList = res.data
    })
  }

  navigateToroutes(data: any, index: any) {
    let selectedRoute = "/go/" + data.slug
    this.selectedName = data.name
    this.activeIndex = index;
    this.activeSlugsName=index
    this.router.navigateByUrl(selectedRoute);
  }

  userByName(index: any) {
    return index;
  }

  redirectchildshedulepsge(data : any){
    this.apiservice.callCommonCompo(data)
  }

}
