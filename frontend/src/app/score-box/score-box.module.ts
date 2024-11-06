import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // Import this if using routerLink
import { ScoreBoxComponent } from './score-box.component';

@NgModule({
  declarations: [
    ScoreBoxComponent
  ],
  imports: [
    CommonModule,
    RouterModule  // Import if you need routerLink in ScoreBoxComponent
  ],
  exports: [
    ScoreBoxComponent  // Export to make it available in other modules
  ]
})
export class ScoreBoxModule { }
