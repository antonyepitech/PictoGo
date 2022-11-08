import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public data : object = {
    messages: [],
    newMessage: ""
  }

  private socket: WebSocket;
  // private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
    this.socket = new WebSocket("ws://localhost:8080/ws");
  }

  connectToWebSocketMessage() {
    this.socket.onopen = event => {
      console.log("connected ok");
      console.log(event);
    }
  }

  disconnectFromWebSocketMessage() {
    this.socket.onclose = event => {
      console.log("disconnect ok");
      console.log(event);
    }
  }

  getMessageFromWebsocket() {
    this.socket.onmessage = event => {
      console.log("message comming");
      console.log(JSON.parse(event.data));
    }
  }

  sendMessage(message: string) {
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
