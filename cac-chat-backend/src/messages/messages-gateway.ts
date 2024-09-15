import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { DeleteMessageDto } from "./dto/deleteMessage.dto";

@WebSocketGateway({cors: true})
export class MessageGateway {
	constructor(
		private MessageService: MessagesService
	) {}


	@WebSocketServer() server: Server

	@SubscribeMessage('sendMessage')
	async handleNewMessage(client: Socket, dto: CreateMessageDto){
		const message = await this.MessageService.createMessage(dto)

		client.broadcast.emit(""+dto.chatId, message)

		// this.server.emit(""+dto.chatId, message)
	}

	@SubscribeMessage('deleteMessage')
	async handleDeleteMessage(client: Socket, dto: DeleteMessageDto){
		await this.MessageService.deleteMessage(dto)
		this.server.emit(""+dto.chatId, dto)
	}
}