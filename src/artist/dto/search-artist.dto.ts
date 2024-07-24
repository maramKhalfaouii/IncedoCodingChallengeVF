import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SearchArtistDto {
  @ApiProperty({
    description: 'The name of the artist you want to search for',
    example: 'Adele',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The filename ',
    example: 'artists',
  })
  @IsString()
  @IsNotEmpty()
  filename: string;
}
