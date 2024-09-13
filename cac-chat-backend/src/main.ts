import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const PORT = process.env.PORT ?? 4972
	console.log(process.env.PORT)

	const app = await NestFactory.create(AppModule);

	app.enableCors({origin: process.env.ORIGIN_LINK})

	await app.listen(PORT);
}
bootstrap();
