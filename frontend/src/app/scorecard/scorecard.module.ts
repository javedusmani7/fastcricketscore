import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ScorecardComponent } from "./scorecard.component";


const scorecardRoute=[{
  path:"",component:ScorecardComponent
}]


@NgModule({
  declarations:[
    ScorecardComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(scorecardRoute)
  ]
})
export class ScorecardModule{}
