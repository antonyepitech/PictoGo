import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Route, Router} from "@angular/router";
import {Room} from "../../model/room.model";
import {isNotNullOrUndefined} from "../../util/control";

@Component({
  selector: 'app-pop-up-start',
  templateUrl: './pop-up-start.component.html',
  styleUrls: ['./pop-up-start.component.scss']
})
export class PopUpStartComponent implements OnInit, OnChanges {

  @Output() sendlaunchGame: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() pseudoCurrentUser: string;
  @Input() actualRoom: Room;
  @Input() launchStart: boolean = false;

  public PlayerAdmin = true //check si admin
  // si le player est admin => affiche popUp et start game, sinon pas de popUp pour les joueurs qui se connecte
  public edited = this.PlayerAdmin ? false : true;

//chrono
  private _minutes: number = 0;
  public _secondes: number = 0;
  private _totalSecondes: number = 0;
  private _timer: string | number | NodeJS.Timeout | undefined;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(isNotNullOrUndefined(changes["launchStart"]) && changes["launchStart"].currentValue) {
      this.start();
    }
  }

  start() {
    this.edited = true
    this.sendlaunchGame.emit(true);
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
