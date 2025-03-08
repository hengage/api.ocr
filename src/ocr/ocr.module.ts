import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';

@Module({
  providers: [OcrService],
  exports: [OcrService],
  controllers: [OcrController],
})
export class OcrModule {}
