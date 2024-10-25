import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SocketServiceService } from '../socket-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit ,OnDestroy{
  liveScoreList: any
  PlayingXI: boolean = false
  scorelist: any
  matchId: any
  pitchReport: any;
  weatherReport: any;
  formattedDate: any
  squadData: any;
  playerImages: any
  players: any
  images: any;
  prediction_poll: any;
  sum_of_prediction_poll: any;
  prediction_pollsData1: any
  prediction_pollsData2: any
  prediction_pollsData3: any
  activeIndex=0
  // voteCount: number = 8074;
  totalCount: number = 10000;
  Innings:any
  hide=false
  convertedDateTime:any
  not_batted:any
  @ViewChild('elementToFocus') elementToFocus!: ElementRef;
  @ViewChild('container') container: any;

  inningTabs=""
  selectedTabIndex = 0;
  teamDefaultImg = '../../assets/team-default.png'
  convertedDateTimes:any
 
  public scoreArray: any[] = [];




  constructor(private datePipe: DatePipe,private apiservic: ServiceService, private route: ActivatedRoute, private router: Router,private socketService:SocketServiceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.matchId = this.route.snapshot.paramMap.get('id');
    })

      // Assuming scorelist is an object
  // this.scoreArray = Object.values(this.scorelist);
  // console.log(this.scoreArray)
    // this.socketService.connectSocket()
    // this.getLiveCricketScores();
    this.getLiveCricketScores() 
    this.getInfoCricketScores()// for info
    // this.socketService.setLiveScore(this.matchId)
    // this.socketService.getLiveScore(this.matchId)
    // this.socketService.getLiveScoreData().subscribe((res:any)=>{
    //   this.liveScoreList = res.message.score_strip
    //   this.scorelist = res.message
    //   this.pitchReport = res.message.pitch
    //   this.weatherReport = res.message.weather
    //   this.datetimeconvart(this.scorelist.datetime)
    //   this.datetimeconvartdata(this.scorelist.datetime)
    //   this.squadData = res.message.squad
    //   this.playerImages = res.message.player_images
    //   this.Innings=res.message.innings
    //   this.not_batted=Object.values( this.Innings[0]?.not_batted);
    //   if(this.scorelist.match_status =="live"){
    //     this.hide=true
    //   }else{
    //     this.hide=false
    //   }
    // })

      // Assuming scorelist is an object

  

  }
  ngOnDestroy(): void {
    this.socketService.destorySocket()
  }
  getLiveCricketScores() {
    this.apiservic.getLiveCricketScore(this.matchId).subscribe((res: any) => {
      this.liveScoreList = res.data
      console.log("livescorelist" , res)
      this.scorelist = res.data
      this.scoreArray = Object.values(this.scorelist);
      console.log("scorearray ",this.scoreArray)
      this.pitchReport = res.data.pitch
      this.weatherReport = res.data.weather
      // this.datetimeconvart(this.scorelist.datetime)
      // this.datetimeconvartdata(this.scorelist.datetime)
      this.squadData = res.data.pre_squad
      // this.playerImages = res.data.player_images
      this.Innings=res.data.innings
      this.inningTabs=this.Innings[0].name

      this.not_batted=Object.values( this.Innings[0]?.did_not_bat);


      // this.prediction_poll=res.data.prediction_poll
      // this.prediction_pollsData1=this.prediction_poll.options.opt1
      // this.prediction_pollsData2=this.prediction_poll.options.opt2
      // this.prediction_pollsData3=this.prediction_poll.options.opt3

      // this.sum_of_prediction_poll= this.prediction_poll.options.opt1.vote_count+this.prediction_poll.options.opt2.vote_count+this.prediction_poll.options.opt3.vote_count
      if(this.scorelist.status_str =="live"){
        this.hide=true
      }else{
        this.hide=false
      }

    })

  }
  datetimeconvart(data: any) {
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
  calculatePercentage(voteCount: any): string {
    const percentage = (voteCount / this.totalCount) * 100;
    return percentage.toFixed(2) + '%';
  }
  toggleSqaud(data: any) {
    if (data == "PlayingXI") {
      this.squadData
      this.PlayingXI = true
      this.router.navigate(['/squad'])
    }
  }
  datetimeconvartdata(unixTimestamp:any){
    console.log("fvnkjbfvh")
    const milliseconds = unixTimestamp * 1000;
    const dateObject = new Date(milliseconds);

    // Get current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight

    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);

    // Format the date and time according to IST (UTC+5:30)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata', // IST timezone
      hour12: true,
      weekday: 'short', // Display short weekday names
      month: 'short', // Display short month names
      day: 'numeric', // Display numeric day of the month
      hour: 'numeric', // Display numeric hour
      minute: '2-digit', // Display 2-digit minute
      second: '2-digit' // Display 2-digit second
    };

    if (dateObject.toDateString() === currentDate.toDateString()) {
      this.convertedDateTime = 'Today, ' + dateObject.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit' });
    } else if (dateObject.toDateString() === tomorrowDate.toDateString()) {
      this.convertedDateTime = 'Tomorrow, ' + dateObject.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit' });
    } else {
      this.convertedDateTime = dateObject.toLocaleString('en-IN', options);
    }
  }

  focusOnElement() {
    // Trigger focus on the element
    this.elementToFocus.nativeElement.focus();
  }
  userByName(index: any) {
    return index;
  }

  gatInningsByTabs(tabs:any,index:any){
    this.selectedTabIndex=index
    this.inningTabs=tabs
  }

  selectTab(index: number) {
    this.selectedTabIndex = index;
    this.activeIndex=index

  }

  scrollToIndex(index: number): void {
    // const itemElement = this.container.nativeElement.querySelector(`#item${index}`);
    // if (itemElement) {
    //   itemElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest', inlinePosition: 'start'});
    // }
    document.getElementById(`innings-name-${index}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  getInfoCricketScores() {
    this.apiservic.getInfoCricketScores(this.matchId).subscribe((res: any) => {
    
     this.scorelist = res.data[0];
     console.log("scorelist " , this.scorelist)
     this.datetimeconvartNew(this.scorelist?.timestamp_start)

    })

  }
  datetimeconvartNew(unixTimestamp:any){
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

  getSum(a:any,b:any){
return Number(a) + Number(b);
  }

}
