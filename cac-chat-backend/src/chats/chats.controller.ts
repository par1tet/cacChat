import { Body, Controller, Post } from '@nestjs/common';
import { CreateChatDto } from './dto/createChat.dto';
import { ChatsService } from './chats.service';
import { DeleteChatDto } from './dto/deleteChat.dto';
import { AddUserToChatDto } from './dto/addUserToChat.dto';
import { FindAllChatUsers } from './dto/findAllChatUsers.dto';
import { FindAllUserChatsDto } from './dto/findAllUserChats.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchPrivateUserChatDto } from './dto/searchPrivateUserChat.dto';

@ApiTags('Chat')
@Controller('chats')
export class ChatsController {
    constructor(private ChatService: ChatsService) {}

    @ApiOperation({summary: "Создание чата"})
    @Post('/create')
    create(@Body() dto: CreateChatDto) {
        return this.ChatService.createChat(dto);
    }

    @ApiOperation({summary: "Удаление чата"})
    @Post('/delete')
    delete(@Body() dto: DeleteChatDto) {
        return this.ChatService.deleteChat(dto);
    }

    @ApiOperation({summary: "Приглашение пользователя в чат"})
    @Post('/invite')
    invite(@Body() dto: AddUserToChatDto) {
        return this.ChatService.addUserToChat(dto);
    }

    @ApiOperation({summary: "Получение пользователей из чата"})
    @Post('/get_user')
    getUsers(@Body() dto: FindAllChatUsers) {
        return this.ChatService.findAllChatUsers(dto);
    }

    @ApiOperation({summary: "Получение всех чатов у пользователя"})
    @Post('/list')
    getChats(@Body() dto: FindAllUserChatsDto) {
        return this.ChatService.findAllUserChats(dto);
    }
}
