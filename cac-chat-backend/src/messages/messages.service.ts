import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { CreateMessageDto } from './dto/createMessage.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { JwtService } from '@nestjs/jwt';
import { UserChat } from 'src/chats/chat-user.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    private jwtService: JwtService
  ) {}

  private async getUserId(token: string): Promise<number> {
    try{
      const payload = this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY || "SEC"
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
      console.log({...dto, userId: user})
      const message = await this.messageRepository.destroy({where: {userId: user, id: dto.messageId}})
      return "delete"
    }catch(e){
      throw new HttpException("Такого пользователя или сообщения не существует", HttpStatus.BAD_REQUEST)
    }
  }
}
