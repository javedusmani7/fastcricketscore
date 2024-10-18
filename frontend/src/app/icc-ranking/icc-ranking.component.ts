import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-icc-ranking',
  templateUrl: './icc-ranking.component.html',
  styleUrls: ['./icc-ranking.component.css']
})
export class IccRankingComponent implements OnInit{
  rankinglist:any
  rankingname:any
  constructor(private apiservice:ServiceService, private route:ActivatedRoute){}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.rankingname=this.route.snapshot.paramMap.get('rankingName');
      this.apiservice.getIccRankingapis(this.rankingname).subscribe((res:any)=>{
        this.rankinglist=res.data

      })
      // this.ngOnInit()
    })

  }

}
