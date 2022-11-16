import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulePrincipalRoutingModule } from './module-principal-routing.module';
import {GameSceneComponent} from "./gameScene/gameScene.component";
import {HomeComponent} from "./home/home.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DrawBoxComponent } from './draw-box/draw-box.component';
import { RoomComponent } from './room/room.component';
import { CardPlayerComponent } from './card-player/card-player.component';
import { PopUpStartComponent } from './pop-up-start/pop-up-start.component';
import { ModalEndGameChatComponent } from './modal-end-game-chat/modal-end-game-chat.component';
import {ChatService} from "../service/chat.service";


@NgModule({
  declarations: [
    GameSceneComponent,
    HomeComponent,
    DrawBoxComponent,
    RoomComponent,
    CardPlayerComponent,
    PopUpStartComponent,
    ModalEndGameChatComponent
  ],
  imports: [
    CommonModule,
    ModulePrincipalRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ChatService
  ]
})
export class ModulePrincipalModule { }
