import { Injectable, Logger } from '@nestjs/common';
import { API_KEY, BASE_URL } from '../config';
import { CsvService } from '../shared/csv/csv.service';
import axios from 'axios';
import { ArtistResponseDto } from './dto/artist-response.dto';
import { artistsMock } from '../shared/randomArtists';

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name);

  constructor(private readonly csvService: CsvService) {}

  async searchAndSaveArtists(name: string, filename: string) {
    let artists = await this.searchArtist(name);

    if (!artists.length) {
      this.logger.log(`No results found for ${name}. Trying random artists.`);
      artists = await this.searchRandomArtistsUntilFound();
    }

    await this.csvService.writeCSV(filename, artists);
    const firstArtist = artists[0];
    const records = [
      {
        name: firstArtist.name,
        mbid: firstArtist.mbid,
        url: firstArtist.url,
        image_small: firstArtist.image[0]['#text'],
        image: firstArtist.image[firstArtist.image.length - 1]['#text'],
      },
    ];
    return { message: 'CSV file created successfully.', records };
  }
  public async searchArtist(name: string): Promise<ArtistResponseDto[]> {
    const url = `${BASE_URL}&artist=${name}&api_key=${API_KEY}&format=json`;
    try {
      const { data } = await axios.get(url);
      return data.results.artistmatches.artist;
    } catch (error) {
      this.logger.error(`Failed to fetch artist data: ${error.message}`);
      return [];
    }
  }
  public async searchRandomArtistsUntilFound() {
    try {
      const randomArtists = artistsMock;
      for (const artistName of randomArtists) {
        const artists = await this.searchArtist(artistName);
        if (artists.length) {
          return artists;
        }
      }
    } catch (error) {
      console.error('Error in searchRandomArtistsUntilFound:', error);
    }
    return [];
  }
}
