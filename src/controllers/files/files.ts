import { Body, Controller, Post } from '@nestjs/common';

import { DataService } from 'src/services/data/data.service';

@Controller()
export class Files {
  constructor(private readonly dataService: DataService) {}

  @Post('upload')
  async getMrr(@Body() file: File) {
    const data = await this.dataService.getData(file);
    console.log(data);
  }
}
