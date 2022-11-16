import {User} from "./user.model";
import {ChatMessage} from "./message.model";

export class Room {
  id: number;
  name: string;
  clients: User[];
  messages: ChatMessage[] =  [];
}
