import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { GameSceneComponent } from "./gameScene/gameScene.component";
import {RoomComponent} from "./room/room.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'gameScene/:id',
    component: GameSceneComponent,
  },
  {
    path: 'room',
    component: RoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulePrincipalRoutingModule { }
