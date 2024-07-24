import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [ArtistModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
