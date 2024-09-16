import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { JwtModule } from '@nestjs/jwt';
import { MessageGateway } from './messages-gateway';

@Module({
  imports: [
    SequelizeModule.forFeature([Message]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SEC',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  providers: [MessagesService, MessageGateway],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
