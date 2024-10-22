import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ChildSheduleComponent } from "./child-shedule.component";


const ChildSheduleRoute=[{
  path:"",component:ChildSheduleComponent
}]


@NgModule({
  declarations:[
    ChildSheduleComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(ChildSheduleRoute)
  ]
})
export class ChildSheduleModule{}
