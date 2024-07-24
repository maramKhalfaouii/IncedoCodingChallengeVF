import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { SearchArtistDto } from '../artist/dto/search-artist.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArtistResponseDto } from './dto/artist-response.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search and save artists to CSV' })
  @ApiResponse({
    status: 200,
    description: 'CSV file created successfully.',
    type: ArtistResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'No artists found.' })
  @ApiResponse({ status: 500, description: 'Failed to create CSV file.' })
  @UsePipes(new ValidationPipe())
  async searchArtist(@Query() searchArtistDto: SearchArtistDto) {
    const { name, filename } = searchArtistDto;
    return this.artistService.searchAndSaveArtists(name, filename);
  }
}
