import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import { SocketServiceService } from '../socket-service.service';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.css']
})
export class SquadComponent implements OnInit ,OnDestroy{
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
  teamDefaultImg = '../../assets/team-default.png'
  imageUrl = '../../assets/team-default.png';
imageLoaded = true;
formattedDate2:any
formattedTime:any
matchSquads:any;

  // voteCount: number = 8074;
  totalCount: number = 10000;
  hide=false

  constructor(private datePipe: DatePipe,private apiservic:ServiceService, private route:ActivatedRoute,private router:Router, private socket:SocketServiceService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.matchId=this.route.snapshot.paramMap.get('id');
    })
    this.getInfoCricketScores();
    this.getTeamSquards();
    // this.socket.connectSocket()
    // this.getLiveCricketScores()
    // this.socket.setLiveScore(this.matchId)
    // this.socket.getLiveScore(this.matchId)
    // this.socket.getLiveScoreData().subscribe((res:any)=>{
    //   this.liveScoreList=res.message.score_strip
    //   this.scorelist=res.message
    //   this.pitchReport=res.message.pitch
    //   this.weatherReport=res.message.weather
    //   this.datetimeconvart(this.scorelist.datetime)
    //   this.squadData=res.message.squad
    //   this.formattedDate2 = this.formatDate(this.scorelist?.datetime);
    //   this.formattedTime = this.formatTime(this.scorelist?.datetime);
    //   this.playerImages=res.message.player_images
    //   if(this.scorelist.match_status =="live"){
    //     this.hide=true
    //   }else{
    //     this.hide=false
    //   }


    // })
  }
  ngOnDestroy(): void {
    this.socket.destorySocket()
  }
  getLiveCricketScores(){
    this.apiservic.getLiveCricketScore(this.matchId).subscribe((res:any)=>{
      this.liveScoreList=res.data.score_strip
      this.scorelist=res.data
      this.pitchReport=res.data.pitch
      this.weatherReport=res.data.weather
      this.datetimeconvart(this.scorelist.datetime)
      this.squadData=res.data.squad
      this.formattedDate2 = this.formatDate(this.scorelist?.datetime);
      this.formattedTime = this.formatTime(this.scorelist?.datetime);
      this.playerImages=res.data.player_images
      if(this.scorelist.match_status =="live"){
        this.hide=true
      }else{
        this.hide=false
      }

      // this.prediction_poll=res.data.prediction_poll
      // this.prediction_pollsData1=this.prediction_poll.options.opt1
      // this.prediction_pollsData2=this.prediction_poll.options.opt2
      // this.prediction_pollsData3=this.prediction_poll.options.opt3

      // this.sum_of_prediction_poll= this.prediction_poll.options.opt1.vote_count+this.prediction_poll.options.opt2.vote_count+this.prediction_poll.options.opt3.vote_count

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
calculatePercentage(voteCount:any): string {
  const percentage = (voteCount / this.totalCount) * 100;
  return percentage.toFixed(2) + '%';
}
toggleSqaud(data:any){
  if(data=="PlayingXI"){
    this.squadData
    this.PlayingXI=true
    this.router.navigate(['/squad'])
  }
}

handleImageError() {
  this.imageUrl = 'path_to_default_image';
  this.imageLoaded = false;
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
userByName(index: any) {
  return index;
}

getTeamSquards() {
  this.apiservic.getMatchSquads(this.matchId).subscribe((res: any) => {
    this.matchSquads = res.data;

  })
}
getInfoCricketScores() {
  this.apiservic.getInfoCricketScores(this.matchId).subscribe((res: any) => {
   this.scorelist = res.data[0];
   this.playerImages=""
  })

}

getBenchPlayers(list:any){
  return list.filter((item:any)=> item.playing11 == 'false')
}
getPlayingXIPlayers(list:any){
return list.filter((item:any)=> item.playing11 == 'true')
}

}
