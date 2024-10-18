import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NewsDetailComponent } from "./news-detail.component";
const     NewsDetailRoute=[{
  path:"",component:NewsDetailComponent
}]


@NgModule({
  declarations:[
    NewsDetailComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(NewsDetailRoute)
  ]
})
export class     NewsDetailModule{}
