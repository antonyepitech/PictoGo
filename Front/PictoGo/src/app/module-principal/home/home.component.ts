import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from "../../util/control";
import {LocalStorageService} from "../../service/local-storage.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public pseudo: string;
  public pseudoOk: boolean = false;

  constructor(private router : Router, private localStorageService: LocalStorageService) {

  }

  ngOnInit() {}

  onClickPlay(){
    this.localStorageService.savePseudo(this.pseudo);
    this.router.navigate(['/room']);
  }

  onClickCreate() {
    this.localStorageService.savePseudo(this.pseudo);
    // Le front redirige le joueur vers la room, en tant qu’administrateur de la room
    // add create game and get id of this game
    let idGame = 0;

    this.router.navigate(['/gameScene/'+ idGame]);
  }

  verifyPseudo() {
    if(isNullOrUndefined(this.pseudo)) {
      this.pseudoOk = false;
    }else this.pseudoOk = this.pseudo.length > 0;
  }
}

