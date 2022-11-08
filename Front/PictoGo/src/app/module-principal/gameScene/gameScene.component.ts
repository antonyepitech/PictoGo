import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "../../service/chat.service";

@Component({
  selector: 'app-gameScene',
  templateUrl: './gameScene.component.html',
  styleUrls: ['./gameScene.component.css']
})
export class GameSceneComponent implements OnInit {

  public message: string = '';
  public formPrincipal : FormGroup;

  constructor(private fb: FormBuilder, private chatService: ChatService) {
    this.formPrincipal = this.fb.group({});
    this.chatService.connectToWebSocketMessage();
  }

  ngOnInit() {
    this.initializeForm();
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
