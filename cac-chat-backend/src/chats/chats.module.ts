import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Chat } from './chats.model';
import { UserChat } from './chat-user.model';
import { JwtModule } from '@nestjs/jwt';
import { Message } from 'src/messages/messages.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Chat, UserChat, Message]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SEC',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  providers: [ChatsService],
  controllers: [ChatsController]
})
export class ChatsModule {}
