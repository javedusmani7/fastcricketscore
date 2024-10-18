import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IccRankingComponent } from "./icc-ranking.component";

const iccRankingRoute=[{
  path:"",component:IccRankingComponent
}]


@NgModule({
  declarations:[
    IccRankingComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(iccRankingRoute)
  ]
})
export class IccRankingModule{}
