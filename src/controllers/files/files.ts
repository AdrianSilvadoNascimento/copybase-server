import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { DataService } from 'src/services/data/data.service';

@Controller()
export class Files {
  constructor(private readonly dataService: DataService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async getData(@UploadedFile() file: any) {
    try {
      const data = await this.dataService.getData(file.buffer);
      return data;
    } catch (error) {
      console.error(error.message);
      return { success: false, message: 'Erro ao processar o arquivo.' };
    }
  }
}
