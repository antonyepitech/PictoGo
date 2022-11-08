import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "../../service/chat.service";
import {ChatMessage} from "../../model/message.model";

@Component({
  selector: 'app-gameScene',
  templateUrl: './gameScene.component.html',
  styleUrls: ['./gameScene.component.css']
})
export class GameSceneComponent implements OnInit, OnDestroy {

  public message: string = '';
  public formPrincipal : FormGroup;
  public messages: ChatMessage[] = [];

  constructor(private fb: FormBuilder, private chatService: ChatService) {
    this.formPrincipal = this.fb.group({});
    this.chatService.connectToWebSocketMessage();
  }

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

}
