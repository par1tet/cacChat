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

    sendMessageToChat(chatId: number, message: any) {
        const chatRoom = `chat_${chatId}`;
        this.server.to(chatRoom).emit('newMessage', { message });
    }

    @SubscribeMessage('message')
    async handleMessage(
        client: Socket,
        dto: CreateMessageDto,
    ): Promise<void> {
        const message = await this.MessageService.createMessage(dto);
        const chatRoom = `chat_${dto.chatId}`;
        this.server.to(chatRoom).emit('message', message);
    }

    // @SubscribeMessage('deleteMessage')
    // async handleDeleteMessage(client: Socket, dto: DeleteMessageDto) {
    //     await this.MessageService.deleteMessage(dto);
    //     this.server.emit('' + dto.chatId, dto);
    // }
}
