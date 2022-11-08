import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DrawBoxComponent } from './drawBox.component';
import { HelloComponent } from './hello.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ DrawBoxComponent, HelloComponent ],
  bootstrap:    [ DrawBoxComponent ]
})
export class DrawBoxModule { }
