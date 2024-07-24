import * as dotenv from 'dotenv';
dotenv.config();

export const API_KEY = process.env.APIkey;
export const BASE_URL = `http://ws.audioscrobbler.com/2.0/?method=artist.search`;
export const PORT = process.env.PORT || 3000;
export const csvDirectory = process.env.CSV_DIRECTORY || './data/csv_files';
