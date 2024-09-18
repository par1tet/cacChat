import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ChatsService } from "./chats.service";

import {Socket, Server} from "socket.io"
import { CreateChatDto } from "./dto/createChat.dto";
import { DeleteChatDto } from "./dto/deleteChat.dto";
import { AddUserToChatDto } from "./dto/addUserToChat.dto";

@WebSocketGateway({cors: true})
export class ChatGateway {
  constructor (
    private ChatService: ChatsService,
  ) {}

  @WebSocketServer() server: Server

  @SubscribeMessage('searchChatPrivate')
  async handleSearchNewChat (client: Socket, dto: any){
    const chats = await this.ChatService.searchPrivateUserChat(dto)
    return chats
  }

  @SubscribeMessage('createChat')
  async handleNewChat (client: Socket, dto: CreateChatDto){
    const chat = await this.ChatService.createChat(dto)
    this.server.emit("userIn", chat)
    return chat
  }

  @SubscribeMessage('deleteChat')
  async handleDeleteChat (client: Socket, dto: DeleteChatDto){
    await this.ChatService.deleteChat(dto)
    this.server.emit('delete', "delete")
  }

  @SubscribeMessage('addUserToChat')
  async handleAddUserToChat (client: Socket, dto: AddUserToChatDto){
    const invite = await this.ChatService.addUserToChat(dto)
    console.log(invite.dataValues.id)
    this.server.emit("user", dto.userId)
  }
}