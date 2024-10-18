import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MobileRankingComponent } from "./mobile-ranking.component";

const mobileRankingRoute=[{
  path:"",component:MobileRankingComponent
}]


@NgModule({
  declarations:[
    MobileRankingComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(mobileRankingRoute)
  ]
})
export class MobileRankingModule{}
