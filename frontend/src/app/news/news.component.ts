import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit{
  trunaments:any
  newslist:any
  seriesInfo:any


  constructor(private apiservice:ServiceService , private route:ActivatedRoute){}



  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.trunaments=this.route.snapshot.paramMap.get('event_slug');
    })
    if(this.trunaments){
      this.apiservice.getSeriesNews(this.trunaments).subscribe((res:any)=>{
        this.newslist=res.data?.news

      })
    }else{
      this.apiservice.getLatestNews().subscribe((res:any)=>{
        this.newslist=res.data

      })
    }

    this.apiservice.getSeriesInfo(this.trunaments).subscribe((res:any)=>{
      this.seriesInfo=res.data
    })
  }

}
