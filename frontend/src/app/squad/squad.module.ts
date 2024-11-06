import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SquadComponent } from "./squad.component";
import { ScoreBoxModule } from "../score-box/score-box.module";
const     SquadRoute=[{
  path:"",component:SquadComponent
}]


@NgModule({
  declarations:[
    SquadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SquadRoute),
    ScoreBoxModule
]
})
export class     SquadModule{}
