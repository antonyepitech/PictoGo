import {Component,OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "../../service/chat.service";
import {ChatMessage} from "../../model/message.model";
import {User} from "../../model/user.model";
import {LocalStorageService} from "../../service/local-storage.service";
import {Room} from "../../model/room.model";
import {ActivatedRoute, Router} from "@angular/router";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../util/control";


@Component({
  selector: 'app-gameScene',
  templateUrl: './gameScene.component.html',
  styleUrls: ['./gameScene.component.css']
})
export class GameSceneComponent implements OnInit, OnDestroy {

  public pseudoCurrentUser: string = "";
  private gameName: string = "";
  public currentUser: User;
  public message: string = '';
  public formPrincipal : FormGroup;
  public messages: ChatMessage[] = [];
  public actualRoom: Room;

  constructor(private fb: FormBuilder, private chatService: ChatService, private localStorageService: LocalStorageService,
              private router: Router, private activatedRoute: ActivatedRoute) {
    this.currentUser = new User();
    this.currentUser.name = "toto";
    this.formPrincipal = this.fb.group({});
  }

  onClickPlay(){
  }

  ngOnInit() {
    this.initializeForm();
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
    this.pseudoCurrentUser = this.localStorageService.getPseudo();

    this.chatService.setRoom(this.gameName);
    this.chatService.connectUser(this.pseudoCurrentUser);

    // TODO creer la fonction ^pour recuperer l'utilisateur actuel
    // this.chatService.getCurrentUser()

    this.chatService.getMessageFromWebsocket().subscribe({
      next: (data) => {
        this.actualRoom = data;
      }
    });
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

}
