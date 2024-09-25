import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';

import { Socket, Server } from 'socket.io';
import { CreatePrivateUserChatDto } from './dto/createPrivateUserChat.dto';
import { ApiOperation } from '@nestjs/swagger';
import { MessagesService } from '../messages/messages.service';
import { CreateChatDto } from './dto/createChat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
    constructor(private ChatService: ChatsService) {}

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('WebSocket Initialized');
    }

    /* Подключение пользователя к комнате чата 
    для последующего получения из него сообщений */

    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, payload: { chatId: number }) {
        const chatRoom = `chat_${payload.chatId}`;
        client.join(chatRoom);
    }

    /* Подключение пользователя к комнате пользователя,
    для последующего получения из него данных об обновление групп 
    (удаление, добавление и тд.) */

    @SubscribeMessage('connectUser')
    handleConnectUser(client: Socket, payload: {userId: number}) {
        const userRoom = `user_${payload.userId}`
        client.join(userRoom)
    }

    @ApiOperation({summary: "Создание лс"})
    @SubscribeMessage('createPrivateChat')
    async handleCreatePM(client: Socket, dto: CreatePrivateUserChatDto) {
        const candidate = await this.ChatService.findCommonChats(dto)
        if(candidate.length > 0){
            return candidate[0]
        }
        const chat = await this.ChatService.createPrivateChat(dto);
        dto.users.forEach(element => {
            const userRoom = `user_${element}`;
            this.server.to(userRoom).emit('chatInvite', chat);
        });
        
        return chat;
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
