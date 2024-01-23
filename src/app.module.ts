import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataService } from './services/data/data.service';
import { Files } from './controllers/files/files';

@Module({
  imports: [],
  controllers: [AppController, Files],
  providers: [AppService, DataService],
})
export class AppModule {}
