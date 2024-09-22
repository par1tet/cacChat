import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { createUserDto } from './dto/createUser.dto';
import { getUserDto } from './dto/getUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { deleteUserDto } from './dto/deleteUser.dto';
import { getUserByNameAndPassword } from './dto/getUserByNameAndPassword.dto';
import { searchUserByNickname } from './dto/searchUserByNickname.dto';
import { Op } from 'sequelize';
import { Chat } from 'src/chats/chats.model';
import { Message } from 'src/messages/messages.model';
import { UserChat } from 'src/chats/chat-user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Chat) private chatRepository: typeof Chat,
        @InjectModel(Message) private messageRepository: typeof Message,
        @InjectModel(UserChat) private userChatRepository: typeof UserChat,
    ) {}

    async getUsers() {
        return await this.userRepository.findAll();
    }

    async getUser(dto: getUserDto) {
        const foundUser = await this.userRepository.findOne({
            where: {
                email: dto.email,
            },
        });
        console.log(foundUser);

        return foundUser;
    }

    async updateUser(dto: updateUserDto) {
        const foundUser = await this.userRepository.update(dto, {
            where: {
                id: dto.id,
            },
        });
        console.log(foundUser);
        return foundUser;
    }

    async createUser(dto: createUserDto) {
        console.log(dto);
        const user = await this.userRepository.create(dto);
        return user;
    }

    async deleteUser(dto: deleteUserDto) {
        console.log(dto);
        await this.chatRepository.destroy({
            where: {
                id: dto.userId,
            },
        });
        await this.messageRepository.destroy({
            where: {
                id: dto.userId,
            },
        });
        await this.userChatRepository.destroy({
            where: {
                id: dto.userId,
            },
        });
        await this.userRepository.destroy({
            where: {
                id: dto.userId,
            },
        });
    }

    async getUserByNameAndPassword(dto: getUserByNameAndPassword) {
        const foundUser = await this.userRepository.findOne({
            where: {
                email: dto.email,
                password: dto.password,
            },
        });

        return foundUser;
    }

    async searchUserByNickname(dto: searchUserByNickname) {
        try {
            const candidate = await this.userRepository.findAll({
                where: {
                    nickname: {
                        [Op.iLike]: `%${dto.nickname}%`,
                    },
                },
            });
            return candidate;
        } catch {
            throw new HttpException(
                'По данному запросу ничего не найдено',
                HttpStatus.NOT_FOUND,
            );
        }
    }
}
