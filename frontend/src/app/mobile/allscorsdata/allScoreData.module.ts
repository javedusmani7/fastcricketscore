import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AllscorsdataComponent } from "./allscorsdata.component";


const liveRoute=[{
  path:"",component:AllscorsdataComponent
}]


@NgModule({
  declarations:[
    AllscorsdataComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(liveRoute)
  ]
})
export class AllScoreDataModule{}
