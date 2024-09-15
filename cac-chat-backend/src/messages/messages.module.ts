import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { JwtModule } from '@nestjs/jwt';

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
  providers: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
