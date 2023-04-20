/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from 'firebase/app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
 // core
 import { resolve } from 'path';
 import { writeFileSync, createWriteStream } from 'fs';
 import { get } from 'http';

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

  const serverUrl = 'rea-producoes-api.vercel.app/api'

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
    .setDescription('The R&A Producoes API description')
    .setVersion('1.0')
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors()
  await app.listen(3000);

  // write swagger ui files
  get(
    `${serverUrl}/swagger/swagger-ui-bundle.js`, function
    (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
    console.log(
      `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
    );
  });

  get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    console.log(
      `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
    );
  });

  get(
    `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
    function (response) {
      response.pipe(
        createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
      );
      console.log(
        `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
      );
    });

  get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
    response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    console.log(
      `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
    );
  });
}
bootstrap();