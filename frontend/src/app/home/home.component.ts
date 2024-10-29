import { Component, OnInit, OnDestroy,  ViewChild, ElementRef  } from '@angular/core';
import { ServiceService } from '../service.service';
import { interval } from 'rxjs';
import { SocketServiceService } from '../socket-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild("widgetsContent", { static: false , read: ElementRef}) widgetsContent:any;
  uniqueTitlesMap: { title: string, slug: string }[] = [];

  rightScrollCount = 0;
  CricketMainTabs: any;
  activeIndex: number = 0;
  matchList: any;
  id = "featured"
  slug = { name: 'Featured', slug: 'featured' };
  intervalSubscription: any;
  loader = false
  allData: any;
  scores: any;
  toggleMenubtn = false
  listing = ["Featured"]
  selectedvalue = 'Featured';
  liveData: any = {};
  convertedDate: any;
  teamDefaultImg = '../../assets/team-default.png'
  rankingList: any;
  rankingListAll: any;
  rankingByTabs='team'
  selectedRanking="icc-t20-international-rankings"
  remainingTime: any;
  showTimer: boolean = false;
  lestesNewsList:any
  showEventName = false;
  newsList:any
  selectedNewsTab="latest"
  readmoreless = false;
  pionteTableData:any
  statLeaders:any
  serieslist:any=[]
  flattenedArray: any = [];
  uniqueSeries:any=[]


  constructor(private apiservice: ServiceService, private socket: SocketServiceService,private router:Router) {
  }
  ngOnInit(): void {
    // this.socket.connectSocket()
    // this.getCricketMatches(this.slug, 0)
    // this.getIccRankingData(this.selectedRanking)
    this.loader = true
    this.getCompetitionByDay()
    // this.getnews()
    // this.getHomeSidebarNewData('latest')
    // this.getPointsTableData()
    // this.getHomeSidebarStats()
    // this.getCricketSeries()
    // this.loader = false
  }

  ngOnDestroy() {
    this.socket.destorySocket()
  }

  getCompetitionByDay(){
    this.apiservice.getCompetitionByDay().subscribe((res:any)=>{
      console.log("resres",res.data)
      this.matchList = res.data
      this.loader =false;
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

  getnews(){
    this.apiservice.getLatestNews().subscribe((res:any)=>{
      this.newsList=res.data


    })
  }

  getCricketMatches(data: any, index: any) {
    this.loader = true
    this.activeIndex = index;
    this.listing.push(data.slug)

    this.slug = data.slug
    this.apiservice.getCricketMatches(data.slug).subscribe((res: any) => {
      this.matchList = res.data
      this.loader = false

    })
    this.socket.setMatches(this.slug)
    this.socket.getMatches(this.slug)
    this.socket.getUpdateMessageListner().subscribe((res: any) => {
      // this.matchList = res.message.matches
      this.allData = res.message.livedata
      this.liveData = this.allData.reduce((acc: any, dt: any) => {
        acc[dt.id] = dt;
        return acc;
      }, {})

      let timers=this.matchList.map((obj:any) => obj.datetime);
      this.startTimer(timers);

    })

    this.selectedvalue = data.name;
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
    this.matchSportTime(datetime)
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

  getMatchStatus(id:string,status:any){
    if(status=="Live"){
      // let url:=`/live/${encodedId}`
      let url: string = `/live/${id}`;
      this.router.navigateByUrl(url)
    }else{
      // let url= `/livecricket-score/${encodedId}`
      let url: string = `/livecricket-score/${id}`;
      this.router.navigateByUrl(url)
    }
  }

  getIccRankingData(data:any){
    this.selectedRanking=data
    this.apiservice.getIccRankingapis(data).subscribe((res:any)=>{
      this.rankingListAll=res.data
      if(data=='icc-t20-international-rankings'){

        this.rankingList= this.rankingListAll
        console.log( this.rankingList," this.rankingList");

        this.rankingByTabs='team'

      }else if(data=='icc-odi-ranking'){
        this.rankingList= this.rankingListAll
        this.rankingByTabs='team'

      }
      else if(data=='icc-test-ranking'){
        this.rankingList= this.rankingListAll
        this.rankingByTabs='team'

      }  console.log("ranking list ",this.rankingList)


    })
  }
  getDataByTbs(data:any){
    this.rankingByTabs=data

  }
  startTimer(data:any) {
    const matchStartTime = new Date(data).getTime(); // Match start time
    const interval = setInterval(() => {
      const now = new Date().getTime(); // Current time
      const distance = matchStartTime - now;

      // Calculating remaining time
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Displaying remaining time
      this.remainingTime = `${minutes}m ${seconds}s`;

      // Checking if the timer has expired
      if (distance < 0) {
        clearInterval(interval);
        this.showTimer = true;

        this.remainingTime = "Match Started";
        this.showEventName = false; // Hide event name when the match starts

      }else{
        this.showTimer = false;


      }
    }, 1000); // Update every 1 second
  }


  matchSportTime(datetime:any){
    const matchStartTime = new Date(datetime).getTime(); // Match start time
    const now = new Date().getTime(); // Current time
    const ddiff = now-matchStartTime
    if(ddiff<3600000 && ddiff>0){
    }
  }




  getHomeSidebarNewData(data:any){
    this.selectedNewsTab=data
    this.apiservice.getHomeSidebarNews().subscribe((res:any)=>{
      this.lestesNewsList=res.data
    })

  }


  collapseddata(){
    document.getElementById('removeCollapse')?.classList.toggle('collapsed')
    document.getElementById('addExpanded')?.classList.toggle('expanded')
    this.readmoreless = !this.readmoreless;
  }


  collapseddatamobile(){
    document.getElementById('removemobileCollapse')?.classList.toggle('collapsed')
    document.getElementById('addExpandedmobile')?.classList.toggle('expanded')
    this.readmoreless = !this.readmoreless;
  }

  getPointsTableData(){
    this.apiservice.getPointsTable('ipl').subscribe((res:any)=>{
    this.pionteTableData = res.data.table[0].table;
    })
  }

  getHomeSidebarStats(){
    this.apiservice.getHomeSidebarStat().subscribe((res:any)=>{
      this.statLeaders=res.data

    })
  }

  addOrdinalSuffix(num: string): string {
    const numInt = parseInt(num);
    const suffix = ["th", "st", "nd", "rd"];
    const v = numInt % 100;
    return numInt + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  }


  getCricketSeries(){
    this.apiservice.getCricketSeries().subscribe((res:any)=>{
      // this.serieslist=res.data
      for (const key in res.data) {
        if (res.data.hasOwnProperty(key)) {
          // Push the array value of each property into the dataArray
          this.serieslist.push(res.data[key]);
        }
      }
      this.flattenNestedArray(this.serieslist);

      // console.log(this.flattenedArray,"this.serieslist");
      const titlesMap = new Map<string, string>();
      this.flattenedArray.forEach((event:any) => {
        if (!titlesMap.has(event.title)) {
          titlesMap.set(event.title, event.slug);
          this.uniqueTitlesMap.push({ title: event.title, slug: event.slug });
        }
      });


    })
  }
  flattenNestedArray(array: any[]) {
    for (const item of array) {
      if (Array.isArray(item)) {
        this.flattenNestedArray(item);
      } else {
        this.flattenedArray.push(item);
      }
    }
    const titlesSet = new Set<string>();
    this.flattenedArray.map((event:any) => titlesSet.add(event.title));
    this.uniqueSeries = Array.from(titlesSet);
    // console.log(this.uniqueSeries,"this.flattenedArray");

  }
}
