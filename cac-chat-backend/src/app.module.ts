import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ConfigModule.forRoot({
		envFilePath: `./.${process.env.NODE_ENV}.env`
	}),
	SequelizeModule.forRoot({
		dialect: 'postgres',
		host: process.env.POSTGRES_HOST,
		port: +process.env.POSTGRES_PORT,
		username: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		models: [User],
		synchronize: true,
		autoLoadModels: true,
	}),
	UsersModule,
	AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
