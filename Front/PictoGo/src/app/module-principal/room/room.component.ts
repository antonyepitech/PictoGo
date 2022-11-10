import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Room} from "../../model/room.model";
import {ChatService} from "../../service/chat.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public rooms: Room[] = [];

  constructor(private router: Router, private chatService: ChatService) {
    let room1 = new Room();
    room1.id = 0;
    room1.name = "game1";
    room1.clients = [];
    this.rooms.push(room1);
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    let room2 = new Room();
    room2.id = 1;
    room2.name = "game2";
    room2.clients = [];
    this.rooms.push(room2);

    this.loadGames();
  }

  /**
   * load all existing game
   */
  loadGames() {
    // this.chatService.getAllGames().subscribe((rooms) => {
    //   this.rooms = rooms;
    // });
  }

  onClickRoom(room: Room){
    this.router.navigate(['/gameScene/'+ room.id])
  }

}
