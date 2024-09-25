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

    @SubscribeMessage('message')
    handleMessage(
        client: Socket,
        payload: { chatId: string; content: string, userToken: string },
    ): void {
        console.log(payload);
        this.server.to(payload.chatId).emit('message', payload.content);
    }

    // @SubscribeMessage('deleteMessage')
    // async handleDeleteMessage(client: Socket, dto: DeleteMessageDto) {
    //     await this.MessageService.deleteMessage(dto);
    //     this.server.emit('' + dto.chatId, dto);
    // }
}
