import { Injectable } from '@angular/core';
import {Message} from "@angular/compiler/src/i18n/i18n_ast";
import {Observable} from "rxjs";
import {ChatMessage} from "../model/message.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  public messages: ChatMessage[];

  private socket: WebSocket;
  // private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
    this.socket = new WebSocket("ws://localhost:8080/ws");
  }

  connectToWebSocketMessage() {
    this.socket.onopen = event => {
      console.log("connected ok");
      console.log(event);

      //
    }
  }

  disconnectFromWebSocketMessage() {
    this.socket.onclose = event => {
      console.log("disconnect ok");
      console.log(event);
    }
  }

  getMessageFromWebsocket(): Observable<ChatMessage> {
    return new Observable(observer => {
      this.socket.onmessage = event => {
        observer.next(JSON.parse(event.data));
      }
    });
  }

  sendMessage(message: string) {
    console.log(message)
    this.socket.send(JSON.stringify({message: message}));
  }

  public close() {
    console.log("close ok");
    this.socket.close();
  }

  public getEventListener() {
    // return this.listener;
  }
}
