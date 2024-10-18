import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TeamComponent } from "./team.component";

const teamRout=[{
  path:"",component:TeamComponent
}]


@NgModule({
  declarations:[
    TeamComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(teamRout)
  ]
})
export class TeamModule{}
