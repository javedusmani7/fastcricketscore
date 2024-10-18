import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { GoComponent } from "./go.component";


const goRoute=[{
  path:"",component:GoComponent
}]


@NgModule({
  declarations:[
    GoComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(goRoute)
  ]
})
export class GoModule{}
