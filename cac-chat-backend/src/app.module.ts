import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { Chat } from './chats/chats.model';
import { UserChat } from './chats/chat-user.model';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/messages.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Chat, UserChat, Message],
      synchronize: true,
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
  ],
})
export class AppModule {}
