import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-points-table',
  templateUrl: './points-table.component.html',
  styleUrls: ['./points-table.component.css']
})
export class PointsTableComponent implements OnInit{

  pointsRes:any;
  showData:any;
  eventgrupname: any;
  seriesInfo: any;
  pageName="Points Table"
  data:any
  newslist:any
  latestNewsList:any
  popularNewsList: any;
  selectedNewsTab="latest"


  constructor(private apiservice:ServiceService,private route:ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.eventgrupname=this.route.snapshot.paramMap.get('event_slug');
    })
    this.getSeriesInfo()
    this.getneswdata('latest')
    this.popularNewsdata('latest')

    this.getPointsTableData(this.eventgrupname)

  }

  getPointsTableData(data:any){
    this.apiservice.getPointsTable(data).subscribe((res:any)=>{
      this.data=res.data
      this.pointsRes = res.data.table[0].table;
      this.showData = this.pointsRes.group
    })
  }
  getSeriesInfo(){
    this.apiservice.getSeriesInfo(this.eventgrupname).subscribe((res:any)=>{
      this.seriesInfo=res.data
    })
  }

  getneswdata(data:any){
    this.selectedNewsTab=data
    this.apiservice.getSeriesNews(this.eventgrupname).subscribe((res:any)=>{
      this.newslist=res.data?.news
      this.latestNewsList=res.data?.sidebar?.latest
      // this.loadernews=false
    })
  }

  popularNewsdata(data:any){
    this.selectedNewsTab=data
    this.apiservice.getSeriesNews(this.eventgrupname).subscribe((res:any)=>{
      this.newslist=res.data?.news
      this.popularNewsList=res.data?.sidebar?.popular
      // this.loadernews=false

    })

  }


}
