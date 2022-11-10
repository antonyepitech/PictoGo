import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-pop-up-start',
  templateUrl: './pop-up-start.component.html',
  styleUrls: ['./pop-up-start.component.scss']
})
export class PopUpStartComponent implements OnInit {

  constructor(private router: Router) {}

  public PlayerAdmin = true //check si admin
  // si le player est admin => affiche popUp et start game, sinon pas de popUp pour les joueurs qui se connecte
  public edited = this.PlayerAdmin ? false : true;

//chrono
  private _minutes: number = 0;
  public _secondes: number = 0;
  private _totalSecondes: number = 0;
  private _timer: string | number | NodeJS.Timeout | undefined;

  start() {
    this.edited = true
    this._timer = setInterval(() => {
      this._minutes = Math.floor(++this._totalSecondes / 60);
      this._secondes = this._totalSecondes - this._minutes * 60;
    }, 1000);
  }
  stop() {
    clearInterval(this._timer);
  }
  reset() {
    this._totalSecondes = this._minutes = this._secondes = 0;
  }
  //fin chrono

  ngOnInit(): void {
  }

  closeModal(){
    this.edited = true
  }

  clickBack(){
    this.router.navigate([''])
  }

}
