import { Injectable } from '@nestjs/common';
import * as createCsvWriter from 'csv-writer';
import * as fs from 'fs';
import * as path from 'path';
import { csvDirectory } from 'src/config';

@Injectable()
export class CsvService {
  async writeCSV(filename: string, data: any[]) {
    const directoryPath = path.resolve(__dirname, '..', '..', csvDirectory);

    // To Ensure the directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.join(directoryPath, filename);
    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'mbid', title: 'MBID' },
        { id: 'url', title: 'URL' },
        { id: 'image_small', title: 'Image Small' },
        { id: 'image', title: 'Image' },
      ],
    });
    const firstArtist = data[0];
    const records = [
      {
        name: firstArtist.name,
        mbid: firstArtist.mbid,
        url: firstArtist.url,
        image_small: firstArtist.image[0]['#text'],
        image: firstArtist.image[firstArtist.image.length - 1]['#text'],
      },
    ];
    await csvWriter.writeRecords(records);
  }
}
