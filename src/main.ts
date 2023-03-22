/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from 'firebase/app';

// import { corsConfig } from './cors.config';
// import { initializeFirebaseApp } from 'firebase.config';
// initializeFirebaseApp();

const serviceAccount = {
  apiKey: "AIzaSyBhSgJt8qA5yNNkAvMHXQfgUsPXhB-B4lo",
  authDomain: "reaproducoes-31713.firebaseapp.com",
  projectId: "reaproducoes-31713",
  storageBucket: "reaproducoes-31713.appspot.com",
  messagingSenderId: "1030329546371",
  appId: "1:1030329546371:web:835ec1763a2d89e7cb8db6",
  measurementId: "G-FE7WL2BFKL"
};

initializeApp(serviceAccount);

async function bootstrap() {

  const corsConfig = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  }

  // const app = await NestFactory.create(AppModule, {cors:true});
  // app.enableCors(corsConfig);
  // await app.listen(process.env.PORT || 3000);

  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(3000);
}
bootstrap();
