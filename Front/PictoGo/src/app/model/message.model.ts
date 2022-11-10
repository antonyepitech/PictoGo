import {Room} from "./room.model";
import {User} from "./user.model";

export class ChatMessage {
  message: string;
  action: string;
  target: Room;
  sender: User;
}
