import { Component, HostListener, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.css']
})
export class TopHeaderComponent  implements OnInit{

  sports:any[] =[]
  cricketMenuList:any
  selected=true
  activeIndex: number = 0;
  menubtn=false
  sidebarmenu=false
  currentPath:any
  showheader:boolean=true
  evenSlug: any;
  series: any;
  liveroute:any
  livehiddenheader=false
  selectedName = ""
  mainheader=true


  constructor(private apiservice:ServiceService ,private router:Router , private route:ActivatedRoute){
    this.router.events.subscribe((event)=>{
      this.currentPath=router.url
      this.extractValue(this.currentPath);
      this.getRoute(this.currentPath)
      if(event instanceof NavigationEnd) {
        this.mainheader = !(event.url.includes('/live-cricket-score'))
        this.showheader = (event.url.includes('/cricket-news') || event.url.includes('/player') || event.url.includes('/team'))
        // this.livehiddenheader = !(event.url.includes('/cricket-news'))


        // this.showheader = (event.url.includes('/ranking') || event.url.includes('/livecricket-score') || event.url.includes('scorecard') || event.url.includes('/squad'))
      }

      if(this.currentPath=="/cricket-schedule"){
        this.showheader=true
        // this.livehiddenheader=false

      }else if(this.currentPath=="/home"){
        this.showheader=true
        // this.livehiddenheader=false
      }else if(this.currentPath=="/news"){
        this.showheader=true
        // this.livehiddenheader=false
      }
      else if(this.currentPath=="/series"){
        // this.livehiddenheader=false
        this.showheader=true

      }
      else if (this.currentPath == "/ranking/icc-odi-ranking" || this.currentPath == "/ranking/icc-test-ranking" || this.currentPath == "/ranking/icc-t20-international-rankings") {
        // this.livehiddenheader=false
        this.showheader=true
      }
      // else if (this.currentPath == "/player") {
      //   this.showheader = true
      // }
      // else if (this.currentPath == "/cricket-news") {
      //   this.showheader = true
      //   this.livehiddenheader = false
      // }
      // else{
      //   this.showheader=false
        // this.livehiddenheader=false

      // }
    })
  }
  private extractValue(param: string): any {
    const parts = param.split('/');

    this.evenSlug=decodeURIComponent(parts[2]);
  }
  ngOnInit(): void {
    // this.apiservice.getSportData().subscribe(

    //   (data:any)=>{this.sports=data.data
    //   console.log("data fetched" , this.sports) },
    //   (error)=>{

    //     console.log("error while fetching data")
    //   }
    // )

    // this.sports= [
    //   {
    //     "_id": "67122604628192344486b01d",
    //     "sport_id": 4,
    //     "name": "Cricket",
    //     "description": "This sport is use to handle all available options in the Cricket.",
    //     "status": true,
    //     "create_date": "2024-10-18T09:10:28.442Z",
    //     "update_date": "2024-10-18T09:10:28.442Z"
    //   },
    //   {
    //     "_id": "67122604628192344486b01e",
    //     "sport_id": 1,
    //     "name": "Soccer",
    //     "description": "This sport is use to handle all available options in the Soccer.",
    //     "status": true,
    //     "create_date": "2024-10-18T09:10:28.442Z",
    //     "update_date": "2024-10-18T09:10:28.442Z"
    //   },
    //   {
    //     "_id": "67122604628192344486b01f",
    //     "sport_id": 2,
    //     "name": "Tennis",
    //     "description": "This sport is use to handle all available options in the Tennis.",
    //     "status": true,
    //     "create_date": "2024-10-18T09:10:28.442Z",
    //     "update_date": "2024-10-18T09:10:28.442Z"
    //   },
    //   {
    //     "_id": "67122604628192344486b020",
    //     "sport_id": 3,
    //     "name": "Football",
    //     "description": "This sport is use to handle all available options in the Football.",
    //     "status": true,
    //     "create_date": "2024-10-18T09:10:28.442Z",
    //     "update_date": "2024-10-18T09:10:28.442Z"
    //   }
    // ];
    this.apiservice.getSportData().subscribe((res:any)=>{
      this.sports=res.data;
      console.log("step1");
      console.log(this.sports[0]);
      console.log("step2");
    })



    // this.getCricketMenu()
  }
  getRoute(url: string): any {
    const parts = url.split('/');
    this.liveroute= parts[2];

  }
  refreshPage(): void {
    window.location.reload();
  }

  getCricketMenu(){
    this.apiservice.getCricketMenus().subscribe((res:any)=>{
      this.cricketMenuList=res.data
    })
  }
  navigateToroutes(data: any, index: any) {
    let selectedRoute = "/go/" + data.slug
    this.selectedName = data.name
    this.activeIndex = index;
    this.router.navigateByUrl(selectedRoute);
  }

  // menu(){

  //   this.menubtn=!this.menubtn
  // }
  @HostListener('document:click', ['$event'])
  onclick(event : MouseEvent){
    const target = event.target as HTMLElement;
    if(!(target).closest('.keeda-side-menu')){
      this.sidebarmenu = false
    }
  }
  sidebarmenus(){
    this.sidebarmenu=!this.sidebarmenu
  }
  onclickHidesidebar(){
    this.sidebarmenu=false

  }


  redirectchildshedulepsge(data : any){
    this.apiservice.callCommonCompo(data)
  }
}
