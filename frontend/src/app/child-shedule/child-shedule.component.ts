import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-child-shedule',
  templateUrl: './child-shedule.component.html',
  styleUrls: ['./child-shedule.component.css']
})
export class ChildSheduleComponent implements OnInit {
  @ViewChild("widgetsContent", { static: false, read: ElementRef }) widgetsContent: any;

  tempData: any
  rightScrollCount = 0;
  seriesTitle: any
  liveLiteamDefaultImgst: any
  upcominglist: any
  upcomingFeature: any
  eventgrupname: any;
  headingNmae: any;
  convertedDate: any
  teamDefaultImg = '../../assets/team-default.png'
  cricketMenuList: any
  statsList: any
  battingbtn = "batting"
  routeName = ""
  short_name = ""
  selectedIndex: any; // Or initialize with the index of the initially selected option
  selectedTab = 'Scheduled'
  selectedNewsTab = 'latest'
  latestNewsList: any
  popularNewsList: any
  scores: any;
  mainData:any=[]
  // toggleMenubtn = false
  constructor(private apiservice: ServiceService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.eventgrupname = this.route.snapshot.paramMap.get('event_slug');

    })
    this.getStoreData()
    // this.getMatchesbySeries('upcoming', this.eventgrupname)
    // this.getTitalDta(this.eventgrupname)
    // this.getCricketMenu()
    // this.getStats("batting", this.eventgrupname)
    // this.getneswdata('latest')
    // this.popularNewsdata('latest')
    // console.log(
    //   "mvkvnjbhbfv",this.apiservice.seriesMatchData.getValue()
    // )

  }
  getStoreData(): any {
    let data = JSON.parse(localStorage.getItem('seriesMatchData')|| '');
    if (Object.keys(data).length > 0 && data != null) {
      this.tempData = data;
      this.mainData = this.tempData.matches.filter((item:any )=> item.status_str == 'Scheduled')
    } else {
      //api call 
    }
    console.log("this.tempData",this.tempData)

  }
  getMatchesbySeries(data: any, eventName: any) {
    if (data == "Scheduled") {
      this.selectedTab = data;
      this.mainData = this.tempData.matches.filter((item:any )=> item.status_str == this.selectedTab)
      // let url = '/child-shedule/' + eventName + "/" + this.selectedTab
      // this.apiservice.getUpcomingMatchesbyseries(eventName).subscribe((res: any) => {
      //   this.upcominglist = res.data
      //   console.log("this is upcoming list", this.upcominglist)
      //   this.short_name = res.data[0].short_name
      //   let url = '/child-shedule/' + eventName + "/" + this.selectedTab

      //   this.router.navigateByUrl(url);
      // })
      let url = '/child-shedule/' + eventName + "/" + this.selectedTab

      this.router.navigateByUrl(url);
    } else if (data == "Live") {
      this.selectedTab = data;
      this.mainData = this.tempData.matches.filter((item:any )=> item.status_str == this.selectedTab)
      // this.apiservice.getLiveMatchesbyseries(eventName).subscribe((res: any) => {
      //   this.upcominglist = res.data
      //   let url = '/child-shedule/' + eventName + "/" + this.selectedTab
      //   this.router.navigateByUrl(url);
      // })
      // this.apiservice.getUpcomingMatchesbyseries(eventName).subscribe((res: any) => {
      //   this.upcomingFeature = res.data
      // })
    } else if (data == "Completed") {
      this.selectedTab = data;
      this.mainData = this.tempData.matches.filter((item:any )=> item.status_str == this.selectedTab)
      // this.apiservice.getResultMatchesbyseries(eventName).subscribe((res: any) => {
      //   this.upcominglist = res.data
      //   let url = '/child-shedule/' + eventName + "/" + this.selectedTab
      //   this.router.navigateByUrl(url);
      // })
    }
    // let url = '/child-shedule/' + eventName + "/" + this.selectedTab
    //     this.router.navigateByUrl(url);
  }

  addOrdinalSuffix(num: string): string {
    const numInt = parseInt(num);
    const suffix = ["th", "st", "nd", "rd"];
    const v = numInt % 100;
    return numInt + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  }
  convertDate(datetime: any) {
    const currentDate = new Date();
    const providedDate = new Date(datetime);

    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const tomorrow = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

    if (providedDate.toDateString() === today.toDateString()) {
      this.convertedDate = 'Today';
    } else if (providedDate.toDateString() === tomorrow.toDateString()) {
      this.convertedDate = 'Tomorrow';
    } else {
      // const options = { weekday: 'long', month: 'long', day: 'numeric' };
      this.convertedDate = providedDate.toLocaleDateString('en-US');
      const date = new Date(this.convertedDate);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const dayOfWeek = daysOfWeek[date.getDay()];
      const dayOfMonth = date.getDate();
      const month = months[date.getMonth()];

      return `${dayOfWeek}, ${dayOfMonth} ${month}`;
    }
    return this.convertedDate
  }
  getCricketMenu() {
    this.apiservice.getCricketMenus().subscribe((res: any) => {
      this.cricketMenuList = res.data

    })
  }
  getCricketMatches(event: any) {
    const selectedRoute = event.target.value;
    this.routeName = selectedRoute
    let url = '/child-shedule/' + selectedRoute + "/" + this.selectedTab
    this.router.navigateByUrl(url);
    this.getTitalDta(selectedRoute)
    this.getMatchesbySeries(this.selectedTab, selectedRoute)
    this.getStats('batting', selectedRoute)

  }
  getStats(select: any, eventName: any) {
    if (select == 'batting') {
      this.battingbtn = select
      // this.bowlingbtn=true

      this.apiservice.getSeriesStats(eventName).subscribe((res: any) => {
        this.statsList = res.data
      })
    } else if (select == 'bowling') {
      this.battingbtn = select
      this.apiservice.getSeriesStats(this.eventgrupname).subscribe((res: any) => {
        this.statsList = res.data
      })
    }

  }
  getTitalDta(data: any) {
    this.apiservice.getSeriesInfo(data).subscribe((res: any) => {
      this.seriesTitle = res.data
    })
  }

  userByName(index: any) {
    return index;
  }

  checkIfMobile(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 768; // Example threshold for mobile view
  }
  getrouteandCheckwidth(route: any, route1: any, id: any=84398) {
    let url1 = route + '/' + id
    let url2 = route1 + '/' + id
    const isMobile = this.checkIfMobile();
    if (isMobile) {
      this.router.navigateByUrl(url2);
    } else {
      this.router.navigateByUrl(url1);
    }
  }

  getStatsRouteandCheckwidth(route: any, route1: any, id: any) {
    let url1 = route + '/' + id
    let url2 = route1 + '/' + id
    const isMobile = this.checkIfMobile();
    if (isMobile) {
      this.router.navigateByUrl(url2);
    } else {
      this.router.navigateByUrl(url1);
    }
  }


  getneswdata(data: any) {
    this.selectedNewsTab = data
    this.apiservice.getSeriesNews(this.eventgrupname).subscribe((res: any) => {
      this.latestNewsList = res.data?.sidebar?.latest
    })
  }

  popularNewsdata(data: any) {
    this.selectedNewsTab = data
    this.apiservice.getSeriesNews(this.eventgrupname).subscribe((res: any) => {
      // this.newslist=res.data?.news
      this.popularNewsList = res.data?.sidebar?.popular
    })

  }

  public scrollRight(): void {
    this.rightScrollCount = this.rightScrollCount + 1;
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 950), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.rightScrollCount = this.rightScrollCount - 1;
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 950), behavior: 'smooth' });
  }

  // ngOnDestroy(): void {
  //   localStorage.removeItem('seriesMatchData')
  // }




}
