import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { CsvService } from '../shared/csv/csv.service';
import axios from 'axios';
import { getRandomArtists } from '../shared/getRandomArtists';
import { ArtistResponseDto } from './dto/artist-response.dto';
jest.mock('axios');
jest.mock('../shared/getRandomArtists');

describe('ArtistService', () => {
  let service: ArtistService;
  let csvService: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: CsvService,
          useValue: { writeCSV: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
    csvService = module.get<CsvService>(CsvService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchAndSaveArtists', () => {
    it('should save artists to CSV and return success message', async () => {
      const mockArtists: ArtistResponseDto[] = [
        {
          name: 'Artist 1',
          mbid: 'mbid1',
          url: 'url1',
          image_small: 'image1',
          image: 'image2',
        },
      ];
      jest.spyOn(service, 'searchArtist').mockResolvedValue(mockArtists);

      const result = await service.searchAndSaveArtists(
        'Artist 1',
        'filename.csv',
      );

      expect(csvService.writeCSV).toHaveBeenCalledWith(
        'filename.csv',
        mockArtists,
      );
      expect(result).toEqual({
        message: 'CSV file created successfully.',
        records: [
          {
            name: 'Artist 1',
            mbid: 'mbid1',
            url: 'url1',
            image_small: 'image1',
            image: 'image2',
          },
        ],
      });
    });

    it('should try random artists if no results are found', async () => {
      jest.spyOn(service, 'searchArtist').mockResolvedValue([]);
      (getRandomArtists as jest.Mock).mockResolvedValue(['Random Artist 1']);
      const mockArtists: ArtistResponseDto[] = [
        {
          name: 'Artist 1',
          mbid: 'mbid1',
          url: 'url1',
          image_small: 'image1',
          image: 'image2',
        },
      ];
      jest
        .spyOn(service, 'searchArtist')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockArtists);

      const result = await service.searchAndSaveArtists(
        'Nonexistent Artist',
        'filename.csv',
      );

      expect(getRandomArtists).toHaveBeenCalled();
      expect(csvService.writeCSV).toHaveBeenCalledWith(
        'filename.csv',
        mockArtists,
      );
      expect(result).toEqual({
        message: 'CSV file created successfully.',
        records: [
          {
            name: 'Random Artist 1',
            mbid: 'mbid2',
            url: 'url2',
            image_small: 'image3',
            image: 'image4',
          },
        ],
      });
    });

    it('should handle no artists from random search', async () => {
      jest.spyOn(service, 'searchArtist').mockResolvedValue([]);
      (getRandomArtists as jest.Mock).mockResolvedValue([]);

      const result = await service.searchAndSaveArtists(
        'Nonexistent Artist',
        'filename.csv',
      );

      expect(getRandomArtists).toHaveBeenCalled();
      expect(csvService.writeCSV).toHaveBeenCalledWith('filename.csv', []);
      expect(result).toEqual({
        message: 'CSV file created successfully.',
        records: [],
      });
    });
  });

  describe('searchArtist', () => {
    it('should return a list of artists', async () => {
      const mockData = {
        results: {
          artistmatches: {
            artist: [
              {
                name: 'Artist 1',
                mbid: 'mbid1',
                url: 'url1',
                image: [{ '#text': 'image1' }, { '#text': 'image2' }],
              },
            ],
          },
        },
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await service.searchArtist('Artist 1');

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('artist=Artist 1'),
      );
      expect(result).toEqual(mockData.results.artistmatches.artist);
    });

    it('should handle no artists found', async () => {
      const mockData = {
        results: {
          artistmatches: {
            artist: [],
          },
        },
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await service.searchArtist('Nonexistent Artist');

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('artist=Nonexistent Artist'),
      );
      expect(result).toEqual([]);
    });

    it('should handle errors and return empty array', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

      const result = await service.searchArtist('Artist 1');

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('artist=Artist 1'),
      );
      expect(result).toEqual([]);
    });
  });
});
