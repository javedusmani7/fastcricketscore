import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit{
  turnament:any
  statsList:any
  seriesInfo:any
  upcominglist:any
  resultdata:any
  selectedTabupcoming=true
  resulttab=false
  pointsRes:any
  showData:any
  loader=true
  selectedNewsTab='latest'
  latestNewsList:any
  popularNewsList:any
  teamDefaultImg = '../../assets/team-default.png'
  readmoreless = false;
  constructor(private apiService:ServiceService,private route:ActivatedRoute,private router: Router){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.turnament=this.route.snapshot.paramMap.get('event_slug');
    })
    this.apiService.getSeriesStats(this.turnament).subscribe((res:any)=>{
      this.loader=false
      this.statsList=res.data


    })
    this.getSeriesInfo()
    this.getupcomming()
    this.getPointsTableData()
    this.getneswdata('latest')
    this.popularNewsdata('latest')

  }
  // isObjectEmpty(): boolean {

  //   return Object?.keys( this.statsList)?.length === 0;
  // }
  getSeriesInfo(){
    this.apiService.getSeriesInfo(this.turnament).subscribe((res:any)=>{
      this.seriesInfo=res.data
    })
  }
  getupcomming(){
    this.selectedTabupcoming=true
    this.resulttab=false
      this.apiService.getUpcomingMatchesbyseries(this.turnament).subscribe((res:any)=>{
        this.upcominglist=res.data
      })
  }
  getresult(){
    this.selectedTabupcoming=false
    this.resulttab=true
    this.apiService.getResultMatchesbyseries(this.turnament).subscribe((res:any)=>{
      this.resultdata=res.data


    })

  }
  getPointsTableData(){
    this.apiService.getPointsTable(this.turnament).subscribe((res:any)=>{
      this.pointsRes = res.data?.table?.[0]?.table?.[0]?.group;
      this.showData = this.pointsRes?.group
    })
  }
  getAngularFormat(heading: string): string {
    return heading.toLowerCase().replace(/\s+/g, '-');
  }


  getneswdata(data:any){
    this.selectedNewsTab=data
    this.apiService.getSeriesNews(this.turnament).subscribe((res:any)=>{
      // this.newslist=res.data?.news
      this.latestNewsList=res.data?.sidebar?.latest
      console.log(this.latestNewsList,"this.latestNewsList");
    })
  }

  popularNewsdata(data:any){
    this.selectedNewsTab=data
    this.apiService.getSeriesNews(this.turnament).subscribe((res:any)=>{
      // this.newslist=res.data?.news
      this.popularNewsList=res.data?.sidebar?.popular
    })

  }


  collapseddata(){
    document.getElementById('removeCollapse')?.classList.toggle('collapsed')
    document.getElementById('addExpanded')?.classList.toggle('expanded')
    this.readmoreless = !this.readmoreless;
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


  gett1Scores(scoreString:any){
    return scoreString.split(/\(|\)/).filter(Boolean);
  }
  gett2Scores(scoreString:any){
    return scoreString.split(/\(|\)/).filter(Boolean);
  }
}
