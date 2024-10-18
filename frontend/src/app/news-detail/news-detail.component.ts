import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit{
  newsDetail:any
  link:any
  loader=true
  constructor(private apiservice:ServiceService , private route:ActivatedRoute){}


  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.link=this.route.snapshot.paramMap.get('link');
    })
    this.apiservice.getSKNewsDetail(this.link).subscribe((res:any)=>{
      this.newsDetail=res.data?.news
      this.loader=false

    })
  }

}
