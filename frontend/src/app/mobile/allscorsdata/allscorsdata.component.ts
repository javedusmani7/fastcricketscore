import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, debounceTime, filter, fromEvent } from 'rxjs';
import { ServiceService } from 'src/app/service.service';
import { SocketServiceService } from 'src/app/socket-service.service';

@Component({
  selector: 'app-allscorsdata',
  templateUrl: './allscorsdata.component.html',
  styleUrls: ['./allscorsdata.component.css']
})
export class AllscorsdataComponent implements OnInit ,OnDestroy{
  @ViewChild("widgetsContent", { static: false , read: ElementRef}) widgetsContent:any;

  rightScrollCount = 0;
  showtTable:any
  pionteTableData:any

  matchId:any
  liveScoreData: any;
  Inning:any
  now_battings:any
  bowlings:any
  overstimeline_v2:any
  formattedDate2:any
  formattedTime:any
  scorecard:any
  tabs="live"
  selected='live'
  activeIndex=0
  not_batted:any
  convertedDateTimes:any
  squadData: any;
  maxLength: number = 8; // Maximum length of string to display
  prediction_poll:any
  playerImages:any
  sum_of_vots:any
  overAndBall: string = '';
  remainingText: string = '';
  getDataFromSocket:Subscription | undefined;
  inningTabs=""
  isLoadingOlder: boolean = false;  readonly pageSize: number = 10;
  commentrayList:any=[]
  oldCommentrayList:any
  prediction_pollArr:any
  sum_of_vote_count:any
  fullsqure = '386px';
  hidebtn=false
  hidesquad=true
  scrollVarible:Subscription | undefined
  keys: any;
  values:any;
  liveScoreList:any
  value2:any
  value3:any
  teamDefaultImg="../../assets/team-default.png"
  commentryLoading=true


  constructor(private apiservic:ServiceService, private route:ActivatedRoute,private router:Router,private socket:SocketServiceService,private datePipe: DatePipe,
    private elementRef : ElementRef){}

  ngOnDestroy(): void {
    this.socket.destorySocket()
    this.getDataFromSocket?.unsubscribe()
    this.scrollVarible?.unsubscribe()
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.matchId=this.route.snapshot.paramMap.get('id');
    })
    this.socket.connectSocket()
    this.getLiveScoreDataFromApi(this.tabs)
    this.socket.setLiveScore(this.matchId)
    this.socket.getLiveScore(this.matchId)
    this.getDataFromSocket=this.socket.getLiveScoreData().subscribe((res:any)=>{
      this.liveScoreData=res.message
      this.liveScoreList=res.message?.score_strip
      this.Inning=res.message?.innings
      // this.commentrayList=this.liveScoreData?.commentary
      if(this.commentryLoading==true){
        this.commentrayList=this.liveScoreData?.commentary
        // console.log( this.commentrayList," this.commentrayList");

      }
      this.now_battings=res.message?.now_batting
      this.bowlings=res.message?.now_bowling
      const reversed=res.message?.overs_timeline_v2?.reverse()
      this.overstimeline_v2=reversed
      this.formattedDate2 = this.formatDate(this.liveScoreData?.datetime);
      // this.formattedTime = this.formatTime(this.liveScoreData?.datetime);

      this.datetimeconvart(this.liveScoreData?.datetime)
      this.prediction_pollArr = Object.values(this.liveScoreData?.prediction_poll?.options);
      this.sum_of_vote_count= this.prediction_pollArr.reduce((total:any, option:any) => total + option.vote_count, 0);

      this.squadData=res.message?.squad
      // if(res.data?.player_images){
      //   this.playerImages=res.data?.player_images
      // }else{
      //   this.playerImages=""

      // }


      this.sum_of_vots=this.liveScoreData?.prediction_poll?.options?.opt1?.vote_count+this.liveScoreData?.prediction_poll?.options?.opt2?.vote_count
      this.not_batted=Object?.values( this.Inning[0]?.not_batted);
      this.getkeyvaluedata(this.liveScoreData?.team_win_probability)


      // this.overstimeline_v2 =res.data?.overs_timeline_v2.slice().sort((a:any, b:any) => a - b);

    })
    this.getPointsTableData()
    this.scrollVarible=fromEvent(window, 'scroll')
    .pipe(
      debounceTime(200),
      filter(() => !this.isLoadingOlder)
    )
    .subscribe((event: Event) => {
      this.onScroll(event);
      // this.onScrollUp(event);
    });
  }


  getLiveScoreDataFromApi(data:any){
    this.selected=data
    this.apiservic.getLiveCricketScore(this.matchId).subscribe((res:any)=>{
      this.liveScoreData=res.data
      this.liveScoreList=res.data?.score_strip

      this.commentrayList=this.liveScoreData?.commentary
      this.Inning=res.data?.innings
      this.inningTabs=this.Inning[0]?.name
      this.now_battings=res.data?.now_batting
      this.bowlings=res.data?.now_bowling
      const reversed=res.data?.overs_timeline_v2?.reverse()
      this.overstimeline_v2=reversed
      this.formattedDate2 = this.formatDate(this.liveScoreData?.datetime);

      // this.formattedTime = this.formatTime(this.liveScoreData?.datetime);

      this.datetimeconvart(this.liveScoreData?.datetime)
      this.prediction_pollArr = Object.values(this.liveScoreData?.prediction_poll?.options);

      this.sum_of_vote_count= this.prediction_pollArr.reduce((total:any, option:any) => total + option.vote_count, 0);

      this.squadData=res.data?.squad
      // this.playerImages=res.data.player_images
      if(res.data?.player_images){
        this.playerImages=res.data?.player_images
      }else{
        this.playerImages=""

      }
      this.sum_of_vots=this.liveScoreData?.prediction_poll?.options?.opt1?.vote_count+this.liveScoreData?.prediction_poll?.options?.opt2.vote_count
      this.not_batted=Object?.values( this.Inning[0]?.not_batted);
      this.getkeyvaluedata(this.liveScoreData?.team_win_probability)


      // this.overstimeline_v2 =res.data?.overs_timeline_v2.slice().sort((a:any, b:any) => a - b);
    })
  }

  userByName(index: any) {
    return index;
  }
  formatDate(timestamp: number): any {
    const milliseconds = timestamp * 1000;
    const dateObj = new Date(milliseconds);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (dateObj.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return this.datePipe.transform(dateObj, 'MMMM d');
    }
  }
  // formatTime(timestamp: number): any {
  //   const milliseconds = timestamp * 1000;
  //   const dateObj = new Date(milliseconds);
  //   return this.datePipe.transform(dateObj, 'h:mm a');
  // }
  datetimeconvart(unixTimestamp:any){
    const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata' // IST timezone
    };
    return this.convertedDateTimes=new Intl.DateTimeFormat('en-IN', options).format(date);


  }
  getPlayerImage(playerName: string): string {
    return this.playerImages[playerName.toLowerCase().replace(/\s+/g, '-')] || ''; // Return empty string if the player name is not found
  }
  shouldTrim(): boolean {
    return window.innerWidth > 260;
  }

  splitCommentText(commentText: string): void {
    const match = commentText?.match(/(\d+\.\d+)\s*(.*)/);
    if (match && match.length >= 3) {
      this.overAndBall = match[1];
      this.remainingText = match[2];
    } else {
      this.overAndBall = '';
      this.remainingText = '';
    }
  }
  extractNumber(comment: string): string {
    const numberRegex = /\d+(\.\d+)?/; // Regular expression to match a number
    const match = comment.match(numberRegex);
    if (match) {
      return match[0]; // Return the matched number
    }
    return ""; // Return empty string if no number found
  }

  gatInningsByTabs(tabs:any,index:any){
    this.inningTabs=tabs
    this.activeIndex=index
  }
  formatDateTime(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
  }





