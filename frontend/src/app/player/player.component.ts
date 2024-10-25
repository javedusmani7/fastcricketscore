import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit{
  playerList:any
  playerName:any
  mostRecentMatches: any;
  playerStatsList:any
  playerStatsTab:any
  popularPlayers:any
  teamId="india-national-cricket-team"
  popularPlayerFilter:any
  tournamentStatsData:any
  oditabs="odi"
  totallist: any;
  loader=true
  loader2=false
  teamOptionsId:any
  playerId:any;
  playerews:any
  playerData:any;
  playerstats:any;
  batBowData:any;

  constructor(private apiservice: ServiceService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.playerId = this.route.snapshot.paramMap.get('playerId');
    })

    this.playerStata('stats');
    // this.overviewdata()
    // this.filterplayer(this.teamId)
  }

  overviewdata(){
    this.playerStatsTab='';
    // this.apiservice.getPlayerInfo(this.playerId).subscribe((res:any)=>{
    //   this.loader=false
    //   console.log("res",res.data)
    //   // this.playerList=res.data
    //   // this.mostRecentMatches=res.data?.tables
    //   // this.popularPlayers=res.data?.popularPlayers
    //   // this.popularPlayerFilter=this.popularPlayers?.players?.[0]
    //   // this.teamOptionsId=this.popularPlayers?.teamOptions[0]?.teamId


    // })

  }
  filterplayer(teamId:any){
    let d=teamId?.target?.value
    this.teamOptionsId=d
    this.teamId=d

    const x = this.popularPlayers?.players?.filter((el:any) => el.teamId === this.teamId)
    this.popularPlayerFilter=x[0]

  }
  // getPlayerNews
  playerStata(data:any){
    this.playerStatsTab=data
    this.apiservice.getPlayerStats(this.playerId).subscribe((res:any)=>{
      console.log('res',res.data)
      this.playerstats= res.data
     this.playerData = res.data.player;
     this.batBowData = [{ type:'Batting' ,data:res.data.batting }, {type:'Bowling',data:res.data.bowling}]
      this.playerStatsList=[]
      this.loader =false
      // console.log(this.playerStatsList,"this.playerStatsList");

      // this.tournamentStatsData=res.data['Tournament Stats']
    })

  }
  personalKeys(obj:any){
    return Object?.keys(obj)
    }
  playerNews(data:any){
    this.loader2=true

    this.playerStatsTab=data

    this.apiservice.getPlayerNews(this.playerName).subscribe((res:any)=>{
      this.playerews=res.data?.news
      this.loader2=false


    })
  }
  switchMatchMenus(data:any){
    this.oditabs=data
    // this.playerStatsList['VS Team Stats']

  }
  listadata(list:any){
    this.totallist=list


  }
  getTotal(column: string): number {
    return this.totallist.reduce((acc:any, curr:any) => acc + parseInt(curr[column]), 0);
  }
  listadata1(list:any){
    this.totallist=list

  }
  extractPartFromLink(link: string): string {
    const parts = link.split('/');
    return parts[parts.length - 1];
  }

  typeKeys(obj:any){
    return Object?.keys(obj)
    }
}
