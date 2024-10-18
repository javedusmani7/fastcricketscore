import { NgModule } from "@angular/core";
import { SeriesComponent } from "./series.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
const seriesRoute=[{
  path:"",component:SeriesComponent
}]


@NgModule({
  declarations:[
    SeriesComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(seriesRoute)
  ]
})
export class SeriesModule{}
