import fs from 'fs/promises';
import path from 'path';

export const getRandomArtists = async () => {
  const filePath = path.join(__dirname, 'randomArtists.json');
  const buffer = await fs.readFile(filePath);
  const { randomArtists } = JSON.parse(buffer.toString());
  return randomArtists.artists;
};
