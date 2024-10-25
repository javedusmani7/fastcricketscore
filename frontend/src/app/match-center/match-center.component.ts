import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SocketServiceService } from '../socket-service.service';
import { DatePipe } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-match-center',
  templateUrl: './match-center.component.html',
  styleUrls: ['./match-center.component.css']
})
export class MatchCenterComponent implements OnInit,OnDestroy{
  showtTable:any
  pionteTableData:any
  infoData:any
  matchId:any
  matchesDtata:any
  convertedDateTimes:any
  playerImages:any
  prediction_pollArr:any
  sum_of_vote_count: any;
  // numerator: number = 50;
  totalCount: number = 10000;
  fullsqure = '380px';
  hidebtn=false
  hidesquad=true
  formattedDate2:any
  formattedTime:any
  teamDefaultImg="../../assets/team-default.png";
  matchSquads:any;
  loader=true;

  constructor(private datePipe: DatePipe,private apiservic:ServiceService, private route:ActivatedRoute,private router:Router,private socket:SocketServiceService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.matchId=this.route.snapshot.paramMap.get('id');
    })
    this.getInfoCricket();// for info
    this.getMatchSquads();
    // this.socket.connectSocket()
    // this.getinfoData()
    // this.socket.setLiveScore(this.matchId)
    // this.socket.getLiveScore(this.matchId)
    // this.socket.getLiveScoreData().subscribe((res:any)=>{
    //   this.infoData=res.message
    //   this.matchesDtata=res.message?.score_strip
    //   this.datetimeconvart(this.infoData?.datetime)
    //   if(res.message?.player_images){
    //     this.playerImages=res.message.player_images
    //   }else{
    //     this.playerImages=""

    //   }

    //   this.formattedDate2 = this.formatDate(this.infoData?.datetime);
    //   this.formattedTime = this.formatTime(this.infoData?.datetime);
    //   this.prediction_pollArr = Object.values(this.infoData?.prediction_poll?.options);
    //   this.sum_of_vote_count= this.prediction_pollArr?.reduce((total:any, option:any) => total + option?.vote_count, 0);
    // })
    // this.getPointsTableData()
  }
  ngOnDestroy(): void {
    this.socket.destorySocket()
  }
  getinfoData(){
    this.apiservic.getLiveCricketScore(this.matchId).subscribe((res:any)=>{
      this.infoData=res?.data
      this.matchesDtata=res.data?.score_strip
      this.datetimeconvart(this.infoData?.datetime)
      // this.playerImages=res.data?.player_images
      if(res.data?.player_images){
        this.playerImages=res.data?.player_images
      }else{
        this.playerImages=""

      }
      this.formattedDate2 = this.formatDate(this.infoData?.datetime);
      this.formattedTime = this.formatTime(this.infoData?.datetime);
      this.prediction_pollArr = Object?.values(this.infoData?.prediction_poll?.options);
      this.sum_of_vote_count= this.prediction_pollArr?.reduce((total:any, option:any) => total + option?.vote_count, 0);

    })
  }

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


  userByName(index: any) {
    return index;
  }


  getPlayerImage(playerName: string): string {
    return this.playerImages[playerName?.toLowerCase().replace(/\s+/g, '-')] || ''; // Return empty string if the player name is not found
  }
  calculatePercentage(voteCount:any) {
    let a = (voteCount /  this.sum_of_vote_count) * 100;

    return (voteCount /  this.sum_of_vote_count) * 100; // Assuming total possible votes as 1000
  }

  expandfullsqure(){
    this.fullsqure = 'auto';
   this.hidebtn=true
  }
  expandHidesqure(){
    this.hidesquad=!this.hidesquad
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

  getPointsTableData(){
    this.apiservic.getPointsTable('ipl').subscribe((res:any)=>{
    this.pionteTableData = res.data.table[0].table;
    this.showtTable=res.data.table[0].table[0]?.group.filter((re:any)=>{
      if(this.matchesDtata?.[0]?.name==re.team_name){
        return re;
      }

    })

    })
  }

  addOrdinalSuffix(num: string): string {
    const numInt = parseInt(num);
    const suffix = ["th", "st", "nd", "rd"];
    const v = numInt % 100;
    return numInt + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
  }

  getInfoCricket() {
    this.apiservic.getInfoCricket(this.matchId).subscribe((res: any) => {
      this.infoData = res.data[0];
     this.matchesDtata = res.data[0];
     this.datetimeconvart(this.infoData?.timestamp_start)
     // this.playerImages=res.data?.player_images
     if(res.data?.player_images){
       this.playerImages=res.data?.player_images
     }else{
       this.playerImages=""

     }
     this.formattedDate2 = this.formatDate(this.infoData?.timestamp_start);
     this.formattedTime = this.formatTime(this.infoData?.timestamp_start);

    })

  }

  getMatchSquads() {
    this.loader =true
    this.apiservic.getMatchSquads(this.matchId).subscribe((res: any) => {
          this.matchSquads = res.data[0];
   this.playerImages="";
   this.loader =false
    })

  }


  getBenchPlayers(list:any){
       return list.filter((item:any)=> item.playing11 == 'false')
  }
  getPlayingXIPlayers(list:any){
    return list.filter((item:any)=> item.playing11 == 'true')
}
  }


