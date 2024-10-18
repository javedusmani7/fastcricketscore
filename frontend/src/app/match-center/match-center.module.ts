import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatchCenterComponent } from "./match-center.component";

const matchCenterRoute=[{
  path:"",component:MatchCenterComponent
}]


@NgModule({
  declarations:[
    MatchCenterComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(matchCenterRoute)
  ]
})
export class MatchCenterModule{}
