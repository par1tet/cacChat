import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { JwtModule } from '@nestjs/jwt';
import { MessageGateway } from './messages.gateway';
import { UserChat } from 'src/chats/chat-user.model';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Message, UserChat]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SEC',
            signOptions: {
                expiresIn: '24h',
            },
        }),
        UsersModule,
    ],
    providers: [MessagesService, MessageGateway],
    controllers: [MessagesController],
})
export class MessagesModule {}
