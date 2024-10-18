import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PlayerComponent } from "./player.component";

const playerRoute=[{
  path:"",component:PlayerComponent
}]


@NgModule({
  declarations:[
    PlayerComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild(playerRoute)
  ]
})
export class PlayerModule{}
