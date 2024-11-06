import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatchCenterComponent } from "./match-center.component";
import { ScoreBoxModule } from "../score-box/score-box.module";

const matchCenterRoute=[{
  path:"",component:MatchCenterComponent
}]


@NgModule({
  declarations:[
    MatchCenterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(matchCenterRoute),
    ScoreBoxModule
]
})
export class MatchCenterModule{}
