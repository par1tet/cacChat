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
import { Message } from 'src/messages/messages.model';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { SearchPrivateUserChatDto } from './dto/searchPrivateUserChat.dto';
import { CreatePrivateUserChatDto } from './dto/createPrivateUserChat.dto';

@Injectable()
export class ChatsService {
    constructor(
        @InjectModel(UserChat) private userChatRepository: typeof UserChat,
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Chat) private chatRepository: typeof Chat,
        @InjectModel(Message) private messageRepository: typeof Message,
        private jwtService: JwtService,
    ) {}

    async getUserId(token: string): Promise<number> {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.PRIVATE_KEY,
            });
            if (payload) {
                return payload.id;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async createChat(dto: CreateChatDto) {
        try {
            const userId = await this.getUserId(dto.userToken);
            const candidate = await this.chatRepository.create({
                userId,
                title: dto.title,
            });
            await this.addUserToChat({ userId, chatId: candidate.id });
            return candidate;
        } catch (error) {
            console.error('Error creating chat:', error);
            throw new HttpException(
                'Could not create chat',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async selectChatUsersData(chatId: number) {
        try {
            const chat = await this.chatRepository.findOne({
                where: { id: chatId },
                include: [{
                    model: User,
                    attributes: ['id', 'nickname', 'email'],
                    through: {
                        attributes: []
                    }
                }]
            });
            
            return chat ? chat.users : [];
        } catch (e) {
            console.error(e);
            throw new HttpException('Не удалось получить данные пользователей', HttpStatus.BAD_REQUEST);
        }
    }

    async findCommonChats(userIds: CreatePrivateUserChatDto): Promise<number[]> {
        if(userIds.users[0] == userIds.users[1]){
            return [0]
        }
        const chats = await this.userChatRepository.findAll({
            attributes: ['chatId'],
            where: {
                userId: userIds.users,
            },
            group: ['chatId'],
            having: Sequelize.literal('COUNT(DISTINCT "userId") = 2'),
        });

        return chats.map(chat => chat.chatId);
    }

    async createPrivateChat(dto: CreatePrivateUserChatDto) {
        try {
            const userId = await this.getUserId(dto.userToken);
            const chat = await this.chatRepository.create({
                title: "private-chat",
                userId: userId,
                type: "privateChat"
            });

            await Promise.all(dto.users.map(async (element) => {
                await this.addUserToChat({ userId: element, chatId: chat.id });
            }));

            return chat;
        } catch (error) {
            console.error('Error creating chat:', error);
            throw new HttpException(
                'Could not create chat',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    

    async deleteChat(dto: DeleteChatDto) {
        const userId = await this.getUserId(dto.userToken);
        await this.chatRepository.destroy({
            where: { userId: userId, id: dto.chatId },
        });
        return 'DELETE';
    }

    async addUserToChat(dto: AddUserToChatDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const chat = await this.chatRepository.findByPk(dto.chatId);
        if (user && chat) {
            await chat.$add('users', user.id);
            return user;
        }
        throw new HttpException(
            'Пользователь или чат не найден',
            HttpStatus.BAD_REQUEST,
        );
    }
    

    async findAllChatUsers(dto: FindAllChatUsers) {
        return await this.userChatRepository.findAll({
            where: { chatId: dto.chatId },
        });
    }

    async searchPrivateUserChat(dto: SearchPrivateUserChatDto) {
        
        try {
            const chats = await Chat.findAll({
                attributes: ['id', 'title', 'createdAt'],
                include: [
                    {
                        model: User,
                        as: 'users',
                        attributes: [],
                        through: { attributes: [] },
                        where: {
                            id: {
                                [Op.in]: dto,
                            },
                        },
                        duplicating: false,
                    },
                ],
                group: ['Chat.id'],
                having: Sequelize.literal(
                    `COUNT(DISTINCT "users"."id") = 2 AND 
					COUNT(DISTINCT CASE WHEN "users"."id" IN (${dto[0]}, ${dto[1]}) THEN "users"."id" END) = 2`,
                ),
            });

            return chats;
        } catch (e) {
            console.log(e);
            throw new HttpException(
                'Такого пользователя не существует',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findAllUserChats(dto: FindAllUserChatsDto) {
        try {
            const userId = await this.getUserId(dto.userToken);
    
            const chats = await Chat.findAll({
                attributes: ['id', 'title', 'createdAt', 'type'],
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
                        through: { attributes: [] },
                    },
                ],
            });
    
            chats.forEach(chat => {
                chat.users = chat.users.map(user => ({
                    id: user.id,
                    nickname: user.nickname,
                })) as unknown as User[];
            });
    
            return chats;
        } catch (e) {
            console.log(e);
            throw new HttpException(
                'Такого пользователя не существует',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    
}
