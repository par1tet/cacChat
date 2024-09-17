import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatDto } from './dto/createChat.dto';
import { ChatsService } from './chats.service';
import { DeleteChatDto } from './dto/deleteChat.dto';
import { AddUserToChatDto } from './dto/addUserToChat.dto';
import { FindAllChatUsers } from './dto/findAllChatUsers.dto';
import { FindAllUserChatsDto } from './dto/findAllUserChats.dto';
import { getChatsWithMessagesForUserDto } from './dto/getChatsWithMessagesForUser.dto';

@Controller('chats')
export class ChatsController {
  constructor(
    private ChatService: ChatsService
  ) {}
  
  @Post("/create")
  create(@Body() dto: CreateChatDto){
    return this.ChatService.createChat(dto)
  }

  @Post("/delete")
  delete(@Body() dto: DeleteChatDto){
    return this.ChatService.deleteChat(dto)
  }

  @Post("/invite")
  invite(@Body() dto: AddUserToChatDto){
    return this.ChatService.addUserToChat(dto)
  }
  
  @Post("/get_user")
  getUsers(@Body() dto: FindAllChatUsers){
    return this.ChatService.findAllChatUsers(dto)
  }
  
  @Post("/list")
  getChats(@Body() dto: FindAllUserChatsDto){
    return this.ChatService.findAllUserChats(dto)
  }

  @Post("/get_chats_with_messages_for_user")
  getChatsWithMessagesForUser(@Body() dto: getChatsWithMessagesForUserDto){
    return this.ChatService.getChatsWithMessagesForUser(dto)
  }
}
