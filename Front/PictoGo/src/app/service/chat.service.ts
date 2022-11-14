import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ChatMessage} from "../model/message.model";
import {User} from "../model/user.model";
import {Room} from "../model/room.model";
import {isNotNullOrUndefined, isNullOrUndefined} from "../util/control";
import {RoomMessage} from "../model/RoomMessage.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public rooms: Room[] = [];
  public room: Room;
  public messages: ChatMessage[] = [];
  messageChange: Subject<Room> = new Subject<Room>()
  roomChange: Subject<Room> = new Subject<Room>()
  public currentUser: User;
  public roomInput: string;
  // public

  private socket: WebSocket;
  // private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {
    this.room = new Room();
    this.room = new Room();
    this.room.clients = [];
    this.room.messages = [];
  }

  connectToMainWebsocket(pseudo: string) {
    this.socket = new WebSocket("ws://localhost:8080/ws"+ "?name=" + pseudo);
    this.socket.onopen = event => {
      this.getAllRooms();
    }
  }

  connectUser(pseudo: string) {
    this.socket = new WebSocket("ws://localhost:8080/ws"+ "?name=" + pseudo);
    this.connectToWebSocketMessage();
  }

  connectToWebSocketMessage() {
    this.socket.onopen = event => {
      this.joinRoom();
    }
  }

  disconnectFromWebSocketMessage() {
    this.socket.onclose = event => {
      // console.log("disconnect ok");
      // console.log(event);
    }
  }

  /**
   * GET ALL ROOMS BUT CAN HANDLE OTHER CATION LATER NOT BOUND DIRECTLY WITH GAMES
   */
  getRoomsActionFromWebsocket(): Observable<Room[]> {
    return new Observable(observer => {
      this.socket.onmessage = event => {
        let data = event.data;
        data = data.split(/\r?\n/);

        for (let i = 0; i < data.length; i++) {
          let msg = JSON.parse(data[i]);
          switch (msg.action) {
            case "get-rooms":
              observer.next(this.handleAllRooms(msg));
              break;
            default:
              break;
          }
        }
      }
    });
  }

  getMessageFromWebsocket(): Observable<Room> {
    return new Observable(observer => {
      this.socket.onmessage = event => {
        let data = event.data;
        data = data.split(/\r?\n/);

        for (let i = 0; i < data.length; i++) {
          let msg = JSON.parse(data[i]);
          switch (msg.action) {
            case "send-message":
              observer.next(this.handleChatMessage(msg));
              break;
            case "user-join":
              observer.next(this.handleUserJoined(msg));
              break;
            case "user-left":
              observer.next(this.handleUserLeft(msg));
              break;
            case "room-joined":
              console.log(msg);
              this.room = msg.target;
              observer.next(this.handleRoomJoined(msg));
              break;
            // case "room-create":
            //   this.getNewGame(msg);
            //   break;
            // case "get-all-game":
            //   this.getAllGames(msg);
            //   break;
            default:
              break;
          }
        }
      }
    });
  }

  handleChatMessage(msg: ChatMessage): Room {
    const room: Room | null = this.findRoom(msg.target.id);
    if (isNotNullOrUndefined(room)) {
      // room?.messages.push(msg);
    }

    if(isNullOrUndefined(this.room.messages)) {
      this.room.messages = [];
    }
    this.room.messages.push(msg)
    this.messageChange.next(this.room);
    return this.room;
  }

  public close() {
    console.log("close ok");
    this.socket.close();
  }

  public getEventListener() {
    // return this.listener;
  }

  public findRoom(roomId: number): any | null {
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === roomId) {
        return this.rooms[i];
      }
    }
    return null;
  }

  public joinRoom() {
    this.socket.send(JSON.stringify({ action: 'join-room', message: this.roomInput }));
  }

  public leaveRoom(room: Room) {
    this.socket.send(JSON.stringify({ action: 'leave-room', message: room.id }));

    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].id === room.id) {
        this.rooms.splice(i, 1);
        break;
      }
    }
    this.roomChange.next(this.room);
  }

  handleUserJoined(msg: ChatMessage): Room {
    console.log('dans hadle user join')
    this.initializeMessageAndClientArray();

    this.room.clients.push(msg.sender);
    this.room.messages.push(msg);
    this.roomChange.next(this.room);
    return this.room;
  }
  //
  handleUserLeft(msg: ChatMessage): Room {
    console.log('dans hadle user left');
    console.log(this.room.clients);
    for (let i = 0; i < this.room.clients.length; i++) {
      if (this.room.clients[i].id === msg.sender.id) {
        this.room.clients.splice(i, 1);
      }
    }
    console.log(this.room.clients);
    this.roomChange.next(this.room);
    return this.room;
  }

  public handleAllRooms(msg: RoomMessage): Room[] {
    const rooms: Room[] = msg.target;

    if(isNotNullOrUndefined(rooms) && isNotNullOrUndefined(rooms.length) && rooms.length > 0) {
      rooms.forEach(room => {
        this.rooms.push(room);
      })
    }

    return this.rooms;
  }

  public handleRoomJoined(msg: ChatMessage): Room {
    let room = msg.target;
    console.log(msg)
    this.rooms.push(room);
    this.room = room;
    return this.room;
  }

  /**
   * get all rooms
   */
  public getAllRooms() {
    this.socket.send(JSON.stringify({ action: 'get-rooms', message: '' }));
  }


  getNewGame(msg: ChatMessage) {
    console.log('new game created')
    console.log(msg)
  }

  setRoom(roomName: string) {
    this.roomInput = roomName;
  }

  sendMessage(room : Room, message: string) {
    if (message !== "") {
      this.socket.send(JSON.stringify({
        action: 'send-message',
        message: message,
        target: {
          id: room.id,
          name: room.name,
          private: false
        }
      }));
    }
  }

  getMessages(): Observable<ChatMessage[]> {
    return new Observable(observer => {
      observer.next(this.room.messages);
    });
  }

  initializeMessageAndClientArray() {
    if(isNullOrUndefined(this.room.clients)) {
      this.room.clients = [];
    }
    if(isNullOrUndefined(this.room.messages)) {
      this.room.messages = [];
    }
  }
}
