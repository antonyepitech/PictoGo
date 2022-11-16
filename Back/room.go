package main

import (
	"fmt"
	"github.com/google/uuid"
)

const welcomeOwnerMessage = " a crée la partie"
const welcomeMessage = "%s est arrivé dans la partie"
const welcomeWithoutNameMessage = " est arrivé dans la partie"
const leaveMessage = " a quitté la partie"

type Room struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Message
	Private    bool `json:"private"`
}

// NewRoom creates a new Room
func NewRoom(name string, private bool) *Room {
	return &Room{
		ID:         uuid.New(),
		Name:       name,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *Message),
		Private:    private,
	}
}

// RunRoom runs our room, accepting various requests
func (room *Room) RunRoom() {
	for {
		select {

		case client := <-room.register:
			room.registerClientInRoom(client)

		case client := <-room.unregister:
			room.unregisterClientInRoom(client)

		case message := <-room.broadcast:
			room.broadcastToClientsInRoom(message.encode())
		}

	}
}

func (room *Room) registerClientInRoom(client *Client) {
	room.notifyClientJoined(client)
	room.clients[client] = true
}

func (room *Room) unregisterClientInRoom(client *Client) {
	if _, ok := room.clients[client]; ok {

		delete(room.clients, client)
	}
}

func (room *Room) broadcastToClientsInRoom(message []byte) {
	for client := range room.clients {
		client.send <- message
	}
}

func (room *Room) notifyClientJoined(client *Client) {
	message := &Message{
		Action:  SendMessageAction,
		Target:  room,
		Message: fmt.Sprintf(welcomeMessage, client.GetName()),
	}

	room.broadcastToClientsInRoom(message.encode())

	message1 := &Message{
		Action:  UserJoinedAction,
		Sender: client,
		Target:  room,
		Message: fmt.Sprintf(welcomeMessage, client.GetName()),
	}

	room.broadcastToClientsInRoom(message1.encode())
}

func (room *Room) notifyClientLeft(client *Client) {
	message := &Message{
		Action:  UserLeftAction,
		Sender: client,
		Target:  room,
		Message: fmt.Sprintf(leaveMessage, client.GetName()),
	}

	room.broadcastToClientsInRoom(message.encode())
}

func (room *Room) GetId() string {
	return room.ID.String()
}

func (room *Room) GetName() string {
	return room.Name
}
