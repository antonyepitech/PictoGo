import {Component,OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "../../service/chat.service";
import {ChatMessage} from "../../model/message.model";
import {User} from "../../model/user.model";
import {LocalStorageService} from "../../service/local-storage.service";
import {PopUpStartComponent} from "../pop-up-start/pop-up-start.component";
import {Room} from "../../model/room.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Objects} from "../../dictionnary/word";


@Component({
  selector: 'app-gameScene',
  templateUrl: './gameScene.component.html',
  styleUrls: ['./gameScene.component.css']
})
export class GameSceneComponent implements OnInit, OnDestroy {

  public pseudoCurrentUser: string = "";
  public drawerPseudo: string = "";
  private gameName: string = "";
  public currentUser: User;
  public message: string = '';
  public formPrincipal : FormGroup;
  public messages: ChatMessage[] = [];
  public actualRoom: Room;
  public drawInfo: ChatMessage;
  public drawInfos: ChatMessage[] = [];
  public guess = Objects;
  public wordToFound :string = "";
  public hideWord: string = "";
  public launchStart: boolean = false;
  public gameEnded: boolean = false;

  public _secondes: PopUpStartComponent;

  constructor(private fb: FormBuilder, private chatService: ChatService, private localStorageService: LocalStorageService,
              private router: Router, private activatedRoute: ActivatedRoute) {
    this.currentUser = new User();
    this.currentUser.name = "toto";
    this.formPrincipal = this.fb.group({});
  }

  onClickPlay(){}

  ngOnInit() {
    this.messages = [];
    this.activatedRoute.params.subscribe({
      next: (param) => {
        this.actualRoom = new Room();
        this.gameName = param["id"]
        this.initialize();
      }
    });
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.actualRoom);
    this.chatService.disconnectFromWebSocketMessage();
    this.chatService.close();
  }

  initialize() {
    this.initializeForm();
    this.generateWord();
    this.pseudoCurrentUser = this.localStorageService.getPseudo();
    this.drawerPseudo = this.pseudoCurrentUser;

    this.chatService.setRoom(this.gameName);
    this.chatService.connectUser(this.pseudoCurrentUser);

    // TODO creer la fonction ^pour recuperer l'utilisateur actuel
    // this.chatService.getCurrentUser()

    this.chatService.getMessageFromWebsocket().subscribe({
      next: (data) => {
        if(data.guessWord) {
          this.wordToFound = data.guessWord.toLocaleUpperCase();
          this.generateHideWord();
        }
        //
        this.actualRoom = data;
        console.log(data)
      }
    });

    this.chatService.guessWordChange.subscribe({
      next: (word) => {
        this.wordToFound = word.toLocaleUpperCase();
        this.launchStart = true;
        this.generateHideWord();

      }
    })

    this.chatService.roomChange.subscribe({
      next: (actualRoom) => {
        console.log(actualRoom)
        this.actualRoom = actualRoom;
        this.drawerPseudo = this.actualRoom.name;
      }
    })

    this.chatService.drawInfoChange.subscribe({
      next: (drawInfo) => {
        this.drawInfo = drawInfo;
        this.drawInfos.push(drawInfo);
      }
    })

    // this.chatService.getDrawFromWebSocket().subscribe({
    //   next: (data) => {
    //     this.drawInfo = data;
    //   }
    // });
  }

  initializeForm() {
    this.formPrincipal.addControl('message', this.fb.control('', [Validators.required, Validators.minLength(1)]));
  }

  get f() {
    return this.formPrincipal.controls;
  }

  onSubmit() {
    this.chatService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.messages = this.chatService.room.messages;
      }
    });
    if(this.formPrincipal.valid) {
      this.chatService.sendMessage(this.actualRoom ,this.formPrincipal.value.message);
    }
  }

  filterName:string;
  clear(){
    this.filterName = '';
  }

  drawInfoSend(event: ChatMessage) {
    this.chatService.sendDraw(event.target, event.offsetX, event.offsetY, event.mouse);
  }

  launchGame(event?: any) {
    if(this.actualRoom.name === this.localStorageService.getPseudo()) {
      this.chatService.sendGuessWord(this.actualRoom, this.wordToFound.toLocaleUpperCase());
    }
  }

  generateWord() {
    this.wordToFound = this.guess[Math.floor(Math.random() * 20)].toLocaleUpperCase();
    this.launchGame();
  }

  generateHideWord() {
    if(this.hideWord === "") {
      this.wordToFound.length;

      for(let i=0; i < this.wordToFound.length; i++) {
        this.hideWord += "_ ";
      }
    }
  }

  sendEndGame(event: any) {
    this.gameEnded = true;
  }

}
