import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NewsComponent } from "./news.component";


const newsRoute=[{
  path:"",component:NewsComponent
}]


@NgModule({
  declarations:[
    NewsComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(newsRoute)
  ]
})
export class NewsModule{}
