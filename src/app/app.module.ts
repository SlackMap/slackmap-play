import { GremlinsModule } from './gremlins/gremlins.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GremlinsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
