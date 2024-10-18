import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StatsComponent } from "./stats.component";
const     StatsRoute=[{
  path:"",component:StatsComponent
}]


@NgModule({
  declarations:[
    StatsComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(StatsRoute)
  ]
})
export class     StatsModule{}
