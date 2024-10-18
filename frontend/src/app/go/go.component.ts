import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SocketServiceService } from '../socket-service.service';

@Component({
  selector: 'app-go',
  templateUrl: './go.component.html',
  styleUrls: ['./go.component.css']
})
export class GoComponent implements OnInit , OnDestroy{
  @ViewChild("widgetsContent", { static: false , read: ElementRef}) widgetsContent:any;

  rightScrollCount = 0;
  turnament:any
  seriesInfo: any;
  matchList: any;
  CricketMainTabs: any;
  activeIndex: number = 0;
  // matchList: any;
  // id = "featured"
  // slug = { name: 'Featured', slug: 'featured' };
  intervalSubscription: any;
  loader = false
  loadernews=true
  allData: any;
  scores: any;
  toggleMenubtn = false
  // listing = ["Featured"]
  // selectedvalue = 'Featured';
  liveData: any = {};
  convertedDate: any;
  teamDefaultImg = '../../assets/team-default.png'
  newslist:any
  latestNewsList:any
  popularNewsList: any;
  selectedNewsTab="latest"

  constructor(private apiservice: ServiceService, private socket: SocketServiceService,private router:Router ,private route:ActivatedRoute) {

  }

  ngOnInit(): void {
    this.socket.connectSocket()
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.turnament=this.route.snapshot.paramMap.get('event_slug');
    // })
    this.getMarches(this.turnament)
    this.socket.setMatches(this.turnament)
    this.socket.getMatches(this.turnament)
    this.socket.getUpdateMessageListner().subscribe((res: any) => {
      // this.matchList = res.message.matches
      this.allData = res.message.livedata
      this.liveData = this.allData.reduce((acc: any, dt: any) => {
        acc[dt.id] = dt;
        return acc;
      }, {})


    })
    // this.getMarches(this.turnament)
    this.getneswdata('latest')
    this.popularNewsdata('latest')
    this.apiservice.getSeriesInfo(this.turnament).subscribe((res:any)=>{
      this.seriesInfo=res.data
    })
  })

    // this.getMatches()
  }
  ngOnDestroy() {
    this.socket.destorySocket()
  }
  getMarches(data:any){
    this.apiservice.getCricketMatches( data).subscribe((res: any) => {
      this.matchList = res.data
      this.loader = false
    })

  }

  getCricketMatches() {
    this.loader = true
    this.apiservice.getCricketMatches(this.turnament).subscribe((res: any) => {
      this.matchList = res.data
      this.loader = false
    })
    this.toggleMenubtn = false;

  }
  liveScores(ID: any) {
    this.allData?.filter((el: any) => {
      if (el.id == ID) {
        this.scores = el.score_strip
      }
    })
  }
  datetimedata(utcString: any) {
    const utcDate = new Date(utcString);
    const localDateString = utcDate.toLocaleString();
    return localDateString.split(",")
  }
  toggleMenu() {
    this.toggleMenubtn = !this.toggleMenubtn
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

  userByName(index: any) {
    return index;
  }

  getMatchStatus(id:any,status:any){
    if(status=="live"){
      let url="/live/"+id
      this.router.navigateByUrl(url)
    }else{
      let url="/livecricket-score/"+id
      this.router.navigateByUrl(url)

    }


  }
  checkIfMobile(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 768; // Example threshold for mobile view
  }
  getrouteandCheckwidth(route: any, route1: any, id: any) {
    let url1 = route + '/' + id
    let url2 = route1 + '/' + id
    const isMobile = this.checkIfMobile();
    if (isMobile) {
      this.router.navigateByUrl(url2);
    } else {
      this.router.navigateByUrl(url1);
    }
  }


  public scrollRight(): void {
    this.rightScrollCount = this.rightScrollCount + 1;
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 950), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.rightScrollCount = this.rightScrollCount - 1;
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 950), behavior: 'smooth' });
  }
  getneswdata(data:any){
    this.selectedNewsTab=data
    this.apiservice.getSeriesNews(this.turnament).subscribe((res:any)=>{
      this.newslist=res.data?.news
      this.latestNewsList=res.data?.sidebar?.latest
      this.loadernews=false
    })
  }

  popularNewsdata(data:any){
    this.selectedNewsTab=data
    this.apiservice.getSeriesNews(this.turnament).subscribe((res:any)=>{
      this.newslist=res.data?.news
      this.popularNewsList=res.data?.sidebar?.popular
      this.loadernews=false

    })

  }


  addOrdinalSuffix(num: string): string {
    const numInt = parseInt(num);
    const suffix = ["th", "st", "nd", "rd"];
    const v = numInt % 100;
    return numInt + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  }

}
