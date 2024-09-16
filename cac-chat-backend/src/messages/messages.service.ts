import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { CreateMessageDto } from './dto/createMessage.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { JwtService } from '@nestjs/jwt';
import { findAllChatMessages } from './dto/findAllChatMessage.dto';

@Injectable()
export class MessagesService {
  constructor(
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

  async createMessage(dto: CreateMessageDto){
    try{
      const user = await this.getUserId(dto.userToken)
      const message = await this.messageRepository.create({...dto, userId: user})
      return message
    }catch(e){
      throw new HttpException("Такого чата или пользователя не существует", HttpStatus.BAD_REQUEST)
    }
  }

  async deleteMessage(dto: DeleteMessageDto){
    try{
      const user = await this.getUserId(dto.userToken)
      await this.messageRepository.destroy({where: {userId: user, id: dto.messageId}})
      return "delete"
    }catch(e){
      throw new HttpException("Такого пользователя или сообщения не существует", HttpStatus.BAD_REQUEST)
    }
  }

  async deleteAllChatMessages(chatId: number){
    try{
      await this.messageRepository.destroy({where: {chatId: chatId}})
    }catch(e){
      throw new HttpException("Неверный chatId, либо сообщений нет", HttpStatus.BAD_REQUEST)
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

}
