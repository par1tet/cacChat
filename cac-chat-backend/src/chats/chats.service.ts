import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Chat } from './chats.model';
import { CreateChatDto } from './dto/createChat.dto';
import { DeleteChatDto } from './dto/deleteChat.dto';
import { AddUserToChatDto } from './dto/addUserToChat.dto';
import { UserChat } from './chat-user.model';
import { FindAllUserChatsDto } from './dto/findAllUserChats.dto';
import { FindAllChatUsers } from './dto/findAllChatUsers.dto';
import { JwtService } from '@nestjs/jwt';
import { findAllChatMessages } from './dto/findAllChatMessage.dto';
import { Message } from 'src/messages/messages.model';
import { getChatsWithMessagesForUserDto } from './dto/getChatsWithMessagesForUser.dto';

@Injectable()
export class ChatsService {
	constructor(
		@InjectModel(UserChat) private userChatRepository: typeof UserChat,
		@InjectModel(User) private userRepository: typeof User,
		@InjectModel(Chat) private chatRepository: typeof Chat,
		@InjectModel(Message) private messageRepository: typeof Message,
		private jwtService: JwtService
	) {}

	private async getUserId(token: string): Promise<number> {
		try{
			const payload = this.jwtService.verify(token, {
				secret: process.env.PRIVATE_KEY
			})
			if(payload){
				return payload.id
			}
		}catch(e){
			console.log(e)
		}
	}

	async createChat(dto: CreateChatDto) {
		const userId = await this.getUserId(dto.userToken)
		console.log(userId)
		const candidate = await this.chatRepository.create({userId: userId, title: dto.title});
		await this.addUserToChat({userId: userId, chatId: candidate.id})
		return candidate;
	}

	async deleteChat(dto: DeleteChatDto) {
		const userId = await this.getUserId(dto.userToken)
		await this.chatRepository.destroy({
			where: { userId: userId, id: dto.chatId },
		});
		return "DELETE"
	}

	async addUserToChat(dto: AddUserToChatDto) {
		const user = await this.userRepository.findByPk(dto.userId)
		const chat = await this.chatRepository.findByPk(dto.chatId)
		if(user && chat){
			await chat.$add("users", user.id)
			return user
		}
		throw new HttpException("Пользователь или чат не найден", HttpStatus.BAD_REQUEST)
	}

	async findAllChatUsers(dto: FindAllChatUsers) {
		return await this.userChatRepository.findAll({where: {chatId: dto.chatId}})
	}

	async findAllUserChats(dto: FindAllUserChatsDto) {
		try {
			const userId = await this.getUserId(dto.userToken);

			const chats = await Chat.findAll({
				attributes: ['id', 'title', 'createdAt'],
				include: [
					{
						model: Message,
						as: 'messages',
						attributes: ['id', 'content', 'createdAt', 'userId'],
						required: false,
					},
					{
						model: User,
						as: 'users',
						where: { id: userId },
						through: { attributes: [] },
					}
				],
			});

			return chats;
		} catch (e) {
			console.log(e)
			throw new HttpException('Такого пользователя не существует', HttpStatus.BAD_REQUEST);
		}
	}


	async findAllChatMessages(dto: findAllChatMessages){
		try{
			const messages = await this.messageRepository.findAll({where: {chatId: dto.chatId}})
			return messages
		}catch(e){
			throw new HttpException("Такого чата не существует", HttpStatus.BAD_REQUEST)
		}
	}

	async getChatsWithMessagesForUser(dto: getChatsWithMessagesForUserDto) {
		return await this.findAllUserChats(dto)
	}
}
