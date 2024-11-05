import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-points-table',
  templateUrl: './points-table.component.html',
  styleUrls: ['./points-table.component.css']
})
export class PointsTableComponent implements OnInit {

  pointsRes: any;
  showData: any;
  eventgrupname: any;
  seriesInfo: any;
  pageName = "Points Table"
  data: any
  newslist: any
  latestNewsList: any
  popularNewsList: any;
  selectedNewsTab = "latest"


  constructor(private apiservice: ServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.eventgrupname = this.route.snapshot.paramMap.get('event_slug');
    })
    // this.getSeriesInfo()
    // this.getneswdata('latest')
    // this.popularNewsdata('latest')

    this.getPointsTableData(this.eventgrupname)

  }

  getPointsTableData(cid: any) {
    this.apiservice.getPointsTable(cid).subscribe((res: any) => {
      if(res.data !=null){
      this.data = res.data.standings;
      // this.pointsRes = res.data.standings[0].standings;
      this.seriesInfo = res.data.standings[0].round
      }else{
        this.data =[]
      }
      console.log(" this.data", this.data)
    })
  }
  // getSeriesInfo(){
  //   this.apiservice.getSeriesInfo(this.eventgrupname).subscribe((res:any)=>{
  //     this.seriesInfo=res.data
  //   })
  // }

  getneswdata(data: any) {
    this.selectedNewsTab = data
    this.apiservice.getSeriesNews(this.eventgrupname).subscribe((res: any) => {
      this.newslist = res.data?.news
      this.latestNewsList = res.data?.sidebar?.latest
      // this.loadernews=false
    })
  }

  popularNewsdata(data: any) {
    this.selectedNewsTab = data
    this.apiservice.getSeriesNews(this.eventgrupname).subscribe((res: any) => {
      this.newslist = res.data?.news
      this.popularNewsList = res.data?.sidebar?.popular
      // this.loadernews=false

    })

  }

  pointTablePostion(data: any) {


    data.forEach((item: any, index: number) => {

      data[index]['position'] = Number(item.points) / Number(item.netrr)

    });
    return data.sort((a: any, b: any) => b.points - a.points)

  }

  updateDate(date: any) {
    if(date){
    let str = date.split('-');
    if (str.length > 1) {
      return `${str[2]}-${str[1]}-${str[0]}`
    } else {
      return date
    }
  }else{
    return ''
  }
  }


}
