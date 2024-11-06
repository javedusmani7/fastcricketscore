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
  categoryWiseData:any
  tab: string = 't20';
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
  showEventName = false;
  newsList:any
  selectedNewsTab="latest"
  readmoreless = false;
  pionteTableData:any
  statLeaders:any
  serieslist:any=[]
  flattenedArray: any = [];
  uniqueSeries:any=[]
  lestesNewsList:any = [
    {
      title: "Josh Inglis to lead Australia in AUS vs PAK 2024 T20I series",
      link: "https://www.sportskeeda.com/cricket/news-josh-inglis-lead-australia-aus-vs-pak-2024-t20i-series"
    },
    {
      title: '"What he said is not wrong" - Aakash Chopra on Sunil Gavaskar asking for Jasprit Bumrah to be made captain instead of Rohit Sharma for BGT 2024-25',
      link: "https://www.sportskeeda.com/cricket/news-what-said-wrong-aakash-chopra-sunil-gavaskar-asking-jasprit-bumrah-made-captain-instead-rohit-sharma-bgt-2024-25"
    },
    {
      title: '"I think they’ve obviously squashed it as fast as they could" - David Warner on ball-tampering allegations levelled against India A ',
      link: "https://www.sportskeeda.com/cricket/news-i-think-they-ve-obviously-squashed-fast-could-david-warner-ball-tampering-allegations-levelled-india-a"
    },
    {
      title: '"Forget that you travel in big cars and flights and that you may not get VIP treatment"- Mohammad Kaif urges Indian batters to play Ranji before BGT',
      link: "https://www.sportskeeda.com/cricket/news-forget-travel-big-cars-flights-may-get-vip-treatment-mohammad-kaif-urges-indian-batters-play-ranji-bgt"
    },
    {
      title: '"Means a lot to me" - David Warner returns as Sydney Thunder captain ahead of BBL 2024-25',
      link: "https://www.sportskeeda.com/cricket/news-forget-travel-big-cars-flights-may-get-vip-treatment-mohammad-kaif-urges-indian-batters-play-ranji-bgt" }
    ]
    t20s:any = { batsmen: [], bowlers: [], teams: [], allRounders: [] };
    odis:any = { batsmen: [], bowlers: [], teams: [], allRounders: [] };
    tests:any = { batsmen: [], bowlers: [], teams: [], allRounders: [] };
    // allRounders = { batsmen: [], bowlers: [], teams: [], allRounders: [] };

  constructor(private apiservice: ServiceService, private socket: SocketServiceService,private router:Router) {
  }
  ngOnInit(): void {
    // this.socket.connectSocket()
    // this.getCricketMatches(this.slug, 0)
    this.getIccRankingData(this.selectedRanking)
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
    this.apiservice.getIccRankingapis().subscribe((res:any)=>{
      this.rankingListAll=res.data
      if(data=='icc-t20-international-rankings'){
        
        this.iccRankingCategory("t20s")
        this.rankingList= this.t20s
        this.tab="t20s"
        this.getCategory(data)
        console.log("t20 ranks " , this.t20s)
            // console.log("rankinglist it this",this.rankingList)

        this.rankingByTabs='team'

      }else if(data=='icc-odi-ranking'){
        this.iccRankingCategory("odis")
        this.rankingList= this.odis
        this.tab="odis"
        this.getCategory(data)
        this.rankingByTabs='team'
        console.log("odi ranks " , this.odis)

      }
      else if(data=='icc-test-ranking'){
        this.iccRankingCategory("tests")
        this.rankingList= this.tests
        this.rankingByTabs='team'
        this.tab="tests"
        this.getCategory(data)

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

  iccRankingCategory(category: string) {
    switch (category) {
      case 't20s':
        this.t20s.batsmen = this.rankingListAll.ranks.batsmen.t20s || [];
        this.t20s.bowlers = this.rankingListAll.ranks.bowlers.t20s || [];
        this.t20s.teams = this.rankingListAll.ranks.teams.t20s || [];
        this.t20s.allRounders = this.rankingListAll.ranks?.['all-rounders'].t20s || [];
        break;

      case 'odis':
        this.odis.batsmen = this.rankingListAll.ranks.batsmen.odis || [];
        this.odis.bowlers = this.rankingListAll.ranks.bowlers.odis || [];
        this.odis.teams = this.rankingListAll.ranks.teams.odis || [];
        this.odis.allRounders = this.rankingListAll.ranks?.["all-rounders"].odis || [];
        break;
  
      case 'tests':
        this.tests.batsmen = this.rankingListAll.ranks.batsmen.tests || [];
        this.tests.bowlers = this.rankingListAll.ranks.bowlers.tests || [];
        this.tests.teams = this.rankingListAll.ranks.teams.tests || [];
        this.tests.allRounders = this.rankingListAll.ranks?.["all-rounders"].tests || [];
        break;
  
      // case 'all-rounders':
      //   this.allRounders.batsmen = this.rankingListAll.ranks.batsmen.allRounders || [];
      //   this.allRounders.bowlers = this.rankingListAll.ranks.bowlers.allRounders || [];
      //   this.allRounders.teams = this.rankingListAll.ranks.teams.allRounders || [];
      //   this.allRounders.allRounders = this.rankingListAll.ranks?.['all-rounders'].allRounders || [];
      //   break;
  
      default:
        console.warn('Invalid category');
    }
  }
  
  getCategory(category:string){

    if(category=="icc-t20-international-rankings"){

      this.categoryWiseData=this.t20s
    }
    else if(category=="icc-odi-ranking"){
            this.categoryWiseData= this.odis
    }
      else{
               this.categoryWiseData=this.tests
      }

  }
}
