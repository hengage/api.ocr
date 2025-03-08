import { BadRequestException, Injectable } from '@nestjs/common';
import { TesseractConfig } from 'src/constants';
import { createWorker } from 'tesseract.js';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractTextFromImage(file: Express.Multer.File) {
    const worker = await createWorker('eng');
    try {
      //   await worker.loadLanguage('eng');
      //   await worker.initialize('eng');
      //   // Optional: Configure Tesseract parameters for better accuracy
      //   await worker.setParameters({
      //     tessedit_pageseg_mode: '3', // Auto page segmentation
      //     tessedit_char_whitelist:
      //       '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      //   });
      //   const {
      //     data: { text },
      //   } = await worker.recognize(imageBuffer);
      //   return text.trim();

      // Set the language and image path

      //   const tessDone = Tesseract.recognize(imageBuffer, language, {
      //     logger: (m) => console.log({ m }),
      //   }).then(({ data: { text } }) => {
      //     console.log({ text });
      //   });

      //   console.log({ tessDone });

      if (!file) {
        throw new BadRequestException('No image provided');
      }

      await worker.load();
      await worker.setParameters({
        tessedit_pageseg_mode: '6' as Tesseract.PSM,
        tessedit_char_whitelist: TesseractConfig.CharWhitelist,
        preserve_interword_spaces: '1',
      });
      const result = await worker.recognize(file.buffer, {}, { blocks: true });
      //   const fullText = result.data.blocks
      //     .map((block) => block.text)
      //     .join('\n')
      //     .trim();
      const fullText = result.data.text.trim();
      console.log(result.data.blocks[0]);

      if (fullText === '') {
        return {
          message: 'No text detected  in image',
        };
      }

      // Return as a proper JSON object
      return {
        text: fullText,
      };
    } finally {
      await worker.terminate();
    }
  }
}
