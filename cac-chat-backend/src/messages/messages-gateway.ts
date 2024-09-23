import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: true })
export class MessageGateway {
    constructor(
        private MessageService: MessagesService,
        private UsersService: UsersService,
    ) {}

    @WebSocketServer() server: Server;

    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, payload: { chatId: number }) {
        const chatRoom = `chat_${payload.chatId}`;
        client.join(chatRoom);
    }

    sendMessageToChat(chatId: number, message: any) {
        const chatRoom = `chat_${chatId}`;
        console.log(chatRoom)
        this.server.to(chatRoom).emit('newMessage', { message });
    }

    @SubscribeMessage('sendMessage')
    async handleNewMessage(client: Socket, dto: CreateMessageDto) {
        const message = await this.MessageService.createMessage(dto);
        this.sendMessageToChat(dto.chatId, message)
    }

    // @SubscribeMessage('deleteMessage')
    // async handleDeleteMessage(client: Socket, dto: DeleteMessageDto) {
    //     await this.MessageService.deleteMessage(dto);
    //     this.server.emit('' + dto.chatId, dto);
    // }
}
