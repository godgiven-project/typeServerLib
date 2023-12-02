import { promises as fs } from 'fs';

/**
 * Enhanced read json file.
 *
 * @example
 * const fileContent = await readJsonFile('./file.json');
 */
export async function readJsonFile<T extends Record<string | number, unknown>>(path: string): Promise<T>
{
  // Read file
  const fileContent = await fs.readFile(path, { encoding: 'utf-8' });
  // Parse object
  try
  {
    return JSON.parse(fileContent);
  }
  catch (err)
  {
    throw new Error('invalid_json');
  }
}
