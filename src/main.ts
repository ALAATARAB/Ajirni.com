import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import express from 'express';
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{rawBody:true,cors:true,bodyParser:true});
  app.enableCors({origin:"*",methods:"*",allowedHeaders:"*",credentials:true});
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.listen(3000);
}
bootstrap();