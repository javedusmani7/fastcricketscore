import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  teamName: any
  teamList: any
  turnament: any
  squadList: any
  squadData: any
  upcomingMatches: any
  ResultMatches: any
  selectedtab = "Overview"
  upcomingMatchshedule: any
  resultstab = ""
  ResultMatcheslist: any
  convertedDate: any;
  activeindex=0
  squadtabData:any
  teamListtabData:any
  teamNews:any
  lastMatches:any
  nextMatch:any
  noData = false
  noData1 = false


  constructor(private apiserice: ServiceService, private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.teamName = this.route.snapshot.paramMap.get('teamName');
    })
    this.Overview('Overview')

    this.getTeamUpcomingMatche()
    this.getTeamResultMatches()
    this.getLastMatchesNextMatches()
    // getTeamInfo
  }

  Overview(data: any) {
    this.selectedtab = data
    this.apiserice.getTeamInfo(this.teamName).subscribe((res: any) => {
      this.teamList = res.data
      this.toggleSquadTeams(res.data?.tabs[0]?.id,0)
    })

  }
  toggleSquadTeams(data:any,ind:any){
    this.activeindex=ind
    var id='team-overall-detail-'+data

    this.teamListtabData =this.teamList?.squad.filter((res:any)=>{
      return res.id==id

    })



  }
  getTeamSquads(data: any) {
    this.selectedtab = data
    this.apiserice.getTeamSquad(this.teamName).subscribe((res: any) => {
      this.squadList = res.data
      this.toggleFullSquadTeams(this.squadList?.tabs[0]?.id,0)
    })
  }
  userByName(index: any) {
    return index;
  }
  toggleFullSquadTeams(data:any,inde:any){
    this.activeindex=inde

    if(data==='t20'){
      this.squadtabData=this.squadList?.squad?.t20


    }else if(data=='odi'){
      this.squadtabData=this.squadList?.squad?.odi

    }else{
      this.squadtabData=this.squadList?.squad?.test

    }


  }

  getLastMatchesNextMatches(){
    // getTeamLastnNextMatch
    this.apiserice.getTeamLastnNextMatch(this.teamName).subscribe((res:any)=>{
      this.lastMatches=res.data?.lastMatch
      this.nextMatch=res.data?.nextMatch


    })
  }

  getTeamUpcomingMatche() {
    this.apiserice.getTeamUpcomingMatches(this.teamName).subscribe((res: any) => {
      this.upcomingMatches = res.data
    })
  }
  getTeamResultMatches() {
    this.apiserice.getTeamResultMatches(this.teamName).subscribe((res: any) => {
      this.ResultMatches = res.data
    })
  }
  getTeamSquadsNews(data:any){
    this.selectedtab=data
    this.apiserice.getteamNews(this.teamName).subscribe((res:any)=>{
      this.teamNews=res.data?.news

    })
  }


  getscheduleSquads(data: any) {
    this.selectedtab = data
    this.apiserice.getTeamUpcomingMatches(this.teamName).subscribe((res: any) => {
      this.upcomingMatchshedule = res.data
    })

  }

  toggleScheduleType(data: any) {
    this.resultstab = data
    if (data == 'results') {
      this.apiserice.getTeamResultMatches(this.teamName).subscribe((res: any) => {
        this.ResultMatcheslist = res.data
      })

    } else {
      this.apiserice.getTeamUpcomingMatches(this.teamName).subscribe((res: any) => {
        this.upcomingMatchshedule = res.data
      })
    }


  }


  gatedate(dateString: any) {
    const currentDate = new Date();
    const providedDate = new Date(dateString);

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

  getTime(dateString: any) {
    // const dateString = "2024-04-04T08:00:00.000Z";
    const date = new Date(dateString);

    // Get hours, minutes, and seconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format time string
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return formattedTime
  }
  getkeysdata4(obj: any) {
    if(Object?.keys(obj).length == 0){
      this.noData1 = true
    }
    return Object?.keys(obj)
  }
  getkeysdata(obj: any) {
    return Object?.keys(obj)
  }
  getkeysdata2(obj: any) {
    return Object?.keys(obj)
  }

  getkeysdata3(obj: any) {
    if(Object?.keys(obj).length == 0){
      this.noData = true
    }
    return Object?.keys(obj)
  }
  extractPartFromLink(link: string): string {
    const parts = link.split('/');
    return parts[parts.length - 1];
  }
  checkIfMobile(): boolean {
    const screenWidth = window.innerWidth;
    return screenWidth < 768; // Example threshold for mobile view
  }
  getrouteandCheckwidth(route:any,route1:any,id:any){
    let url1=route+'/'+id
    let url2=route1 +'/'+id
    const isMobile = this.checkIfMobile();
     // Function to determine if it's mobile or not

    if (isMobile) {
      this.router.navigateByUrl(url2);
    } else {
      this.router.navigateByUrl(url1);
    }
  }



}
