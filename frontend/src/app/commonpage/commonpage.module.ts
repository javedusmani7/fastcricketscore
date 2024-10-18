import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CommonpageComponent } from "./commonpage.component";

const commonpageRoute=[{
  path:"",component:CommonpageComponent
}]


@NgModule({
  declarations:[
    CommonpageComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(commonpageRoute)
  ]
})
export class CommonpageModule{}
