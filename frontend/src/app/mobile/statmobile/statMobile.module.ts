import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { StatmobileComponent } from "./statmobile.component";


const StatmobileRoute=[{
  path:"",component:StatmobileComponent
}]


@NgModule({
  declarations:[
    StatmobileComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(StatmobileRoute)
  ]
})
export class StatmobileModule{}
