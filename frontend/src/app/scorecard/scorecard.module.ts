import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ScorecardComponent } from "./scorecard.component";
import { ScoreBoxModule } from "../score-box/score-box.module";
// import { ScoreBoxComponent } from "../score-box/score-box.component";


const scorecardRoute=[{
  path:"",component:ScorecardComponent
}]


@NgModule({
  declarations:[
    ScorecardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(scorecardRoute),
    ScoreBoxModule
]
})
export class ScorecardModule{}
