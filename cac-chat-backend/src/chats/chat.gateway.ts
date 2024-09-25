import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';

import { Socket, Server } from 'socket.io';
import { SearchPrivateUserChatDto } from './dto/searchPrivateUserChat.dto';
import { ApiOperation } from '@nestjs/swagger';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
    constructor(private ChatService: ChatsService) {}

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('WebSocket Initialized');
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string): void {
        client.join(room);
    }

    @ApiOperation({ summary: 'Поиск чата' })
    @SubscribeMessage('searchChatPrivate')
    async handleSearchNewChat(client: Socket, dto: SearchPrivateUserChatDto) {
        const chats = await this.ChatService.searchPrivateUserChat(dto);
        return chats;
    }
    
    /*
    @ApiOperation({ summary: 'Создание лс' })
    @SubscribeMessage('searchChatPrivate')
    async handleCreatePM(client: Socket, dto: SearchPrivateUserChatDto) {
        // Nothing
    } */

    // @SubscribeMessage('createChat')
    // async handleNewChat(client: Socket, dto: CreateChatDto) {
    //     const chat = await this.ChatService.createChat(dto);
    //     this.server.emit('userIn', chat);
    //     return chat;
    // }

    // @SubscribeMessage('deleteChat')
    // async handleDeleteChat(client: Socket, dto: DeleteChatDto) {
    //     await this.ChatService.deleteChat(dto);
    //     this.server.emit('delete', 'delete');
    // }

    // @SubscribeMessage('addUserToChat')
    // async handleAddUserToChat(client: Socket, dto: AddUserToChatDto) {
    //     const invite = await this.ChatService.addUserToChat(dto);
    //     console.log(invite.dataValues.id);
    //     this.server.emit('user', dto.userId);
    // }
}
