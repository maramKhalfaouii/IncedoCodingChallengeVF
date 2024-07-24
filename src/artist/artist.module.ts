import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { CsvModule } from 'src/shared/csv/csv.module';

@Module({
  imports: [CsvModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
