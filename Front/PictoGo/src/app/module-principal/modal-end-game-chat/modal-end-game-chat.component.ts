import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal-end-game-chat',
  templateUrl: './modal-end-game-chat.component.html',
  styleUrls: ['./modal-end-game-chat.component.scss']
})
export class ModalEndGameChatComponent implements OnInit {

  public gameNumber = 0
  public endGame = false

  constructor(private router: Router) {}

  ngOnInit(): void {
   if(this.gameNumber === 10){
     this.endGame = true
   }
  }

  continueGame(){
    this.endGame = true
  }

  leaveGame(){
    this.router.navigate([''])
  }


}
