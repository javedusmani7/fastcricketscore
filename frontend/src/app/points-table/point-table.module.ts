import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PointsTableComponent } from "./points-table.component";


const PointsTableRoute=[{
  path:"",component:PointsTableComponent
}]


@NgModule({
  declarations:[
    PointsTableComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(PointsTableRoute)
  ]
})
export class PointsTableModule{}
