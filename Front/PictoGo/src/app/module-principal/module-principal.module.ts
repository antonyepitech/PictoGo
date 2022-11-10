import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulePrincipalRoutingModule } from './module-principal-routing.module';
import {GameSceneComponent} from "./gameScene/gameScene.component";
import {HomeComponent} from "./home/home.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DrawBoxComponent } from './draw-box/draw-box.component';
import { RoomComponent } from './room/room.component';
import { CardPlayerComponent } from './card-player/card-player.component';


@NgModule({
  declarations: [
    GameSceneComponent,
    HomeComponent,
    DrawBoxComponent,
    RoomComponent,
    CardPlayerComponent
  ],
  imports: [
    CommonModule,
    ModulePrincipalRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ModulePrincipalModule { }
