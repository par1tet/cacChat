import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { findAllChatMessages } from './dto/findAllChatMessage.dto';

@Controller('messages')
export class MessagesController {
  constructor(
    private MessageService: MessagesService
  ) {}

  @Post("/create")
  create(@Body() dto: CreateMessageDto){
    return this.MessageService.createMessage(dto)
  }

  @Post("/delete")
  delete(@Body() dto: DeleteMessageDto){
    return this.MessageService.deleteMessage(dto)
  }

  @Post("/get")
  getMessages(@Body() dto: findAllChatMessages){
    return this.MessageService.findAllChatMessages(dto)
  }
}
