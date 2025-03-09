import { BadRequestException, Injectable } from '@nestjs/common';
import { TesseractConfig } from 'src/constants';
import { createWorker } from 'tesseract.js';
import * as Tesseract from 'tesseract.js';
import * as sharp from 'sharp';

@Injectable()
export class OcrService {
  async extractTextFromImage(file: Express.Multer.File) {
    const worker = await createWorker('eng');
    try {
      const proccessedImage = await this.preprocessImage(file.buffer);

      const result = await Tesseract.recognize(proccessedImage, 'eng', {
        // logger: (m) => console.log({ m }),
      });
      console.log({result: result.data.text});

      if (!file) {
        throw new BadRequestException('No image provided');
      }

      if (result.data.text === '') {
        throw new BadRequestException('No text found in the image');
      }
      
      return {
        // text: fullText,
        text: result.data.text.trim(),
      };
    } catch(error: unknown) {
      console.error(error);
    }
  }

  async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    return await sharp(imageBuffer)
      .resize(2000) // Resize to improve resolution
      .greyscale() // Convert to grayscale
      .threshold(128) // Apply thresholding
      .toBuffer();
  }
}
