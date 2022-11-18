import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ChatMessage} from "../model/message.model";
import {User} from "../model/user.model";
import {Room} from "../model/room.model";
import {isNotNullOrUndefined, isNullOrUndefined} from "../util/control";
import {RoomMessage} from "../model/RoomMessage.model";
import {LocalStorageService} from "./local-storage.service";

@Injectable()
export class ChatService {

  public rooms: Room[] = [];
  public room: Room;
  public drawInfos: ChatMessage[] = [];
  public messages: ChatMessage[] = [];
  public actualWord: string = "";

  guessWordChange: Subject<string> = new Subject<string>()
  messageChange: Subject<Room> = new Subject<Room>()
  roomChange: Subject<Room> = new Subject<Room>()
  drawInfoChange: Subject<ChatMessage> = new Subject<ChatMessage>()
  public currentUser: User;
  public roomInput: string;
  // public

  private socket: WebSocket;
  // private listener: EventEmitter<any> = new EventEmitter();

  public constructor(private localStorageService: LocalStorageService) {
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

  // getDrawFromWebSocket():Observable<ChatMessage> {
  //   return new Observable(observer => {
  //     this.socket.onmessage = event => {
  //       let data = event.data;
  //       data = data.split(/\r?\n/);
  //
  //       for (let i = 0; i < data.length; i++) {
  //         let msg = JSON.parse(data[i]);
  //         switch (msg.action) {
  //           case "send-draw":
  //             console.log('ds case send draw')
  //             observer.next(this.handleSendDraw(msg));
  //             break;
  //           default:
  //             break;
  //         }
  //       }
  //     }
  //   });
  // }

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
            case "guess-word":
              if(this.actualWord !== msg.message){
                observer.next(this.handleGuessWord(msg));
              }

              break;
            case "user-join":
                observer.next(this.handleUserJoined(msg));
              break;
            case "user-left":
              observer.next(this.handleUserLeft(msg));
              break;
            case "room-joined":
              this.room = msg.target;
              observer.next(this.handleRoomJoined(msg));
              break;
            case "leave-room":
              observer.next(this.handleUserLeft(msg));
              break
            case "send-draw":
              observer.next(this.handleSendDraw(msg));
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

  handleGuessWord(msg: ChatMessage): Room {
    if(msg.target.id === this.room.id && msg.target.name !== this.localStorageService.getPseudo()) {
      this.guessWordChange.next(msg.message);
    }
    return msg.target;
  }

  handleChatMessage(msg: ChatMessage): Room {
    const room: Room | null = this.findRoom(msg.target.id);
    if (isNotNullOrUndefined(room)) {
      // room?.messages.push(msg);
    }

    if(msg.target.id === this.room.id) {
      if(isNullOrUndefined(this.room.messages)) {
        this.room.messages = [];
      }

      if(this.room.messages.length === 0) {
        this.room.messages.push(msg)
        this.messageChange.next(this.room);
      }

      if(this.room.messages.length > 0 && msg.message !== this.room.messages[this.room.messages.length -1].message) {
        this.room.messages.push(msg)
        this.messageChange.next(this.room);
      }

    }
    return this.room;
  }

  public close() {
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
    this.socket.send(JSON.stringify({action: 'user-left', message: room.id}));

    if (this.room.id === room.id) {
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === room.id) {
          this.rooms.splice(i, 1);
          break;
        }
      }
      this.roomChange.next(this.room);
    }
  }

  handleUserJoined(msg: ChatMessage): Room
  {
    this.initializeMessageAndClientArray();

    if (this.room.id === msg.target.id) {
      if (this.room.clients.length > 0) {
        let clientExist = this.room.clients.filter(client => client.name === msg.sender.name)
        if (clientExist.length === 0) {
          this.room.clients.push(msg.sender);
        }
      } else {
        this.room.clients.push(msg.sender);
      }

      this.roomChange.next(this.room);
      return this.room;
    }
    return this.room;
  }

  //
  handleUserLeft(msg: ChatMessage): Room {

    if (isNotNullOrUndefined(this.room.messages) && isNotNullOrUndefined(this.room.messages.length) && (this.room.messages.length > 0 && this.room.messages[this.room.messages.length - 1].message !== msg.message) || (this.room.messages.length === 0)) {
      for (let i = 0; i < this.room.clients.length; i++) {
        if (this.room.clients[i].id === msg.sender.id) {
          this.room.clients.splice(i, 1);
        }
      }
      this.room.messages.push(msg)
      this.roomChange.next(this.room);
    }
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

  public handleSendDraw(msg: ChatMessage): Room {

    if(isNullOrUndefined(this.drawInfos)) {
      this.drawInfos = [];
    }

    if(msg.target.id === this.room.id && this.room.name !== this.localStorageService.getPseudo()) {
      this.drawInfoChange.next(msg);
      this.drawInfos.push(msg)
    }
    return msg.target;
  }

  public handleRoomJoined(msg: ChatMessage): Room {
    this.initializeMessageAndClientArray();
    let room = msg.target;

    if(this.room.clients.length > 0) {
      let clientExist = this.room.clients.filter(client => client === msg.sender);
      if(clientExist.length === 0) {
        this.room.clients.push(msg.sender);
      }
    } else {
      this.room.clients.push(msg.sender);
    }

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

  sendGuessWord(room : Room, message: string) {
    if (message !== "") {
      this.socket.send(JSON.stringify({
        action: 'guess-word',
        message: message,
        target: {
          id: room.id,
          name: room.name,
          private: false
        }
      }));
    }
  }

  sendDraw(room : Room, offsetX: string, offsetY: string, mouse: string) {
    if (offsetX !== "" && offsetY !== "") {
      this.socket.send(JSON.stringify({
        action: 'send-draw',
        message: 'envoi draw',
        offsetX: offsetX,
        offsetY: offsetY,
        mouse: mouse,
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
