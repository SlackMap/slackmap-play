import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GremlinsComponent } from './gremlins.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    GremlinsComponent
  ],
  declarations: [GremlinsComponent]
})
export class GremlinsModule { }
