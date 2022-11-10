import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-pop-up-start',
  templateUrl: './pop-up-start.component.html',
  styleUrls: ['./pop-up-start.component.scss']
})
export class PopUpStartComponent implements OnInit {

  constructor(private router: Router) {}

  public PlayerAdmin = true
  // si le player est admin => affiche popUp et start game, sinon pas de popUp pour les joueurs qui se connecte
  public edited = this.PlayerAdmin ? false : true;

  ngOnInit(): void {
  }

  closeModal(){
    this.edited = true
  }

  clickBack(){
    this.router.navigate([''])
  }

}
