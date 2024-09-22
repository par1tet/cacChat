import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Message")
@Controller('messages')
export class MessagesController {
    constructor(private MessageService: MessagesService) {}

    @ApiOperation({ summary: 'Создание сообщения' })
    @Post('/create')
    create(@Body() dto: CreateMessageDto) {
        return this.MessageService.createMessage(dto);
    }

    @ApiOperation({ summary: 'Удаление сообщения' })
    @Post('/delete')
    delete(@Body() dto: DeleteMessageDto) {
        return this.MessageService.deleteMessage(dto);
    }
}
