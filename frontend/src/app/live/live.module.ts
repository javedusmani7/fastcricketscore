import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LiveComponent } from "./live.component";
import { ScoreBoxModule } from "../score-box/score-box.module";


const liveRoute=[{
  path:"",component:LiveComponent
}]


@NgModule({
  declarations:[
    LiveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(liveRoute),
    ScoreBoxModule
]
})
export class LiveModule{}
