import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-mobile-ranking',
  templateUrl: './mobile-ranking.component.html',
  styleUrls: ['./mobile-ranking.component.css']
})
export class MobileRankingComponent implements OnInit{

  rankinglist:any
  rankingname:any
  constructor(private apiservice:ServiceService, private route:ActivatedRoute){}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.rankingname=this.route.snapshot.paramMap.get('rankingName');
      this.apiservice.getIccRankingapis().subscribe((res:any)=>{
        this.rankinglist=res.data

      })
      // this.ngOnInit()
    })

  }

}
