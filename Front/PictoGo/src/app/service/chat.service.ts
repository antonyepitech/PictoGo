import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ChatMessage} from "../model/message.model";
import {User} from "../model/user.model";
import {Room} from "../model/room.model";
import {isNotNullOrUndefined} from "../util/control";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public rooms: Room[] = [];
  public messages: ChatMessage[];
  public roomInput: string;
  // public

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
      this.socket.addEventListener('message', (event) => {
        console.log(event);
        observer.next(JSON.parse(event.data));

        let data = event.data;
        data = data.split(/\r?\n/);

        for (let i = 0; i < data.length; i++) {
          let msg = JSON.parse(data[i]);
          switch (msg.action) {
            case "send-message":
              this.handleChatMessage(msg);
              break;
            // case "user-join":
            //   this.handleUserJoined(msg);
            //   break;
            // case "user-left":
            //   this.handleUserLeft(msg);
            //   break;
            case "room-joined":
              this.handleRoomJoined(msg);
              break;
            case "get-all-game":
              this.getAllGames(msg);
              break;
            default:
              break;
          }

        }

      })
    });
  }

  sendMessage(message: string) {
    console.log(message)
    this.socket.send(JSON.stringify({message: message}));
  }

  handleChatMessage(msg: ChatMessage) {
    const room: Room | null = this.findRoom(msg.target.id);
    if (isNotNullOrUndefined(room)) {
      room?.messages.push(msg);
    }
  }

  public close() {
    console.log("close ok");
    this.socket.close();
  }

  public getEventListener() {
    // return this.listener;
  }

  public findRoom(roomId: number): Room | null {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === roomId) {
        return this.rooms[i];
      }
    }
    return null;
  }

  public joinRoom() {
    this.socket.send(JSON.stringify({ action: 'join-room', message: this.roomInput }));
    this.roomInput = "";
  }

  public leaveRoom(room: Room) {
    this.socket.send(JSON.stringify({ action: 'leave-room', message: room.id }));

    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === room.id) {
        this.rooms.splice(i, 1);
        break;
      }
    }
  }

  // handleUserJoined(msg: ChatMessage) {
  //   this.users.push(msg.sender);
  // }
  //
  // handleUserLeft(msg: ChatMessage) {
  //   for (let i = 0; i < this.users.length; i++) {
  //     if (this.users[i].id == msg.sender.id) {
  //       this.users.splice(i, 1);
  //     }
  //   }
  // }

  public handleRoomJoined(msg: ChatMessage) {
    let room = msg.target;
    // room["messages"] = [];
    this.rooms.push(room);
  }

  /**
   * ce ne sera pas un chat message mais
   */
  getAllGames(msg: ChatMessage):Observable<Room[]> {
    return new Observable(observer => {
      this.socket.addEventListener('message', (event) => {
        observer.next(event.data);
      })
    });
  }
}
