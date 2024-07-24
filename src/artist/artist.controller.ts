import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { SearchArtistDto } from '../artist/dto/search-artist.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get('search')
  @UsePipes(new ValidationPipe())
  async searchArtist(@Query() searchArtistDto: SearchArtistDto) {
    const { name, filename } = searchArtistDto;
    return this.artistService.searchAndSaveArtists(name, filename);
  }
}
