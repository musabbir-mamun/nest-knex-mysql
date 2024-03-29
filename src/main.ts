import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });


    const config = new DocumentBuilder()
        .setTitle('Nest APIs')
        .setDescription('1st class api collection')
        .setVersion('1.0')
        .addTag('Awesome project')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(5000);
}
bootstrap();
