import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { OcrService } from './ocr.service';

// Todo: abstract the uploadOptions to a separate file
const uploadOptions: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image')) {
      return cb(new Error('Only images are allowed'), false);
      //   Todo: throw nestjs built in error
    }
    cb(null, true);
  },
};

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('extract-text')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  @HttpCode(HttpStatus.OK)
  async extractText(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.ocrService.extractTextFromImage(file);
  }
}
