import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatsService } from "./chats.service";

import {Socket, Server} from "socket.io"
import { CreateChatDto } from "./dto/createChat.dto";
import { DeleteChatDto } from "./dto/deleteChat.dto";
import { AddUserToChatDto } from "./dto/addUserToChat.dto";
import { MessagesService } from "src/messages/messages.service";

@WebSocketGateway()
export class ChatGateway {
  constructor (
    private ChatService: ChatsService,
  ) {}

  @WebSocketServer() server: Server

  @SubscribeMessage('createChat')
  async handleNewChat (client: Socket, dto: CreateChatDto){
    const userId = await this.ChatService.getUserId(dto.userToken)
    const chat = await this.ChatService.createChat(dto)
    client.broadcast.emit("user:"+userId, chat)
  }
  
  @SubscribeMessage('deleteChat')
  async handleDeleteChat (client: Socket, dto: DeleteChatDto){
    await this.ChatService.deleteChat(dto)
    client.broadcast.emit(""+dto.chatId, "delete")
  }

  @SubscribeMessage('addUserToChat')
  async handleAddUserToChat (client: Socket, dto: AddUserToChatDto){
    const invite = await this.ChatService.addUserToChat(dto)
    console.log(invite)
    client.broadcast.emit("user:"+invite, "invite")
  }
}