// @HostListener('window:scroll', ['$event'])
onScroll(event: Event): void {

  const container = this.elementRef.nativeElement.querySelector('.load-more');
  const scrollPosition = window.pageYOffset + window.innerHeight;
  const containerHeight = container.offsetHeight + container.offsetTop;

  if (scrollPosition  >= containerHeight ) {
    this.isLoadingOlder=true
    this.fetchData()

  }

}



fetchData(): void {
  this.isLoadingOlder = true;
  if (this.commentrayList?.length > 0) {
    const lastObject = this.commentrayList[this.commentrayList?.length - 1];
    let lastTimestamp = lastObject?.timestamp;
    this.apiservic.loadCommentryData(this.matchId,lastTimestamp).subscribe((res: any) => {
      this.commentryLoading=false
      this.commentrayList.push(...res.commentary)
      this.isLoadingOlder=false
    })
  } else {
  }
}
expandfullsqure(){
  this.fullsqure = 'auto';
 this.hidebtn=true
}



expandHidesqure(){
  this.hidesquad=!this.hidesquad

}


// getkeyvaluedata(data:any){
//   this.keys = Object.keys(data);
//   this.values = this.keys.map((key:any) => data[key]);

// }
addOrdinalSuffix(num: string): string {
  const numInt = parseInt(num);
  const suffix = ["th", "st", "nd", "rd"];
  const v = numInt % 100;
  return numInt + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
}

calculatePercentage(voteCount:any) {
  let a = (voteCount /  this.sum_of_vote_count) * 100;

  return (voteCount /  this.sum_of_vote_count) * 100; // Assuming total possible votes as 1000
}
getkeyvaluedata(data:any){

  this.keys = Object.keys(data);
  let shortName = this.liveScoreList?.[0]?.short_name;
  let shortName1 = this.liveScoreList?.[1]?.short_name;

    this.values = data[shortName];
    this.value2 = data[shortName1];

    this.value3 = data['DRAW'];
}

getPointsTableData(){
  this.apiservic.getPointsTable('ipl').subscribe((res:any)=>{
  this.pionteTableData = res.data.table[0].table;
  this.showtTable=res.data.table[0].table[0]?.group.filter((re:any)=>{
    if(this.liveScoreList?.[0]?.name==re.team_name){
      return re;
    }

  })

  })
}


previousScrollPosition = 0;
scrollUpFunction() {
  this.commentryLoading=true
  console.log("Scrolled up!");
}

@HostListener('window:scroll', ['$event'])
onScroll1(event: any) {
  if (this.isScrollingDown()) {
    // this.scrollDownFunction();
  } else {
    this.scrollUpFunction();
  }
  this.previousScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
}
isScrollingDown(): boolean {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  return currentScrollPosition > this.previousScrollPosition;
}



}

