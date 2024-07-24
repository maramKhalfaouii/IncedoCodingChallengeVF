import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class ArtistResponseDto {
  @ApiProperty({ description: 'The name of the artist' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The MusicBrainz ID of the artist' })
  @IsOptional()
  mbid: string;

  @ApiProperty({ description: "The URL of the artist's Last.fm page" })
  @IsUrl()
  url: string;

  @ApiProperty({ description: "The URL of the artist's small image" })
  @IsUrl()
  image_small: string;

  @ApiProperty({ description: "The URL of the artist's large image" })
  @IsUrl()
  image: string;
}
