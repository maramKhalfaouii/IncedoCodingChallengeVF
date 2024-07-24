import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { SearchArtistDto } from '../artist/dto/search-artist.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArtistResponseDto } from './dto/artist-response.dto';

@ApiTags('artists') // Optional: Add a tag for grouping in Swagger UI
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

    try {
      const result = await this.artistService.searchAndSaveArtists(
        name,
        filename,
      );

      // Adjust the response structure based on actual service response
      if (result.records && result.records.length === 0) {
        throw new HttpException('No artists found.', HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      if (error.response && error.response.status) {
        throw new HttpException(
          error.response.data.message || 'Failed to create CSV file.',
          error.response.status,
        );
      } else {
        throw new HttpException(
          'Failed to create CSV file.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
