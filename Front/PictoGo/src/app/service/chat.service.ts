import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ChatMessage} from "../model/message.model";
import {User} from "../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  public messages: ChatMessage[];

  private socket: WebSocket;
  // private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
  }

  connectUser(user: User) {
    this.socket = new WebSocket("ws://localhost:8080/ws"+ "?name=" + user.name);
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
        console.log(event);
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
