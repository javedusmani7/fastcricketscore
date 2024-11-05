import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SocketServiceService } from '../socket-service.service';
import { DatePipe } from '@angular/common';
import { Subscription, debounceTime, filter, fromEvent, timestamp } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
interface BowlingStats {
  runs: string;
  balls: string;
  maiden_overs: string;
  wickets: string;
  overs: string;
  economy: number;
}

interface BowlingPlayer {
  name: string;
  stats: BowlingStats;
}
@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy{
  @ViewChild("widgetsContent", { static: false , read: ElementRef}) widgetsContent:any;
  commentaryList:any
  loader:any=false
  rightScrollCount = 0;
  liveScoreList:any
  PlayingXI:boolean=false
  scorelist:any
  matchId:any
  pitchReport: any;
  weatherReport: any;
  formattedDate:any
  squadData: any;
  playerImages:any
  players:any
  images: any;
  prediction_poll: any;
  sum_of_prediction_poll: any;
  prediction_pollsData1:any
  prediction_pollsData2:any
  prediction_pollsData3:any
  totalCount: number = 10000;
  Innings: any
  now_battings:any;
  current_partnerships: any;
  blowings: any;
  overstimeline_v2: any;
  hide=false
  overNumber: string = '';
    isSticky: boolean = false;
    plainString:any
    overAndBall: string = '';
    remainingText: string = '';
  normalsammary: any;
  endOfOversammary: any;
  wicketsammary: any;
  formattedDate2:any
  formattedTime:any
  page: number = 1; // Page number for pagination
  isLoadingOlder: boolean = false;  readonly pageSize: number = 10;
  commentrayList:any=[]
  oldCommentrayList:any
  prediction_pollArr:any
  sum_of_vote_count:any
  scrollVarible:Subscription | undefined
  keys: any;
  values:any;
  value2:any
  value3:any
  emptyCommentry:any
  commentryLoading=true
  constructor(private datePipe: DatePipe,private apiservic:ServiceService, private route:ActivatedRoute,private router:Router,private socket:SocketServiceService, private elementRef : ElementRef){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.matchId=this.route.snapshot.paramMap.get('id');
    })
 
    this.loader=true
   this.getCommentary(this.matchId)


    this.socket.connectSocket()
    this.getLiveCricketScores()
    this.socket.setLiveScore(this.matchId)
    this.socket.getLiveScoreData().subscribe((res:any)=>{
      this.liveScoreList=res.message.score_strip
      this.scorelist=res.message
      this.pitchReport=res.message.pitch
      this.weatherReport=res.message.weather
      this.datetimeconvart(this.scorelist.datetime)
      this.squadData=res.message.squad
      this.playerImages=res.message.player_images
      this.prediction_poll=res.message.prediction_poll
      this.prediction_pollsData1=this.prediction_poll.options.opt1
      this.prediction_pollsData2=this.prediction_poll.options.opt2
      this.prediction_pollsData3=this.prediction_poll.options.opt3
      this.Innings=res.message.innings
      this.current_partnerships=this.Innings[0]?.current_partnership
      this.now_battings=res.message.now_batting
      this.blowings=res.message.now_bowling
      const reversed=res.message.overs_timeline_v2.reverse()
      this.overstimeline_v2=reversed
      this.formattedDate2 = this.formatDate(this.scorelist?.datetime);
      this.formattedTime = this.formatTime(this.scorelist?.datetime);
      this.prediction_pollArr = Object.values(this.scorelist?.prediction_poll?.options);
      this.sum_of_vote_count= this.prediction_pollArr.reduce((total:any, option:any) => total + option.vote_count, 0);
      if(this.commentryLoading==true){
        this.commentrayList=this.commentaryList
        // console.log(this.commentrayList,"this.commentrayList+++");
      }

      // this.oldCommentrayList=this.scorelist?.commentary


      this.getkeyvaluedata(this.scorelist?.team_win_probability)

      if(this.scorelist.match_status =="live"){
        this.hide=true

      }else{
        this.hide=false
      }


    })
    this.plainString = this.convertToPlainText('');
    this.scrollVarible=fromEvent(window, 'scroll')
    .pipe(
      debounceTime(200),
      filter(() => !this.isLoadingOlder)
    )
    .subscribe((event: Event) => {
      this.onScroll(event);
    });

  }
  ngOnDestroy(): void {
    this.socket.destorySocket()
    this.scrollVarible?.unsubscribe()

  }
  getLiveCricketScores(){
    this.apiservic.getLiveCricketScore(this.matchId).subscribe((res:any)=>{
      this.liveScoreList=res.data?.score_strip

      this.scorelist=res.data
      console.log("ye hai scorelist " , this.scorelist )
      this.loader=false
      this.pitchReport=res.data?.pitch
      this.weatherReport=res.data?.weather
      this.datetimeconvart(this.scorelist.datetime)
      this.squadData=res.data?.squad
      this.playerImages=res.data?.player_images
      this.prediction_poll=res.data?.prediction_poll
      this.prediction_pollsData1=this.prediction_poll?.options?.opt1
      this.prediction_pollsData2=this.prediction_poll?.options?.opt2
      this.prediction_pollsData3=this.prediction_poll?.options?.opt3
      this.Innings=res.data?.innings
      this.formattedDate2 = this.formatDate(this.scorelist?.datetime);
      this.formattedTime = this.formatTime(this.scorelist?.datetime);
      this.current_partnerships=this.Innings[0]?.current_partnership
      this.now_battings=res.data?.now_batting
      this.blowings=res.data?.now_bowling
      const reversed=res.data?.overs_timeline_v2.reverse()
      this.overstimeline_v2=reversed
      this.commentrayList=this.commentaryList

      this.prediction_pollArr = Object.values(this.scorelist?.prediction_poll?.options);
      this.sum_of_vote_count= this.prediction_pollArr.reduce((total:any, option:any) => total + option.vote_count, 0);

      this.getkeyvaluedata(this.scorelist?.team_win_probability)

      if(this.scorelist.match_status =="live"){
        this.hide=true
      }else{
        this.hide=false
      }
    })

  }
