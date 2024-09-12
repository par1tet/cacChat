import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [SequelizeModule.forRoot({
		dialect: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'root',
		database: 'nest-back',
		models: [],
		autoLoadModels: true
	}),
	ConfigModule.forRoot({
		envFilePath: './.env'
	})
	,UsersModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
