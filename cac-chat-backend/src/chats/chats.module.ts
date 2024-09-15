import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Chat } from './chats.model';
import { UserChat } from './chat-user.model';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat-gateway';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    MessagesModule,
    SequelizeModule.forFeature([User, Chat, UserChat]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SEC',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [ChatsService, ChatGateway],
  controllers: [ChatsController],
})
export class ChatsModule {}
