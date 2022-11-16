import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Room} from "../../model/room.model";
import {isNotNullOrUndefined} from "../../util/control";
import {User} from "../../model/user.model";

@Component({
  selector: 'app-card-player',
  templateUrl: './card-player.component.html',
  styleUrls: ['./card-player.component.scss']
})
export class CardPlayerComponent implements OnInit, OnChanges {

  @Input() actualRoom: Room;

  public users: User[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(isNotNullOrUndefined(changes["actualRoom"].currentValue) && isNotNullOrUndefined(this.actualRoom.clients)) {
      this.users = this.actualRoom.clients;
    }

  }



}