datetimeconvart(data:any){
  const timestamp = 1706846400;
  const milliseconds = data * 1000;
  const date = new Date(milliseconds);
  this.formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
  });
}
getPlayerImage(playerName: string): string {
  return this.playerImages[playerName.toLowerCase().replace(/\s+/g, '-')] || ''; // Return empty string if the player name is not found
}
calculatePercentage(voteCount:any) {
  let a = (voteCount /  this.sum_of_vote_count) * 100;

  return (voteCount /  this.sum_of_vote_count) * 100; // Assuming total possible votes as 1000
}
toggleSqaud(data:any){
  if(data=="PlayingXI"){
    this.squadData
    this.PlayingXI=true
    this.router.navigate(['/squad'])
  }
}

covaertkeydata(data:any):any{

  return Object.keys(data)
}

userByName(index: any) {
  return index;
}
overTrack(index:any, item:any){
  return item.over;
}
ballTrack(index:any, item:any){
  return item;
}


convertToPlainText(htmlString: string): string {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;
  return tempElement.innerText;
}

extractNumber(comment: string): string {
  const numberRegex = /\d+(\.\d+)?/; // Regular expression to match a number
  const match = comment.match(numberRegex);
  if (match) {
    return match[0]; // Return the matched number
  }
  return ""; // Return empty string if no number found
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
formatTime(timestamp: number): any {
  const milliseconds = timestamp * 1000;
  const dateObj = new Date(milliseconds);
  return this.datePipe.transform(dateObj, 'h:mm a');
}

getcommentraykeys(obj:any){
 let s= Object.keys(obj)

}

  onScroll(event: Event): void {
    // this.commentryLoading=false

    const container = this.elementRef.nativeElement.querySelector('.load-more');
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const containerHeight = container.offsetHeight + container.offsetTop;

    if (scrollPosition  >= containerHeight ) {
      this.isLoadingOlder=true
      this.commentryLoading=false

      this.fetchData()
    }

  }




  fetchData(): void {
    this.isLoadingOlder = true;
    if (this.commentrayList.length > 0) {
      const lastObject = this.commentrayList[this.commentrayList.length - 1];
      let lastTimestamp = lastObject.timestamp;
      this.apiservic.loadCommentryData(this.matchId,lastTimestamp).subscribe((res: any) => {
        this.commentryLoading=false
        // console.log(    this.commentryLoading,"    this.commentryLoading");
        this.commentrayList.push(...res.commentary)
        this.emptyCommentry=res.commentary
        this.isLoadingOlder=false
      })
    } else {
    }

  }


  public scrollRight(): void {
    this.rightScrollCount = this.rightScrollCount + 1;
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.rightScrollCount = this.rightScrollCount - 1;
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  getkeyvaluedata(data:any){

    this.keys = Object?.keys(data);
    let shortName = this.liveScoreList?.[0]?.short_name;
    let shortName1 = this.liveScoreList?.[1]?.short_name;

      this.values = data[shortName];
      this.value2 = data[shortName1];

      this.value3 = data['DRAW'];


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

  getCommentary(match_id:any){

    this.apiservic.getCommentary(this.matchId).subscribe((res:any)=>{
      this.commentaryList = res.data?.commentaries?.reverse();
      console.log("this is live list" , this.commentaryList)
      this.loader=false
})

 

  }

  getPlayer(id:any){

    const player = this.scorelist.players.find((p:any)=> p.pid===id)
 
    return player;
  }
 
}
