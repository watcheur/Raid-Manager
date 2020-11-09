import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const options = new DocumentBuilder()
		.setTitle("Raid-Manager API")
		.setVersion("0.0.1")
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	app.use(helmet());
	app.use(cookieParser());
	app.use(rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100 // 100 request per window
	}))

  	await app.listen(3000);
}
bootstrap();
