import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { OcrService } from './ocr/ocr.service';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    OcrModule
  ],
  controllers: [AppController],
  providers: [AppService, OcrService],
})
export class AppModule {}
