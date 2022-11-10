import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "../../service/chat.service";
import {ChatMessage} from "../../model/message.model";
import {User} from "../../model/user.model";
import {LocalStorageService} from "../../service/local-storage.service";
import {PopUpStartComponent} from "../pop-up-start/pop-up-start.component";


@Component({
  selector: 'app-gameScene',
  templateUrl: './gameScene.component.html',
  styleUrls: ['./gameScene.component.css']
})
export class GameSceneComponent implements OnInit, OnDestroy {

  private pseudoCurrentUser: string = "";
  private currentUser: User;
  public message: string = '';
  public formPrincipal : FormGroup;
  public messages: ChatMessage[] = [];

  public _secondes: PopUpStartComponent;

  constructor(private fb: FormBuilder, private chatService: ChatService, private localStorageService: LocalStorageService) {
    this.currentUser = new User();
    this.currentUser.name = "toto";
    this.formPrincipal = this.fb.group({});
    this.chatService.connectUser(this.currentUser);
    this.chatService.connectToWebSocketMessage();
  }

  onClickPlay(){}

  ngOnInit() {
    this.initializeForm();
    this.initialize();
    this.messages = [];
    this.getMessages();
  }

  getMessages() {
    this.chatService.getMessageFromWebsocket().subscribe({
      next: (message) => {
        this.messages.push(message);
      }
    })
  }

  ngOnDestroy(): void {
    this.chatService.close();
    this.chatService.disconnectFromWebSocketMessage();
  }

  initialize() {
    this.pseudoCurrentUser = this.localStorageService.getPseudo();
    this.messages = this.chatService.messages;
  }

  initializeForm() {
    this.formPrincipal.addControl('message', this.fb.control('', [Validators.required, Validators.minLength(1)]));
  }

  get f() {
    return this.formPrincipal.controls;
  }

  onSubmit() {

    if(this.formPrincipal.valid) {
      this.chatService.sendMessage(this.formPrincipal.value.message);
    }
  }

  filterName:string;

  clear(){
    this.filterName = '';
  }

}
