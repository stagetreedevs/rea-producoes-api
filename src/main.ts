/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from 'firebase/app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhSgJt8qA5yNNkAvMHXQfgUsPXhB-B4lo",
  authDomain: "reaproducoes-31713.firebaseapp.com",
  projectId: "reaproducoes-31713",
  storageBucket: "reaproducoes-31713.appspot.com",
  messagingSenderId: "1030329546371",
  appId: "1:1030329546371:web:835ec1763a2d89e7cb8db6",
  measurementId: "G-FE7WL2BFKL"
};
initializeApp(firebaseConfig);

async function bootstrap() {

  const corsConfig = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  }

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('R&A Producoes')
    .setDescription('R&A Producoes API - Todos os endpoints da aplicação')
    .setVersion('1.0')
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  SwaggerModule.setup('api', app, document, {
    // customSiteTitle: 'Backend Generator',
    // customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.2/swagger-ui.css',
    ],
  });

  app.enableCors()
  await app.listen(3000);
}
bootstrap();