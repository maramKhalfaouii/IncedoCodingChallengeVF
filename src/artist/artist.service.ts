import { Injectable, Logger } from '@nestjs/common';
import { API_KEY, BASE_URL } from 'src/config';
import { CsvService } from 'src/shared/csv/csv.service';
import axios from 'axios';
import { getRandomArtists } from 'src/shared/getRandomArtists';

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
    return { message: 'CSV file created successfully.' };
  }
  private async searchArtist(name: string): Promise<any[]> {
    const url = `${BASE_URL}&artist=${name}&api_key=${API_KEY}&format=json`;
    try {
      const { data } = await axios.get(url);
      return data.results.artistmatches.artist || [];
    } catch (error) {
      this.logger.error(`Failed to fetch artist data: ${error.message}`);
      return [];
    }
  }
  private async searchRandomArtistsUntilFound() {
    const randomArtists = await getRandomArtists();
    for (const artist of randomArtists) {
      const artists = await this.searchArtist(artist);
      if (artists.length) {
        return artists;
      }
    }
    return [];
  }
}
