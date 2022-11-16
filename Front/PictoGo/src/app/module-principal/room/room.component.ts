import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Room} from "../../model/room.model";
import {ChatService} from "../../service/chat.service";
import {LocalStorageService} from "../../service/local-storage.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  public rooms: Room[] = [];
  private pseudoCurrentUser: string;

  constructor(private router: Router, private chatService: ChatService,
              private localStorageService: LocalStorageService) {
  }

  onClickPlay(){
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {

    this.pseudoCurrentUser = this.localStorageService.getPseudo();

    //TODO voir comment transferer ce service a gameScene pour eviter de reinitialiser un nouveau service
    // qui force la creation de l utilisateur identique
    this.chatService.connectToMainWebsocket(this.pseudoCurrentUser);
    this.loadGames();
  }

  ngOnDestroy(): void {
    // this.chatService.disconnectFromWebSocketMessage();
    // this.chatService.close();
  }



  /**
   * load all existing game
   */
  loadGames() {
    this.chatService.getRoomsActionFromWebsocket().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      }
    });
  }

  onClickRoom(room: Room){
    this.router.navigate(['/gameScene/'+ room.name])
  }

}
