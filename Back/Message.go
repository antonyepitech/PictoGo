package main

import (
	"encoding/json"
	"log"
)

const SendDrawAction = "send-draw"
const SendMessageAction = "send-message"
const JoinRoomAction = "join-room"
const LeaveRoomAction = "leave-room"
const UserJoinedAction = "user-join"
const UserLeftAction = "user-left"
const GetRooms = "get-rooms"
const JoinRoomPrivateAction = "join-room-private"
const RoomJoinedAction = "room-joined"
const RoomCreatedAction = "room-created"

type Message struct {
	Action  string  `json:"action"`
	Message string  `json:"message"`
	Target  *Room   `json:"target"`
	Sender  *Client `json:"sender"`
	OffsetX string  `json:"offsetX"`
	OffsetY string  `json:"offsetY"`
	Mouse string  `json:"mouse"`
}

type MessageRoom struct {
	Action  string  `json:"action"`
	Message string  `json:"message"`
	Target  []*Room  `json:"target"`
	Sender  *Client `json:"sender"`
	OffsetX string  `json:"offsetX"`
	OffsetY string  `json:"offsetY"`
	Mouse string  `json:"mouse"`
}

func (message *Message) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}

func (message *MessageRoom) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}
