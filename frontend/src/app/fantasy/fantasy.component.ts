import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-fantasy',
  templateUrl: './fantasy.component.html',
  styleUrls: ['./fantasy.component.css']
})
export class FantasyComponent  {
  matchSquads:any;
  loader=false;
  scorelist:any;
  matchId:any;
  teamDefaultImg = '../../assets/team-default.png'
  imageUrl = '../../assets/team-default.png';
  playerImages:any;
  hide=false;
  liveScoreList:any
  formattedDate2:any
formattedTime:any
  constructor(private datePipe: DatePipe,private apiservic:ServiceService, private route:ActivatedRoute,private router:Router){}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.matchId=this.route.snapshot.paramMap.get('id');
    })

    this.getFantasyData()

  }

  getFantasyData(){
    this.apiservic.getFantasyData(this.matchId).subscribe((res: any) => {
      this.scorelist = res.data;
      this.matchSquads = res.data.points;
      this.playerImages=""
     })
  }

  getBenchPlayers(list:any){
    return list.filter((item:any)=> item.playing11 == 'false')
  }
  getPlayingXIPlayers(list:any){
  return list.filter((item:any)=> item.playing11 == 'true')
  }
  getPlayerImage(playerName: string): string {
    return this.playerImages[playerName.toLowerCase().replace(/\s+/g, '-')] || ''; // Return empty string if the player name is not found
  }
}
