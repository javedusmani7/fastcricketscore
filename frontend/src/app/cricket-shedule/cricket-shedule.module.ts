import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CricketSheduleComponent } from "./cricket-shedule.component";


const cricketsheduleRoute=[{
  path:"",component:CricketSheduleComponent
}]


@NgModule({
  declarations:[
    CricketSheduleComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(cricketsheduleRoute)
  ]
})
export class CricketSheduleModule{}
